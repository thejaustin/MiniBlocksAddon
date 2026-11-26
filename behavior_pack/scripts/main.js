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

// Mini Blocks Add-on v2.0.0 — Bedrock 26.60 (@minecraft/server 2.11.0)
// Successor to the classic 2015 MCPE Mini Blocks Mod by thejaustin.
//
// Mechanics:
// 1. Wall Slabs:
//    - Tap any horizontal wall face (N/S/E/W) -> snaps flush against that wall face!
//    - Tap any floor/ceiling (Up/Down) -> faces the player's cardinal direction!
//    - Tap an existing matching wall slab (or adjacent face pointing into one) ->
//      combines both halves into the full vanilla block!
//    - Sneak while placing to bypass combining and build adjacent thin walls.
// 2. Mini Blocks:
//    - Mounts natively to floor, ceiling, or any of the 4 walls (bottom or top half).
//    - Tap an existing matching mini block to stack progressively in the same space:
//      Single (1) -> Double (2) -> Triple L-cluster (3) -> Full Vanilla Block (4)!
//    - Breaking a Double or Triple cluster in Survival refunds all constituent mini blocks.
//    - Sneak while placing to bypass stacking and place a separate adjacent mini block.
// 3. Cobblestone Floor Slab:
//    - Supports top & bottom placement and combines 2:1 into full cobblestone.

