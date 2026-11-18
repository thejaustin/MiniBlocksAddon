import {
  world,
  system,
  Direction,
  GameMode,
  PlayerPermissionLevel,
  BlockPermutation,
  ItemStack,
} from "@minecraft/server";
import { SLAB_TO_FULL_BLOCK, SLAB_SOUNDS, MINI_BLOCK_IDS } from "./slab_map.js";

// Mini Blocks Addon - Wall Slab & Multi-Slot Mini Block Placement & Combining
// Recreates and elevates the classic 2015 Mini Blocks Mod by thejaustin.
// Mini blocks support 8 sub-slots (2×2×2 octant grid) inside a single block space.
// Direct tap placement on touch/pointer devices accurately targets sub-slots.
// When all 8 sub-slots are filled, the block converts into the full vanilla block.
// Wall slabs combine 2 halves into the full block. Sneak while placing to bypass.

// Nostalgic session greeting echoing the classic 2015 ModPE script
const welcomedPlayers = new Set();
world.afterEvents.playerSpawn.subscribe((event) => {
  const { player, initialSpawn } = event;
  if (!initialSpawn || !player?.isValid) return;
  if (welcomedPlayers.has(player.id)) return;
  welcomedPlayers.add(player.id);

  system.runTimeout(() => {
    if (!player.isValid) return;
    player.sendMessage(
      "§eWelcome back to Minecraft PE! You are using the §aMini Blocks Add-on v1.5.0§e! Originally created by §bthejaustin§e."
    );
  }, 20); // 1-second delay so world and UI are fully loaded
});

const NON_BLOCKING_ENTITIES = new Set(["minecraft:item", "minecraft:xp_orb"]);

const FACE_OFFSET = {
  [Direction.Down]:  { x: 0, y: -1, z: 0 },
  [Direction.Up]:    { x: 0, y: 1,  z: 0 },
  [Direction.North]: { x: 0, y: 0,  z: -1 },
  [Direction.South]: { x: 0, y: 0,  z: 1 },
  [Direction.West]:  { x: -1, y: 0, z: 0 },
  [Direction.East]:  { x: 1,  y: 0, z: 0 },
};

