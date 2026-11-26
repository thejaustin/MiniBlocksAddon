import {
  world,
  system,
  Direction,
  GameMode,
  PlayerPermissionLevel,
  BlockPermutation,
  ItemStack,
} from "@minecraft/server";
import {
  WALL_SLAB_IDS,
  MINI_BLOCK_IDS,
  SLAB_TO_FULL_BLOCK,
  SLAB_SOUNDS,
} from "./slab_map.js";

// Mini Blocks Add-on v2.1.0 — Bedrock 26.60 (@minecraft/server 2.11.0)
// Successor to the classic 2015 MCPE Mini Blocks Mod by thejaustin.
//
// Mechanics:
// 1. Wall Slabs (42 variants):
//    - Side-face snapping: tap any vertical wall face (N/S/E/W) -> attaches flush to that wall.
//    - Floor/ceiling facing: tap Up/Down -> faces your cardinal direction.
//    - Auto-Connecting Corners: placing perpendicular wall slabs automatically forms seamless
//      Inner Corners (3/4 L-wall) and Outer Corners (1/4 post), updating neighbors on place & break.
//    - Tap-to-Combine: tap a matching wall slab to combine 2 halves into the full vanilla block.
//    - Crouching (Sneak): universal opt-out — prevents combining AND prevents auto-connecting
//      (locks the placed wall slab straight without distorting neighbors!).
// 2. Mini Blocks (57 variants — 42 1:1 slab parity + 15 extended):
//    - Mounts natively to floor, ceiling, or any of the 4 walls (bottom or top half).
//    - Tap-Aware Directional Stacking (1 -> 2 -> 3 -> Full Block):
//      * Tap Up/Down on Single -> Vertical Pillar (2-high, centered or wall-mounted)
//      * Tap East/West on Single -> East-West Horizontal Beam (2-wide)
//      * Tap North/South on Single -> North-South Horizontal Beam (2-wide)
//      * Tap Side on Beam -> Flat L-Corner (3) | Tap Up/Down on Beam or Side on Pillar -> Vertical Step (3)
//      * Tap any 3-cube shape -> Full Vanilla Block (4)
//    - Breaking multi-cube mini blocks in Survival refunds all pieces.
//    - Crouching (Sneak) bypasses stacking to place a separate adjacent mini block.

const welcomedPlayers = new Set();
world.afterEvents.playerSpawn.subscribe((event) => {
  const { player, initialSpawn } = event;
  if (!initialSpawn || !player?.isValid) return;
  if (welcomedPlayers.has(player.id)) return;
  welcomedPlayers.add(player.id);

  system.runTimeout(() => {
    if (!player?.isValid) return;
    player.sendMessage(
      "§eWelcome back to Minecraft! You are using the §aMini Blocks Add-on v2.2.0§e (Bedrock 26.60)! Originally created by §bthejaustin§e."
    );
  }, 20);
});

const NON_BLOCKING_ENTITIES = new Set(["minecraft:item", "minecraft:xp_orb"]);

const REPLACEABLE_BLOCKS = new Set([
  "minecraft:air",
  "minecraft:water",
  "minecraft:flowing_water",
  "minecraft:short_grass",
  "minecraft:tall_grass",
  "minecraft:fern",
  "minecraft:large_fern",
  "minecraft:snow_layer",
  "minecraft:vine",
  "minecraft:deadbush",
]);

const INTERACTIVE_BLOCK_PATTERNS = [
  "chest", "barrel", "shulker_box", "furnace", "smoker", "hopper", "dropper",
  "dispenser", "crafting_table", "stonecutter", "anvil", "grindstone", "loom",
  "cartography_table", "smithing_table", "enchanting_table", "brewing_stand",
  "beacon", "bed", "door", "trapdoor", "fence_gate", "button", "lever",
  "repeater", "comparator", "noteblock", "jukebox", "lectern", "bell", "crafter",
];

const FACE_OFFSET = {
  [Direction.Down]:  { x: 0, y: -1, z: 0 },
  [Direction.Up]:    { x: 0, y: 1,  z: 0 },
  [Direction.North]: { x: 0, y: 0,  z: -1 },
  [Direction.South]: { x: 0, y: 0,  z: 1 },
  [Direction.West]:  { x: -1, y: 0, z: 0 },
  [Direction.East]:  { x: 1,  y: 0, z: 0 },
};

