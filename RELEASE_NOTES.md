# Mini Blocks Add-on v1.4.0 (Bedrock Edition)
*A modern Bedrock Edition port of the classic Pocket Edition Mini Blocks Mod by thejaustin.*

```text
// =========================================================================
// Mini Blocks Mod v1.4.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// Originally made for MCPE 0.10.x / 0.11.1; updated for Bedrock 1.26.x.
// Directional placement logic originally credited to androidKaghon.
// =========================================================================
```

---

## Overview

Mini Blocks brings vertical half-blocks (**Wall Slabs**) and scaled decorative blocks (**Mini Blocks**) to Minecraft: Bedrock Edition. Originally developed by **thejaustin** on **January 16, 2015** as a ModPE script for Minecraft Pocket Edition, following the v1.9 release and subsequent **v2.0 Beta** teased on Minecraft Forum, this release modernizes the project into a native Bedrock add-on.

### Inspirations: Carpenter's Blocks, Chisels & Bits, and Little Blocks
* **Carpenter's Blocks (Mineshopper)**: Directly inspired the **Wall Slab** concept. Carpenter's Blocks pioneered customizable geometric shapes and vertical panels in Minecraft. Since MCPE lacked specialized carpenter's tools or frame mechanics, Austin translated that idea into dedicated craftable vertical half-blocks using 3 blocks in a vertical column (`["aba", "aba", "aba"]`), directly mirroring vanilla's horizontal slab recipe.
* **Little Blocks Mod (SlimeVoid / Gullibility & Vengeeur)**: Inspired the dream of miniature block scaling and micro-detailing on mobile.
* **Chisels & Bits (AlgorithmX2)**: Popularized voxel sub-block carving and proved the enduring desire among Minecraft builders for precision micro-scale detailing.

