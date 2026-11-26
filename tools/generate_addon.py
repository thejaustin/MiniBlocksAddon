#!/usr/bin/env python3
"""Generator for MiniBlocks Addon v2.0.0 — targets Minecraft Bedrock 26.60 (1.26.60).

Run from anywhere: `python3 tools/generate_addon.py` (or `--package` to build .mcaddon).
Regenerates block JSONs, geometries, recipes, crafting item catalog (expandable creative
inventory groups), terrain textures, block sounds, lang strings, and the JS block maps.
"""

import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BP = os.path.join(REPO, "behavior_pack")
RP = os.path.join(REPO, "resource_pack")

BLOCK_FORMAT = "1.26.60"    # Mojang bedrock-samples v1.26.60.5
CATALOG_FORMAT = "1.26.50"  # Mojang bedrock-samples v1.26.60.5 crafting_catalog
RECIPE_FORMAT = "1.20.10"   # Matches vanilla recipes in v1.26.60.5
GEO_FORMAT = "1.21.0"       # Matches vanilla block models in v1.26.60.5
TEX_PREFIX = "miniblocks_"  # Prefix prevents collisions with vanilla terrain_texture keys

# ── Catalog Definitions ──────────────────────────────────────────────────────

# Wall Slabs: (slug, source_block, hardness, stonecutter_allowed, rp_sound, tool_type, flammable)
# Ordered thoughtfully for the Creative Menu "Wall Slabs (+)" drawer.
WALL_SLABS = [
    # Woods
    ("oak",                  "minecraft:oak_planks",           1.5, False, "wood",         "axe",     True),
    ("spruce",               "minecraft:spruce_planks",        1.5, False, "wood",         "axe",     True),
    ("birch",                "minecraft:birch_planks",         1.5, False, "wood",         "axe",     True),
    ("jungle",               "minecraft:jungle_planks",        1.5, False, "wood",         "axe",     True),
    ("acacia",               "minecraft:acacia_planks",        1.5, False, "wood",         "axe",     True),
    ("dark_oak",             "minecraft:dark_oak_planks",      1.5, False, "wood",         "axe",     True),
    ("mangrove",             "minecraft:mangrove_planks",      1.5, False, "wood",         "axe",     True),
    ("cherry",               "minecraft:cherry_planks",        1.5, False, "cherry_wood",  "axe",     True),
    ("bamboo",               "minecraft:bamboo_planks",        1.5, False, "bamboo_wood",  "axe",     True),
    ("pale_oak",             "minecraft:pale_oak_planks",      1.5, False, "wood",         "axe",     True),
    ("crimson",              "minecraft:crimson_planks",       1.5, False, "nether_wood",  "axe",     False),
    ("warped",               "minecraft:warped_planks",        1.5, False, "nether_wood",  "axe",     False),
    # Stones & Bricks
    ("stone",                "minecraft:stone",                1.5, True,  "stone",        "pickaxe", False),
    ("smooth_stone",         "minecraft:smooth_stone",         2.0, True,  "stone",        "pickaxe", False),
    ("cobblestone",          "minecraft:cobblestone",          2.0, True,  "stone",        "pickaxe", False),
    ("mossy_cobblestone",    "minecraft:mossy_cobblestone",    2.0, True,  "stone",        "pickaxe", False),
    ("stone_brick",          "minecraft:stone_bricks",         1.5, True,  "stone",        "pickaxe", False),
    ("mossy_stone_brick",    "minecraft:mossy_stone_bricks",   1.5, True,  "stone",        "pickaxe", False),
    ("granite",              "minecraft:granite",              1.5, True,  "stone",        "pickaxe", False),
    ("polished_granite",     "minecraft:polished_granite",     1.5, True,  "stone",        "pickaxe", False),
    ("diorite",              "minecraft:diorite",              1.5, True,  "stone",        "pickaxe", False),
    ("polished_diorite",     "minecraft:polished_diorite",     1.5, True,  "stone",        "pickaxe", False),
    ("andesite",             "minecraft:andesite",             1.5, True,  "stone",        "pickaxe", False),
    ("polished_andesite",    "minecraft:polished_andesite",    1.5, True,  "stone",        "pickaxe", False),
    ("deepslate",            "minecraft:cobbled_deepslate",    3.5, True,  "deepslate",    "pickaxe", False),
    ("brick",                "minecraft:brick_block",          2.0, True,  "stone",        "pickaxe", False),
    # Sandstone & Quartz
    ("sandstone",            "minecraft:sandstone",            0.8, True,  "stone",        "pickaxe", False),
    ("cut_sandstone",        "minecraft:cut_sandstone",        0.8, True,  "stone",        "pickaxe", False),
    ("smooth_sandstone",     "minecraft:smooth_sandstone",     0.8, True,  "stone",        "pickaxe", False),
    ("red_sandstone",        "minecraft:red_sandstone",        0.8, True,  "stone",        "pickaxe", False),
    ("cut_red_sandstone",    "minecraft:cut_red_sandstone",    0.8, True,  "stone",        "pickaxe", False),
    ("smooth_red_sandstone", "minecraft:smooth_red_sandstone", 0.8, True,  "stone",        "pickaxe", False),
    ("quartz",               "minecraft:quartz_block",         0.8, True,  "stone",        "pickaxe", False),
    ("smooth_quartz",        "minecraft:smooth_quartz",        0.8, True,  "stone",        "pickaxe", False),
    # Nether, End, Copper & Glass
    ("nether_brick",         "minecraft:nether_brick",         2.0, True,  "nether_brick", "pickaxe", False),
    ("red_nether_brick",     "minecraft:red_nether_brick",     2.0, True,  "nether_brick", "pickaxe", False),
    ("blackstone",           "minecraft:blackstone",           1.5, True,  "stone",        "pickaxe", False),
    ("polished_blackstone",  "minecraft:polished_blackstone",  2.0, True,  "stone",        "pickaxe", False),
    ("end_stone_brick",      "minecraft:end_bricks",           3.0, True,  "stone",        "pickaxe", False),
    ("purpur",               "minecraft:purpur_block",         1.5, True,  "stone",        "pickaxe", False),
    ("cut_copper",           "minecraft:cut_copper",           3.0, True,  "copper",       "pickaxe", False),
    ("glass",                "minecraft:glass",                0.3, False, "glass",        None,      False),
]

