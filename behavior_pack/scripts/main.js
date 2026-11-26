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
  WALL_SLAB_TO_MINI_BLOCK,
  MINI_BLOCK_TO_WALL_SLAB,
  MINI_BLOCK_TO_STAIR,
  STAIR_TO_MINI_BLOCK,
  STAIR_TO_FULL_BLOCK,
  SLAB_SOUNDS,
} from "./slab_map.js";

// Mini Blocks Add-on v2.3.0 — Bedrock 26.60 (@minecraft/server 2.11.0)
// Successor to the classic 2015 MCPE Mini Blocks Mod by thejaustin.
//
// Mechanics:
// 1. Face-Aware Wall Slab Building & Combining (57 variants):
//    - Tap open inner face of a matching Wall Slab -> Combines 2:1 into full vanilla block!
//    - Tap Top/Bottom face -> Stacks directly above/below in same facing direction (with Vertical
//      Corner Continuity when stacking onto outer/inner corners!).
//    - Tap Left/Right narrow edge -> Extends the thin wall sideways in the same facing direction!
//    - Tap Back face -> Places back-to-back behind it.
//    - Tap any solid block's vertical side face -> Snaps flush against that wall.
//    - Auto-Connects cross-material to Wall Slabs, Vanilla Stairs (with corner precision),
//      Open Vertical Trapdoors, and Wall-Mounted Mini Block Pillars!
//    - Crouch (Sneak): universal opt-out — prevents combining AND locks straight (`addon:shape = 'locked'`).
// 2. Mini Blocks <-> Wall Slabs Synergy (71 Mini Blocks, 57/57 1:1 parity):
//    - Placing any Mini Block onto Top/Bottom/Side of any Wall Slab aligns flush to the slab's plane!
//    - Tap Wall Slab's open face with matching Mini Block -> fills with 2 Mini Blocks -> Full Block!
//    - Tap 2-cube or 3-cube Mini Block with matching Wall Slab -> combines into Full Block (with refund)!
//    - Wall-mounted Mini Pillars connect seamlessly with adjacent Wall Slabs.
// 3. Tap-Aware Mini Block Shapes & Face-Aware Floor Slab Combining.

