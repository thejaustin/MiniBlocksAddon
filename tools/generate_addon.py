#!/usr/bin/env python3
"""Generator for MiniBlocks Addon - targets Minecraft Bedrock 26.50.

Run from anywhere: `python3 tools/generate_addon.py`. Regenerates block JSONs,
geometry, recipes, terrain textures, block sounds, lang strings and the
slab -> full block map used by the merge script.
"""

import json, os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BP = os.path.join(REPO, "behavior_pack")
RP = os.path.join(REPO, "resource_pack")

BLOCK_FORMAT = "1.26.20"   # latest block schema in bedrock-samples v1.26.50
RECIPE_FORMAT = "1.20.10"  # matches vanilla recipes in 26.50
TEX_PREFIX = "miniblocks_" # terrain_texture keys share a namespace with vanilla

# (name_slug, source_item, hardness, stone_cutter, sound)
# source_item doubles as the full block a merged pair of slabs turns into.
WALL_SLABS = [
    ("andesite",             "minecraft:andesite",             1.5, True,  "stone"),
    ("birch",                "minecraft:birch_planks",         1.5, False, "wood"),
    ("blackstone",           "minecraft:blackstone",           1.5, True,  "stone"),
    ("brick",                "minecraft:brick_block",          2.0, True,  "stone"),
    ("cobblestone",          "minecraft:cobblestone",          2.0, True,  "stone"),
    ("crimson",              "minecraft:crimson_planks",       1.5, False, "nether_wood"),
    ("cut_copper",           "minecraft:cut_copper",           3.0, True,  "copper"),
    ("cut_red_sandstone",    "minecraft:cut_red_sandstone",    0.8, True,  "stone"),
    ("cut_sandstone",        "minecraft:cut_sandstone",        0.8, True,  "stone"),
    ("dark_oak",             "minecraft:dark_oak_planks",      1.5, False, "wood"),
    ("deepslate",            "minecraft:cobbled_deepslate",    3.5, True,  "deepslate"),
    ("diorite",              "minecraft:diorite",              1.5, True,  "stone"),
    ("end_stone_brick",      "minecraft:end_bricks",           3.0, True,  "stone"),
    ("granite",              "minecraft:granite",              1.5, True,  "stone"),
    ("jungle",               "minecraft:jungle_planks",        1.5, False, "wood"),
    ("mossy_cobblestone",    "minecraft:mossy_cobblestone",    2.0, True,  "stone"),
    ("mossy_stone_brick",    "minecraft:mossy_stone_bricks",   1.5, True,  "stone"),
    ("nether_brick",         "minecraft:nether_brick",         2.0, True,  "nether_brick"),
    ("oak",                  "minecraft:oak_planks",           1.5, False, "wood"),
    ("polished_andesite",    "minecraft:polished_andesite",    1.5, True,  "stone"),
    ("polished_blackstone",  "minecraft:polished_blackstone",  2.0, True,  "stone"),
    ("polished_diorite",     "minecraft:polished_diorite",     1.5, True,  "stone"),
    ("polished_granite",     "minecraft:polished_granite",     1.5, True,  "stone"),
    ("purpur",               "minecraft:purpur_block",         1.5, True,  "stone"),
    ("quartz",               "minecraft:quartz_block",         0.8, True,  "stone"),
    ("red_nether_brick",     "minecraft:red_nether_brick",     2.0, True,  "nether_brick"),
    ("red_sandstone",        "minecraft:red_sandstone",        0.8, True,  "stone"),
    ("sandstone",            "minecraft:sandstone",            0.8, True,  "stone"),
    ("smooth_quartz",        "minecraft:smooth_quartz",        0.8, True,  "stone"),
    ("smooth_red_sandstone", "minecraft:smooth_red_sandstone", 0.8, True,  "stone"),
    ("smooth_sandstone",     "minecraft:smooth_sandstone",     0.8, True,  "stone"),
    ("smooth_stone",         "minecraft:smooth_stone",         2.0, True,  "stone"),
    ("spruce",               "minecraft:spruce_planks",        1.5, False, "wood"),
    ("stone_brick",          "minecraft:stone_bricks",         1.5, True,  "stone"),
    ("stone",                "minecraft:stone",                1.5, True,  "stone"),
    ("warped",               "minecraft:warped_planks",        1.5, False, "nether_wood"),
]