# Mini Blocks: (slug, source_block, hardness, rp_sound, stonecutter_allowed, tool_type, flammable, light_emission)
# First matches ALL 42 Wall Slabs in identical 1:1 order (Woods -> Stones & Bricks -> Sandstone & Quartz
# -> Nether, End, Copper & Glass), then extends into extra building/nature/light/metal blocks!
MINI_BLOCKS = [
    # ── 1:1 Wall Slab Parity: Woods (12) ──
    ("oak_planks",           "minecraft:oak_planks",           1.5,  "wood",           False, "axe",     True,  0),
    ("spruce_planks",        "minecraft:spruce_planks",        1.5,  "wood",           False, "axe",     True,  0),
    ("birch_planks",         "minecraft:birch_planks",         1.5,  "wood",           False, "axe",     True,  0),
    ("jungle_planks",        "minecraft:jungle_planks",        1.5,  "wood",           False, "axe",     True,  0),
    ("acacia_planks",        "minecraft:acacia_planks",        1.5,  "wood",           False, "axe",     True,  0),
    ("dark_oak_planks",      "minecraft:dark_oak_planks",      1.5,  "wood",           False, "axe",     True,  0),
    ("mangrove_planks",      "minecraft:mangrove_planks",      1.5,  "wood",           False, "axe",     True,  0),
    ("cherry_planks",        "minecraft:cherry_planks",        1.5,  "cherry_wood",    False, "axe",     True,  0),
    ("bamboo_planks",        "minecraft:bamboo_planks",        1.5,  "bamboo_wood",    False, "axe",     True,  0),
    ("pale_oak_planks",      "minecraft:pale_oak_planks",      1.5,  "wood",           False, "axe",     True,  0),
    ("crimson_planks",       "minecraft:crimson_planks",       1.5,  "nether_wood",    False, "axe",     False, 0),
    ("warped_planks",        "minecraft:warped_planks",        1.5,  "nether_wood",    False, "axe",     False, 0),
    # ── 1:1 Wall Slab Parity: Stones & Bricks (14) ──
    ("stone",                "minecraft:stone",                1.5,  "stone",          True,  "pickaxe", False, 0),
    ("smooth_stone",         "minecraft:smooth_stone",         2.0,  "stone",          True,  "pickaxe", False, 0),
    ("cobblestone",          "minecraft:cobblestone",          2.0,  "stone",          True,  "pickaxe", False, 0),
    ("mossy_cobblestone",    "minecraft:mossy_cobblestone",    2.0,  "stone",          True,  "pickaxe", False, 0),
    ("stone_bricks",         "minecraft:stone_bricks",         1.5,  "stone",          True,  "pickaxe", False, 0),
    ("mossy_stone_bricks",   "minecraft:mossy_stone_bricks",   1.5,  "stone",          True,  "pickaxe", False, 0),
    ("granite",              "minecraft:granite",              1.5,  "stone",          True,  "pickaxe", False, 0),
    ("polished_granite",     "minecraft:polished_granite",     1.5,  "stone",          True,  "pickaxe", False, 0),
    ("diorite",              "minecraft:diorite",              1.5,  "stone",          True,  "pickaxe", False, 0),
    ("polished_diorite",     "minecraft:polished_diorite",     1.5,  "stone",          True,  "pickaxe", False, 0),
    ("andesite",             "minecraft:andesite",             1.5,  "stone",          True,  "pickaxe", False, 0),
    ("polished_andesite",    "minecraft:polished_andesite",    1.5,  "stone",          True,  "pickaxe", False, 0),
    ("cobbled_deepslate",    "minecraft:cobbled_deepslate",    3.5,  "deepslate",      True,  "pickaxe", False, 0),
    ("brick",                "minecraft:brick_block",          2.0,  "stone",          True,  "pickaxe", False, 0),
    # ── 1:1 Wall Slab Parity: Sandstone & Quartz (8) ──
    ("sandstone",            "minecraft:sandstone",            0.8,  "stone",          True,  "pickaxe", False, 0),
    ("cut_sandstone",        "minecraft:cut_sandstone",        0.8,  "stone",          True,  "pickaxe", False, 0),
    ("smooth_sandstone",     "minecraft:smooth_sandstone",     0.8,  "stone",          True,  "pickaxe", False, 0),
    ("red_sandstone",        "minecraft:red_sandstone",        0.8,  "stone",          True,  "pickaxe", False, 0),
    ("cut_red_sandstone",    "minecraft:cut_red_sandstone",    0.8,  "stone",          True,  "pickaxe", False, 0),
    ("smooth_red_sandstone", "minecraft:smooth_red_sandstone", 0.8,  "stone",          True,  "pickaxe", False, 0),
    ("quartz_block",         "minecraft:quartz_block",         0.8,  "stone",          True,  "pickaxe", False, 0),
    ("smooth_quartz",        "minecraft:smooth_quartz",        0.8,  "stone",          True,  "pickaxe", False, 0),
    # ── 1:1 Wall Slab Parity: Nether, End, Copper & Glass (8) ──
    ("nether_brick",         "minecraft:nether_brick",         2.0,  "nether_brick",   True,  "pickaxe", False, 0),
    ("red_nether_brick",     "minecraft:red_nether_brick",     2.0,  "nether_brick",   True,  "pickaxe", False, 0),
    ("blackstone",           "minecraft:blackstone",           1.5,  "stone",          True,  "pickaxe", False, 0),
    ("polished_blackstone",  "minecraft:polished_blackstone",  2.0,  "stone",          True,  "pickaxe", False, 0),
    ("end_stone_brick",      "minecraft:end_bricks",           3.0,  "stone",          True,  "pickaxe", False, 0),
    ("purpur_block",         "minecraft:purpur_block",         1.5,  "stone",          True,  "pickaxe", False, 0),
    ("cut_copper",           "minecraft:cut_copper",           3.0,  "copper",         True,  "pickaxe", False, 0),
    ("glass",                "minecraft:glass",                0.3,  "glass",          False, None,      False, 0),
    # ── Extended Territory: Extra Masonry, Decor, Lights, Metals & Nature (15) ──
    ("tuff_bricks",          "minecraft:tuff_bricks",          1.5,  "tuff_bricks",    True,  "pickaxe", False, 0),
    ("obsidian",             "minecraft:obsidian",             10.0, "stone",          False, "pickaxe", False, 0),
    ("bookshelf",            "minecraft:bookshelf",            1.5,  "wood",           False, "axe",     True,  0),
    ("glowstone",            "minecraft:glowstone",            0.3,  "glass",          False, None,      False, 15),
    ("sea_lantern",          "minecraft:sea_lantern",          0.3,  "glass",          False, None,      False, 15),
    ("iron_block",           "minecraft:iron_block",           5.0,  "iron",           True,  "pickaxe", False, 0),
    ("gold_block",           "minecraft:gold_block",           3.0,  "metal",          True,  "pickaxe", False, 0),
    ("diamond_block",        "minecraft:diamond_block",        5.0,  "metal",          True,  "pickaxe", False, 0),
    ("emerald_block",        "minecraft:emerald_block",        5.0,  "metal",          True,  "pickaxe", False, 0),
    ("copper_block",         "minecraft:copper_block",         3.0,  "copper",         True,  "pickaxe", False, 0),
    ("amethyst_block",       "minecraft:amethyst_block",       1.5,  "amethyst_block", True,  "pickaxe", False, 0),
    ("dirt",                 "minecraft:dirt",                 0.5,  "gravel",         False, None,      False, 0),
    ("grass_block",          "minecraft:grass_block",          0.6,  "grass",          False, None,      False, 0),
    ("moss_block",           "minecraft:moss_block",           0.1,  "moss_block",     False, None,      False, 0),
    ("sand",                 "minecraft:sand",                 0.5,  "sand",           False, None,      False, 0),
]