const HORIZONTAL_OFFSETS = [
  { x: 0, y: 0, z: -1 }, // North
  { x: 0, y: 0, z:  1 }, // South
  { x: -1, y: 0, z: 0 }, // West
  { x:  1, y: 0, z: 0 }, // East
];

const FACE_TO_WALL_SLAB_DIR = {
  [Direction.North]: "south",
  [Direction.South]: "north",
  [Direction.East]:  "west",
  [Direction.West]:  "east",
};

// Local basis vectors for each wall slab facing (matching CCW Y-rotation in Bedrock):
//   back  = where the slab panel rests (Outer Corner neighbor direction)
//   front = open side of the slab (Inner Corner neighbor direction)
//   left  = left perpendicular facing direction & offset
//   right = right perpendicular facing direction & offset
const SLAB_BASIS = {
  north: {
    back:  { x:  0, z: -1 },
    front: { x:  0, z:  1 },
    left:  { dir: "west",  x: -1, z:  0 },
    right: { dir: "east",  x:  1, z:  0 },
  },
  west: {
    back:  { x: -1, z:  0 },
    front: { x:  1, z:  0 },
    left:  { dir: "south", x:  0, z:  1 },
    right: { dir: "north", x:  0, z: -1 },
  },
  south: {
    back:  { x:  0, z:  1 },
    front: { x:  0, z: -1 },
    left:  { dir: "east",  x:  1, z:  0 },
    right: { dir: "west",  x: -1, z:  0 },
  },
  east: {
    back:  { x:  1, z:  0 },
    front: { x: -1, z:  0 },
    left:  { dir: "north", x:  0, z: -1 },
    right: { dir: "south", x:  0, z:  1 },
  },
};

const SHAPE_COUNT = {
  single: 1,
  pillar: 2,
  beam_x: 2,
  beam_z: 2,
  corner: 3,
  step_x: 3,
  step_z: 3,
};

const SHAPE_LABELS = {
  pillar: "Vertical Pillar (2/4)",
  beam_x: "Horizontal Beam E-W (2/4)",
  beam_z: "Horizontal Beam N-S (2/4)",
  corner: "L-Corner (3/4)",
  step_x: "Mini Step E-W (3/4)",
  step_z: "Mini Step N-S (3/4)",
  full:   "Combined -> Full Block",
};

const SHAPE_PITCH = {
  pillar: 0.96,
  beam_x: 0.96,
  beam_z: 0.96,
  corner: 1.04,
  step_x: 1.04,
  step_z: 1.04,
  full:   1.12,
};

function canBuild(player) {
  const mode = player.getGameMode();
  if (mode !== GameMode.Survival && mode !== GameMode.Creative) return false;
  return player.playerPermissionLevel !== PlayerPermissionLevel.Visitor;
}

function isInteractiveBlock(block) {
  const id = block?.typeId || "";
  if (!id.startsWith("minecraft:")) return false;
  const shortId = id.slice(10);
  return INTERACTIVE_BLOCK_PATTERNS.some((p) => shortId.includes(p));
}

function isReplaceable(block) {
  if (!block) return false;
  return block.isAir || REPLACEABLE_BLOCKS.has(block.typeId);
}

function showHint(player, text) {
  try {
    player.onScreenDisplay.setActionBar(text);
  } catch {
    // Ignore if HUD unavailable
  }
}

function consumeItem(player, typeId, selectedSlot) {
  if (player.getGameMode() === GameMode.Creative) return true;
  const container = player.getComponent("minecraft:inventory")?.container;
  if (!container) return false;

  const activeSlot = player.selectedSlotIndex;
  const slot =
    activeSlot !== undefined && container.getItem(activeSlot)?.typeId === typeId
      ? activeSlot
      : selectedSlot;
  const item = container.getItem(slot);
  if (item?.typeId !== typeId) return false;

  if (item.amount > 1) {
    item.amount -= 1;
    container.setItem(slot, item);
  } else {
    container.setItem(slot, undefined);
  }
  return true;
}

function playSound(dimension, location, typeId, basePitch = 1.0) {
  const sound = SLAB_SOUNDS?.[typeId] || "use.stone";
  const soundLoc = {
    x: location.x + 0.5,
    y: location.y + 0.5,
    z: location.z + 0.5,
  };
  try {
    dimension.playSound(sound, soundLoc, {
      volume: 1.0,
      pitch: basePitch + (Math.random() - 0.5) * 0.14,
    });
  } catch {
    try {
      dimension.playSound("use.stone", soundLoc, { volume: 0.9, pitch: basePitch });
    } catch {
      // Ignore
    }
  }
}