# Vanilla Bedrock RP texture paths (resolved from the vanilla pack at runtime).
# Verified against bedrock-samples v1.26.50.4.
TEXTURE_PATHS = {
    "andesite":           "textures/blocks/stone_andesite",
    "birch":              "textures/blocks/planks_birch",
    "blackstone":         "textures/blocks/blackstone",
    "brick":              "textures/blocks/brick",
    "cobblestone":        "textures/blocks/miniblocks_cobblestone",  # own file; vanilla path would override all cobblestone
    "crimson":            "textures/blocks/huge_fungus/crimson_planks",
    "cut_copper":         "textures/blocks/cut_copper",
    "cut_red_sandstone":  "textures/blocks/red_sandstone_smooth",
    "cut_sandstone":      "textures/blocks/sandstone_smooth",
    "dark_oak":           "textures/blocks/planks_big_oak",
    "deepslate":          "textures/blocks/deepslate/cobbled_deepslate",
    "diorite":            "textures/blocks/stone_diorite",
    "end_stone_brick":    "textures/blocks/end_bricks",
    "granite":            "textures/blocks/stone_granite",
    "jungle":             "textures/blocks/planks_jungle",
    "mossy_cobblestone":  "textures/blocks/cobblestone_mossy",
    "mossy_stone_brick":  "textures/blocks/stonebrick_mossy",
    "nether_brick":       "textures/blocks/nether_brick",
    "oak":                "textures/blocks/planks_oak",
    "polished_andesite":  "textures/blocks/stone_andesite_smooth",
    "polished_blackstone":"textures/blocks/polished_blackstone",
    "polished_diorite":   "textures/blocks/stone_diorite_smooth",
    "polished_granite":   "textures/blocks/stone_granite_smooth",
    "purpur":             "textures/blocks/purpur_block",
    "quartz":             "textures/blocks/quartz_block_side",
    "red_nether_brick":   "textures/blocks/red_nether_brick",
    "red_sandstone":      "textures/blocks/red_sandstone_normal",
    "sandstone":          "textures/blocks/sandstone_normal",
    "smooth_quartz":      "textures/blocks/quartz_block_bottom",
    "smooth_red_sandstone":"textures/blocks/red_sandstone_top",
    "smooth_sandstone":   "textures/blocks/sandstone_top",
    "smooth_stone":       "textures/blocks/stone_slab_top",
    "spruce":             "textures/blocks/planks_spruce",
    "stone_brick":        "textures/blocks/stonebrick",
    "stone":              "textures/blocks/stone",
    "warped":             "textures/blocks/huge_fungus/warped_planks",
    "mini_dirt":          "textures/blocks/mini_dirt",  # ships in resource_pack/textures/blocks
}

DIRECTIONS = ["north", "south", "east", "west"]

# Collision/selection boxes per facing direction
# Block-local coords: center at 0,0,0; X/Z range -8..8; Y range 0..16
BOXES = {
    "north": {"origin": [-8, 0, -8], "size": [16, 16, 8]},
    "south": {"origin": [-8, 0,  0], "size": [16, 16, 8]},
    "east":  {"origin": [ 0, 0, -8], "size": [8,  16, 16]},
    "west":  {"origin": [-8, 0, -8], "size": [8,  16, 16]},
}


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")
    print(f"  wrote {os.path.relpath(path, REPO)}")


# ── 1. Wall slab geometry ────────────────────────────────────────────────────

def uv(u, v, w, h):
    return {"uv": [u, v], "uv_size": [w, h]}