const welcomedPlayers = new Set();
world.afterEvents.playerSpawn.subscribe((event) => {
  const { player, initialSpawn } = event;
  if (!initialSpawn || !player?.isValid) return;
  if (welcomedPlayers.has(player.id)) return;
  welcomedPlayers.add(player.id);

  system.runTimeout(() => {
    if (!player?.isValid) return;
    player.sendMessage(
      "§eWelcome back to Minecraft! You are using the §aMini Blocks Add-on v2.5.0§e (Bedrock 26.60)! Originally created by §bthejaustin§e."
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
  { x:  0, z: -1 }, // North
  { x:  0, z:  1 }, // South
  { x: -1, z:  0 }, // West
  { x:  1, z:  0 }, // East
];

const FACE_TO_WALL_SLAB_DIR = {
  [Direction.North]: "south",
  [Direction.South]: "north",
  [Direction.East]:  "west",
  [Direction.West]:  "east",
};

const DIR_TO_DIRECTION = {
  north: Direction.North,
  south: Direction.South,
  east:  Direction.East,
  west:  Direction.West,
};

// Mapping between Wall Slab facing half and Mini Block `minecraft:block_face` wall half:
//   Mini block_face='south' renders on North half (z=-8..0), matching Wall Slab dir='north'!
const SLAB_DIR_TO_MINI_FACE = {
  north: "south",
  south: "north",
  west:  "east",
  east:  "west",
};

const MINI_FACE_TO_SLAB_DIR = {
  south: "north",
  north: "south",
  east:  "west",
  west:  "east",
};

// Local basis vectors for each wall slab facing (matching CCW Y-rotation in Bedrock):
const SLAB_BASIS = {
  north: {
    back:  { dir: "north", face: Direction.North, x:  0, z: -1 },
    front: { dir: "south", face: Direction.South, x:  0, z:  1 },
    left:  { dir: "west",  face: Direction.West,  x: -1, z:  0 },
    right: { dir: "east",  face: Direction.East,  x:  1, z:  0 },
  },
  west: {
    back:  { dir: "west",  face: Direction.West,  x: -1, z:  0 },
    front: { dir: "east",  face: Direction.East,  x:  1, z:  0 },
    left:  { dir: "south", face: Direction.South, x:  0, z:  1 },
    right: { dir: "north", face: Direction.North, x:  0, z: -1 },
  },
  south: {
    back:  { dir: "south", face: Direction.South, x:  0, z:  1 },
    front: { dir: "north", face: Direction.North, x:  0, z: -1 },
    left:  { dir: "east",  face: Direction.East,  x:  1, z:  0 },
    right: { dir: "west",  face: Direction.West,  x: -1, z:  0 },
  },
  east: {
    back:  { dir: "east",  face: Direction.East,  x:  1, z:  0 },
    front: { dir: "west",  face: Direction.West,  x: -1, z:  0 },
    left:  { dir: "north", face: Direction.North, x:  0, z: -1 },
    right: { dir: "south", face: Direction.South, x:  0, z:  1 },
  },
};

// Vanilla Bedrock stair `weirdo_direction` -> side where the stair's full-height 8px back sits:
const STAIR_WEIRDO_TO_DIR = {
  0: "east",
  1: "west",
  2: "south",
  3: "north",
};

const DIR_TO_STAIR_WEIRDO = {
  east:  0,
  west:  1,
  south: 2,
  north: 3,
};

// Vanilla Bedrock trapdoor `direction` -> wall side when `open_bit == true`:
const TRAPDOOR_DIR_TO_SLAB_DIR = {
  0: "west",
  1: "east",
  2: "north",
  3: "south",
};

const CORNER_SHAPES = new Set(["inner_left", "inner_right", "outer_left", "outer_right"]);

const SHAPE_COUNT = {
  single:    1,
  pillar:    2,
  beam_x:    2,
  beam_z:    2,
  corner:    3,
  step_x:    3,
  step_z:    3,
  slab_half: 4,
  five:      5,
  six:       6,
  seven:     7,
};

const SHAPE_LABELS = {
  pillar:    "Vertical Pillar (2/8)",
  beam_x:    "Horizontal Beam E-W (2/8)",
  beam_z:    "Horizontal Beam N-S (2/8)",
  corner:    "Flat L-Corner (3/8)",
  step_x:    "Mini Step E-W (3/8)",
  step_z:    "Mini Step N-S (3/8)",
  wall_slab: "Wall Slab (4/8)",
  slab_half: "Half Block (4/8)",
  five:      "5/8 Block",
  stair:     "Stairs (6/8)",
  six:       "Mini Stair (6/8)",
  seven:     "7/8 Block",
  full:      "Combined -> Full Block (8/8)",
};

const SHAPE_PITCH = {
  pillar:    0.92,
  beam_x:    0.92,
  beam_z:    0.92,
  corner:    0.96,
  step_x:    0.96,
  step_z:    0.96,
  wall_slab: 1.00,
  slab_half: 1.00,
  five:      1.04,
  stair:     1.08,
  six:       1.08,
  seven:     1.12,
  full:      1.18,
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

function isTrapdoorBlock(block) {
  const id = block?.typeId || "";
  return id.endsWith("_trapdoor") || id === "minecraft:trapdoor";
}

function isStairBlock(block) {
  if (!block) return false;
  if (block.typeId.endsWith("_stairs")) return true;
  try {
    return block.permutation.getState("weirdo_direction") !== undefined;
  } catch {
    return false;
  }
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

function getItemCount(player, typeId, selectedSlot) {
  if (player.getGameMode() === GameMode.Creative) return 64;
  const container = player.getComponent("minecraft:inventory")?.container;
  if (!container) return 0;

  const activeSlot = player.selectedSlotIndex;
  const slot =
    activeSlot !== undefined && container.getItem(activeSlot)?.typeId === typeId
      ? activeSlot
      : selectedSlot;
  const item = container.getItem(slot);
  return item?.typeId === typeId ? item.amount : 0;
}

function hasEnoughItems(player, typeId, selectedSlot, amount = 1) {
  return getItemCount(player, typeId, selectedSlot) >= amount;
}

function consumeItem(player, typeId, selectedSlot, amount = 1) {
  if (player.getGameMode() === GameMode.Creative) return true;
  const container = player.getComponent("minecraft:inventory")?.container;
  if (!container) return false;

  const activeSlot = player.selectedSlotIndex;
  const slot =
    activeSlot !== undefined && container.getItem(activeSlot)?.typeId === typeId
      ? activeSlot
      : selectedSlot;
  const item = container.getItem(slot);
  if (item?.typeId !== typeId || item.amount < amount) return false;

  if (item.amount > amount) {
    item.amount -= amount;
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

// ── Auto-Connecting Wall Slab Engine ────────────────────────────────────────
// Connects cross-material across:
//   1. Non-locked Wall Slabs (all 57 variants)
//   2. Vanilla Stairs (with `minecraft:corner` precision to avoid floating corners!)
//   3. Open Vertical Trapdoors (`open_bit == true`)
//   4. Wall-Mounted Mini Block Pillars (`addon:shape == 'pillar'`)

function getConnectableSlabDir(dimension, x, y, z, approachingFromDir = null) {
  const b = dimension.getBlock({ x, y, z });
  if (!b) return null;

  // 1. Any non-locked Wall Slab (works cross-material!)
  if (WALL_SLAB_IDS.has(b.typeId)) {
    if (b.permutation.getState("addon:shape") === "locked") return null;
    return b.permutation.getState("minecraft:cardinal_direction") || null;
  }

  // 2. Any Vanilla Stair (with `minecraft:corner` precision check)
  if (isStairBlock(b)) {
    const weirdo = b.permutation.getState("weirdo_direction");
    const stairDir =
      weirdo !== undefined && STAIR_WEIRDO_TO_DIR[weirdo]
        ? STAIR_WEIRDO_TO_DIR[weirdo]
        : b.permutation.getState("minecraft:cardinal_direction");
    if (!stairDir) return null;

    // If the stair has narrowed into an outer corner AWAY from our slab, skip false connection!
    const corner = b.permutation.getState("minecraft:corner");
    if (approachingFromDir && (corner === "outer_left" || corner === "outer_right")) {
      const sb = SLAB_BASIS[stairDir];
      if (sb) {
        // outer_left keeps back + left; outer_right keeps back + right.
        const keptSide = corner === "outer_left" ? sb.left.dir : sb.right.dir;
        if (approachingFromDir !== sb.back.dir && approachingFromDir !== keptSide) {
          return null;
        }
      }
    }
    return stairDir;
  }

  // 3. Any Open Vertical Trapdoor
  if (isTrapdoorBlock(b)) {
    if (b.permutation.getState("open_bit") === true) {
      const td = b.permutation.getState("direction");
      if (td !== undefined && TRAPDOOR_DIR_TO_SLAB_DIR[td]) {
        return TRAPDOOR_DIR_TO_SLAB_DIR[td];
      }
    }
    return null;
  }

  // 4. Any Wall-Mounted Mini Block Pillar (exact 8px flush depth match!)
  if (MINI_BLOCK_IDS.has(b.typeId)) {
    if (b.permutation.getState("addon:shape") === "pillar") {
      const mf = b.permutation.getState("minecraft:block_face");
      if (mf && MINI_FACE_TO_SLAB_DIR[mf]) {
        return MINI_FACE_TO_SLAB_DIR[mf];
      }
    }
  }

  return null;
}

function computeWallSlabShape(dimension, loc, dir, inheritVerticalFrom = null) {
  const basis = SLAB_BASIS[dir];
  if (!basis) return "straight";

  // 1. Check Back neighbor -> Outer Corner (1/4 post)
  // From the back neighbor's perspective, our slab sits in the `basis.front.dir` direction.
  const backDir = getConnectableSlabDir(
    dimension,
    loc.x + basis.back.x,
    loc.y,
    loc.z + basis.back.z,
    basis.front.dir
  );
  if (backDir === basis.left.dir) {
    const rightDir = getConnectableSlabDir(dimension, loc.x + basis.right.x, loc.y, loc.z + basis.right.z);
    if (rightDir !== dir) return "outer_left";
  } else if (backDir === basis.right.dir) {
    const leftDir = getConnectableSlabDir(dimension, loc.x + basis.left.x, loc.y, loc.z + basis.left.z);
    if (leftDir !== dir) return "outer_right";
  }

  // 2. Check Front neighbor -> Inner Corner (3/4 L-wall)
  const frontDir = getConnectableSlabDir(
    dimension,
    loc.x + basis.front.x,
    loc.y,
    loc.z + basis.front.z,
    basis.back.dir
  );
  if (frontDir === basis.left.dir) {
    const leftDir = getConnectableSlabDir(dimension, loc.x + basis.left.x, loc.y, loc.z + basis.left.z);
    if (leftDir !== dir) return "inner_left";
  } else if (frontDir === basis.right.dir) {
    const rightDir = getConnectableSlabDir(dimension, loc.x + basis.right.x, loc.y, loc.z + basis.right.z);
    if (rightDir !== dir) return "inner_right";
  }

  // 3. Vertical Corner Continuity: if stacking onto a corner (or directly above/below one
  //    with matching direction and no horizontal corner override), continue the pillar/corner!
  if (inheritVerticalFrom && CORNER_SHAPES.has(inheritVerticalFrom)) {
    return inheritVerticalFrom;
  }

  for (const dy of [-1, 1]) {
    const vert = dimension.getBlock({ x: loc.x, y: loc.y + dy, z: loc.z });
    if (vert && WALL_SLAB_IDS.has(vert.typeId)) {
      const vDir = vert.permutation.getState("minecraft:cardinal_direction");
      const vShape = vert.permutation.getState("addon:shape");
      if (vDir === dir && CORNER_SHAPES.has(vShape)) {
        // Only inherit vertically if there isn't a parallel horizontal wall alongside us
        const leftDir = getConnectableSlabDir(dimension, loc.x + basis.left.x, loc.y, loc.z + basis.left.z);
        const rightDir = getConnectableSlabDir(dimension, loc.x + basis.right.x, loc.y, loc.z + basis.right.z);
        if (leftDir !== dir && rightDir !== dir) {
          return vShape;
        }
      }
    }
  }

  return "straight";
}

function refreshWallSlabShape(dimension, loc) {
  const block = dimension.getBlock(loc);
  if (!block || !WALL_SLAB_IDS.has(block.typeId)) return;
  const curShape = block.permutation.getState("addon:shape") || "straight";
  if (curShape === "locked") return; // Never disturb crouched/locked wall slabs!

  const dir = block.permutation.getState("minecraft:cardinal_direction");
  if (!dir) return;

  const newShape = computeWallSlabShape(dimension, loc, dir);
  if (newShape !== curShape) {
    block.setPermutation(block.permutation.withState("addon:shape", newShape));
  }
}

function refreshAdjacentWallSlabs(dimension, loc) {
  for (const off of HORIZONTAL_OFFSETS) {
    refreshWallSlabShape(dimension, { x: loc.x + off.x, y: loc.y, z: loc.z + off.z });
  }
  // Also refresh directly above & below for vertical corner continuity!
  refreshWallSlabShape(dimension, { x: loc.x, y: loc.y + 1, z: loc.z });
  refreshWallSlabShape(dimension, { x: loc.x, y: loc.y - 1, z: loc.z });
}

// ── Face-Aware Wall Slab Detection ──────────────────────────────────────────

function isWallSlabCombineFace(dir, shape, blockFace) {
  const basis = SLAB_BASIS[dir];
  if (!basis) return false;

  // Tapping the open front face ALWAYS means combine!
  if (blockFace === basis.front.face) return true;

  // On Inner/Outer corners, tapping the inner open cavity side also means combine!
  if ((shape === "inner_left" || shape === "outer_left") && blockFace === basis.right.face) {
    return true;
  }
  if ((shape === "inner_right" || shape === "outer_right") && blockFace === basis.left.face) {
    return true;
  }

  return false;
}

// ── Placement & Combining Actions ───────────────────────────────────────────

function tryMergeToFullBlock(player, targetBlock, blockTypeId, itemTypeId = blockTypeId, consumeCount = 1, refundTypeId = null, refundCount = 0) {
  const fullBlockId = SLAB_TO_FULL_BLOCK[blockTypeId] || STAIR_TO_FULL_BLOCK[blockTypeId];
  if (!fullBlockId || !canBuild(player)) return false;

  const location = targetBlock.location;
  const dimension = targetBlock.dimension;
  if (isFullBlockObstructed(dimension, location)) return false;

  const selectedSlot = player.selectedSlotIndex;
  if (!hasEnoughItems(player, itemTypeId, selectedSlot, consumeCount)) {
    if (consumeCount > 1) {
      const have = getItemCount(player, itemTypeId, selectedSlot);
      const targetName = STAIR_TO_FULL_BLOCK[blockTypeId] ? "Stairs" : "Wall Slab";
      showHint(player, `§eNeed ${consumeCount} Mini Blocks to fill ${targetName} §7(have ${have}/${consumeCount})`);
    }
    return false;
  }

  const shouldRefreshNeighbors = WALL_SLAB_IDS.has(blockTypeId) || MINI_BLOCK_IDS.has(blockTypeId) || isStairBlock(targetBlock);

  system.run(() => {
    const current = dimension.getBlock(location);
    if (current?.typeId !== blockTypeId) return;
    if (!player?.isValid || !canBuild(player)) return;
    if (!consumeItem(player, itemTypeId, selectedSlot, consumeCount)) return;

    current.setType(fullBlockId);
    if (shouldRefreshNeighbors) {
      refreshAdjacentWallSlabs(dimension, location);
    }
    if (refundTypeId && refundCount > 0 && player.getGameMode() === GameMode.Survival) {
      try {
        dimension.spawnItem(new ItemStack(refundTypeId, refundCount), {
          x: location.x + 0.5,
          y: location.y + 0.5,
          z: location.z + 0.5,
        });
      } catch {
        // Ignore
      }
    }
    playSound(dimension, location, itemTypeId, 1.15);
  });

  return true;
}

function tryUpgradeWallSlabToStair(player, wallSlabBlock, slabDir, faceLocation, miniTypeId, stairId) {
  if (!canBuild(player)) return false;
  const location = wallSlabBlock.location;
  const dimension = wallSlabBlock.dimension;
  const selectedSlot = player.selectedSlotIndex;

  if (!hasEnoughItems(player, miniTypeId, selectedSlot, 2)) {
    const have = getItemCount(player, miniTypeId, selectedSlot);
    showHint(player, `§eNeed 2 Mini Blocks to form Stairs §7(have ${have}/2)`);
    return false;
  }

  const weirdo = DIR_TO_STAIR_WEIRDO[slabDir] ?? 3;
  const upsideDown = (faceLocation?.y ?? 0.4) >= 0.5;
  const slabTypeId = wallSlabBlock.typeId;

  system.run(() => {
    const current = dimension.getBlock(location);
    if (current?.typeId !== slabTypeId) return;
    if (!player?.isValid || !canBuild(player)) return;
    if (!consumeItem(player, miniTypeId, selectedSlot, 2)) return;

    try {
      const perm = BlockPermutation.resolve(stairId, {
        weirdo_direction: weirdo,
        upside_down_bit: upsideDown,
      });
      current.setPermutation(perm);
    } catch {
      current.setType(stairId);
    }
    refreshAdjacentWallSlabs(dimension, location);
    showHint(player, "§bWall Slab + 2 Mini: §fStairs (6/8) §8(Tap w/ 2 more -> Full Block)");
    playSound(dimension, location, miniTypeId, SHAPE_PITCH.stair);
  });

  return true;
}

function tryPlaceWallSlabAt(player, targetLoc, dimension, slabTypeId, dir, inheritVerticalShape = null) {
  if (!canBuild(player)) return false;
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

    const shape = isLocked
      ? "locked"
      : computeWallSlabShape(dimension, targetLoc, dir, inheritVerticalShape);

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

function tryExtendFloorSlab(player, clickedSlab, blockFace, slabTypeId) {
  if (!canBuild(player)) return false;
  const offset = FACE_OFFSET[blockFace];
  if (!offset) return false;

  const targetLoc = {
    x: clickedSlab.location.x + offset.x,
    y: clickedSlab.location.y + offset.y,
    z: clickedSlab.location.z + offset.z,
  };
  const dim = clickedSlab.dimension;
  const targetBlock = dim.getBlock(targetLoc);
  if (!isReplaceable(targetBlock)) return false;

  const half = clickedSlab.permutation.getState("minecraft:vertical_half") || "bottom";
  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    if (!player?.isValid || !canBuild(player)) return;
    const current = dim.getBlock(targetLoc);
    if (!isReplaceable(current)) return;
    if (!consumeItem(player, slabTypeId, selectedSlot)) return;

    const perm = BlockPermutation.resolve(slabTypeId, {
      "minecraft:vertical_half": half,
    });
    current.setPermutation(perm);
    playSound(dim, targetLoc, slabTypeId, 1.0);
  });

  return true;
}

// ── Mini Block <-> Wall Slab Flush Placement ────────────────────────────────

function tryPlaceMiniBlockAlignedToWallSlab(player, clickedWallSlab, blockFace, faceLocation, miniTypeId) {
  if (!canBuild(player)) return false;
  const slabDir = clickedWallSlab.permutation.getState("minecraft:cardinal_direction");
  const alignedMiniFace = SLAB_DIR_TO_MINI_FACE[slabDir];
  if (!alignedMiniFace) return false;

  const offset = FACE_OFFSET[blockFace];
  if (!offset) return false;

  const targetLoc = {
    x: clickedWallSlab.location.x + offset.x,
    y: clickedWallSlab.location.y + offset.y,
    z: clickedWallSlab.location.z + offset.z,
  };
  const dim = clickedWallSlab.dimension;
  const targetBlock = dim.getBlock(targetLoc);
  if (!isReplaceable(targetBlock)) return false;

  let verticalHalf = "bottom";
  if (blockFace === Direction.Up) {
    verticalHalf = "bottom"; // Resting flush on top of the wall slab
  } else if (blockFace === Direction.Down) {
    verticalHalf = "top";    // Hanging flush underneath the wall slab
  } else {
    verticalHalf = (faceLocation?.y ?? 0.4) >= 0.5 ? "top" : "bottom";
  }

  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    if (!player?.isValid || !canBuild(player)) return;
    const current = dim.getBlock(targetLoc);
    if (!isReplaceable(current)) return;
    if (!consumeItem(player, miniTypeId, selectedSlot)) return;

    const perm = BlockPermutation.resolve(miniTypeId, {
      "minecraft:block_face": alignedMiniFace,
      "minecraft:vertical_half": verticalHalf,
      "addon:shape": "single",
    });
    current.setPermutation(perm);
    playSound(dim, targetLoc, miniTypeId, 1.0);
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

function getPlayerCardinalDir(player) {
  try {
    const view = player.getViewDirection();
    if (Math.abs(view.x) >= Math.abs(view.z)) {
      return view.x >= 0 ? "east" : "west";
    }
    return view.z >= 0 ? "south" : "north";
  } catch {
    return "north";
  }
}

function resolveNextMiniShape(currentShape, blockFace, faceLocation, player, miniTypeId) {
  const isVerticalFace = blockFace === Direction.Up || blockFace === Direction.Down;
  const isXFace = blockFace === Direction.East || blockFace === Direction.West;
  const isZFace = blockFace === Direction.North || blockFace === Direction.South;

  if (currentShape === "single") {
    if (isXFace) return "beam_x";
    if (isZFace) return "beam_z";
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
    return "step_x";
  }

  if (currentShape === "beam_z") {
    if (isVerticalFace) return "step_z";
    if (isXFace) return "corner";
    return "step_z";
  }

  // 3/8 -> 4/8: Vertical Mini Step transforms into a real Wall Slab (4 Mini = 1 Wall Slab!)
  // when a matching Wall Slab exists; Flat L-Corner completes into a 4/8 Horizontal Half-Block!
  if (currentShape === "step_x" || currentShape === "step_z") {
    if (MINI_BLOCK_TO_WALL_SLAB[miniTypeId]) return "wall_slab";
    return "slab_half";
  }
  if (currentShape === "corner") return "slab_half";

  // 4/8 -> 5/8 -> 6/8 (Real Vanilla Stair if available, else Mini Stair!) -> 7/8 -> 8/8 Full Block!
  if (currentShape === "slab_half") return "five";
  if (currentShape === "five") {
    if (MINI_BLOCK_TO_STAIR[miniTypeId]) return "stair";
    return "six";
  }
  if (currentShape === "six") return "seven";
  if (currentShape === "seven") return "full";

  return null;
}

function tryStackMiniBlock(player, targetBlock, blockFace, faceLocation, miniTypeId) {
  if (!canBuild(player)) return false;

  const currentShape = targetBlock.permutation.getState("addon:shape") || "single";
  const nextShape = resolveNextMiniShape(currentShape, blockFace, faceLocation, player, miniTypeId);
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
    const liveNext = resolveNextMiniShape(liveShape, blockFace, faceLocation, player, miniTypeId);
    if (!liveNext) return;

    if (!consumeItem(player, miniTypeId, selectedSlot)) return;

    if (liveNext === "full") {
      const fullBlockId = SLAB_TO_FULL_BLOCK[miniTypeId];
      if (fullBlockId) {
        current.setType(fullBlockId);
      }
      refreshAdjacentWallSlabs(dimension, location);
    } else if (liveNext === "stair") {
      // 6/8 Mini Blocks -> real Vanilla Stair facing player direction + matching floor/ceiling half!
      const stairId = MINI_BLOCK_TO_STAIR[miniTypeId];
      const mf = current.permutation.getState("minecraft:block_face");
      const vh = current.permutation.getState("minecraft:vertical_half");
      const upsideDown = mf === "down" || (mf !== "up" && vh === "top");
      const pDir = getPlayerCardinalDir(player);
      const weirdo = DIR_TO_STAIR_WEIRDO[pDir] ?? 3;
      try {
        const perm = BlockPermutation.resolve(stairId, {
          weirdo_direction: weirdo,
          upside_down_bit: upsideDown,
        });
        current.setPermutation(perm);
      } catch {
        current.setType(stairId);
      }
      refreshAdjacentWallSlabs(dimension, location);
    } else if (liveNext === "wall_slab") {
      // 4 Mini Blocks in a vertical step -> real auto-connecting Wall Slab!
      const wallSlabId = MINI_BLOCK_TO_WALL_SLAB[miniTypeId];
      const mf = current.permutation.getState("minecraft:block_face");
      let slabDir = mf && MINI_FACE_TO_SLAB_DIR[mf] ? MINI_FACE_TO_SLAB_DIR[mf] : null;
      if (!slabDir) {
        const pDir = getPlayerCardinalDir(player);
        if (liveShape === "step_x") {
          slabDir = pDir === "north" || pDir === "south" ? pDir : "north";
        } else {
          slabDir = pDir === "east" || pDir === "west" ? pDir : "west";
        }
      }
      const wallShape = computeWallSlabShape(dimension, location, slabDir);
      const perm = BlockPermutation.resolve(wallSlabId, {
        "minecraft:cardinal_direction": slabDir,
        "addon:shape": wallShape,
      });
      current.setPermutation(perm);
      refreshAdjacentWallSlabs(dimension, location);
    } else {
      current.setPermutation(current.permutation.withState("addon:shape", liveNext));
      if (liveNext === "pillar" || liveShape === "pillar") {
        refreshAdjacentWallSlabs(dimension, location);
      }
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

  // Toggling a vanilla trapdoor next to wall slabs -> refresh adjacent wall slabs on next tick!
  if (isTrapdoorBlock(block) && !player.isSneaking) {
    const loc = block.location;
    const dim = block.dimension;
    system.run(() => refreshAdjacentWallSlabs(dim, loc));
  }

  if (!itemStack) return;
  const itemTypeId = itemStack.typeId;
  if (!SLAB_TO_FULL_BLOCK[itemTypeId]) return;

  // ── 1. Holding a MINI BLOCK ───────────────────────────────────────────────
  if (MINI_BLOCK_IDS.has(itemTypeId)) {
    if (!player.isSneaking) {
      // 1A. Tapping a matching Mini Block directly -> tap-aware directional stacking!
      if (block.typeId === itemTypeId) {
        if (tryStackMiniBlock(player, block, blockFace, faceLocation, itemTypeId)) {
          event.cancel = true;
          return;
        }
      }

      // 1B. Tapping a Wall Slab with a Mini Block:
      if (WALL_SLAB_IDS.has(block.typeId)) {
        const slabDir = block.permutation.getState("minecraft:cardinal_direction");
        const slabShape = block.permutation.getState("addon:shape") || "straight";
        const basis = SLAB_BASIS[slabDir];

        // Matching Mini Block tapped onto the Wall Slab's open inner face:
        //   - If a Vanilla Stair exists: Wall Slab (4/8) + 2 Mini Blocks -> Stairs (6/8)!
        //   - Otherwise (glass, smooth_stone, cut_sandstone): Wall Slab (4/8) + 4 Mini Blocks -> Full Block (8/8)!
        if (
          MINI_BLOCK_TO_WALL_SLAB[itemTypeId] === block.typeId &&
          isWallSlabCombineFace(slabDir, slabShape, blockFace)
        ) {
          const matchingStair = MINI_BLOCK_TO_STAIR[itemTypeId];
          if (matchingStair) {
            if (tryUpgradeWallSlabToStair(player, block, slabDir, faceLocation, itemTypeId, matchingStair)) {
              event.cancel = true;
              return;
            }
          } else if (tryMergeToFullBlock(player, block, block.typeId, itemTypeId, 4)) {
            event.cancel = true;
            return;
          }
        }

        // Tapping Top, Bottom, Left, or Right of ANY Wall Slab -> align Mini Block flush to slab plane!
        if (
          basis &&
          (blockFace === Direction.Up ||
            blockFace === Direction.Down ||
            blockFace === basis.left.face ||
            blockFace === basis.right.face)
        ) {
          if (tryPlaceMiniBlockAlignedToWallSlab(player, block, blockFace, faceLocation, itemTypeId)) {
            event.cancel = true;
            return;
          }
        }
      }

      // 1C. Tapping a matching Vanilla Stair (6/8) with 2 Mini Blocks -> completes Full Vanilla Block (8/8)!
      if (STAIR_TO_MINI_BLOCK[block.typeId] === itemTypeId) {
        if (tryMergeToFullBlock(player, block, block.typeId, itemTypeId, 2)) {
          event.cancel = true;
          return;
        }
      }

      // 1D. Tapping an adjacent block face pointing into a matching Mini Block -> stack!
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
    }
    return;
  }

  // ── 2. Holding a WALL SLAB ────────────────────────────────────────────────
  if (WALL_SLAB_IDS.has(itemTypeId)) {
    const dim = block.dimension;
    const offset = FACE_OFFSET[blockFace];

    // 2A. Tapping a placed Wall Slab (Face-Aware: Combine on open face, Extend/Stack on edges & top/bottom!)
    if (WALL_SLAB_IDS.has(block.typeId)) {
      const slabDir = block.permutation.getState("minecraft:cardinal_direction");
      const slabShape = block.permutation.getState("addon:shape") || "straight";
      const basis = SLAB_BASIS[slabDir];

      if (basis) {
        // Combine 2:1 when tapping the open inner face of a matching wall slab (not sneaking)
        if (!player.isSneaking && block.typeId === itemTypeId && isWallSlabCombineFace(slabDir, slabShape, blockFace)) {
          if (tryMergeToFullBlock(player, block, itemTypeId)) {
            event.cancel = true;
            return;
          }
        }

        if (offset) {
          const targetLoc = {
            x: block.location.x + offset.x,
            y: block.location.y + offset.y,
            z: block.location.z + offset.z,
          };

          // Top / Bottom -> stack vertically in same facing direction (+ vertical corner continuity!)
          if (blockFace === Direction.Up || blockFace === Direction.Down) {
            const inheritCorner = CORNER_SHAPES.has(slabShape) ? slabShape : null;
            if (tryPlaceWallSlabAt(player, targetLoc, dim, itemTypeId, slabDir, inheritCorner)) {
              event.cancel = true;
              return;
            }
          }

          // Left / Right narrow edge -> extend thin wall sideways in the same facing direction!
          if (blockFace === basis.left.face || blockFace === basis.right.face) {
            if (tryPlaceWallSlabAt(player, targetLoc, dim, itemTypeId, slabDir)) {
              event.cancel = true;
              return;
            }
          }

          // Back face -> place flush back-to-back behind the wall slab!
          if (blockFace === basis.back.face) {
            const backSnapDir = FACE_TO_WALL_SLAB_DIR[blockFace];
            if (backSnapDir && tryPlaceWallSlabAt(player, targetLoc, dim, itemTypeId, backSnapDir)) {
              event.cancel = true;
              return;
            }
          }
        }
      }
    }

    // 2B. Tapping a 4/8..7/8 Mini Block OR matching Vanilla Stair (6/8) with a Wall Slab (4/8) -> Volume-conserved combine!
    if (!player.isSneaking && MINI_BLOCK_IDS.has(block.typeId) && WALL_SLAB_TO_MINI_BLOCK[itemTypeId] === block.typeId) {
      const mShape = block.permutation.getState("addon:shape") || "single";
      const mCount = SHAPE_COUNT[mShape] || 1;
      if (mCount >= 4) {
        // mCount + 4 >= 8 -> Full Block (8/8) + exact refund of (mCount - 4) Mini Blocks!
        const refund = mCount - 4;
        if (tryMergeToFullBlock(player, block, block.typeId, itemTypeId, 1, refund > 0 ? block.typeId : null, refund)) {
          event.cancel = true;
          return;
        }
      }
    }
    if (!player.isSneaking && STAIR_TO_MINI_BLOCK[block.typeId] && STAIR_TO_MINI_BLOCK[block.typeId] === WALL_SLAB_TO_MINI_BLOCK[itemTypeId]) {
      // Vanilla Stair (6/8) + Wall Slab (4/8) = Full Block (8/8) + refund 2 Mini Blocks!
      const miniRefundId = STAIR_TO_MINI_BLOCK[block.typeId];
      if (tryMergeToFullBlock(player, block, block.typeId, itemTypeId, 1, miniRefundId, 2)) {
        event.cancel = true;
        return;
      }
    }

    // 2C. Tapping an adjacent block face pointing into an existing matching Wall Slab -> combine!
    if (!player.isSneaking && offset) {
      const adjBlock = dim.getBlock({
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

    // 2D. Tapping any solid block's vertical side face (N/S/E/W) -> snap flush against that wall!
    // (Respects interactive blocks like chests/doors unless sneaking; floor/ceiling falls through
    // to native minecraft:placement_direction + playerPlaceBlock auto-connect!)
    if (FACE_TO_WALL_SLAB_DIR[blockFace] && offset && (player.isSneaking || !isInteractiveBlock(block))) {
      const targetLoc = {
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z,
      };
      if (tryPlaceWallSlabAt(player, targetLoc, dim, itemTypeId, FACE_TO_WALL_SLAB_DIR[blockFace])) {
        event.cancel = true;
        return;
      }
    }
    return;
  }

  // ── 3. Holding COBBLESTONE FLOOR SLAB (Face-Aware Combining & Extending) ──
  if (block.typeId === itemTypeId) {
    const half = block.permutation.getState("minecraft:vertical_half") || "bottom";
    const isCombineFace =
      (half === "bottom" && blockFace === Direction.Up) ||
      (half === "top" && blockFace === Direction.Down);

    if (!player.isSneaking && isCombineFace) {
      if (tryMergeToFullBlock(player, block, itemTypeId)) {
        event.cancel = true;
        return;
      }
    }

    // Tapping horizontal sides extends the floor/ceiling slab row cleanly!
    if (FACE_TO_WALL_SLAB_DIR[blockFace]) {
      if (tryExtendFloorSlab(player, block, blockFace, itemTypeId)) {
        event.cancel = true;
        return;
      }
    }
  } else if (!player.isSneaking) {
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

// Auto-connect Wall Slabs placed via native floor/ceiling placement (and when placing Stairs/Trapdoors!)
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

  if ((isStairBlock(block) || isTrapdoorBlock(block)) && !isCrouched) {
    refreshAdjacentWallSlabs(dim, loc);
  }
});

// Survival drop conservation for multi-cube Mini Blocks + refresh Wall Slab neighbors on break
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const { block, player, dimension } = event;
  if (!block?.isValid) return;

  const typeId = block.typeId;
  const loc = block.location;

  if (WALL_SLAB_IDS.has(typeId) || isStairBlock(block) || isTrapdoorBlock(block)) {
    system.run(() => {
      refreshAdjacentWallSlabs(dimension, loc);
    });
    return;
  }

  if (!MINI_BLOCK_IDS.has(typeId)) return;

  const shape = block.permutation.getState("addon:shape") || "single";
  if (shape === "pillar") {
    system.run(() => refreshAdjacentWallSlabs(dimension, loc));
  }

  if (!player?.isValid || player.getGameMode() !== GameMode.Survival) return;

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
