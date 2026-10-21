import { world, system, Direction, GameMode, PlayerPermissionLevel } from "@minecraft/server";
import { SLAB_TO_FULL_BLOCK } from "./slab_map.js";

// When a player right-clicks the open face of a wall slab while holding the
// same slab type, the second half fills in and the slab upgrades to the
// corresponding full block. This recreates the original Mini Blocks Mod
// combining mechanic. Sneak to place a slab normally instead.

// The face opposite each panel — the side of the block that is still empty.
const OPEN_FACE = {
  north: Direction.South,
  south: Direction.North,
  east:  Direction.West,
  west:  Direction.East,
};

// Entities that don't stop vanilla block placement.
const NON_BLOCKING_ENTITIES = new Set(["minecraft:item", "minecraft:xp_orb"]);

function canBuild(player) {
  const mode = player.getGameMode();
  if (mode !== GameMode.Survival && mode !== GameMode.Creative) return false;
  return player.playerPermissionLevel !== PlayerPermissionLevel.Visitor;
}

// True when any entity's hitbox overlaps the block space being filled.
function isObstructed(dimension, { x, y, z }) {
  const center = { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
  for (const entity of dimension.getEntities({ location: center, maxDistance: 3 })) {
    if (NON_BLOCKING_ENTITIES.has(entity.typeId)) continue;
    const { center: c, extent: e } = entity.getAABB();
    if (c.x - e.x < x + 1 && c.x + e.x > x &&
        c.y - e.y < y + 1 && c.y + e.y > y &&
        c.z - e.z < z + 1 && c.z + e.z > z) {
      return true;
    }
  }
  return false;
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, itemStack, blockFace } = event;
  if (!event.isFirstEvent) return;

  const fullBlockId = SLAB_TO_FULL_BLOCK[block.typeId];
  if (!fullBlockId) return;
  if (itemStack?.typeId !== block.typeId) return;
  if (player.isSneaking) return;

  const facing = block.permutation.getState("minecraft:cardinal_direction");
  if (blockFace !== OPEN_FACE[facing]) return;

  // Leave anything vanilla would refuse to vanilla.
  if (!canBuild(player)) return;
  const location = block.location;
  const dimension = block.dimension;
  if (isObstructed(dimension, location)) return;

  event.cancel = true;

  const slabTypeId = block.typeId;
  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    const target = dimension.getBlock(location);
    if (target?.typeId !== slabTypeId) return;
    if (!player.isValid || !canBuild(player)) return;

    // Take the slab first so a failed deduction never yields a free merge.
    if (player.getGameMode() !== GameMode.Creative) {
      const container = player.getComponent("minecraft:inventory")?.container;
      const item = container?.getItem(selectedSlot);
      if (item?.typeId !== slabTypeId) return;
      if (item.amount > 1) {
        item.amount -= 1;
        container.setItem(selectedSlot, item);
      } else {
        container.setItem(selectedSlot, undefined);
      }
    }

    target.setType(fullBlockId);
  });
});
