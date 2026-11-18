# Mini Blocks Add-on for Minecraft: Bedrock Edition
*A modern Bedrock Edition port of the classic Pocket Edition Mini Blocks Mod by thejaustin.*

```text
// =========================================================================
// Mini Blocks Mod v1.9 -> v1.4.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// Originally created for MCPE 0.10.x / 0.11.1; updated for Bedrock 1.26.x.
// Directional placement logic originally credited to androidKaghon.
// =========================================================================
```

---

## Overview

Mini Blocks brings vertical half-blocks (**Wall Slabs**) and scaled decorative blocks (**Mini Blocks**) to Minecraft: Bedrock Edition.

### Inspirations: Carpenter's Blocks, Chisels & Bits, and Little Blocks
The original mod was created by **thejaustin** on **January 16, 2015** for Minecraft Pocket Edition, growing out of three landmark Java modding inspirations from that era:
1. **Carpenter's Blocks (Mineshopper)**: The direct inspiration for **Wall Slabs**. Carpenter's Blocks introduced customizable architectural shapes and vertical panels. Since mobile MCPE had no carpenter's hammer or frame tools, Austin introduced dedicated craftable vertical half-blocks (**Wall Slabs**), crafted with 3 blocks in a vertical column (`["aba", "aba", "aba"]`), directly mirroring vanilla's horizontal slab recipe.
2. **The Little Blocks Mod (SlimeVoid / Gullibility & Vengeeur)**: Sparked the dream of micro-scale detailing (fitting 512 mini blocks in a single coordinate).
3. **Chisels & Bits (AlgorithmX2)**: Further popularized sub-block sculpting and micro-detailing, showing the massive builder demand for decorative precision beyond standard 1x1 meter blocks.

Following early releases through v1.9 and an experimental **v2.0 Beta** teased on Minecraft Forum, development paused as MCPE moved away from ModPE scripting. This modern edition rebuilds the mod as a native Bedrock add-on utilizing custom block geometry, cardinal placement direction traits, and Bedrock Script API (`@minecraft/server`) runtime behavior.

