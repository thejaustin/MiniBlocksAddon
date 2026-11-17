import { world, system, Direction, GameMode, PlayerPermissionLevel } from "@minecraft/server";
import { SLAB_TO_FULL_BLOCK, SLAB_SOUNDS } from "./slab_map.js";

// Mini Blocks Addon - Wall Slab Combining Mechanic
// Recreates the classic Mini Blocks Mod combining behavior.
// Interacting with a wall slab while holding the matching slab type combines
// both halves into the full vanilla block. Sneak while placing to build adjacent slabs.

const NON_BLOCKING_ENTITIES = new Set(["minecraft:item", "minecraft:xp_orb"]);

function canBuild(player) {
  const mode = player.getGameMode();
  if (mode !== GameMode.Survival && mode !== GameMode.Creative) return false;
  return player.playerPermissionLevel !== PlayerPermissionLevel.Visitor;
}

function isObstructed(dimension, { x, y, z }) {
  const center = { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
  try {
    for (const entity of dimension.getEntities({ location: center, maxDistance: 3 })) {
      if (!entity?.isValid) continue;
      if (NON_BLOCKING_ENTITIES.has(entity.typeId)) continue;
      if (typeof entity.getAABB !== "function") continue;
      const aabb = entity.getAABB();
      if (!aabb?.center || !aabb?.extent) continue;
      const { center: c, extent: e } = aabb;
      if (c.x - e.x < x + 1 && c.x + e.x > x &&
          c.y - e.y < y + 1 && c.y + e.y > y &&
          c.z - e.z < z + 1 && c.z + e.z > z) {
        return true;
      }
    }
  } catch {
    // If entity query or AABB computation fails, fail-safe (do not block placement)
  }
  return false;
}

const FACE_OFFSET = {
  [Direction.Down]:  { x: 0, y: -1, z: 0 },
  [Direction.Up]:    { x: 0, y: 1,  z: 0 },
  [Direction.North]: { x: 0, y: 0,  z: -1 },
  [Direction.South]: { x: 0, y: 0,  z: 1 },
  [Direction.West]:  { x: -1, y: 0, z: 0 },
  [Direction.East]:  { x: 1,  y: 0, z: 0 },
};

function tryMerge(player, targetBlock, slabTypeId) {
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

    if (player.getGameMode() !== GameMode.Creative) {
      const container = player.getComponent("minecraft:inventory")?.container;
      if (!container) return;
      const activeSlot = player.selectedSlotIndex;
      const slot = (activeSlot !== undefined && container.getItem(activeSlot)?.typeId === slabTypeId)
        ? activeSlot
        : selectedSlot;
      const item = container.getItem(slot);
      if (item?.typeId !== slabTypeId) return;
      if (item.amount > 1) {
        item.amount -= 1;
        container.setItem(slot, item);
      } else {
        container.setItem(slot, undefined);
      }
    }

    current.setType(fullBlockId);

    // Audio feedback: play the corresponding placement sound at block center
    const sound = SLAB_SOUNDS?.[slabTypeId] || "use.stone";
    try {
      dimension.playSound(sound, {
        x: location.x + 0.5,
        y: location.y + 0.5,
        z: location.z + 0.5,
      });
    } catch {
      // Sound playback fail-safe
    }
  });

  return true;
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, itemStack, blockFace } = event;
  if (!event.isFirstEvent) return;
  if (player.isSneaking) return;
  if (!itemStack) return;

  // Case 1: Interacting directly with the wall slab from any face
  if (block.typeId === itemStack.typeId && SLAB_TO_FULL_BLOCK[block.typeId]) {
    if (tryMerge(player, block, block.typeId)) {
      event.cancel = true;
      return;
    }
  }

  // Case 2: Interacting with an adjacent block face pointing into an existing wall slab
  const offset = FACE_OFFSET[blockFace];
  if (offset) {
    const adjLoc = { x: block.location.x + offset.x, y: block.location.y + offset.y, z: block.location.z + offset.z };
    const adjBlock = block.dimension.getBlock(adjLoc);
    if (adjBlock?.typeId === itemStack.typeId && SLAB_TO_FULL_BLOCK[adjBlock.typeId]) {
      if (tryMerge(player, adjBlock, adjBlock.typeId)) {
        event.cancel = true;
        return;
      }
    }
  }
});