# Verified vanilla Bedrock RP texture paths from Mojang/bedrock-samples v1.26.60.5.
# Every path resolves cleanly from the built-in vanilla pack (and respects user texture packs!).
TEXTURE_ENTRIES = {
    # Woods
    "oak":                  "textures/blocks/planks_oak",
    "spruce":               "textures/blocks/planks_spruce",
    "birch":                "textures/blocks/planks_birch",
    "jungle":               "textures/blocks/planks_jungle",
    "acacia":               "textures/blocks/planks_acacia",
    "dark_oak":             "textures/blocks/planks_big_oak",
    "mangrove":             "textures/blocks/mangrove_planks",
    "cherry":               "textures/blocks/cherry_planks",
    "bamboo":               "textures/blocks/bamboo_planks",
    "pale_oak":             "textures/blocks/pale_oak_planks",
    "crimson":              "textures/blocks/huge_fungus/crimson_planks",
    "warped":               "textures/blocks/huge_fungus/warped_planks",
    # Stones & Bricks
    "stone":                "textures/blocks/stone",
    "smooth_stone_top":     "textures/blocks/stone_slab_top",
    "smooth_stone_side":    "textures/blocks/stone_slab_side",
    "cobblestone":          "textures/blocks/cobblestone",
    "mossy_cobblestone":    "textures/blocks/cobblestone_mossy",
    "stone_brick":          "textures/blocks/stonebrick",
    "mossy_stone_brick":    "textures/blocks/stonebrick_mossy",
    "granite":              "textures/blocks/stone_granite",
    "polished_granite":     "textures/blocks/stone_granite_smooth",
    "diorite":              "textures/blocks/stone_diorite",
    "polished_diorite":     "textures/blocks/stone_diorite_smooth",
    "andesite":             "textures/blocks/stone_andesite",
    "polished_andesite":    "textures/blocks/stone_andesite_smooth",
    "deepslate":            "textures/blocks/deepslate/cobbled_deepslate",
    "brick":                "textures/blocks/brick",
    "tuff_bricks":          "textures/blocks/tuff_bricks",
    "obsidian":             "textures/blocks/obsidian",
    # Sandstone & Quartz
    "sandstone_top":        "textures/blocks/sandstone_top",
    "sandstone_side":       "textures/blocks/sandstone_normal",
    "sandstone_bottom":     "textures/blocks/sandstone_bottom",
    "cut_sandstone":        "textures/blocks/sandstone_smooth",
    "red_sandstone_top":    "textures/blocks/red_sandstone_top",
    "red_sandstone_side":   "textures/blocks/red_sandstone_normal",
    "red_sandstone_bottom": "textures/blocks/red_sandstone_bottom",
    "cut_red_sandstone":    "textures/blocks/red_sandstone_smooth",
    "quartz_top":           "textures/blocks/quartz_block_top",
    "quartz_side":          "textures/blocks/quartz_block_side",
    "quartz_bottom":        "textures/blocks/quartz_block_bottom",
    # Nether, End, Copper, Glass
    "nether_brick":         "textures/blocks/nether_brick",
    "red_nether_brick":     "textures/blocks/red_nether_brick",
    "blackstone":           "textures/blocks/blackstone",
    "polished_blackstone":  "textures/blocks/polished_blackstone",
    "end_stone_brick":      "textures/blocks/end_bricks",
    "purpur":               "textures/blocks/purpur_block",
    "cut_copper":           "textures/blocks/cut_copper",
    "glass":                "textures/blocks/glass",
    # Nature, Lights, Decor, Metals
    "dirt":                 "textures/blocks/dirt",
    "grass_top":            "textures/blocks/grass_top",
    "grass_side":           "textures/blocks/grass_side",
    "grass_carried_top":    "textures/blocks/grass_carried",
    "grass_carried_side":   {"path": "textures/blocks/grass_side", "overlay_color": "#79c05a"},
    "moss_block":           "textures/blocks/moss_block",
    "sand":                 "textures/blocks/sand",
    "glowstone":            "textures/blocks/glowstone",
    "sea_lantern":          "textures/blocks/sea_lantern",
    "bookshelf":            "textures/blocks/bookshelf",
    "iron_block":           "textures/blocks/iron_block",
    "gold_block":           "textures/blocks/gold_block",
    "diamond_block":        "textures/blocks/diamond_block",
    "emerald_block":        "textures/blocks/emerald_block",
    "copper_block":         "textures/blocks/copper_block",
    "amethyst_block":       "textures/blocks/amethyst_block",
}


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def clean_generated_dir(dir_path, expected_files):
    if not os.path.isdir(dir_path):
        return
    for fname in os.listdir(dir_path):
        if fname.endswith(".json") and fname not in expected_files:
            os.remove(os.path.join(dir_path, fname))
            print(f"  removed stale {os.path.relpath(os.path.join(dir_path, fname), REPO)}")


# ── 1. Geometries (Explicit Per-Face UVs + Material Instances) ───────────────

def uv_face(u, v, w, h, mat="side"):
    return {"uv": [u, v], "uv_size": [w, h], "material_instance": mat}


def full_cube_uv():
    return {
        "north": uv_face(0, 0, 16, 16, "side"),
        "south": uv_face(0, 0, 16, 16, "side"),
        "east":  uv_face(0, 0, 16, 16, "side"),
        "west":  uv_face(0, 0, 16, 16, "side"),
        "up":    uv_face(0, 0, 16, 16, "up"),
        "down":  uv_face(0, 0, 16, 16, "down"),
    }


def make_geo_doc(identifier, cubes, bounds=(1, 1, 0)):
    return {
        "format_version": GEO_FORMAT,
        "minecraft:geometry": [{
            "description": {
                "identifier": identifier,
                "texture_width": 16,
                "texture_height": 16,
                "visible_bounds_width": bounds[0],
                "visible_bounds_height": bounds[1],
                "visible_bounds_offset": [0, bounds[2], 0],
            },
            "bones": [{
                "name": "bb_main",
                "pivot": [0, 0, 0],
                "cubes": cubes,
            }],
        }],
    }


def wall_slab_uv():
    return {
        "north": uv_face(0, 0, 16, 16, "side"),
        "south": uv_face(0, 0, 16, 16, "side"),
        "east":  uv_face(8, 0,  8, 16, "side"),
        "west":  uv_face(0, 0,  8, 16, "side"),
        "up":    uv_face(0, 0, 16,  8, "up"),
        "down":  uv_face(0, 0, 16,  8, "down"),
    }


def slab_uv(is_top=False):
    v = 0 if is_top else 8
    return {
        "north": uv_face(0, v, 16, 8, "side"),
        "south": uv_face(0, v, 16, 8, "side"),
        "east":  uv_face(0, v, 16, 8, "side"),
        "west":  uv_face(0, v, 16, 8, "side"),
        "up":    uv_face(0, 0, 16, 16, "up"),
        "down":  uv_face(0, 0, 16, 16, "down"),
    }


GEOMETRIES = {
    # Wall slab: North half (z = -8..0); rotated by minecraft:transformation for W/S/E!
    "wall_slab.geo.json": make_geo_doc(
        "geometry.wall_slab",
        [{"origin": [-8, 0, -8], "size": [16, 16, 8], "uv": wall_slab_uv()}],
        bounds=(2, 2, 0.5),
    ),
    # Centered wall slab icon for inventory/hotbar/creative UI via minecraft:item_visual
    "wall_slab_icon.geo.json": make_geo_doc(
        "geometry.wall_slab_icon",
        [{"origin": [-8, 0, -4], "size": [16, 16, 8], "uv": wall_slab_uv()}],
        bounds=(2, 2, 0.5),
    ),
    # Floor / ceiling slab
    "slab.geo.json": make_geo_doc(
        "geometry.slab",
        [{"origin": [-8, 0, -8], "size": [16, 8, 16], "uv": slab_uv(False)}],
        bounds=(2, 1.5, 0.25),
    ),
    "slab_top.geo.json": make_geo_doc(
        "geometry.slab_top",
        [{"origin": [-8, 8, -8], "size": [16, 8, 16], "uv": slab_uv(True)}],
        bounds=(2, 1.5, 0.75),
    ),
    # Mini blocks: Single (floor, ceiling, wall bottom, wall top)
    "mini_block_single.geo.json": make_geo_doc(
        "geometry.mini_block_single",
        [{"origin": [-4, 0, -4], "size": [8, 8, 8], "uv": full_cube_uv()}],
        bounds=(1, 1, 0.25),
    ),
    "mini_block_ceiling.geo.json": make_geo_doc(
        "geometry.mini_block_ceiling",
        [{"origin": [-4, 8, -4], "size": [8, 8, 8], "uv": full_cube_uv()}],
        bounds=(1, 1, 0.75),
    ),
    "mini_block_wall_bottom.geo.json": make_geo_doc(
        "geometry.mini_block_wall_bottom",
        [{"origin": [-4, 0, -8], "size": [8, 8, 8], "uv": full_cube_uv()}],
        bounds=(1, 1, 0.25),
    ),
    "mini_block_wall_top.geo.json": make_geo_doc(
        "geometry.mini_block_wall_top",
        [{"origin": [-4, 8, -8], "size": [8, 8, 8], "uv": full_cube_uv()}],
        bounds=(1, 1, 0.75),
    ),
    # Mini blocks: Double (2 distinct 8x8x8 cubes side-by-side)
    "mini_block_double_bottom.geo.json": make_geo_doc(
        "geometry.mini_block_double_bottom",
        [
            {"origin": [-8, 0, -4], "size": [8, 8, 8], "uv": full_cube_uv()},
            {"origin": [ 0, 0, -4], "size": [8, 8, 8], "uv": full_cube_uv()},
        ],
        bounds=(2, 1, 0.25),
    ),
    "mini_block_double_top.geo.json": make_geo_doc(
        "geometry.mini_block_double_top",
        [
            {"origin": [-8, 8, -4], "size": [8, 8, 8], "uv": full_cube_uv()},
            {"origin": [ 0, 8, -4], "size": [8, 8, 8], "uv": full_cube_uv()},
        ],
        bounds=(2, 1, 0.75),
    ),
    # Mini blocks: Triple (3 distinct 8x8x8 cubes in an L-cluster)
    "mini_block_triple_bottom.geo.json": make_geo_doc(
        "geometry.mini_block_triple_bottom",
        [
            {"origin": [-8, 0, -8], "size": [8, 8, 8], "uv": full_cube_uv()},
            {"origin": [ 0, 0, -8], "size": [8, 8, 8], "uv": full_cube_uv()},
            {"origin": [-8, 0,  0], "size": [8, 8, 8], "uv": full_cube_uv()},
        ],
        bounds=(2, 1, 0.25),
    ),
    "mini_block_triple_top.geo.json": make_geo_doc(
        "geometry.mini_block_triple_top",
        [
            {"origin": [-8, 8, -8], "size": [8, 8, 8], "uv": full_cube_uv()},
            {"origin": [ 0, 8, -8], "size": [8, 8, 8], "uv": full_cube_uv()},
            {"origin": [-8, 8,  0], "size": [8, 8, 8], "uv": full_cube_uv()},
        ],
        bounds=(2, 1, 0.75),
    ),
}