function isBoxObstructed(dimension, minX, minY, minZ, maxX, maxY, maxZ) {
  const center = {
    x: (minX + maxX) * 0.5,
    y: (minY + maxY) * 0.5,
    z: (minZ + maxZ) * 0.5,
  };
  const EPS = 0.04;
  try {
    for (const entity of dimension.getEntities({ location: center, maxDistance: 3 })) {
      if (!entity?.isValid) continue;
      if (NON_BLOCKING_ENTITIES.has(entity.typeId)) continue;
      if (typeof entity.getAABB !== "function") continue;
      const aabb = entity.getAABB();
      if (!aabb?.center || !aabb?.extent) continue;
      const { center: c, extent: e } = aabb;
      if (
        c.x - e.x < maxX - EPS && c.x + e.x > minX + EPS &&
        c.y - e.y < maxY - EPS && c.y + e.y > minY + EPS &&
        c.z - e.z < maxZ - EPS && c.z + e.z > minZ + EPS
      ) {
        return true;
      }
    }
  } catch {
    // Fail-safe
  }
  return false;
}

function isFullBlockObstructed(dimension, loc) {
  return isBoxObstructed(dimension, loc.x, loc.y, loc.z, loc.x + 1, loc.y + 1, loc.z + 1);
}

function isWallSlabHalfObstructed(dimension, loc, dir) {
  switch (dir) {
    case "north": return isBoxObstructed(dimension, loc.x,       loc.y, loc.z,       loc.x + 1,   loc.y + 1, loc.z + 0.5);
    case "south": return isBoxObstructed(dimension, loc.x,       loc.y, loc.z + 0.5, loc.x + 1,   loc.y + 1, loc.z + 1);
    case "west":  return isBoxObstructed(dimension, loc.x,       loc.y, loc.z,       loc.x + 0.5, loc.y + 1, loc.z + 1);
    case "east":  return isBoxObstructed(dimension, loc.x + 0.5, loc.y, loc.z,       loc.x + 1,   loc.y + 1, loc.z + 1);
    default:      return isFullBlockObstructed(dimension, loc);
  }
}

// ── Auto-Connecting Wall Slab Corner Engine (Cross-Material + Vanilla Stairs!) ──

// Vanilla Bedrock stair `weirdo_direction` -> side where the stair's full-height 8px back sits:
//   0 = East (+X), 1 = West (-X), 2 = South (+Z), 3 = North (-Z)
const STAIR_WEIRDO_TO_DIR = {
  0: "east",
  1: "west",
  2: "south",
  3: "north",
};

function isStairBlock(block) {
  if (!block) return false;
  if (block.typeId.endsWith("_stairs")) return true;
  try {
    return block.permutation.getState("weirdo_direction") !== undefined;
  } catch {
    return false;
  }
}

function getConnectableSlabDir(dimension, x, y, z) {
  const b = dimension.getBlock({ x, y, z });
  if (!b) return null;

  // 1. Any non-locked Wall Slab (works seamlessly cross-material!)
  if (WALL_SLAB_IDS.has(b.typeId)) {
    if (b.permutation.getState("addon:shape") === "locked") return null;
    return b.permutation.getState("minecraft:cardinal_direction") || null;
  }

  // 2. Any Vanilla Stair (tall 8px vertical back aligns flush with our 8px Wall Slabs!)
  if (isStairBlock(b)) {
    const weirdo = b.permutation.getState("weirdo_direction");
    if (weirdo !== undefined && STAIR_WEIRDO_TO_DIR[weirdo]) {
      return STAIR_WEIRDO_TO_DIR[weirdo];
    }
    const card = b.permutation.getState("minecraft:cardinal_direction");
    if (card) return card;
  }

  return null;
}