def make_geo():
    """Four named bones — one per cardinal facing — each a full-height 16×16×8 panel."""
    bones = [
        # NORTH panel: z = -8..0  (pressed against the north wall)
        {
            "name": "north",
            "pivot": [0, 8, 0],
            "cubes": [{
                "origin": [-8, 0, -8], "size": [16, 16, 8],
                "uv": {
                    "north": uv(0, 0, 16, 16),
                    "south": uv(0, 0, 16, 16),
                    "east":  uv(8, 0,  8, 16),
                    "west":  uv(0, 0,  8, 16),
                    "up":    uv(0, 0, 16,  8),
                    "down":  uv(0, 0, 16,  8),
                }
            }]
        },
        # SOUTH panel: z = 0..8
        {
            "name": "south",
            "pivot": [0, 8, 0],
            "cubes": [{
                "origin": [-8, 0, 0], "size": [16, 16, 8],
                "uv": {
                    "south": uv(0, 0, 16, 16),
                    "north": uv(0, 0, 16, 16),
                    "east":  uv(0, 0,  8, 16),
                    "west":  uv(8, 0,  8, 16),
                    "up":    uv(0, 8, 16,  8),
                    "down":  uv(0, 8, 16,  8),
                }
            }]
        },
        # EAST panel: x = 0..8
        {
            "name": "east",
            "pivot": [0, 8, 0],
            "cubes": [{
                "origin": [0, 0, -8], "size": [8, 16, 16],
                "uv": {
                    "east":  uv(0, 0, 16, 16),
                    "west":  uv(0, 0, 16, 16),
                    "north": uv(0, 0,  8, 16),
                    "south": uv(8, 0,  8, 16),
                    "up":    uv(8, 0,  8, 16),
                    "down":  uv(8, 0,  8, 16),
                }
            }]
        },
        # WEST panel: x = -8..0
        {
            "name": "west",
            "pivot": [0, 8, 0],
            "cubes": [{
                "origin": [-8, 0, -8], "size": [8, 16, 16],
                "uv": {
                    "west":  uv(0, 0, 16, 16),
                    "east":  uv(0, 0, 16, 16),
                    "north": uv(8, 0,  8, 16),
                    "south": uv(0, 0,  8, 16),
                    "up":    uv(0, 0,  8, 16),
                    "down":  uv(0, 0,  8, 16),
                }
            }]
        },
    ]
    return {
        "format_version": "1.21.0",
        "minecraft:geometry": [{
            "description": {
                "identifier": "geometry.wall_slab",
                "texture_width": 16,
                "texture_height": 16,
                "visible_bounds_width": 2,
                "visible_bounds_height": 1.5,
                "visible_bounds_offset": [0, 0.25, 0],
            },
            "bones": bones,
        }]
    }

def make_slab_geo():
    return {
        "format_version": "1.21.0",
        "minecraft:geometry": [{
            "description": {
                "identifier": "geometry.slab",
                "texture_width": 16,
                "texture_height": 16,
                "visible_bounds_width": 2,
                "visible_bounds_height": 1.5,
                "visible_bounds_offset": [0, 0.25, 0],
            },
            "bones": [{
                "name": "slab",
                "pivot": [0, 0, 0],
                "cubes": [{
                    "origin": [-8, 0, -8],
                    "size": [16, 8, 16],
                    "uv": [0, 0],
                }],
            }],
        }],
    }

def make_mini_block_geo():
    return {
        "format_version": "1.21.0",
        "minecraft:geometry": [{
            "description": {
                "identifier": "geometry.mini_block",
                "texture_width": 16,
                "texture_height": 16,
                "visible_bounds_width": 1,
                "visible_bounds_height": 1,
                "visible_bounds_offset": [0, 0, 0],
            },
            "bones": [{
                "name": "bb_main",
                "pivot": [0, 0, 0],
                "cubes": [{
                    "origin": [-4, 0, -4],
                    "size": [8, 8, 8],
                    "uv": [0, 0],
                }],
            }],
        }],
    }

