import { world, system } from "@minecraft/server";

// When a player right-clicks a wall slab while holding the same slab type,
// both halves are "present" and the slab upgrades to the corresponding full block.
// This recreates the original Mini Blocks Mod combining mechanic.
const SLAB_TO_FULL_BLOCK = {
  "addon:andesite_wall_slab":             "minecraft:andesite",
  "addon:birch_wall_slab":               "minecraft:birch_planks",
  "addon:blackstone_wall_slab":          "minecraft:blackstone",
  "addon:brick_wall_slab":               "minecraft:brick_block",
  "addon:cobblestone_wall_slab":         "minecraft:cobblestone",
  "addon:crimson_wall_slab":             "minecraft:crimson_planks",
  "addon:cut_copper_wall_slab":          "minecraft:cut_copper",
  "addon:cut_red_sandstone_wall_slab":   "minecraft:cut_red_sandstone",
  "addon:cut_sandstone_wall_slab":       "minecraft:cut_sandstone",
  "addon:dark_oak_wall_slab":            "minecraft:dark_oak_planks",
  "addon:deepslate_wall_slab":           "minecraft:cobbled_deepslate",
  "addon:diorite_wall_slab":             "minecraft:diorite",
  "addon:end_stone_brick_wall_slab":     "minecraft:end_bricks",
  "addon:granite_wall_slab":             "minecraft:granite",
  "addon:jungle_wall_slab":              "minecraft:jungle_planks",
  "addon:mossy_cobblestone_wall_slab":   "minecraft:mossy_cobblestone",
  "addon:mossy_stone_brick_wall_slab":   "minecraft:mossy_stonebrick",
  "addon:nether_brick_wall_slab":        "minecraft:nether_brick",
  "addon:oak_wall_slab":                 "minecraft:oak_planks",
  "addon:polished_andesite_wall_slab":   "minecraft:polished_andesite",
  "addon:polished_blackstone_wall_slab": "minecraft:polished_blackstone",
  "addon:polished_diorite_wall_slab":    "minecraft:polished_diorite",
  "addon:polished_granite_wall_slab":    "minecraft:polished_granite",
  "addon:purpur_wall_slab":              "minecraft:purpur_block",
  "addon:quartz_wall_slab":              "minecraft:quartz_block",
  "addon:red_nether_brick_wall_slab":    "minecraft:red_nether_brick",
  "addon:red_sandstone_wall_slab":       "minecraft:red_sandstone",
  "addon:sandstone_wall_slab":           "minecraft:sandstone",
  "addon:smooth_quartz_wall_slab":       "minecraft:quartz_block",
  "addon:smooth_red_sandstone_wall_slab":"minecraft:red_sandstone",
  "addon:smooth_sandstone_wall_slab":    "minecraft:sandstone",
  "addon:smooth_stone_wall_slab":        "minecraft:smooth_stone",
  "addon:spruce_wall_slab":              "minecraft:spruce_planks",
  "addon:stone_brick_wall_slab":         "minecraft:stonebrick",
  "addon:stone_wall_slab":              "minecraft:stone",
  "addon:warped_wall_slab":              "minecraft:warped_planks",
};

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { block, player } = event;

  const fullBlockId = SLAB_TO_FULL_BLOCK[block.typeId];
  if (!fullBlockId) return;

  const heldItem = player.getComponent("equippable")?.getEquipment("Mainhand");
  if (!heldItem || heldItem.typeId !== block.typeId) return;

  event.cancel = true;

  const { x, y, z } = block.location;
  const dimension = block.dimension;
  const slabTypeId = block.typeId;
  const selectedSlot = player.selectedSlotIndex;
  const isCreative = player.getGameMode() === "creative";

  system.run(() => {
    dimension.runCommand(`setblock ${x} ${y} ${z} ${fullBlockId}`);

    if (!isCreative) {
      const container = player.getComponent("inventory")?.container;
      if (container) {
        const item = container.getItem(selectedSlot);
        if (item?.typeId === slabTypeId) {
          if (item.amount > 1) {
            item.amount -= 1;
            container.setItem(selectedSlot, item);
          } else {
            container.setItem(selectedSlot, undefined);
          }
        }
      }
    }
  });
});