function computeWallSlabShape(dimension, loc, dir) {
  const basis = SLAB_BASIS[dir];
  if (!basis) return "straight";

  // 1. Check Back neighbor -> Outer Corner (1/4 post)
  const backDir = getConnectableSlabDir(dimension, loc.x + basis.back.x, loc.y, loc.z + basis.back.z);
  if (backDir === basis.left.dir) {
    // Don't narrow into an outer corner if our right neighbor continues the same wall
    const rightDir = getConnectableSlabDir(dimension, loc.x + basis.right.x, loc.y, loc.z + basis.right.z);
    if (rightDir !== dir) return "outer_left";
  } else if (backDir === basis.right.dir) {
    const leftDir = getConnectableSlabDir(dimension, loc.x + basis.left.x, loc.y, loc.z + basis.left.z);
    if (leftDir !== dir) return "outer_right";
  }

  // 2. Check Front neighbor -> Inner Corner (3/4 L-wall)
  const frontDir = getConnectableSlabDir(dimension, loc.x + basis.front.x, loc.y, loc.z + basis.front.z);
  if (frontDir === basis.left.dir) {
    const leftDir = getConnectableSlabDir(dimension, loc.x + basis.left.x, loc.y, loc.z + basis.left.z);
    if (leftDir !== dir) return "inner_left";
  } else if (frontDir === basis.right.dir) {
    const rightDir = getConnectableSlabDir(dimension, loc.x + basis.right.x, loc.y, loc.z + basis.right.z);
    if (rightDir !== dir) return "inner_right";
  }

  return "straight";
}

function refreshWallSlabShape(dimension, loc) {
  const block = dimension.getBlock(loc);
  if (!block || !WALL_SLAB_IDS.has(block.typeId)) return;
  const curShape = block.permutation.getState("addon:shape") || "straight";
  if (curShape === "locked") return; // Respect crouched/locked wall slabs!

  const dir = block.permutation.getState("minecraft:cardinal_direction");
  if (!dir) return;

  const newShape = computeWallSlabShape(dimension, loc, dir);
  if (newShape !== curShape) {
    block.setPermutation(block.permutation.withState("addon:shape", newShape));
  }
}

function refreshAdjacentWallSlabs(dimension, loc) {
  for (const off of HORIZONTAL_OFFSETS) {
    refreshWallSlabShape(dimension, {
      x: loc.x + off.x,
      y: loc.y,
      z: loc.z + off.z,
    });
  }
}

// ── Wall Slab & Floor Slab Actions ──────────────────────────────────────────

function tryMergeToFullBlock(player, targetBlock, blockTypeId) {
  const fullBlockId = SLAB_TO_FULL_BLOCK[blockTypeId];
  if (!fullBlockId || !canBuild(player)) return false;

  const location = targetBlock.location;
  const dimension = targetBlock.dimension;
  if (isFullBlockObstructed(dimension, location)) return false;

  const wasWallSlab = WALL_SLAB_IDS.has(blockTypeId);
  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    const current = dimension.getBlock(location);
    if (current?.typeId !== blockTypeId) return;
    if (!player?.isValid || !canBuild(player)) return;
    if (!consumeItem(player, blockTypeId, selectedSlot)) return;

    current.setType(fullBlockId);
    if (wasWallSlab) {
      refreshAdjacentWallSlabs(dimension, location);
    }
    playSound(dimension, location, blockTypeId, 1.0);
  });

  return true;
}

function trySnapWallSlabToFace(player, clickedBlock, blockFace, slabTypeId) {
  const dir = FACE_TO_WALL_SLAB_DIR[blockFace];
  if (!dir || !canBuild(player)) return false;

  const offset = FACE_OFFSET[blockFace];
  const targetLoc = {
    x: clickedBlock.location.x + offset.x,
    y: clickedBlock.location.y + offset.y,
    z: clickedBlock.location.z + offset.z,
  };
  const dimension = clickedBlock.dimension;
  const targetBlock = dimension.getBlock(targetLoc);
  if (!isReplaceable(targetBlock)) return false;
  if (isWallSlabHalfObstructed(dimension, targetLoc, dir)) return false;

  const isLocked = player.isSneaking;
  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    if (!player?.isValid || !canBuild(player)) return;
    const current = dimension.getBlock(targetLoc);
    if (!isReplaceable(current)) return;
    if (!consumeItem(player, slabTypeId, selectedSlot)) return;

    const shape = isLocked ? "locked" : computeWallSlabShape(dimension, targetLoc, dir);
    const perm = BlockPermutation.resolve(slabTypeId, {
      "minecraft:cardinal_direction": dir,
      "addon:shape": shape,
    });
    current.setPermutation(perm);

    if (!isLocked) {
      refreshAdjacentWallSlabs(dimension, targetLoc);
    } else {
      showHint(player, "§7Wall Slab Locked Straight §8(Crouch prevents auto-connect)");
    }
    playSound(dimension, targetLoc, slabTypeId, 1.0);
  });

  return true;
}