### Repository Lineage: Combining `thejaustin/ModPE` & `thejaustin/MiniBlocksAddon`
The project's history spans two dedicated GitHub repositories:
* **[`thejaustin/ModPE`](https://github.com/thejaustin/ModPE) (2015–2018)**: Hosted the original JavaScript ModPE script (`Mini Blocks Mod`), the live in-game auto-updater manifest (`MiniBlocksVersion` tracking v1.4 through v1.9), the update alert message (`changelog`), and related experiments such as `Shards-Mod`.
* **[`thejaustin/MiniBlocksAddon`](https://github.com/thejaustin/MiniBlocksAddon) (2024–Present)**: Established on December 26, 2024 as the dedicated modern home for the native Bedrock Add-on port. (An exploratory repo, `thejaustin/MCBedrock`, was created in May 2023 but remained dormant with only an initial commit). Early 1.19 block schemas were staged on `feat/initial-addon-structure` and merged by Jules in March 2026, before Claude and Antigravity completed modernization on Termux.

### Multi-Agent On-Device Development Lineage
The modern Bedrock port reflects an on-device AI pair-programming workflow traced across the repository history:
* **Google Labs Jules (`google-labs-jules[bot]`)**: Performed initial repository parity fixes (PR #1).
* **Claude (Sonnet 4.6 & Opus 5.5) on Termux (Android Mobile)**: Authored October 2026 commits directly on-device in Termux using Claude Code. Modernized block schemas from 1.19 to 1.21/1.26 format, created Python generation tooling, and drafted early server script slab merging. (Any older Warp terminal sessions occurred ~a year prior on separate project work).
* **Antigravity on Termux (Android Mobile)**: Continued the mobile Termux workflow over loopback ADB in November 2026. Debugged mobile touch-control combining across all faces, created custom pixel iconography, eliminated terrain texture collisions, and finalized native release packaging on-device.

### Core Features
* **41 Wall Slab Variants**: Full coverage across vanilla wood types (Oak, Spruce, Birch, Jungle, Acacia, Dark Oak, Crimson, Warped, and modern additions Bamboo, Cherry, Mangrove, Pale Oak), stone variants (Cobblestone, Granite, Diorite, Andesite, Deepslate, Blackstone, Bricks), sandstone, quartz, copper, and the newly restored Glass Wall Slab.
* **Interactive Slab Combining**: Tap any face or place adjacent with a matching wall slab to merge into the full block. Sneaking allows building adjacent slabs without merging.
* **Directional Placement**: Wall slabs orient automatically toward the player upon placement with robust GUI/in-hand rendering fallback.
* **Multi-Surface Mini Blocks (9 Variants)**: 8×8×8 miniature decorative blocks with native 6-surface attachment (floors, ceilings, walls) via `minecraft:placement_position` (`minecraft:block_face`). Includes Dirt, Cobblestone, Oak Planks, Stone, Stone Bricks, Brick, Sandstone, Obsidian, and Glass.
* **Survival & Stonecutter Parity**:
  * 3 stacked blocks in crafting grid -> 6 wall slabs or 6 mini blocks.
  * 1 stone-type block in stonecutter -> 2 wall slabs or 2 mini blocks.
  * Tool destructibility tags (`is_pickaxe_item_destructible`, `is_axe_item_destructible`) for immediate survival tool mining speed parity.
* **Nostalgic One-Time In-Game Greeting**: Optional welcome greeting on initial world join referencing the original 2015 script release.

---

## Code Archaeology: The 2014–2015 ModPE Heritage

Looking at the original `miniblocks_v1.9.bin` script reflects an authentic snapshot of early MCPE modding culture—an enthusiastic patchwork of community-shared code snippets, reverse-engineered hacks, and creative workarounds:

* **The "Copy Paste Edit" Tradition**: Despite the iconic header warning (`"//Don't steal this code! Do not take it as your own!"`), the codebase was built in that classic modding tradition of copy, paste, and edit—taking community snippets, adjusting and tweaking them, and stitching them together into new mechanics.
* **Directional Placement (`findYaw()`) & androidKaghon**: Directional math was adopted from **androidKaghon** (known for the MCPE 0.9.x–0.11.x *Ender Chest Mod*). To simulate directional facing without block states, `findYaw()` calculated player yaw (`getYaw() + 45`), normalized the angle recursively, and placed one of four discrete block IDs (complete with stone click sounds playing during recursion).
* **In-Game Auto-Updater**: The background Java thread and `AlertDialog.Builder` popup (`MiniBlocksVersion`) were adapted from community templates popularized by **Desno365** and **500ISE**, leveraging **Zhuowei Zhang**'s `net.zhuoweizhang.mcpelauncher.ScriptManager` to hot-reload scripts live.
* **The 52-Block ID Workaround**: Because MCPE 0.10.x lacked rotation permutations, every wall slab required four separate global block IDs (e.g. Stone Wall Slabs consumed IDs 249, 248, 242, and 241, plus 192 for the full block), consuming over 52 IDs across the mod.
* **Modern Bedrock Resolution**: All 52 legacy block IDs and recursive yaw calculations have been replaced with single unified identifiers using Bedrock cardinal placement direction traits and `@minecraft/server` scripting.

---

## Release Notes — v1.4.0 (Bedrock Edition)

### Key Improvements

#### Creative Inventory (+) Expandable Groups
* **Crafting Item Catalog**: Implemented official Bedrock `crafting_item_catalog.json` (`behavior_pack/item_catalog/crafting_item_catalog.json`). Custom blocks are now organized into collapsible drawers within the Construction tab instead of flooding the top-level creative inventory.
* **Expandable Folders**:
  * **Wall Slabs (+)**: Collapsed under the Oak Wall Slab icon; expands to show all 41 wall slab variants.
  * **Mini Blocks (+)**: Collapsed under the Mini Dirt icon; expands to show all 9 miniature blocks.
  * **Slabs (+)**: Places `addon:cobblestone_slab` into the vanilla Stone Slab drawer.
* **Localization Keys**: Added `itemGroup.name.wall_slab=Wall Slabs` and `itemGroup.name.mini_block=Mini Blocks` in `en_US.lang`.

#### Mini Block Combining Parity (2:1 Craft-Combining)
* **Classic ModPE Mechanic**: Tapping any placed mini block with a matching mini block in hand combines them into the full vanilla block.
* **Survival Audio & Item Deduction**: Consumes 1 item from hand in Survival mode and plays matching block placement sounds (`use.stone`, `use.wood`, `use.gravel`).
* **Sneak Placing**: Sneaking/crouching bypasses combining, allowing players to build adjacent mini blocks cleanly.

#### Improved Mini Block Placement Logic
* **Directional Placement Traits**: Added native `minecraft:placement_direction` (`minecraft:cardinal_direction`) traits to track player facing.
* **Ground-Level Placement Fix**: Enabled `minecraft:vertical_half` on `minecraft:placement_position`. Clicking the lower half of an adjacent block keeps the mini block grounded on the floor (Y: 0..8) rather than forcing awkward mid-air positioning (Y: 4..12). Clicking the upper half mounts it at Y: 8..16.
* **10-Bone Multi-Surface Geometry**: Expanded `geometry.mini_block` and block permutations to support floors, ceilings, and bottom/top halves of all four walls with matching hitboxes.

---

## Release Notes — v1.3.0 (Bedrock Edition)

### Key Improvements

#### The Return of Mini Blocks & Multi-Surface Attachment
* **Historical Context**: In v1.5 (January 2015), the original script boldly declared *"Added ACTUAL MINI BLOCKS!"*. While v1.2.0 introduced a basic preview of Mini Dirt, v1.3.0 implements the full, authentic vision of the namesake **Mini Blocks** system.
* **Multi-Surface Attachment**: Utilizing modern Bedrock block traits (`minecraft:placement_position` with `minecraft:block_face`), mini blocks can now be mounted onto floors (`up`), ceilings (`down`), and all four cardinal walls (`north`, `south`, `east`, `west`).
* **Expanded Catalog (9 Blocks)**: Includes Mini Dirt, Mini Cobblestone, Mini Oak Planks, Mini Stone, Mini Stone Bricks, Mini Brick, Mini Sandstone, Mini Obsidian, and Mini Glass.
* **Per-Face Scaled UV Mapping**: Fixed box-UV texture scrambling by generating dedicated per-face UV maps (`uv(0, 0, 16, 16)`), ensuring 16×16 terrain textures scale cleanly onto 8×8×8 miniature faces.

#### Glass Wall Slabs Restored & Modern Woods
* **Glass Wall Slabs (`addon:glass_wall_slab`)**: Originally present in 2015, glass wall slabs were cut in v1.5 due to MCPE 0.10.x transparency rendering bugs (*"Removed glass wall slabs (too many render glitches)"*). Re-implemented with Bedrock `render_method: "alpha_test"`, breaking sounds, and zero light dampening.
* **Modern Wood Wall Slabs**: Added full wall slab support for modern vanilla woods: **Bamboo**, **Cherry**, **Mangrove**, and **Pale Oak** (bringing the total to 41 wall slab variants).

#### Safety, Quality & Survival Parity
* **In-Hand & GUI Rendering Fallback**: Added a Molang fallback expression to bone visibility, ensuring wall slabs and mini blocks render visibly in inventory slots and held in third/first-person hands when block state queries evaluate to null.
* **Tool Destructibility Tags**: Added native `minecraft:tags` (`minecraft:is_axe_item_destructible` and `minecraft:is_pickaxe_item_destructible`) so pickaxes and axes mine slabs and mini blocks with authentic vanilla tool speeds.
* **Missing `languages.json` Fixed**: Created `resource_pack/texts/languages.json` to ensure Bedrock's localization engine reliably loads `en_US.lang` custom tile names.
* **Nostalgic Session Greeting**: Added a one-time welcome greeting in chat on session spawn echoing the classic 2015 script message:  
  *`"Welcome back to Minecraft PE! You are using the Mini Blocks Add-on v1.3.0! Originally created by thejaustin"`*.
* **Automated Packaging (`tools/package.py`)**: One-command compilation generating `.mcpack` and `.mcaddon` archives, syncing directly to `/storage/emulated/0/Download/` and triggering Android media scanner broadcasts.

---

## Release Notes — v1.2.0 (Bedrock Edition)

### Key Improvements

#### Wall Slab Combining: FINALLY FIXED (again)
* **Historical Context**: The original ModPE v1.9 script (`miniblocks_v1.9.bin`) famously included the changelog line:  
  `"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"`  
  This was implemented via tile ID swapping on block click.
* **Bedrock Touch Control Resolution**: In modern Bedrock touch controls on mobile devices, targeting the 8px rear plane of a wall slab is notoriously difficult. In v1.2.0, combining has been overhauled:
  * **Direct Merge**: Tap or right-click any face of an existing wall slab while holding a matching slab to combine it into the full block.
  * **Adjacent Merge**: Placing a matching slab into the open 8px half of an existing wall slab merges it immediately.
  * **Build Mode**: Crouch/sneak while placing to place independent adjacent slabs without triggering a merge.
  * **Survival Parity**: Respects block permissions, consumes the slab from the active hotbar slot in Survival mode, and checks entity collision bounds to prevent mob/player suffocation.

#### Directional Placement: FINALLY FIXED (again)... Mostly
* **Historical Context**: In the MCPE 0.11.1 ModPE days, directional facing required yaw calculations from player coordinates, credited in the source header:  
  `"The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!"`
* **Bedrock State**:
  * **Wall Slabs**: FINALLY FIXED (again). Wall slabs utilize native Bedrock cardinal placement direction traits (`minecraft:placement_direction`) to face the player reliably.
  * **Mini Blocks**: Reliving the classic 2015 directional growing pains. Mini dirt places and renders properly as an 8x8x8 centered cube, but directional facing states remain work-in-progress.

#### Asset Polish & Engine Compatibility
* **Correct Lighting Parity (`minecraft:light_dampening: 0`)**: Directly honors the original headline v1.9 feature (*"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"*), ensuring sunlight and ambient light pass through the empty half of all wall slabs without casting harsh opaque full-block shadows.
* **Flammability Physics (`minecraft:flammable`)**: Wood wall slabs (Oak, Spruce, Birch, Jungle, Acacia, Dark Oak) now catch and burn with vanilla plank fire physics, while stone, metal, and Nether wood slabs remain fire-resistant.
* **Audio Feedback**: Added dynamic placement sound effects (`dimension.playSound`) upon slab combining, matching the block material (`use.wood`, `use.stone`, `use.deepslate`, `use.copper`, etc.) for authentic game feel.
* **Script Hardening**: Added entity validity and AABB checks to `isObstructed`, and runtime active hotbar slot re-verification inside `system.run` to safeguard survival item deduction against slot-scrolling desyncs.
* **Geometry Modernization**: Aligned `mini_block.geo.json` and `slab.geo.json` to modern Bedrock `format_version: "1.21.0"` with standardized visible bounds.
* **Packaging Tooling**: Added `tools/package.py` and `--package` flag in `tools/generate_addon.py` for automated `.mcpack` and `.mcaddon` bundle creation, shared storage deployment, and media scanner triggering.
* **Pack Iconography**: Added a custom 128x128 pixel-art `pack_icon.png` depicting oak and stone brick wall slabs alongside the floating mini dirt block.
* **In-Game Localization & Naming**: Standardized pack names to `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Namespace Fix**: Resolved namespace collisions with vanilla cobblestone and deepslate terrain entries.
* **UUID & Versioning**: Updated pack manifests to version `1.2.0` with fresh UUIDs, resolving engine "Duplicate pack detected" errors during import.
* **API Pinning**: Pinned `@minecraft/server` dependency to stable `1.14.0` / `1.26.20` with `min_engine_version` set to `[1, 21, 0]`.

---

## Version History & Archive

Detailed forum archive notes and historical context can be viewed in [CHANGELOG.md](file:///data/data/com.termux/files/home/miniblocks-work/MiniBlocksAddon/CHANGELOG.md).

```text
=== v1.2.0 (Bedrock Port — 2026) ===
* [Development] Rebuilt via on-device AI-assisted engineering across Google Labs Jules, Claude (Termux), and Antigravity (Termux).
* [Feature] Wall Slabs can be combined on touch controls: FINALLY FIXED (again)! Tap any face or place adjacent.
* [Feature] Directional placement for wall slabs: FINALLY FIXED (again)!
* [Feature] Added custom 128x128 pixel-art pack icon featuring Oak Wall Slab, Stone Brick Wall Slab & Mini Block.
* [Feature] Crouching allows placing wall slabs adjacent without combining.
* [Fix] Fixed Bedrock import failure: "Duplicate pack detected" (fresh UUIDs & 1.2.0 versioning).
* [Fix] Renamed in-game manifests to 'Mini Blocks Add-on (Behaviors)' and '(Resources)'.
* [Fix] Fixed terrain texture collisions with vanilla cobblestone and deepslate.
* [Fix] Lowered min_engine_version to [1, 21, 0] and aligned @minecraft/server to stable runtime.
* [Known Issue] Mini block directional placement is experiencing the classic 2015 directional placement bug (places and renders fine, but faces wherever it wants).
* [Humor] Fixed raw.githubusercontent.com update check failing when airplane mode is on.
* Removed Herobrine.

=== v2.0 Beta (MCPE Forum Beta Era — 2015/2016) ===
* Experimental 2.0 beta builds announced and shared on MinecraftForum.net.
* Planned next-generation overhaul for MCPE: expanding beyond wall slabs with dedicated miniature block sets and revised boundary collision math.
* Development paused as MCPE moved toward native C++ codebases and BlockLauncher ModPE APIs were deprecated.
* Stood as the long-standing "unfinished business" of the original mod, now realized in native Bedrock form.

=== v1.9 (MCPE 0.11.1 - The Classic ModPE Peak — August 2015) ===
* "Correct Lighting, & Wall Slabs can be combined!"
* Wall slabs can become full blocks, just like regular slabs can!
* 'Blocks turn in the direction you're facing' code by androidKaghon added! (FINALLY FIXED!)
* Added in-game update checker via raw.githubusercontent.com/thejaustin/ModPE.
* Creative inventory support for Stone, Cobble, Wood variants, Brick, Sandstone, Stone Brick, Quartz, and Glass Wall Slabs.
* Follow me on Twitter, @thejaustin!

=== v1.8 (MCPE 0.11.0 Era — June 2015) ===
* Updated for MCPE 0.11.0 compatibility.
* Added custom update notifications in chat.
* Internal code cleanups and block ID adjustments.

=== v1.5 (ModPE Script Overhaul — January 2015) ===
* Re-wrote EVERYTHING!
* Added ACTUAL MINI BLOCKS!
* Improved placement logic.
* Removed glass wall slabs (too many render glitches).
* Added a period. It was missing! :P

=== v1.4 (GitHub Debut — January 19, 2015) ===
* First public push to the thejaustin/ModPE repository.
* Implemented MiniBlocksVersion remote update checker.
* Initial creative inventory hooks for all primary wood and stone types.

=== v1.0 — v1.3 (MCPE 0.10.x Release Era) ===
* Initial public release on MinecraftForum on January 16, 2015.
* Transitioned out of beta into full release.
* Added Sandstone, Quartz, and Brick Wall Slabs.
* Basic collision boxes matching 8px wall boundaries.

=== Early Betas: v0.1 — v0.9 (MCPE 0.10.0 Betas) ===
* Initial experimental vertical wall slab tests on MinecraftForum.net.
* Addressed early lighting glitches and block bounds.
* Established foundation for custom half-block positioning in ModPE.
```

---

## Installation

1. Download **`MiniBlocksAddon.mcaddon`** (or the individual `.mcpack` files).
2. Open the file with **Minecraft** to import.
3. In your world settings:
   * Under **Resource Packs**, activate **Mini Blocks Add-on (Resources)**.
   * Under **Behavior Packs**, activate **Mini Blocks Add-on (Behaviors)**.
   * Under **Experiments**, toggle **Beta APIs** to ON.
4. Launch the world.

---

## Development & Tooling

The addon codebase is maintained on-device using Termux with Python generation scripts and AI-assisted pair-programming:

```bash
python3 tools/generate_addon.py
```

To package the distribution archives:
```bash
python3 -c "
import zipfile, os
def zip_dir(path, zip_handle):
    for root, _, files in os.walk(path):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, path)
            zip_handle.write(full, rel)

with zipfile.ZipFile('MiniBlocksAddon_Resources.mcpack', 'w', zipfile.ZIP_DEFLATED) as z:
    zip_dir('resource_pack', z)
with zipfile.ZipFile('MiniBlocksAddon_Behaviors.mcpack', 'w', zipfile.ZIP_DEFLATED) as z:
    zip_dir('behavior_pack', z)
with zipfile.ZipFile('MiniBlocksAddon.mcaddon', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write('MiniBlocksAddon_Resources.mcpack')
    z.write('MiniBlocksAddon_Behaviors.mcpack')
"
```

---

**Original Author:** [@thejaustin](https://github.com/thejaustin)  
**Historical Social:** [@thejaustin on Twitter/X](https://twitter.com/thejaustin) (archived: `@thejaustin_old`)  
*Original ModPE Code Notice: Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