models_dir = os.path.join(RP, "models/blocks")
clean_generated_dir(models_dir, set(GEOMETRIES.keys()))
for fname, geo_data in GEOMETRIES.items():
    write_json(os.path.join(models_dir, fname), geo_data)
print(f"  wrote {len(GEOMETRIES)} block geometries")


# ── 2. Material Instance Helpers ─────────────────────────────────────────────

def mat_inst(tex_key, render_method="opaque", ao=1.0, face_dimming=True, tint_method=None, alpha_masked_tint=False):
    inst = {
        "texture": f"{TEX_PREFIX}{tex_key}",
        "render_method": render_method,
        "ambient_occlusion": ao,
        "face_dimming": face_dimming,
    }
    if tint_method:
        inst["tint_method"] = tint_method
    if alpha_masked_tint:
        inst["alpha_masked_tint"] = True
    return inst


def wall_slab_materials(slug):
    is_glass = (slug == "glass")
    rm = "alpha_test" if is_glass else "opaque"
    ao = 0.0 if is_glass else 1.0
    fd = not is_glass

    if slug == "sandstone":
        return {
            "*":    mat_inst("sandstone_side"),
            "side": mat_inst("sandstone_side"),
            "up":   mat_inst("sandstone_top"),
            "down": mat_inst("sandstone_bottom"),
        }
    if slug == "smooth_sandstone":
        m = mat_inst("sandstone_top")
        return {"*": m, "side": m, "up": m, "down": m}
    if slug == "red_sandstone":
        return {
            "*":    mat_inst("red_sandstone_side"),
            "side": mat_inst("red_sandstone_side"),
            "up":   mat_inst("red_sandstone_top"),
            "down": mat_inst("red_sandstone_bottom"),
        }
    if slug == "smooth_red_sandstone":
        m = mat_inst("red_sandstone_top")
        return {"*": m, "side": m, "up": m, "down": m}
    if slug == "quartz":
        return {
            "*":    mat_inst("quartz_side"),
            "side": mat_inst("quartz_side"),
            "up":   mat_inst("quartz_top"),
            "down": mat_inst("quartz_bottom"),
        }
    if slug == "smooth_quartz":
        m = mat_inst("quartz_bottom")
        return {"*": m, "side": m, "up": m, "down": m}
    if slug == "smooth_stone":
        return {
            "*":    mat_inst("smooth_stone_top"),
            "side": mat_inst("smooth_stone_top"),
            "up":   mat_inst("smooth_stone_top"),
            "down": mat_inst("smooth_stone_top"),
        }

    m = mat_inst(slug, render_method=rm, ao=ao, face_dimming=fd)
    return {"*": m, "side": m, "up": m, "down": m}


def mini_block_materials(slug):
    """Returns (world_materials, item_materials, particle_texture_key)."""
    if slug == "grass_block":
        world_mats = {
            "*":    mat_inst("grass_side", tint_method="grass", alpha_masked_tint=True),
            "side": mat_inst("grass_side", tint_method="grass", alpha_masked_tint=True),
            "up":   mat_inst("grass_top",  tint_method="grass"),
            "down": mat_inst("dirt"),
        }
        item_mats = {
            "*":    mat_inst("grass_carried_side"),
            "side": mat_inst("grass_carried_side"),
            "up":   mat_inst("grass_carried_top"),
            "down": mat_inst("dirt"),
        }
        return world_mats, item_mats, "dirt"

    if slug == "bookshelf":
        mats = {
            "*":    mat_inst("bookshelf"),
            "side": mat_inst("bookshelf"),
            "up":   mat_inst("oak"),
            "down": mat_inst("oak"),
        }
        return mats, mats, "bookshelf"

    if slug == "sandstone":
        mats = {
            "*":    mat_inst("sandstone_side"),
            "side": mat_inst("sandstone_side"),
            "up":   mat_inst("sandstone_top"),
            "down": mat_inst("sandstone_bottom"),
        }
        return mats, mats, "sandstone_side"

    if slug == "smooth_sandstone":
        m = mat_inst("sandstone_top")
        mats = {"*": m, "side": m, "up": m, "down": m}
        return mats, mats, "sandstone_top"

    if slug == "red_sandstone":
        mats = {
            "*":    mat_inst("red_sandstone_side"),
            "side": mat_inst("red_sandstone_side"),
            "up":   mat_inst("red_sandstone_top"),
            "down": mat_inst("red_sandstone_bottom"),
        }
        return mats, mats, "red_sandstone_side"

    if slug == "smooth_red_sandstone":
        m = mat_inst("red_sandstone_top")
        mats = {"*": m, "side": m, "up": m, "down": m}
        return mats, mats, "red_sandstone_top"

    if slug == "quartz_block":
        mats = {
            "*":    mat_inst("quartz_side"),
            "side": mat_inst("quartz_side"),
            "up":   mat_inst("quartz_top"),
            "down": mat_inst("quartz_bottom"),
        }
        return mats, mats, "quartz_side"

    if slug == "smooth_quartz":
        m = mat_inst("quartz_bottom")
        mats = {"*": m, "side": m, "up": m, "down": m}
        return mats, mats, "quartz_bottom"

    if slug == "smooth_stone":
        m = mat_inst("smooth_stone_top")
        mats = {"*": m, "side": m, "up": m, "down": m}
        return mats, mats, "smooth_stone_top"

    tex_map = {
        "oak_planks":         "oak",
        "spruce_planks":      "spruce",
        "birch_planks":       "birch",
        "jungle_planks":      "jungle",
        "acacia_planks":      "acacia",
        "dark_oak_planks":    "dark_oak",
        "mangrove_planks":    "mangrove",
        "cherry_planks":      "cherry",
        "bamboo_planks":      "bamboo",
        "pale_oak_planks":    "pale_oak",
        "crimson_planks":     "crimson",
        "warped_planks":      "warped",
        "stone_bricks":       "stone_brick",
        "mossy_stone_bricks": "mossy_stone_brick",
        "cobbled_deepslate":  "deepslate",
        "purpur_block":       "purpur",
    }
    tex_key = tex_map.get(slug, slug)
    is_glass = (slug == "glass")
    is_light = slug in ("glowstone", "sea_lantern")
    rm = "alpha_test" if is_glass else "opaque"
    ao = 0.0 if (is_glass or is_light) else 1.0
    fd = not (is_glass or is_light)
    m = mat_inst(tex_key, render_method=rm, ao=ao, face_dimming=fd)
    mats = {"*": m, "side": m, "up": m, "down": m}
    return mats, mats, tex_key


WATERLOGGABLE = {
    "detection_rules": [{
        "liquid_type": "water",
        "can_contain_liquid": True,
        "on_liquid_touches": "blocking",
    }]
}


# ── 3. Block Definitions (format_version 1.26.60) ────────────────────────────