write_json(os.path.join(RP, "models/blocks/wall_slab.geo.json"), make_geo())
write_json(os.path.join(RP, "models/blocks/slab.geo.json"), make_slab_geo())
write_json(os.path.join(RP, "models/blocks/mini_block.geo.json"), make_mini_block_geo())


# ── 2. Wall slab block JSONs ─────────────────────────────────────────────────

def make_wall_slab_block(name, hardness, sound):
    identifier = f"addon:{name}_wall_slab"

    # One geometry component; each bone shows only for its own facing state.
    bone_visibility = {
        d: f"q.block_state('minecraft:cardinal_direction') == '{d}'" for d in DIRECTIONS
    }

    permutations = []
    for direction in DIRECTIONS:
        box = BOXES[direction]
        permutations.append({
            "condition": f"q.block_state('minecraft:cardinal_direction') == '{direction}'",
            "components": {
                "minecraft:collision_box": box,
                "minecraft:selection_box": box,
            }
        })

    components = {
        "minecraft:material_instances": {
            "*": {
                "texture": f"{TEX_PREFIX}{name}",
                "render_method": "opaque",
            }
        },
        "minecraft:geometry": {
            "identifier": "geometry.wall_slab",
            "bone_visibility": bone_visibility,
        },
        "minecraft:destructible_by_mining": {
            "seconds_to_destroy": hardness,
        },
        "minecraft:destructible_by_explosion": {
            "explosion_resistance": hardness * 3,
        },
        "minecraft:light_dampening": 0,
    }

    # Wood wall slabs are flammable, matching vanilla plank fire physics
    if sound == "wood":
        components["minecraft:flammable"] = {
            "catch_chance_modifier": 5,
            "destroy_chance_modifier": 20,
        }

    return {
        "format_version": BLOCK_FORMAT,
        "minecraft:block": {
            "description": {
                "identifier": identifier,
                "menu_category": {
                    "category": "construction",
                    "group": "minecraft:itemGroup.name.slab",
                },
                "traits": {
                    "minecraft:placement_direction": {
                        "enabled_states": ["minecraft:cardinal_direction"],
                        "y_rotation_offset": 0,
                    },
                },
            },
            "components": components,
            "permutations": permutations,
        }
    }

for name, source, hardness, stone_cut, sound in WALL_SLABS:
    write_json(os.path.join(BP, f"blocks/{name}_wall_slab.json"),
               make_wall_slab_block(name, hardness, sound))


# ── 3. cobblestone_slab.json (floor slab, no rotation) ──────────────────────

floor_slab = {
    "format_version": BLOCK_FORMAT,
    "minecraft:block": {
        "description": {
            "identifier": "addon:cobblestone_slab",
            "menu_category": {
                "category": "construction",
                "group": "minecraft:itemGroup.name.slab",
            },
        },
        "components": {
            "minecraft:material_instances": {
                "*": {"texture": f"{TEX_PREFIX}cobblestone", "render_method": "opaque"}
            },
            "minecraft:geometry": "geometry.slab",
            "minecraft:destructible_by_mining": {"seconds_to_destroy": 2.0},
            "minecraft:destructible_by_explosion": {"explosion_resistance": 6.0},
            "minecraft:light_dampening": 0,
            "minecraft:collision_box": {"origin": [-8, 0, -8], "size": [16, 8, 16]},
            "minecraft:selection_box": {"origin": [-8, 0, -8], "size": [16, 8, 16]},
        }
    }
}
write_json(os.path.join(BP, "blocks/cobblestone_slab.json"), floor_slab)


# ── 4. mini_dirt.json (8×8×8 cube) ──────────────────────────────────────────