// ── Tap-Aware Directional Mini Block Stacking ───────────────────────────────

function getPlayerHorizontalAxis(player) {
  try {
    const view = player.getViewDirection();
    return Math.abs(view.x) >= Math.abs(view.z) ? "x" : "z";
  } catch {
    return "x";
  }
}

function resolveNextMiniShape(currentShape, blockFace, faceLocation, player) {
  const isVerticalFace = blockFace === Direction.Up || blockFace === Direction.Down;
  const isXFace = blockFace === Direction.East || blockFace === Direction.West;
  const isZFace = blockFace === Direction.North || blockFace === Direction.South;

  if (currentShape === "single") {
    if (isXFace) return "beam_x";
    if (isZFace) return "beam_z";
    // Tapping Up/Down: center tap -> vertical Pillar! Far edge tap -> horizontal Beam along that edge!
    if (faceLocation) {
      const dx = Math.abs(faceLocation.x - 0.5);
      const dz = Math.abs(faceLocation.z - 0.5);
      if (dx > 0.32 && dx >= dz) return "beam_x";
      if (dz > 0.32 && dz > dx) return "beam_z";
    }
    return "pillar";
  }

  if (currentShape === "pillar") {
    if (isXFace) return "step_x";
    if (isZFace) return "step_z";
    return getPlayerHorizontalAxis(player) === "x" ? "step_x" : "step_z";
  }

  if (currentShape === "beam_x") {
    if (isVerticalFace) return "step_x";
    if (isZFace) return "corner";
    // Tapping X ends of an already X-wide beam -> build up into a mini step
    return "step_x";
  }

  if (currentShape === "beam_z") {
    if (isVerticalFace) return "step_z";
    if (isXFace) return "corner";
    return "step_z";
  }

  if (currentShape === "corner" || currentShape === "step_x" || currentShape === "step_z") {
    return "full";
  }

  return null;
}

function tryStackMiniBlock(player, targetBlock, blockFace, faceLocation, miniTypeId) {
  if (!canBuild(player)) return false;

  const currentShape = targetBlock.permutation.getState("addon:shape") || "single";
  const nextShape = resolveNextMiniShape(currentShape, blockFace, faceLocation, player);
  if (!nextShape) return false;

  const location = targetBlock.location;
  const dimension = targetBlock.dimension;

  if (nextShape === "full") {
    if (isFullBlockObstructed(dimension, location)) return false;
  }

  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    if (!player?.isValid || !canBuild(player)) return;
    const current = dimension.getBlock(location);
    if (current?.typeId !== miniTypeId) return;

    const liveShape = current.permutation.getState("addon:shape") || "single";
    const liveNext = resolveNextMiniShape(liveShape, blockFace, faceLocation, player);
    if (!liveNext) return;

    if (!consumeItem(player, miniTypeId, selectedSlot)) return;

    if (liveNext === "full") {
      const fullBlockId = SLAB_TO_FULL_BLOCK[miniTypeId];
      if (fullBlockId) {
        current.setType(fullBlockId);
      }
    } else {
      current.setPermutation(current.permutation.withState("addon:shape", liveNext));
    }

    if (SHAPE_LABELS[liveNext]) {
      showHint(player, `§bMini Block: §f${SHAPE_LABELS[liveNext]}`);
    }
    playSound(dimension, location, miniTypeId, SHAPE_PITCH[liveNext] || 1.0);
  });

  return true;
}