expected_blocks = set()


def make_wall_slab_block(slug, hardness, sound, tool_type, flammable):
    identifier = f"addon:{slug}_wall_slab"
    mats = wall_slab_materials(slug)

    # Rotate single North-half panel + collision/selection box together via minecraft:transformation!
    # Bedrock Y rotation is CCW from above (+Y):
    #   0   -> North (z = -8..0)
    #   90  -> West  (x = -8..0)
    #   180 -> South (z =  0..8)
    #   270 -> East  (x =  0..8)
    rotations = [
        ("north", [0,   0, 0]),
        ("west",  [0,  90, 0]),
        ("south", [0, 180, 0]),
        ("east",  [0, 270, 0]),
    ]
    permutations = [
        {
            "condition": f"q.block_state('minecraft:cardinal_direction') == '{direction}'",
            "components": {
                "minecraft:transformation": {"rotation": rot},
            },
        }
        for direction, rot in rotations
    ]

    components = {
        "minecraft:material_instances": mats,
        "minecraft:geometry": "geometry.wall_slab",
        "minecraft:item_visual": {
            "geometry": "geometry.wall_slab_icon",
            "material_instances": mats,
        },
        "minecraft:collision_box": [{"origin": [-8, 0, -8], "size": [16, 16, 8]}],
        "minecraft:selection_box": {"origin": [-8, 0, -8], "size": [16, 16, 8]},
        "minecraft:destructible_by_mining": {"seconds_to_destroy": hardness},
        "minecraft:destructible_by_explosion": {"explosion_resistance": round(hardness * 3, 2)},
        "minecraft:light_dampening": 0,
        "minecraft:liquid_detection": WATERLOGGABLE,
        "minecraft:destruction_particles": {"particle_count": 48},
    }

    if flammable:
        components["minecraft:flammable"] = {
            "catch_chance_modifier": 5,
            "destroy_chance_modifier": 20,
        }
    if tool_type == "axe":
        components["minecraft:tags"] = ["minecraft:is_axe_item_destructible"]
    elif tool_type == "pickaxe":
        components["minecraft:tags"] = ["minecraft:is_pickaxe_item_destructible"]

    return {
        "format_version": BLOCK_FORMAT,
        "minecraft:block": {
            "description": {
                "identifier": identifier,
                # Managed cleanly inside expandable "Wall Slabs (+)" group in crafting_item_catalog.json
                "menu_category": {"category": "none"},
                "traits": {
                    "minecraft:placement_direction": {
                        "enabled_states": ["minecraft:cardinal_direction"],
                        "y_rotation_offset": 0,
                    },
                },
            },
            "components": components,
            "permutations": permutations,
        },
    }


for slug, source, hardness, stone_cut, sound, tool_type, flammable in WALL_SLABS:
    fname = f"{slug}_wall_slab.json"
    expected_blocks.add(fname)
    write_json(os.path.join(BP, "blocks", fname),
               make_wall_slab_block(slug, hardness, sound, tool_type, flammable))


# Cobblestone floor slab (supports both bottom and top halves!)
cobble_mat = mat_inst("cobblestone")
cobble_mats = {"*": cobble_mat, "side": cobble_mat, "up": cobble_mat, "down": cobble_mat}
floor_slab = {
    "format_version": BLOCK_FORMAT,
    "minecraft:block": {
        "description": {
            "identifier": "addon:cobblestone_slab",
            "menu_category": {
                "category": "construction",
                "group": "minecraft:itemGroup.name.slab",
            },
            "traits": {
                "minecraft:placement_position": {
                    "enabled_states": ["minecraft:vertical_half"],
                },
            },
        },
        "components": {
            "minecraft:material_instances": cobble_mats,
            "minecraft:geometry": "geometry.slab",
            "minecraft:item_visual": {
                "geometry": "geometry.slab",
                "material_instances": cobble_mats,
            },
            "minecraft:collision_box": [{"origin": [-8, 0, -8], "size": [16, 8, 16]}],
            "minecraft:selection_box": {"origin": [-8, 0, -8], "size": [16, 8, 16]},
            "minecraft:destructible_by_mining": {"seconds_to_destroy": 2.0},
            "minecraft:destructible_by_explosion": {"explosion_resistance": 6.0},
            "minecraft:light_dampening": 0,
            "minecraft:liquid_detection": WATERLOGGABLE,
            "minecraft:destruction_particles": {"particle_count": 48},
            "minecraft:tags": ["minecraft:is_pickaxe_item_destructible"],
        },
        "permutations": [
            {
                "condition": "q.block_state('minecraft:vertical_half') == 'top'",
                "components": {
                    "minecraft:geometry": "geometry.slab_top",
                    "minecraft:collision_box": [{"origin": [-8, 8, -8], "size": [16, 8, 16]}],
                    "minecraft:selection_box": {"origin": [-8, 8, -8], "size": [16, 8, 16]},
                },
            }
        ],
    },
}
expected_blocks.add("cobblestone_slab.json")
write_json(os.path.join(BP, "blocks/cobblestone_slab.json"), floor_slab)