mini_box = {"origin": [-4, 0, -4], "size": [8, 8, 8]}
mini_dirt = {
    "format_version": BLOCK_FORMAT,
    "minecraft:block": {
        "description": {
            "identifier": "addon:mini_dirt",
            "menu_category": {
                "category": "nature",
            },
        },
        "components": {
            "minecraft:material_instances": {
                "*": {"texture": f"{TEX_PREFIX}mini_dirt", "render_method": "opaque"}
            },
            "minecraft:geometry": "geometry.mini_block",
            "minecraft:destructible_by_mining": {"seconds_to_destroy": 0.5},
            "minecraft:light_dampening": 0,
            "minecraft:collision_box": mini_box,
            "minecraft:selection_box": mini_box,
        }
    }
}
write_json(os.path.join(BP, "blocks/mini_dirt.json"), mini_dirt)


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
        }
    }

def stonecutter(recipe_id, source, result, count):
    # Vanilla stonecutter recipes are shapeless recipes tagged "stonecutter".
    return {
        "format_version": RECIPE_FORMAT,
        "minecraft:recipe_shapeless": {
            "description": {"identifier": recipe_id},
            "tags": ["stonecutter"],
            "priority": 0,
            "ingredients": [{"item": source}],
            "unlock": [{"item": source}],
            "result": {"item": result, "count": count},
        }
    }

COLUMN = ["#", "#", "#"]

for name, source, hardness, stone_cut, sound in WALL_SLABS:
    identifier = f"addon:{name}_wall_slab"
    # Crafting table: 3 source blocks in a vertical column → 6 wall slabs
    write_json(os.path.join(BP, f"recipes/{name}_wall_slab_crafting.json"),
               shaped(f"addon:{name}_wall_slab_crafting", COLUMN, source, identifier, 6))
    if stone_cut:
        write_json(os.path.join(BP, f"recipes/{name}_wall_slab_stonecutting.json"),
                   stonecutter(f"addon:{name}_wall_slab_stonecutting", source, identifier, 2))

# No crafting-table recipe for cobblestone_slab: "###" cobblestone is the
# vanilla cobblestone slab recipe. The stonecutter lists both outputs.
write_json(os.path.join(BP, "recipes/cobblestone_slab_stonecutting.json"),
           stonecutter("addon:cobblestone_slab_stonecutting", "minecraft:cobblestone",
                       "addon:cobblestone_slab", 2))
write_json(os.path.join(BP, "recipes/mini_dirt_crafting.json"),
           shaped("addon:mini_dirt_crafting", COLUMN, "minecraft:dirt", "addon:mini_dirt", 6))


# ── 6. terrain_texture.json ─────────────────────────────────────────────────

terrain_texture = {
    "resource_pack_name": "MiniBlocksAddon",
    "texture_name": "atlas.terrain",
    "padding": 8,
    "num_mip_levels": 4,
    # Prefixed so our keys never replace vanilla ones of the same name.
    "texture_data": {f"{TEX_PREFIX}{k}": {"textures": v} for k, v in TEXTURE_PATHS.items()},
}
write_json(os.path.join(RP, "textures/terrain_texture.json"), terrain_texture)


# ── 7. blocks.json (sounds) ─────────────────────────────────────────────────

blocks_json = {"format_version": "1.21.40"}
blocks_json["addon:cobblestone_slab"] = {"sound": "stone"}
blocks_json["addon:mini_dirt"] = {"sound": "gravel"}
for name, source, hardness, stone_cut, sound in WALL_SLABS:
    blocks_json[f"addon:{name}_wall_slab"] = {"sound": sound}
write_json(os.path.join(RP, "blocks.json"), blocks_json)


# ── 8. Slab → full block map & sound map for the merge script ───────────────

SOUND_EVENTS = {
    "stone": "use.stone",
    "wood": "use.wood",
    "nether_wood": "use.wood",
    "deepslate": "use.deepslate",
    "copper": "use.copper",
    "nether_brick": "use.nether_brick",
}