### Multi-Agent On-Device Development History
This Bedrock release reflects an on-device AI pair-programming workflow traced across git history:
* **Repository Unification (`thejaustin/ModPE` & `thejaustin/MiniBlocksAddon`)**: The project lineage unifies the original 2015 BlockLauncher mod from [`thejaustin/ModPE`](https://github.com/thejaustin/ModPE) (which powered in-game updates via `MiniBlocksVersion` and `changelog`) with the modern Bedrock codebase in [`thejaustin/MiniBlocksAddon`](https://github.com/thejaustin/MiniBlocksAddon) (created Dec 2024; an earlier exploratory repo `thejaustin/MCBedrock` from May 2023 remained dormant).
* **Google Labs Jules (`google-labs-jules[bot]`)**: Repository parity and structural alignment (PR #1), merging early schemas from `feat/initial-addon-structure`.
* **Claude (Sonnet 4.6 & Opus 5.5) on Termux (Android Mobile)**: Authored October 2026 commits directly on-device in Termux using Claude Code. Modernized block schemas from 1.19 to 1.21/1.26 format, created Python generation tooling, and drafted early server script slab merging. (Any older Warp terminal sessions occurred ~a year prior on separate project work).
* **Antigravity on Termux (Android Mobile)**: Continued the mobile Termux workflow over loopback ADB in November 2026. Debugged mobile touch-control combining across all faces, created custom pixel iconography, eliminated terrain texture collisions, and finalized native release packaging on-device.

---

## Code Archaeology: The 2014–2015 ModPE Heritage

Looking at the original `miniblocks_v1.9.bin` script reflects an authentic snapshot of early MCPE modding culture—an enthusiastic patchwork of community-shared code snippets, reverse-engineered hacks, and creative workarounds:

* **The "Copy Paste Edit" Tradition**: Despite the iconic header warning (`"//Don't steal this code! Do not take it as your own!"`), the codebase was built in that classic modding tradition of copy, paste, and edit—taking community snippets, adjusting and tweaking them, and stitching them together into new mechanics.
* **Directional Placement (`findYaw()`) & androidKaghon**: Directional math was adopted from **androidKaghon** (known for the MCPE 0.9.x–0.11.x *Ender Chest Mod*). To simulate directional facing without block states, `findYaw()` calculated player yaw (`getYaw() + 45`), normalized the angle recursively, and placed one of four discrete block IDs (with stone click sounds playing during recursion).
* **In-Game Auto-Updater**: The background Java thread and `AlertDialog.Builder` popup (`MiniBlocksVersion`) were adapted from community templates popularized by **Desno365** and **500ISE**, leveraging **Zhuowei Zhang**'s `net.zhuoweizhang.mcpelauncher.ScriptManager` to hot-reload scripts live.
* **The 52-Block ID Workaround**: Because MCPE 0.10.x lacked rotation permutations, every wall slab required four separate global block IDs (e.g. Stone Wall Slabs consumed IDs 249, 248, 242, and 241, plus 192 for the full block), consuming over 52 IDs across the mod.
* **Modern Bedrock Resolution**: All 52 legacy block IDs and recursive yaw calculations have been replaced with single unified identifiers using Bedrock cardinal placement direction traits and `@minecraft/server` scripting.

---

## What's New in v1.4.0

### Creative Inventory (+) Expandable Groups
* **Crafting Item Catalog**: Implemented official Bedrock `crafting_item_catalog.json` under `behavior_pack/item_catalog/`. Custom blocks no longer flood the Creative Inventory as loose icons.
* **Organized Expandable Groups**:
  * **Wall Slabs (+)**: Displays with the Oak Wall Slab icon and expands to reveal all 41 wall slab variants.
  * **Mini Blocks (+)**: Displays with the Mini Dirt icon and expands to reveal all 9 miniature blocks.
  * **Slabs (+)**: Integrates `addon:cobblestone_slab` into the vanilla Stone Slab group drawer.
* **Localization Keys**: Added `itemGroup.name.wall_slab=Wall Slabs` and `itemGroup.name.mini_block=Mini Blocks` in `en_US.lang`.

### Mini Block Combining Parity
* **2:1 Ratio Combining**: Tapping any placed mini block with a matching mini block in hand combines them into the full vanilla block (consuming 1 item from inventory in Survival and playing authentic placement audio). Sneaking allows placing adjacent mini blocks without combining.
* **Script Integration**: Extended `@minecraft/server` runtime in `main.js` and `slab_map.js` to cover all 9 mini block types seamlessly alongside wall slabs.

### Improved Mini Block Placement Logic
* **Directional Placement Traits**: Added native `minecraft:placement_direction` (`minecraft:cardinal_direction`) traits so directional facing is tracked.
* **Ground-Level Placement Fix**: Added `minecraft:vertical_half` support to `minecraft:placement_position`. Clicking the lower half of an adjacent block keeps the mini block grounded on the floor (Y: 0..8) instead of forcing mid-air positioning (Y: 4..12). Clicking the upper half mounts it at Y: 8..16.
* **10-Bone Multi-Surface Geometry**: Expanded `geometry.mini_block` and block permutations to handle floors, ceilings, and top/bottom halves of all four cardinal walls with exact collision and selection boxes.

### Reactivity, Lighting & Sound Polish
* **Visual Reactivity & Particles**: Successful combining triggers emerald sparkle particles (`minecraft:villager_happy`) bursting at block center for instant visual feedback.
* **Organic Sound Variation**: Added natural pitch modulation (`pitch: 0.9..1.1`) so placement and merging sound dynamic rather than monotonous.
* **Audio Fixes**: Mapped glass merging to glass shattering audio (`random.glass`), mapped Mini Dirt to vanilla `dirt` sounds.
* **Smooth Contact Lighting**: Enabled `ambient_occlusion: 1.0` and `face_dimming: true` on opaque blocks to render soft contact shadows and directional sunlight shading, while preserving transparent glass clarity.
* **Obstruction Tolerance**: Added a 5cm epsilon margin to `isObstructed`, ensuring players standing near adjacent block edges don't accidentally block combining.

---

## What's New in v1.3.0

### The Return of Mini Blocks & Multi-Surface Attachment
* **Full 9-Block Catalog**: Dirt, Cobblestone, Oak Planks, Stone, Stone Bricks, Brick, Sandstone, Obsidian, and Glass.
* **Glass Wall Slabs Restored**: Fully restored with `render_method: "alpha_test"`.
* **Modern Wood Wall Slabs**: Bamboo, Cherry, Mangrove, and Pale Oak.
* **Survival Quality**: Tool destructibility tags, `languages.json`, and automated packaging.

---

## What's New in v1.2.0

### Wall Slab Combining: FINALLY FIXED (again)
* **Background**: Version 1.9 of the original ModPE script introduced:  
  `"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"`
* **Bedrock Resolution**: In mobile Bedrock touch controls, interacting with the 8px rear plane of a wall slab is difficult. In v1.2.0:
  * **Direct Merge**: Interacting with any face of an existing wall slab while holding a matching slab item combines it into the full block.
  * **Adjacent Merge**: Placing a matching slab into the open half of an existing wall slab merges them into the full block.
  * **Build Mode**: Sneaking allows placing adjacent wall slabs without triggering combining.
  * **Survival Parity**: Verifies build permissions, consumes the slab from the active inventory slot, and includes entity collision checks to prevent suffocation.

### Directional Placement: FINALLY FIXED (again)... Mostly
* **Background**: Orientation math originally credited to androidKaghon in the 0.11.1 source header:  
  `"The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!"`
* **Bedrock State**:
  * **Wall Slabs**: FINALLY FIXED (again). Wall slabs utilize native Bedrock cardinal placement direction traits (`minecraft:placement_direction`) to face the player upon placement.
  * **Mini Blocks**: Mini dirt places and renders as an 8x8x8 centered cube, but directional facing states remain work-in-progress.

### Asset & System Polish
* **Correct Lighting Parity (`minecraft:light_dampening: 0`)**: Directly honors the original headline v1.9 feature (*"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"*), ensuring sunlight and ambient light pass through the empty half of all wall slabs without casting harsh opaque full-block shadows.
* **Flammability Physics (`minecraft:flammable`)**: Wood wall slabs (Oak, Spruce, Birch, Jungle, Acacia, Dark Oak) now catch and burn with vanilla plank fire physics, while stone, metal, and Nether wood slabs remain fire-resistant.
* **Audio Feedback**: Added dynamic placement sound effects (`dimension.playSound`) upon slab combining, matching the block material (`use.wood`, `use.stone`, `use.deepslate`, `use.copper`, etc.) for authentic game feel.
* **Script Hardening**: Added entity validity and AABB checks to `isObstructed`, and runtime active hotbar slot re-verification inside `system.run` to safeguard survival item deduction against slot-scrolling desyncs.
* **Geometry Modernization**: Aligned `mini_block.geo.json` and `slab.geo.json` to modern Bedrock `format_version: "1.21.0"` with standardized visible bounds.
* **Packaging Tooling**: Added `tools/package.py` and `--package` flag in `tools/generate_addon.py` for automated `.mcpack` and `.mcaddon` bundle creation, shared storage deployment, and media scanner triggering.
* **Pack Icon**: Added a custom 128x128 pixel-art `pack_icon.png` illustrating oak and stone brick wall slabs alongside the mini dirt block.
* **Manifests & Localization**: Branded manifests cleanly as `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Namespace**: Resolved terrain texture collisions with vanilla cobblestone and deepslate definitions.
* **Import Stability**: Generated fresh UUIDs and bumped versioning to `1.2.0`, resolving engine "Duplicate pack detected" errors.
* **Engine Requirements**: Pinned `@minecraft/server` to stable `1.14.0` / `1.26.20` with `min_engine_version` set to `[1, 21, 0]`.

---

## Full Version History

```text
=== v1.4.0 (Bedrock Port — Creative Catalogs, Placement & Reactivity Overhaul — 2026) ===
* [Feature] Creative Inventory (+) Expandable Groups: Native integration with Bedrock Crafting Item Catalog (`crafting_item_catalog.json`). Wall Slabs, Mini Blocks, and Slabs now collapse into clean expandable (+) drawers within the Construction tab instead of cluttering the top-level menu.
* [Feature] Mini Block Combining Parity: Tapping any placed mini block with a matching mini block in hand combines them into the full vanilla block (with authentic sound and inventory deduction), matching the 2:1 craft-combining mechanic. Sneaking allows placing adjacent mini blocks without combining.
* [Feature] Improved Mini Block Placement Logic:
  - Added native `minecraft:placement_direction` (`minecraft:cardinal_direction`) traits so directional facing is tracked.
  - Added `minecraft:vertical_half` support to `minecraft:placement_position`: clicking the lower half of an adjacent block keeps the mini block grounded on the floor (Y: 0..8) instead of forcing mid-air positioning (Y: 4..12). Clicking the upper half mounts it at Y: 8..16.
  - Multi-surface attachment geometry expanded to 10 distinct bone states with accurate collision and selection boxes across floors, ceilings, and wall top/bottom halves.
* [Feature] Visual Reactivity & Particle Feedback: Bursting happy emerald sparkles (`minecraft:villager_happy`) trigger at the block center on successful combining.
* [Audio] Organic Sound Design: Added natural random pitch modulation (`pitch: 0.9..1.1`) to combining sound effects, mapped glass combining to authentic shattering audio (`random.glass`), and set Mini Dirt block sound to `dirt`.
* [Lighting] Shading & Contact Shadows: Enabled `ambient_occlusion: 1.0` and `face_dimming: true` on opaque blocks to render natural contact shadows and directional sunlight shading, while keeping glass alpha clean.
* [Feature] Creative Group Localization: Added `itemGroup.name.wall_slab` ("Wall Slabs") and `itemGroup.name.mini_block` ("Mini Blocks") to `en_US.lang`.
* [Session] Updated welcome greeting to v1.4.0.

=== v1.3.0 (Bedrock Port — The Return of Mini Blocks — 2026) ===
* [Feature] The Return of Mini Blocks: Expanded from preview to full 9-block catalog (Dirt, Cobblestone, Oak Planks, Stone, Stone Bricks, Brick, Sandstone, Obsidian, Glass).
* [Feature] Multi-Surface Mini Block Attachment: Mount mini blocks to floors, ceilings, and all 4 walls via native Bedrock `minecraft:placement_position` traits.
* [Feature] Glass Wall Slabs Restored: Originally cut in 2015 v1.5 due to MCPE 0.10 render glitches; fully restored with `render_method: "alpha_test"`, zero light dampening, and authentic breaking sounds.
* [Feature] Modern Wood Wall Slabs: Added Bamboo, Cherry, Mangrove, and Pale Oak (expanding wall slab set to 41 variants).
* [Feature] Nostalgic Session Greeting: Plays authentic one-time welcome greeting in chat on session spawn.
* [Fix] Bone Visibility Fallback: Ensured wall slabs and mini blocks render visibly in inventory UI and hand slots when direction states are unset.
* [Fix] Per-Face UV Scaling: Rewrote slab and mini block geometry UV maps from box-UV to explicit per-face coordinates, eliminating distorted textures on 16x16 tiles.
* [Fix] Survival Tool Destructibility: Added `minecraft:is_axe_item_destructible` and `minecraft:is_pickaxe_item_destructible` tags for survival tool parity.
* [Fix] Localization Loading: Added `resource_pack/texts/languages.json` ensuring custom block names load across all Bedrock game language settings.
* [Tooling] Automated Packaging: Added `tools/package.py` compiling .mcpack and .mcaddon bundles directly to Android shared storage.

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

1. Download **`MiniBlocksAddon.mcaddon`** from the release assets.
2. Open with **Minecraft** (Bedrock Edition).
3. In your world settings:
   * Activate **Mini Blocks Add-on (Resources)** under Resource Packs.
   * Activate **Mini Blocks Add-on (Behaviors)** under Behavior Packs.
   * Enable **Beta APIs** under the **Experiments** toggle.
4. Launch world.

---

**Original Author:** [@thejaustin](https://github.com/thejaustin)  
**Historical Social:** [@thejaustin on Twitter/X](https://twitter.com/thejaustin) (archived: `@thejaustin_old`)  
*Original ModPE Code Notice: Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