def make_mini_block(slug, hardness, sound, tool_type, flammable, light_emission):
    identifier = f"addon:mini_{slug}"
    world_mats, item_mats, particle_tex = mini_block_materials(slug)

    # Multi-surface placement (floor, ceiling, 4 walls × bottom/top) + progressive 1→2→3→Full stacking!
    wall_rotations = [
        ("south", [0,   0, 0]),  # Tapped South face -> cell at z+1 -> mounts on North side (z = -8..0)
        ("east",  [0,  90, 0]),  # Tapped East face  -> cell at x+1 -> mounts on West side  (x = -8..0)
        ("north", [0, 180, 0]),  # Tapped North face -> cell at z-1 -> mounts on South side (z =  0..8)
        ("west",  [0, 270, 0]),  # Tapped West face  -> cell at x-1 -> mounts on East side  (x =  0..8)
    ]

    permutations = [
        # ── Single (1 mini block) ──
        {
            "condition": "q.block_state('addon:size') == 'single' && q.block_state('minecraft:block_face') == 'up'",
            "components": {
                "minecraft:geometry": "geometry.mini_block_single",
                "minecraft:collision_box": [{"origin": [-4, 0, -4], "size": [8, 8, 8]}],
                "minecraft:selection_box": {"origin": [-4, 0, -4], "size": [8, 8, 8]},
            },
        },
        {
            "condition": "q.block_state('addon:size') == 'single' && q.block_state('minecraft:block_face') == 'down'",
            "components": {
                "minecraft:geometry": "geometry.mini_block_ceiling",
                "minecraft:collision_box": [{"origin": [-4, 8, -4], "size": [8, 8, 8]}],
                "minecraft:selection_box": {"origin": [-4, 8, -4], "size": [8, 8, 8]},
            },
        },
    ]

    for face, rot in wall_rotations:
        permutations.append({
            "condition": f"q.block_state('addon:size') == 'single' && q.block_state('minecraft:block_face') == '{face}' && q.block_state('minecraft:vertical_half') == 'bottom'",
            "components": {
                "minecraft:geometry": "geometry.mini_block_wall_bottom",
                "minecraft:collision_box": [{"origin": [-4, 0, -8], "size": [8, 8, 8]}],
                "minecraft:selection_box": {"origin": [-4, 0, -8], "size": [8, 8, 8]},
                "minecraft:transformation": {"rotation": rot},
            },
        })
        permutations.append({
            "condition": f"q.block_state('addon:size') == 'single' && q.block_state('minecraft:block_face') == '{face}' && q.block_state('minecraft:vertical_half') == 'top'",
            "components": {
                "minecraft:geometry": "geometry.mini_block_wall_top",
                "minecraft:collision_box": [{"origin": [-4, 8, -8], "size": [8, 8, 8]}],
                "minecraft:selection_box": {"origin": [-4, 8, -8], "size": [8, 8, 8]},
                "minecraft:transformation": {"rotation": rot},
            },
        })

    # ── Double (2 mini blocks side-by-side) ──
    permutations.extend([
        {
            "condition": "q.block_state('addon:size') == 'double' && (q.block_state('minecraft:block_face') == 'up' || ((q.block_state('minecraft:block_face') == 'north' || q.block_state('minecraft:block_face') == 'south') && q.block_state('minecraft:vertical_half') == 'bottom'))",
            "components": {
                "minecraft:geometry": "geometry.mini_block_double_bottom",
                "minecraft:collision_box": [{"origin": [-8, 0, -4], "size": [16, 8, 8]}],
                "minecraft:selection_box": {"origin": [-8, 0, -4], "size": [16, 8, 8]},
            },
        },
        {
            "condition": "q.block_state('addon:size') == 'double' && (q.block_state('minecraft:block_face') == 'east' || q.block_state('minecraft:block_face') == 'west') && q.block_state('minecraft:vertical_half') == 'bottom'",
            "components": {
                "minecraft:geometry": "geometry.mini_block_double_bottom",
                "minecraft:collision_box": [{"origin": [-8, 0, -4], "size": [16, 8, 8]}],
                "minecraft:selection_box": {"origin": [-8, 0, -4], "size": [16, 8, 8]},
                "minecraft:transformation": {"rotation": [0, 90, 0]},
            },
        },
        {
            "condition": "q.block_state('addon:size') == 'double' && (q.block_state('minecraft:block_face') == 'down' || ((q.block_state('minecraft:block_face') == 'north' || q.block_state('minecraft:block_face') == 'south') && q.block_state('minecraft:vertical_half') == 'top'))",
            "components": {
                "minecraft:geometry": "geometry.mini_block_double_top",
                "minecraft:collision_box": [{"origin": [-8, 8, -4], "size": [16, 8, 8]}],
                "minecraft:selection_box": {"origin": [-8, 8, -4], "size": [16, 8, 8]},
            },
        },
        {
            "condition": "q.block_state('addon:size') == 'double' && (q.block_state('minecraft:block_face') == 'east' || q.block_state('minecraft:block_face') == 'west') && q.block_state('minecraft:vertical_half') == 'top'",
            "components": {
                "minecraft:geometry": "geometry.mini_block_double_top",
                "minecraft:collision_box": [{"origin": [-8, 8, -4], "size": [16, 8, 8]}],
                "minecraft:selection_box": {"origin": [-8, 8, -4], "size": [16, 8, 8]},
                "minecraft:transformation": {"rotation": [0, 90, 0]},
            },
        },
    ])

    # ── Triple (3 mini blocks L-cluster, multi-box 1.26.60 collision!) ──
    permutations.extend([
        {
            "condition": "q.block_state('addon:size') == 'triple' && (q.block_state('minecraft:block_face') == 'up' || (q.block_state('minecraft:block_face') != 'down' && q.block_state('minecraft:vertical_half') == 'bottom'))",
            "components": {
                "minecraft:geometry": "geometry.mini_block_triple_bottom",
                "minecraft:collision_box": [
                    {"origin": [-8, 0, -8], "size": [16, 8, 8]},
                    {"origin": [-8, 0,  0], "size": [ 8, 8, 8]},
                ],
                "minecraft:selection_box": {"origin": [-8, 0, -8], "size": [16, 8, 16]},
            },
        },
        {
            "condition": "q.block_state('addon:size') == 'triple' && (q.block_state('minecraft:block_face') == 'down' || (q.block_state('minecraft:block_face') != 'up' && q.block_state('minecraft:vertical_half') == 'top'))",
            "components": {
                "minecraft:geometry": "geometry.mini_block_triple_top",
                "minecraft:collision_box": [
                    {"origin": [-8, 8, -8], "size": [16, 8, 8]},
                    {"origin": [-8, 8,  0], "size": [ 8, 8, 8]},
                ],
                "minecraft:selection_box": {"origin": [-8, 8, -8], "size": [16, 8, 16]},
            },
        },
    ])

    components = {
        "minecraft:material_instances": world_mats,
        "minecraft:geometry": "geometry.mini_block_single",
        "minecraft:item_visual": {
            "geometry": "geometry.mini_block_single",
            "material_instances": item_mats,
        },
        "minecraft:collision_box": [{"origin": [-4, 0, -4], "size": [8, 8, 8]}],
        "minecraft:selection_box": {"origin": [-4, 0, -4], "size": [8, 8, 8]},
        "minecraft:destructible_by_mining": {"seconds_to_destroy": hardness},
        "minecraft:destructible_by_explosion": {"explosion_resistance": round(hardness * 3, 2)},
        "minecraft:light_dampening": 0,
        "minecraft:liquid_detection": WATERLOGGABLE,
        "minecraft:destruction_particles": {
            "texture": f"{TEX_PREFIX}{particle_tex}",
            "particle_count": 32,
        },
    }

    if light_emission > 0:
        components["minecraft:light_emission"] = light_emission
    if flammable:
        components["minecraft:flammable"] = {
            "catch_chance_modifier": 5,
            "destroy_chance_modifier": 20,
        }
    if tool_type == "axe":
        components["minecraft:tags"] = ["minecraft:is_axe_item_destructible"]
    elif tool_type == "pickaxe":
        components["minecraft:tags"] = ["minecraft:is_pickaxe_item_destructible"]

    return {
        "format_version": BLOCK_FORMAT,
        "minecraft:block": {
            "description": {
                "identifier": identifier,
                # Managed cleanly inside expandable "Mini Blocks (+)" group in crafting_item_catalog.json
                "menu_category": {"category": "none"},
                "states": {
                    "addon:size": ["single", "double", "triple"],
                },
                "traits": {
                    "minecraft:placement_position": {
                        "enabled_states": ["minecraft:block_face", "minecraft:vertical_half"],
                    },
                },
            },
            "components": components,
            "permutations": permutations,
        },
    }


for slug, source, hardness, sound, stone_cut, tool_type, flammable, light_emission in MINI_BLOCKS:
    fname = f"mini_{slug}.json"
    expected_blocks.add(fname)
    write_json(os.path.join(BP, "blocks", fname),
               make_mini_block(slug, hardness, sound, tool_type, flammable, light_emission))

clean_generated_dir(os.path.join(BP, "blocks"), expected_blocks)
print(f"  wrote {len(expected_blocks)} block definitions (42 wall slabs + 1 floor slab + {len(MINI_BLOCKS)} mini blocks)")


# ── 4. Creative Inventory Expandable Groups (crafting_item_catalog.json) ─────

wall_slab_ids = [f"addon:{slug}_wall_slab" for slug, *_ in WALL_SLABS]
mini_block_ids = [f"addon:mini_{slug}" for slug, *_ in MINI_BLOCKS]

catalog = {
    "format_version": CATALOG_FORMAT,
    "minecraft:crafting_items_catalog": {
        "categories": [
            {
                "category_name": "construction",
                "groups": [
                    {
                        "group_identifier": {
                            "icon": "addon:oak_wall_slab",
                            "name": "addon:itemGroup.name.wall_slab",
                        },
                        "items": wall_slab_ids,
                    },
                    {
                        "group_identifier": {
                            "icon": "addon:mini_oak_planks",
                            "name": "addon:itemGroup.name.mini_block",
                        },
                        "items": mini_block_ids,
                    },
                ],
            }
        ]
    },
}
write_json(os.path.join(BP, "item_catalog/crafting_item_catalog.json"), catalog)
print("  wrote behavior_pack/item_catalog/crafting_item_catalog.json")


# ── 5. Recipes ───────────────────────────────────────────────────────────────

def shaped(recipe_id, pattern, source, result, count):
    return {
        "format_version": RECIPE_FORMAT,
        "minecraft:recipe_shaped": {
            "description": {"identifier": recipe_id},
            "tags": ["crafting_table"],
            "pattern": pattern,
            "key": {"#": {"item": source}},
            "unlock": [{"item": source}],
            "result": {"item": result, "count": count},
        },
    }