function canBuild(player) {
  const mode = player.getGameMode();
  if (mode !== GameMode.Survival && mode !== GameMode.Creative) return false;
  return player.playerPermissionLevel !== PlayerPermissionLevel.Visitor;
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

function playPlacementSound(dimension, location, typeId) {
  const sound = SLAB_SOUNDS?.[typeId] || "use.stone";
  const soundLoc = {
    x: location.x + 0.5,
    y: location.y + 0.5,
    z: location.z + 0.5,
  };
  try {
    dimension.playSound(sound, soundLoc, {
      volume: 1.0,
      pitch: 0.9 + Math.random() * 0.2, // Subtle organic pitch variation (0.9..1.1)
    });
  } catch {
    // Sound playback fail-safe
  }
}

function isObstructed(dimension, { x, y, z }) {
  const center = { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
  const EPSILON = 0.05; // 5cm tolerance so grazing adjacent entities don't block
  try {
    for (const entity of dimension.getEntities({ location: center, maxDistance: 3 })) {
      if (!entity?.isValid) continue;
      if (NON_BLOCKING_ENTITIES.has(entity.typeId)) continue;
      if (typeof entity.getAABB !== "function") continue;
      const aabb = entity.getAABB();
      if (!aabb?.center || !aabb?.extent) continue;
      const { center: c, extent: e } = aabb;
      if (
        c.x - e.x < x + 1 - EPSILON && c.x + e.x > x + EPSILON &&
        c.y - e.y < y + 1 - EPSILON && c.y + e.y > y + EPSILON &&
        c.z - e.z < z + 1 - EPSILON && c.z + e.z > z + EPSILON
      ) {
        return true;
      }
    }
  } catch {
    // Fail-safe
  }
  return false;
}

function isSubSlotObstructed(dimension, blockLoc, slot) {
  const dx = slot & 1;
  const dz = (slot >> 1) & 1;
  const dy = (slot >> 2) & 1;

  const minX = blockLoc.x + dx * 0.5;
  const maxX = minX + 0.5;
  const minY = blockLoc.y + dy * 0.5;
  const maxY = minY + 0.5;
  const minZ = blockLoc.z + dz * 0.5;
  const maxZ = minZ + 0.5;

  const center = { x: minX + 0.25, y: minY + 0.25, z: minZ + 0.25 };
  const EPSILON = 0.05;

  try {
    for (const entity of dimension.getEntities({ location: center, maxDistance: 2 })) {
      if (!entity?.isValid) continue;
      if (NON_BLOCKING_ENTITIES.has(entity.typeId)) continue;
      if (typeof entity.getAABB !== "function") continue;
      const aabb = entity.getAABB();
      if (!aabb?.center || !aabb?.extent) continue;
      const { center: c, extent: e } = aabb;
      if (
        c.x - e.x < maxX - EPSILON && c.x + e.x > minX + EPSILON &&
        c.y - e.y < maxY - EPSILON && c.y + e.y > minY + EPSILON &&
        c.z - e.z < maxZ - EPSILON && c.z + e.z > minZ + EPSILON
      ) {
        return true;
      }
    }
  } catch {
    // Fail-safe
  }
  return false;
}

function getFilledSlotCount(permutation) {
  if (!permutation) return 0;
  let count = 0;
  for (let i = 0; i < 8; i++) {
    if (permutation.getState(`addon:slot_${i}`) === true) {
      count++;
    }
  }
  return count;
}

function createMiniBlockPermutation(typeId, targetSlot) {
  const states = {
    "addon:slot_0": false,
    "addon:slot_1": false,
    "addon:slot_2": false,
    "addon:slot_3": false,
    "addon:slot_4": false,
    "addon:slot_5": false,
    "addon:slot_6": false,
    "addon:slot_7": false,
    [`addon:slot_${targetSlot}`]: true,
  };
  return BlockPermutation.resolve(typeId, states);
}

function tryPlaceOrAddMiniBlock(player, block, blockFace, faceLocation, miniTypeId) {
  if (!canBuild(player)) return false;

  const loc = block.location;
  const dim = block.dimension;
  const selectedSlot = player.selectedSlotIndex;

  // Normalize face tap coordinates [0.0..1.0]
  const fx = Math.max(0.0, Math.min(1.0, faceLocation?.x ?? 0.5));
  const fy = Math.max(0.0, Math.min(1.0, faceLocation?.y ?? 0.5));
  const fz = Math.max(0.0, Math.min(1.0, faceLocation?.z ?? 0.5));

  // Case A: Directly tapping an existing mini block of the same type
  if (block.typeId === miniTypeId) {
    const dx = fx >= 0.5 ? 1 : 0;
    const dy = fy >= 0.5 ? 1 : 0;
    const dz = fz >= 0.5 ? 1 : 0;
    const tappedSlot = dx + 2 * dz + 4 * dy;

    let targetLoc = loc;
    let targetSlot = -1;

    if (block.permutation.getState(`addon:slot_${tappedSlot}`) !== true) {
      targetSlot = tappedSlot;
    } else {
      // Sub-slot already occupied; place onto adjacent sub-slot along blockFace
      let nextDx = dx;
      let nextDy = dy;
      let nextDz = dz;

      switch (blockFace) {
        case Direction.Up:    nextDy++; break;
        case Direction.Down:  nextDy--; break;
        case Direction.North: nextDz--; break;
        case Direction.South: nextDz++; break;
        case Direction.West:  nextDx--; break;
        case Direction.East:  nextDx++; break;
      }

      if (nextDx >= 0 && nextDx <= 1 && nextDy >= 0 && nextDy <= 1 && nextDz >= 0 && nextDz <= 1) {
        const candidateSlot = nextDx + 2 * nextDz + 4 * nextDy;
        if (block.permutation.getState(`addon:slot_${candidateSlot}`) !== true) {
          targetSlot = candidateSlot;
        }
      } else {
        const offset = FACE_OFFSET[blockFace];
        if (offset) {
          targetLoc = { x: loc.x + offset.x, y: loc.y + offset.y, z: loc.z + offset.z };
          const subX = nextDx < 0 ? 1 : nextDx > 1 ? 0 : nextDx;
          const subY = nextDy < 0 ? 1 : nextDy > 1 ? 0 : nextDy;
          const subZ = nextDz < 0 ? 1 : nextDz > 1 ? 0 : nextDz;
          targetSlot = subX + 2 * subZ + 4 * subY;
        }
      }
    }

    if (targetSlot === -1) return false;
    if (isSubSlotObstructed(dim, targetLoc, targetSlot)) return false;

    system.run(() => {
      if (!player.isValid || !canBuild(player)) return;
      const current = dim.getBlock(targetLoc);
      if (!current) return;

      if (current.typeId === miniTypeId) {
        if (current.permutation.getState(`addon:slot_${targetSlot}`) === true) return;
        if (!consumeItem(player, miniTypeId, selectedSlot)) return;

        const updatedPerm = current.permutation.withState(`addon:slot_${targetSlot}`, true);
        if (getFilledSlotCount(updatedPerm) === 8) {
          const fullBlockId = SLAB_TO_FULL_BLOCK[miniTypeId];
          if (fullBlockId) {
            current.setType(fullBlockId);
          } else {
            current.setPermutation(updatedPerm);
          }
        } else {
          current.setPermutation(updatedPerm);
        }
        playPlacementSound(dim, targetLoc, miniTypeId);
      } else if (current.isAir) {
        if (!consumeItem(player, miniTypeId, selectedSlot)) return;
        const newPerm = createMiniBlockPermutation(miniTypeId, targetSlot);
        current.setPermutation(newPerm);
        playPlacementSound(dim, targetLoc, miniTypeId);
      }
    });

    return true;
  }

  // Case B: Tapping against a surface to place a mini block
  const offset = FACE_OFFSET[blockFace];
  if (!offset) return false;

  const targetLoc = { x: loc.x + offset.x, y: loc.y + offset.y, z: loc.z + offset.z };
  const targetBlock = dim.getBlock(targetLoc);
  if (!targetBlock) return false;

  let subX = fx >= 0.5 ? 1 : 0;
  let subY = fy >= 0.5 ? 1 : 0;
  let subZ = fz >= 0.5 ? 1 : 0;

  switch (blockFace) {
    case Direction.Up:    subY = 0; break;
    case Direction.Down:  subY = 1; break;
    case Direction.North: subZ = 1; break;
    case Direction.South: subZ = 0; break;
    case Direction.West:  subX = 1; break;
    case Direction.East:  subX = 0; break;
  }

  let targetSlot = subX + 2 * subZ + 4 * subY;

  if (targetBlock.typeId === miniTypeId) {
    if (targetBlock.permutation.getState(`addon:slot_${targetSlot}`) === true) {
      let found = -1;
      for (let s = 0; s < 8; s++) {
        if (targetBlock.permutation.getState(`addon:slot_${s}`) !== true) {
          found = s;
          break;
        }
      }
      if (found !== -1) {
        targetSlot = found;
      } else {
        return false;
      }
    }
  } else if (!targetBlock.isAir) {
    return false;
  }

  if (isSubSlotObstructed(dim, targetLoc, targetSlot)) return false;

  system.run(() => {
    if (!player.isValid || !canBuild(player)) return;
    const current = dim.getBlock(targetLoc);
    if (!current) return;

    if (current.typeId === miniTypeId) {
      if (current.permutation.getState(`addon:slot_${targetSlot}`) === true) return;
      if (!consumeItem(player, miniTypeId, selectedSlot)) return;

      const updatedPerm = current.permutation.withState(`addon:slot_${targetSlot}`, true);
      if (getFilledSlotCount(updatedPerm) === 8) {
        const fullBlockId = SLAB_TO_FULL_BLOCK[miniTypeId];
        if (fullBlockId) {
          current.setType(fullBlockId);
        } else {
          current.setPermutation(updatedPerm);
        }
      } else {
        current.setPermutation(updatedPerm);
      }
      playPlacementSound(dim, targetLoc, miniTypeId);
    } else if (current.isAir) {
      if (!consumeItem(player, miniTypeId, selectedSlot)) return;
      const newPerm = createMiniBlockPermutation(miniTypeId, targetSlot);
      current.setPermutation(newPerm);
      playPlacementSound(dim, targetLoc, miniTypeId);
    }
  });

  return true;
}

function tryMergeWallSlab(player, targetBlock, slabTypeId) {
  const fullBlockId = SLAB_TO_FULL_BLOCK[slabTypeId];
  if (!fullBlockId) return false;
  if (!canBuild(player)) return false;

  const location = targetBlock.location;
  const dimension = targetBlock.dimension;
  if (isObstructed(dimension, location)) return false;

  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    const current = dimension.getBlock(location);
    if (current?.typeId !== slabTypeId) return;
    if (!player.isValid || !canBuild(player)) return;

    if (!consumeItem(player, slabTypeId, selectedSlot)) return;

    current.setType(fullBlockId);
    playPlacementSound(dimension, location, slabTypeId);
  });

  return true;
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, itemStack, blockFace, faceLocation } = event;
  if (!event.isFirstEvent) return;
  if (player.isSneaking) return;
  if (!itemStack) return;

  const itemTypeId = itemStack.typeId;

  // Mini Block Placement & Combining
  if (MINI_BLOCK_IDS.has(itemTypeId)) {
    if (tryPlaceOrAddMiniBlock(player, block, blockFace, faceLocation, itemTypeId)) {
      event.cancel = true;
      return;
    }
  }

  // Wall Slab & Slab Combining
  if (SLAB_TO_FULL_BLOCK[itemTypeId] && !MINI_BLOCK_IDS.has(itemTypeId)) {
    // Case 1: Interacting directly with the slab
    if (block.typeId === itemTypeId) {
      if (tryMergeWallSlab(player, block, itemTypeId)) {
        event.cancel = true;
        return;
      }
    }

    // Case 2: Interacting with an adjacent block face pointing into an existing slab
    const offset = FACE_OFFSET[blockFace];
    if (offset) {
      const adjLoc = {
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z,
      };
      const adjBlock = block.dimension.getBlock(adjLoc);
      if (adjBlock?.typeId === itemTypeId) {
        if (tryMergeWallSlab(player, adjBlock, itemTypeId)) {
          event.cancel = true;
          return;
        }
      }
    }
  }
});

// Conservation on break: refund extra mini blocks placed into multi-slot clusters
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const { block, player, dimension } = event;
  if (!block?.isValid || !player?.isValid) return;
  if (!MINI_BLOCK_IDS.has(block.typeId)) return;
  if (player.getGameMode() !== GameMode.Survival) return;

  const count = getFilledSlotCount(block.permutation);
  if (count > 1) {
    const loc = {
      x: block.location.x + 0.5,
      y: block.location.y + 0.5,
      z: block.location.z + 0.5,
    };
    const typeId = block.typeId;
    system.run(() => {
      try {
        dimension.spawnItem(new ItemStack(typeId, count - 1), loc);
      } catch {
        // Fall-safe if spawnItem fails
      }
    });
  }
});