const welcomedPlayers = new Set();
world.afterEvents.playerSpawn.subscribe((event) => {
  const { player, initialSpawn } = event;
  if (!initialSpawn || !player?.isValid) return;
  if (welcomedPlayers.has(player.id)) return;
  welcomedPlayers.add(player.id);

  system.runTimeout(() => {
    if (!player?.isValid) return;
    player.sendMessage(
      "§eWelcome back to Minecraft! You are using the §aMini Blocks Add-on v2.0.1§e (Bedrock 26.60)! Originally created by §bthejaustin§e."
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

const FACE_OFFSET = {
  [Direction.Down]:  { x: 0, y: -1, z: 0 },
  [Direction.Up]:    { x: 0, y: 1,  z: 0 },
  [Direction.North]: { x: 0, y: 0,  z: -1 },
  [Direction.South]: { x: 0, y: 0,  z: 1 },
  [Direction.West]:  { x: -1, y: 0, z: 0 },
  [Direction.East]:  { x: 1,  y: 0, z: 0 },
};

// When tapping a vertical face of a block, the wall slab placed in the adjacent cell
// attaches flush against that tapped block (opposite cardinal half of the new cell):
//   Tap North face (-Z) -> new cell is z-1 -> flush against South side of new cell ('south')
//   Tap South face (+Z) -> new cell is z+1 -> flush against North side of new cell ('north')
//   Tap East face  (+X) -> new cell is x+1 -> flush against West side of new cell  ('west')
//   Tap West face  (-X) -> new cell is x-1 -> flush against East side of new cell  ('east')
const FACE_TO_WALL_SLAB_DIR = {
  [Direction.North]: "south",
  [Direction.South]: "north",
  [Direction.East]:  "west",
  [Direction.West]:  "east",
};

const NEXT_MINI_SIZE = {
  single: "double",
  double: "triple",
  triple: "full",
};

const STAGE_PITCH = {
  double: 0.96,
  triple: 1.04,
  full:   1.12,
};

function canBuild(player) {
  const mode = player.getGameMode();
  if (mode !== GameMode.Survival && mode !== GameMode.Creative) return false;
  return player.playerPermissionLevel !== PlayerPermissionLevel.Visitor;
}

const INTERACTIVE_BLOCK_PATTERNS = [
  "chest", "barrel", "shulker_box", "furnace", "smoker", "hopper", "dropper",
  "dispenser", "crafting_table", "stonecutter", "anvil", "grindstone", "loom",
  "cartography_table", "smithing_table", "enchanting_table", "brewing_stand",
  "beacon", "bed", "door", "trapdoor", "fence_gate", "button", "lever",
  "repeater", "comparator", "noteblock", "jukebox", "lectern", "bell", "crafter",
];

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
    // Fallback if a specific sound event is unavailable
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

function tryMergeToFullBlock(player, targetBlock, blockTypeId) {
  const fullBlockId = SLAB_TO_FULL_BLOCK[blockTypeId];
  if (!fullBlockId || !canBuild(player)) return false;

  const location = targetBlock.location;
  const dimension = targetBlock.dimension;
  if (isFullBlockObstructed(dimension, location)) return false;

  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    const current = dimension.getBlock(location);
    if (current?.typeId !== blockTypeId) return;
    if (!player?.isValid || !canBuild(player)) return;
    if (!consumeItem(player, blockTypeId, selectedSlot)) return;

    current.setType(fullBlockId);
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

  const selectedSlot = player.selectedSlotIndex;
  let perm;
  try {
    perm = BlockPermutation.resolve(slabTypeId, {
      "minecraft:cardinal_direction": dir,
    });
  } catch {
    return false;
  }

  system.run(() => {
    if (!player?.isValid || !canBuild(player)) return;
    const current = dimension.getBlock(targetLoc);
    if (!isReplaceable(current)) return;
    if (!consumeItem(player, slabTypeId, selectedSlot)) return;

    current.setPermutation(perm);
    playSound(dimension, targetLoc, slabTypeId, 1.0);
  });

  return true;
}

function tryStackMiniBlock(player, targetBlock, miniTypeId) {
  if (!canBuild(player)) return false;

  const currentSize = targetBlock.permutation.getState("addon:size") || "single";
  const nextSize = NEXT_MINI_SIZE[currentSize];
  if (!nextSize) return false;

  const location = targetBlock.location;
  const dimension = targetBlock.dimension;

  if (nextSize === "full") {
    if (isFullBlockObstructed(dimension, location)) return false;
  }

  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    if (!player?.isValid || !canBuild(player)) return;
    const current = dimension.getBlock(location);
    if (current?.typeId !== miniTypeId) return;

    const liveSize = current.permutation.getState("addon:size") || "single";
    const liveNext = NEXT_MINI_SIZE[liveSize];
    if (!liveNext) return;

    if (!consumeItem(player, miniTypeId, selectedSlot)) return;

    if (liveNext === "full") {
      const fullBlockId = SLAB_TO_FULL_BLOCK[miniTypeId];
      if (fullBlockId) {
        current.setType(fullBlockId);
      }
    } else {
      const updatedPerm = current.permutation.withState("addon:size", liveNext);
      current.setPermutation(updatedPerm);
    }
    playSound(dimension, location, miniTypeId, STAGE_PITCH[liveNext] || 1.0);
  });

  return true;
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, itemStack, blockFace } = event;
  if (!event.isFirstEvent) return;
  if (!itemStack) return;

  const itemTypeId = itemStack.typeId;
  if (!SLAB_TO_FULL_BLOCK[itemTypeId]) return;

  // ── 1. Mini Blocks: Progressive 1 -> 2 -> 3 -> Full Block Stacking ──
  if (MINI_BLOCK_IDS.has(itemTypeId)) {
    if (player.isSneaking) return; // Sneak to place a separate adjacent mini block

    if (block.typeId === itemTypeId) {
      if (tryStackMiniBlock(player, block, itemTypeId)) {
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
        if (tryStackMiniBlock(player, adjBlock, itemTypeId)) {
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
      // Case A: Tapping an existing matching wall slab directly -> combine into full block!
      if (block.typeId === itemTypeId) {
        if (tryMergeToFullBlock(player, block, itemTypeId)) {
          event.cancel = true;
          return;
        }
      }

      // Case B: Tapping an adjacent block face pointing into an existing matching wall slab -> combine!
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

    // Case C: Tapping a vertical side face (N/S/E/W) -> snap wall slab flush against that wall!
    // (Respect interactive blocks like chests/doors unless sneaking; floor/ceiling falls through
    // to native minecraft:placement_direction!)
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

// Survival conservation: breaking a Double or Triple mini block cluster drops all pieces!
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const { block, player, dimension } = event;
  if (!block?.isValid || !player?.isValid) return;
  if (!MINI_BLOCK_IDS.has(block.typeId)) return;
  if (player.getGameMode() !== GameMode.Survival) return;

  const size = block.permutation.getState("addon:size");
  const extraCount = size === "triple" ? 2 : size === "double" ? 1 : 0;
  if (extraCount <= 0) return;

  const dropLoc = {
    x: block.location.x + 0.5,
    y: block.location.y + 0.5,
    z: block.location.z + 0.5,
  };
  const typeId = block.typeId;

  system.run(() => {
    try {
      dimension.spawnItem(new ItemStack(typeId, extraCount), dropLoc);
    } catch {
      // Fail-safe
    }
  });
});