// ── Event Subscriptions ─────────────────────────────────────────────────────

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, itemStack, blockFace, faceLocation } = event;
  if (!event.isFirstEvent) return;
  if (!itemStack) return;

  const itemTypeId = itemStack.typeId;
  if (!SLAB_TO_FULL_BLOCK[itemTypeId]) return;

  // ── 1. Mini Blocks: Tap-Aware Directional Stacking (1 -> 2 -> 3 -> Full) ──
  if (MINI_BLOCK_IDS.has(itemTypeId)) {
    if (player.isSneaking) return; // Crouch to place a separate adjacent mini block

    if (block.typeId === itemTypeId) {
      if (tryStackMiniBlock(player, block, blockFace, faceLocation, itemTypeId)) {
        event.cancel = true;
        return;
      }
    }

    const offset = FACE_OFFSET[blockFace];
    if (offset) {
      const adjBlock = block.dimension.getBlock({
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z,
      });
      if (adjBlock?.typeId === itemTypeId) {
        if (tryStackMiniBlock(player, adjBlock, blockFace, faceLocation, itemTypeId)) {
          event.cancel = true;
          return;
        }
      }
    }
    return;
  }

  // ── 2. Wall Slabs: Combine 2:1 OR Snap Flush to Tapped Wall Face ──
  if (WALL_SLAB_IDS.has(itemTypeId)) {
    if (!player.isSneaking) {
      // Case A: Direct tap on matching wall slab -> combine into full block!
      if (block.typeId === itemTypeId) {
        if (tryMergeToFullBlock(player, block, itemTypeId)) {
          event.cancel = true;
          return;
        }
      }

      // Case B: Adjacent block face pointing into matching wall slab -> combine!
      const offset = FACE_OFFSET[blockFace];
      if (offset) {
        const adjBlock = block.dimension.getBlock({
          x: block.location.x + offset.x,
          y: block.location.y + offset.y,
          z: block.location.z + offset.z,
        });
        if (adjBlock?.typeId === itemTypeId) {
          if (tryMergeToFullBlock(player, adjBlock, itemTypeId)) {
            event.cancel = true;
            return;
          }
        }
      }
    }

    // Case C: Tapping a vertical side face (N/S/E/W) -> snap flush against that wall!
    // (Respects interactive blocks like chests/doors unless sneaking; floor/ceiling falls
    // through to native minecraft:placement_direction + playerPlaceBlock auto-connect!)
    if (FACE_TO_WALL_SLAB_DIR[blockFace] && (player.isSneaking || !isInteractiveBlock(block))) {
      if (trySnapWallSlabToFace(player, block, blockFace, itemTypeId)) {
        event.cancel = true;
        return;
      }
    }
    return;
  }

  // ── 3. Cobblestone Floor Slab: Combine 2:1 into Cobblestone ──
  if (!player.isSneaking) {
    if (block.typeId === itemTypeId) {
      if (tryMergeToFullBlock(player, block, itemTypeId)) {
        event.cancel = true;
        return;
      }
    }

    const offset = FACE_OFFSET[blockFace];
    if (offset) {
      const adjBlock = block.dimension.getBlock({
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z,
      });
      if (adjBlock?.typeId === itemTypeId) {
        if (tryMergeToFullBlock(player, adjBlock, itemTypeId)) {
          event.cancel = true;
          return;
        }
      }
    }
  }
});

// Auto-connect Wall Slabs placed via native floor/ceiling placement (and when placing Vanilla Stairs!)
world.afterEvents.playerPlaceBlock.subscribe((event) => {
  const { block, player } = event;
  if (!block?.isValid) return;

  const loc = block.location;
  const dim = block.dimension;
  const isCrouched = Boolean(player?.isValid && player.isSneaking);

  if (WALL_SLAB_IDS.has(block.typeId)) {
    if (isCrouched) {
      block.setPermutation(block.permutation.withState("addon:shape", "locked"));
      showHint(player, "§7Wall Slab Locked Straight §8(Crouch prevents auto-connect)");
    } else {
      refreshWallSlabShape(dim, loc);
      refreshAdjacentWallSlabs(dim, loc);
    }
    return;
  }

  // Placing a Vanilla Stair next to existing Wall Slabs connects them cleanly (unless crouching!)
  if (isStairBlock(block) && !isCrouched) {
    refreshAdjacentWallSlabs(dim, loc);
  }
});

// Survival drop conservation for multi-cube Mini Blocks + un-connect Wall Slab neighbors on break
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const { block, player, dimension } = event;
  if (!block?.isValid) return;

  const typeId = block.typeId;
  const loc = block.location;

  if (WALL_SLAB_IDS.has(typeId) || isStairBlock(block)) {
    system.run(() => {
      refreshAdjacentWallSlabs(dimension, loc);
    });
    return;
  }

  if (!player?.isValid || !MINI_BLOCK_IDS.has(typeId)) return;
  if (player.getGameMode() !== GameMode.Survival) return;

  const shape = block.permutation.getState("addon:shape") || "single";
  const count = SHAPE_COUNT[shape] || 1;
  if (count <= 1) return;

  const dropLoc = { x: loc.x + 0.5, y: loc.y + 0.5, z: loc.z + 0.5 };
  system.run(() => {
    try {
      dimension.spawnItem(new ItemStack(typeId, count - 1), dropLoc);
    } catch {
      // Fail-safe
    }
  });
});