def stonecutter(recipe_id, source, result, count):
    return {
        "format_version": RECIPE_FORMAT,
        "minecraft:recipe_shapeless": {
            "description": {"identifier": recipe_id},
            "tags": ["stonecutter"],
            "priority": 0,
            "ingredients": [{"item": source}],
            "unlock": [{"item": source}],
            "result": {"item": result, "count": count},
        },
    }


COLUMN = ["#", "#", "#"]
DIAGONAL = ["# ", " #"]  # 2x2 safe, zero vanilla recipe conflicts; 2 blocks -> 8 mini blocks (exact 1:4 ratio!)

expected_recipes = set()

for slug, source, hardness, stone_cut, sound, tool_type, flammable in WALL_SLABS:
    identifier = f"addon:{slug}_wall_slab"
    craft_file = f"{slug}_wall_slab_crafting.json"
    expected_recipes.add(craft_file)
    write_json(os.path.join(BP, "recipes", craft_file),
               shaped(f"addon:{slug}_wall_slab_crafting", COLUMN, source, identifier, 6))
    if stone_cut:
        cut_file = f"{slug}_wall_slab_stonecutting.json"
        expected_recipes.add(cut_file)
        write_json(os.path.join(BP, "recipes", cut_file),
                   stonecutter(f"addon:{slug}_wall_slab_stonecutting", source, identifier, 2))

expected_recipes.add("cobblestone_slab_stonecutting.json")
write_json(os.path.join(BP, "recipes/cobblestone_slab_stonecutting.json"),
           stonecutter("addon:cobblestone_slab_stonecutting", "minecraft:cobblestone",
                       "addon:cobblestone_slab", 2))

for slug, source, hardness, sound, stone_cut, tool_type, flammable, light_emission in MINI_BLOCKS:
    identifier = f"addon:mini_{slug}"
    craft_file = f"mini_{slug}_crafting.json"
    expected_recipes.add(craft_file)
    write_json(os.path.join(BP, "recipes", craft_file),
               shaped(f"addon:mini_{slug}_crafting", DIAGONAL, source, identifier, 8))
    if stone_cut:
        cut_file = f"mini_{slug}_stonecutting.json"
        expected_recipes.add(cut_file)
        write_json(os.path.join(BP, "recipes", cut_file),
                   stonecutter(f"addon:mini_{slug}_stonecutting", source, identifier, 4))

clean_generated_dir(os.path.join(BP, "recipes"), expected_recipes)
print(f"  wrote {len(expected_recipes)} recipes")


# ── 6. terrain_texture.json ─────────────────────────────────────────────────

terrain_texture = {
    "resource_pack_name": "MiniBlocksAddon",
    "texture_name": "atlas.terrain",
    "padding": 8,
    "num_mip_levels": 4,
    "texture_data": {f"{TEX_PREFIX}{k}": {"textures": v} for k, v in TEXTURE_ENTRIES.items()},
}
write_json(os.path.join(RP, "textures/terrain_texture.json"), terrain_texture)
print(f"  wrote resource_pack/textures/terrain_texture.json ({len(TEXTURE_ENTRIES)} entries)")


# ── 7. blocks.json (sounds) ─────────────────────────────────────────────────

blocks_json = {"format_version": "1.21.40"}
blocks_json["addon:cobblestone_slab"] = {"sound": "stone"}
for slug, source, hardness, sound, stone_cut, tool_type, flammable, light_emission in MINI_BLOCKS:
    blocks_json[f"addon:mini_{slug}"] = {"sound": sound}
for slug, source, hardness, stone_cut, sound, tool_type, flammable in WALL_SLABS:
    blocks_json[f"addon:{slug}_wall_slab"] = {"sound": sound}
write_json(os.path.join(RP, "blocks.json"), blocks_json)
print("  wrote resource_pack/blocks.json")


# ── 8. Slab & Mini Block Script Maps ────────────────────────────────────────

SOUND_EVENTS = {
    "stone":          "use.stone",
    "wood":           "use.wood",
    "cherry_wood":    "place.cherry_wood",
    "bamboo_wood":    "place.bamboo_wood",
    "nether_wood":    "use.wood",
    "deepslate":      "place.deepslate",
    "copper":         "place.copper",
    "nether_brick":   "place.nether_brick",
    "glass":          "random.glass",
    "grass":          "use.grass",
    "gravel":         "use.gravel",
    "moss_block":     "place.moss",
    "sand":           "use.sand",
    "tuff_bricks":    "place.tuff_bricks",
    "iron":           "use.stone",
    "metal":          "use.stone",
    "amethyst_block": "place.amethyst_block",
}

slab_map_path = os.path.join(BP, "scripts/slab_map.js")
with open(slab_map_path, "w") as f:
    f.write("// Generated by tools/generate_addon.py — do not edit by hand.\n")
    f.write("export const WALL_SLAB_IDS = new Set([\n")
    for slug, *_ in WALL_SLABS:
        f.write(f'  "addon:{slug}_wall_slab",\n')
    f.write("]);\n\n")

    f.write("export const MINI_BLOCK_IDS = new Set([\n")
    for slug, *_ in MINI_BLOCKS:
        f.write(f'  "addon:mini_{slug}",\n')
    f.write("]);\n\n")

    f.write("export const SLAB_TO_FULL_BLOCK = {\n")
    for slug, source, *_ in WALL_SLABS:
        f.write(f'  "addon:{slug}_wall_slab": "{source}",\n')
    f.write('  "addon:cobblestone_slab": "minecraft:cobblestone",\n')
    for slug, source, *_ in MINI_BLOCKS:
        f.write(f'  "addon:mini_{slug}": "{source}",\n')
    f.write("};\n\n")

    source_to_mini = {source: f"addon:mini_{slug}" for slug, source, *_ in MINI_BLOCKS}
    f.write("export const WALL_SLAB_TO_MINI_BLOCK = {\n")
    for slug, source, *_ in WALL_SLABS:
        if source in source_to_mini:
            f.write(f'  "addon:{slug}_wall_slab": "{source_to_mini[source]}",\n')
    f.write("};\n\n")

    f.write("export const SLAB_SOUNDS = {\n")
    for slug, source, hardness, stone_cut, sound, *_ in WALL_SLABS:
        f.write(f'  "addon:{slug}_wall_slab": "{SOUND_EVENTS.get(sound, "use.stone")}",\n')
    f.write('  "addon:cobblestone_slab": "use.stone",\n')
    for slug, source, hardness, sound, *_ in MINI_BLOCKS:
        f.write(f'  "addon:mini_{slug}": "{SOUND_EVENTS.get(sound, "use.stone")}",\n')
    f.write("};\n")
print("  wrote behavior_pack/scripts/slab_map.js")


# ── 9. Lang File & languages.json ───────────────────────────────────────────

WALL_SLAB_NAMES = {
    "acacia":              "Acacia Wall Slab",
    "andesite":            "Andesite Wall Slab",
    "bamboo":              "Bamboo Wall Slab",
    "birch":               "Birch Wall Slab",
    "blackstone":          "Blackstone Wall Slab",
    "brick":               "Brick Wall Slab",
    "cherry":              "Cherry Wall Slab",
    "cobblestone":         "Cobblestone Wall Slab",
    "crimson":             "Crimson Wall Slab",
    "cut_copper":          "Cut Copper Wall Slab",
    "cut_red_sandstone":   "Cut Red Sandstone Wall Slab",
    "cut_sandstone":       "Cut Sandstone Wall Slab",
    "dark_oak":            "Dark Oak Wall Slab",
    "deepslate":           "Cobbled Deepslate Wall Slab",
    "diorite":             "Diorite Wall Slab",
    "end_stone_brick":     "End Stone Brick Wall Slab",
    "glass":               "Glass Wall Slab",
    "granite":             "Granite Wall Slab",
    "jungle":              "Jungle Wall Slab",
    "mangrove":            "Mangrove Wall Slab",
    "mossy_cobblestone":   "Mossy Cobblestone Wall Slab",
    "mossy_stone_brick":   "Mossy Stone Brick Wall Slab",
    "nether_brick":        "Nether Brick Wall Slab",
    "oak":                 "Oak Wall Slab",
    "pale_oak":            "Pale Oak Wall Slab",
    "polished_andesite":   "Polished Andesite Wall Slab",
    "polished_blackstone": "Polished Blackstone Wall Slab",
    "polished_diorite":    "Polished Diorite Wall Slab",
    "polished_granite":    "Polished Granite Wall Slab",
    "purpur":              "Purpur Wall Slab",
    "quartz":              "Quartz Wall Slab",
    "red_nether_brick":    "Red Nether Brick Wall Slab",
    "red_sandstone":       "Red Sandstone Wall Slab",
    "sandstone":           "Sandstone Wall Slab",
    "smooth_quartz":       "Smooth Quartz Wall Slab",
    "smooth_red_sandstone":"Smooth Red Sandstone Wall Slab",
    "smooth_sandstone":    "Smooth Sandstone Wall Slab",
    "smooth_stone":        "Smooth Stone Wall Slab",
    "spruce":              "Spruce Wall Slab",
    "stone_brick":         "Stone Brick Wall Slab",
    "stone":               "Stone Wall Slab",
    "warped":              "Warped Wall Slab",
}

