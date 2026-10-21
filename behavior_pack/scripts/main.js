import { world, system, Direction, GameMode } from "@minecraft/server";
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

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player, itemStack, blockFace } = event;
  if (!event.isFirstEvent) return;

  const fullBlockId = SLAB_TO_FULL_BLOCK[block.typeId];
  if (!fullBlockId) return;
  if (itemStack?.typeId !== block.typeId) return;
  if (player.isSneaking) return;

  const facing = block.permutation.getState("minecraft:cardinal_direction");
  if (blockFace !== OPEN_FACE[facing]) return;

  event.cancel = true;

  const location = block.location;
  const dimension = block.dimension;
  const slabTypeId = block.typeId;
  const selectedSlot = player.selectedSlotIndex;

  system.run(() => {
    const target = dimension.getBlock(location);
    if (target?.typeId !== slabTypeId) return;
    target.setType(fullBlockId);

    if (player.getGameMode() === GameMode.Creative) return;
    const container = player.getComponent("minecraft:inventory")?.container;
    if (!container) return;
    const item = container.getItem(selectedSlot);
    if (item?.typeId !== slabTypeId) return;
    if (item.amount > 1) {
      item.amount -= 1;
      container.setItem(selectedSlot, item);
    } else {
      container.setItem(selectedSlot, undefined);
    }
  });
});