slab_map_path = os.path.join(BP, "scripts/slab_map.js")
with open(slab_map_path, "w") as f:
    f.write("// Generated by tools/generate_addon.py — do not edit by hand.\n")
    f.write("export const SLAB_TO_FULL_BLOCK = {\n")
    for name, source, hardness, stone_cut, sound in WALL_SLABS:
        f.write(f'  "addon:{name}_wall_slab": "{source}",\n')
    f.write('  "addon:cobblestone_slab": "minecraft:cobblestone",\n')
    f.write("};\n\n")
    f.write("export const SLAB_SOUNDS = {\n")
    for name, source, hardness, stone_cut, sound in WALL_SLABS:
        sound_event = SOUND_EVENTS.get(sound, "use.stone")
        f.write(f'  "addon:{name}_wall_slab": "{sound_event}",\n')
    f.write('  "addon:cobblestone_slab": "use.stone",\n')
    f.write("};\n")
print(f"  wrote {os.path.relpath(slab_map_path, REPO)}")


# ── 9. Lang file ─────────────────────────────────────────────────────────────

lang_entries = [
    "## Comments can be added to any line in a .lang file by starting the line with the '#' character.",
    "",
    "pack.name=MiniBlocks Addon",
    "pack.description=Adds wall slabs and mini blocks to Bedrock Edition. Successor to the classic MCPE Mini Blocks Mod.",
    "",
    "tile.addon:mini_dirt.name=Mini Dirt",
    "tile.addon:cobblestone_slab.name=Cobblestone Slab",
]

DISPLAY_NAMES = {
    "andesite":            "Andesite Wall Slab",
    "birch":               "Birch Wall Slab",
    "blackstone":          "Blackstone Wall Slab",
    "brick":               "Brick Wall Slab",
    "cobblestone":         "Cobblestone Wall Slab",
    "crimson":             "Crimson Wall Slab",
    "cut_copper":          "Cut Copper Wall Slab",
    "cut_red_sandstone":   "Cut Red Sandstone Wall Slab",
    "cut_sandstone":       "Cut Sandstone Wall Slab",
    "dark_oak":            "Dark Oak Wall Slab",
    "deepslate":           "Cobbled Deepslate Wall Slab",
    "diorite":             "Diorite Wall Slab",
    "end_stone_brick":     "End Stone Brick Wall Slab",
    "granite":             "Granite Wall Slab",
    "jungle":              "Jungle Wall Slab",
    "mossy_cobblestone":   "Mossy Cobblestone Wall Slab",
    "mossy_stone_brick":   "Mossy Stone Brick Wall Slab",
    "nether_brick":        "Nether Brick Wall Slab",
    "oak":                 "Oak Wall Slab",
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

for name, display in sorted(DISPLAY_NAMES.items()):
    lang_entries.append(f"tile.addon:{name}_wall_slab.name={display}")

lang_path = os.path.join(RP, "texts/en_US.lang")
os.makedirs(os.path.dirname(lang_path), exist_ok=True)
with open(lang_path, "w") as f:
    f.write("\n".join(lang_entries) + "\n")
print(f"  wrote resource_pack/texts/en_US.lang")


# ── 10. Packaging helper ────────────────────────────────────────────────────

def package_addon(dist_dir=None, download_dir="/storage/emulated/0/Download"):
    import shutil, subprocess, zipfile
    if not dist_dir:
        dist_dir = os.path.join(REPO, "dist")
    os.makedirs(dist_dir, exist_ok=True)

    bp_pack = os.path.join(dist_dir, "MiniBlocks_Behavior.mcpack")
    rp_pack = os.path.join(dist_dir, "MiniBlocks_Resource.mcpack")
    addon_file = os.path.join(dist_dir, "MiniBlocksAddon.mcaddon")

    def zip_folder(folder_path, output_path):
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as z:
            for root, dirs, files in os.walk(folder_path):
                for file in files:
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
                "-d", f"file://{os.path.join(download_dir, 'MiniBlocksAddon.mcaddon')}"
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print("  ✓ Triggered Android media scanner broadcast")
        except Exception:
            pass


if __name__ == "__main__":
    import sys
    if "--package" in sys.argv or "-p" in sys.argv:
        package_addon()