MINI_BLOCK_NAMES = {
    # 1:1 Wall Slab Parity
    "oak_planks":           "Mini Oak Planks",
    "spruce_planks":        "Mini Spruce Planks",
    "birch_planks":         "Mini Birch Planks",
    "jungle_planks":        "Mini Jungle Planks",
    "acacia_planks":        "Mini Acacia Planks",
    "dark_oak_planks":      "Mini Dark Oak Planks",
    "mangrove_planks":      "Mini Mangrove Planks",
    "cherry_planks":        "Mini Cherry Planks",
    "bamboo_planks":        "Mini Bamboo Planks",
    "pale_oak_planks":      "Mini Pale Oak Planks",
    "crimson_planks":       "Mini Crimson Planks",
    "warped_planks":        "Mini Warped Planks",
    "stone":                "Mini Stone",
    "smooth_stone":         "Mini Smooth Stone",
    "cobblestone":          "Mini Cobblestone",
    "mossy_cobblestone":    "Mini Mossy Cobblestone",
    "stone_bricks":         "Mini Stone Bricks",
    "mossy_stone_bricks":   "Mini Mossy Stone Bricks",
    "granite":              "Mini Granite",
    "polished_granite":     "Mini Polished Granite",
    "diorite":              "Mini Diorite",
    "polished_diorite":     "Mini Polished Diorite",
    "andesite":             "Mini Andesite",
    "polished_andesite":    "Mini Polished Andesite",
    "cobbled_deepslate":    "Mini Cobbled Deepslate",
    "brick":                "Mini Brick",
    "sandstone":            "Mini Sandstone",
    "cut_sandstone":        "Mini Cut Sandstone",
    "smooth_sandstone":     "Mini Smooth Sandstone",
    "red_sandstone":        "Mini Red Sandstone",
    "cut_red_sandstone":    "Mini Cut Red Sandstone",
    "smooth_red_sandstone": "Mini Smooth Red Sandstone",
    "quartz_block":         "Mini Quartz Block",
    "smooth_quartz":        "Mini Smooth Quartz",
    "nether_brick":         "Mini Nether Brick",
    "red_nether_brick":     "Mini Red Nether Brick",
    "blackstone":           "Mini Blackstone",
    "polished_blackstone":  "Mini Polished Blackstone",
    "end_stone_brick":      "Mini End Stone Brick",
    "purpur_block":         "Mini Purpur Block",
    "cut_copper":           "Mini Cut Copper",
    "glass":                "Mini Glass",
    # Extended Territory
    "tuff_bricks":          "Mini Tuff Bricks",
    "obsidian":             "Mini Obsidian",
    "bookshelf":            "Mini Bookshelf",
    "glowstone":            "Mini Glowstone",
    "sea_lantern":          "Mini Sea Lantern",
    "iron_block":           "Mini Block of Iron",
    "gold_block":           "Mini Block of Gold",
    "diamond_block":        "Mini Block of Diamond",
    "emerald_block":        "Mini Block of Emerald",
    "copper_block":         "Mini Block of Copper",
    "amethyst_block":       "Mini Block of Amethyst",
    "dirt":                 "Mini Dirt",
    "grass_block":          "Mini Grass Block",
    "moss_block":           "Mini Moss Block",
    "sand":                 "Mini Sand",
}

lang_entries = [
    "## Mini Blocks Add-on — en_US Localization",
    "",
    "pack.name=Mini Blocks Add-on",
    "pack.description=Wall slabs, progressive mini blocks, directional placement, and combining! Bedrock 26.60 successor to the classic MCPE Mini Blocks Mod.",
    "",
    "## Creative Menu Expandable Groups",
    "addon:itemGroup.name.wall_slab=Wall Slabs",
    "addon:itemGroup.name.mini_block=Mini Blocks",
    "",
    "tile.addon:cobblestone_slab.name=Cobblestone Slab",
    "",
    "## Mini Blocks",
]
for slug, *_ in MINI_BLOCKS:
    lang_entries.append(f"tile.addon:mini_{slug}.name={MINI_BLOCK_NAMES[slug]}")

lang_entries.append("")
lang_entries.append("## Wall Slabs")
for slug, *_ in WALL_SLABS:
    lang_entries.append(f"tile.addon:{slug}_wall_slab.name={WALL_SLAB_NAMES[slug]}")

for pack_dir in (RP, BP):
    lang_path = os.path.join(pack_dir, "texts/en_US.lang")
    os.makedirs(os.path.dirname(lang_path), exist_ok=True)
    with open(lang_path, "w") as f:
        f.write("\n".join(lang_entries) + "\n")
    write_json(os.path.join(pack_dir, "texts/languages.json"), ["en_US"])
print("  wrote resource_pack/texts/en_US.lang & behavior_pack/texts/en_US.lang")


# ── 10. Packaging Helper ────────────────────────────────────────────────────

def package_addon(dist_dir=None, download_dir="/storage/emulated/0/Download"):
    import shutil
    import subprocess
    import zipfile

    if not dist_dir:
        dist_dir = os.path.join(REPO, "dist")
    os.makedirs(dist_dir, exist_ok=True)

    bp_pack = os.path.join(dist_dir, "MiniBlocks_Behavior.mcpack")
    rp_pack = os.path.join(dist_dir, "MiniBlocks_Resource.mcpack")
    addon_file = os.path.join(dist_dir, "MiniBlocksAddon.mcaddon")

    def zip_folder(folder_path, output_path):
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as z:
            for root, dirs, files in os.walk(folder_path):
                dirs.sort()
                for file in sorted(files):
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, folder_path)
                    z.write(full_path, rel_path)

    print("Packaging behavior pack (.mcpack)...")
    zip_folder(BP, bp_pack)
    print("Packaging resource pack (.mcpack)...")
    zip_folder(RP, rp_pack)

    print("Packaging combined .mcaddon bundle...")
    with zipfile.ZipFile(addon_file, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(bp_pack, os.path.basename(bp_pack))
        z.write(rp_pack, os.path.basename(rp_pack))

    print(f"  ✓ Built {os.path.relpath(addon_file, REPO)}")

    if os.path.exists(download_dir) and os.access(download_dir, os.W_OK):
        print(f"Syncing to Android shared storage ({download_dir})...")
        for src in [bp_pack, rp_pack, addon_file]:
            dst = os.path.join(download_dir, os.path.basename(src))
            shutil.copy2(src, dst)
            print(f"  ✓ Copied {os.path.basename(src)} -> {download_dir}/")

        try:
            subprocess.run([
                "am", "broadcast", "-a", "android.intent.action.MEDIA_SCANNER_SCAN_FILE",
                "-d", f"file://{os.path.join(download_dir, 'MiniBlocksAddon.mcaddon')}",
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print("  ✓ Triggered Android media scanner broadcast")
        except Exception:
            pass


if __name__ == "__main__":
    import sys
    if "--package" in sys.argv or "-p" in sys.argv:
        package_addon()
