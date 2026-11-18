# Mini Blocks Mod & Wall Slabs — Changelog & Historical Archive
*Originally created by thejaustin for MCPE; updated for Minecraft: Bedrock Edition.*

---

```text
   __  __ _       _   ____  _            _          __  __           _ 
  |  \/  (_)_ __ (_) | __ )| | ___   ___| | _____  |  \/  | ___   __| |
  | |\/| | | '_ \| | |  _ \| |/ _ \ / __| |/ / __| | |\/| |/ _ \ / _` |
  | |  | | | | | | | | |_) | | (_) | (__|   <\__ \ | |  | | (_) | (_| |
  |_|  |_|_|_| |_|_| |____/|_|\___/ \___|_|\_\___/ |_|  |_|\___/ \__,_|
        --- The Classic MCPE Mod by thejaustin, Reborn for Bedrock ---
```

> **MinecraftForum.net Archive: MCPE Mods Section**  
> **Original Release Date:** January 16, 2015  
> **Original Thread:** `[0.10.x - 0.11.1] [MOD] Mini Blocks Mod - Wall Slabs, Correct Lighting & Auto-Updates! [by thejaustin]`  
> **Bedrock Edition Target:** Minecraft 1.26.x

---

### Historical Code Header (miniblocks_v1.9.bin)
```text
// =========================================================================
// Mini Blocks Mod v1.3.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// Originally made for MCPE 0.10.x / 0.11.1; updated for Bedrock 1.26.x.
// Directional placement logic originally credited to androidKaghon.
// =========================================================================
```

### Historical Client Join Chat
```text
[Chat] Welcome back to Minecraft PE!
[Chat] You are using the Mini Blocks Mod v1.2.0!
[Chat] This Mod was created by thejaustin
[Chat] v1.2.0 Changelog: Wall Slabs can be combined (FINALLY FIXED... AGAIN!)
[Chat] Directional placement: FINALLY FIXED (again)! ...Well, for wall slabs at least.
[Chat] Follow me on Twitter, @thejaustin!
```

### Historical Update Dialog (ModPE)
```text
┌─────────────────────────────────────────────────────────────────┐
│ thejaustin's Mini Blocks Mod has an update!                     │
├─────────────────────────────────────────────────────────────────┤
│ thejaustin's Mini Blocks Mod has an update!                     │
│ Do you want to update it now?                                   │
│ Current version: v1.9 / v2.0 Beta (MCPE)                        │
│ New version: v1.2.0 (Bedrock 1.26.x)                            │
│                                                                 │
│           [ Maybe Later ]         [ Update it! ]                │
└─────────────────────────────────────────────────────────────────┘
> [Mini Blocks] thejaustin's Mini Blocks Mod has been downloaded and is enabled!
```

---

## Project History: MCPE 0.10.x to Bedrock 1.26.x

The **Mini Blocks Mod** was first released to the world on **January 16, 2015** via MinecraftForum, built as a ModPE script for BlockLauncher on MCPE 0.10.x.

### Inspirations: Carpenter's Blocks, Chisels & Bits, and Little Blocks
The project grew out of three landmark modding inspirations from that era:
1. **Carpenter's Blocks (Java Edition PC by Mineshopper)**: The direct mechanical inspiration for **Wall Slabs**. Carpenter's Blocks revolutionized Minecraft building by introducing customizable architectural geometry, slopes, and vertical panels/slabs. Because mobile MCPE in 2015 had no carpenter's hammer or frame tools, Austin translated the desire for vertical half-blocks into dedicated, craftable blocks: **Wall Slabs**, crafted using 3 blocks in a vertical column (`["aba", "aba", "aba"]`), directly mirroring vanilla's horizontal slab recipe.
2. **The Little Blocks Mod (Java Edition PC by SlimeVoid / Gullibility & Vengeeur)**: Sparked the widespread dream of micro-scale detailing by fitting 512 sub-blocks in a single coordinate, inspiring the miniature decorative block scale in MCPE.
3. **Chisels & Bits (Java Edition PC by AlgorithmX2)**: Further fueled the passion for micro-voxel detailing and sub-block sculpting, proving that Minecraft builders craved precision decoration beyond full 1x1 meter cubes.

The project progressed through early experimental forum betas into GitHub releases under `thejaustin/ModPE`, introducing automatic in-game update verification, directional orientation math, and wall slab combining mechanics. Following the v1.9 release, work began on a highly anticipated **v2.0 Beta**, announced and tested on the Minecraft Forums, aiming to overhaul collision boundaries, expand the mini block catalog, and rewrite the underlying script structure. As MCPE shifted away from ModPE scripting toward native C++ and modern add-ons, v2.0 Beta remained the unfinished frontier of the mod.

### Repository Lineage: Combining `thejaustin/ModPE` & `thejaustin/MiniBlocksAddon`
Tracing the codebases across GitHub highlights how development transitioned across two primary repositories:
1. **`thejaustin/ModPE` (2015–2018) — The Original ModPE Home**:
   * **Distribution & Script Hosting**: The original JavaScript mod lived at [`thejaustin/ModPE`](https://github.com/thejaustin/ModPE), serving as both the open-source repository and the live update backend for BlockLauncher.
   * **Auto-Update Endpoint**: The in-game `AlertDialog` auto-updater polled `raw.githubusercontent.com/thejaustin/ModPE/master/MiniBlocksVersion` (which reached `v1.9`) and displayed update notifications dynamically based on `changelog` (*"Improved placement, re-wrote EVERYTHING, added ACTUAL MINI BLOCKS, removed glass wall slabs, and bug fixes."*).
   * **Companion Work**: Also hosted related ModPE experiments such as `Shards-Mod`.
2. **Repository Transition & Modern Consolidation**:
   * While an early placeholder repository ([`thejaustin/MCBedrock`](https://github.com/thejaustin/MCBedrock)) was created in May 2023 for general Bedrock experimentation, it remained inactive with only an initial commit.
   * On **December 26, 2024**, [`thejaustin/MiniBlocksAddon`](https://github.com/thejaustin/MiniBlocksAddon) was established as the dedicated repository for the Bedrock port (*"Welcome to the FUTURE of the Mini Blocks Mod! Now in Bedrock Addon form!"*).
   * Early block schemas were prepared on branch `feat/initial-addon-structure` and merged into `main` by Google Labs Jules in March 2026 (PR #1).
   * In October 2026, development continued natively on-device in Termux using Claude Code, migrating schemas to Bedrock 1.21/1.26.20 and authoring the Python generator scripts in `tools/`.
   * In November 2026, Antigravity finalized mobile touch-control combining, visual iconography, texture namespacing, and full release packaging directly on Termux over loopback ADB.

---

## Code Archaeology: The 2014–2015 ModPE Heritage

Looking under the hood of `miniblocks_v1.9.bin` reveals an authentic snapshot of early MCPE modding culture: an enthusiastic patchwork of community-shared code snippets, reverse-engineered hacks, and creative workarounds stitched together in mobile text editors.

### The "Copy Paste Edit" Modding Tradition
In true early modding tradition, development was defined by that classic **copy paste edit** workflow: discovering snippets and techniques across the forums, pasting them into a mobile code editor, tweaking and modifying them to fit what you wanted to build, and stitching them together into something brand new.

Despite the iconic top disclaimer (`"//Don't steal this code! Do not take it as your own!"`), the script was an authentic product of that copy-paste-edit era. Tracing the source code reveals the community building blocks that came together:

#### 1. Directional Facing & `findYaw()` — androidKaghon
* **Original Attribution**: `"The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!"`
* **Historical Origin**: **androidKaghon** was an active MCPE mod developer best known for creating the early *Ender Chest Mod* for MCPE 0.9.x–0.11.x. Because BlockLauncher lacked directional block states, androidKaghon developed a mathematical snippet that took player yaw (`getYaw(getPlayerEnt()) + 45`), normalized the angle within a 0°–360° range, and selected the appropriate directional block ID.
* **The Recursive Quirk**: The original `findYaw()` implementation used recursion (`yaw = yaw - 360; findYaw();`) and included a line that played the `"step.stone"` sound effect on *every* recursive iteration—meaning placement calculations literally produced subtle stone clicking sounds while normalizing the angle!

#### 2. In-Game Auto-Updater — Desno365 & 500ISE Community Patterns
* **Implementation**: The script ran an asynchronous Java thread via Rhino reflection (`java.lang.Thread`, `java.net.URL`, `ctx.runOnUiThread`), checked `raw.githubusercontent.com/.../MiniBlocksVersion`, and displayed a native Android `AlertDialog.Builder`. When accepted, it downloaded the updated script, overwrote `modscripts/Mini Blocks Mod.js`, and hot-reloaded the engine via:
  ```javascript
  net.zhuoweizhang.mcpelauncher.ScriptManager.setEnabled(modpeFile, false);
  net.zhuoweizhang.mcpelauncher.ScriptManager.setEnabled(modpeFile, true);
  ```
* **Historical Lineage**: This pattern was popularized across MinecraftForum by **Desno365** (creator of Desno's ModPE Scripts and ModPE Script Manager) and **500 Internal Server Error (500ISE)**, relying on the internal APIs exposed by **Zhuowei Zhang**'s BlockLauncher (`mcpelauncher`).

#### 3. The 52-Block ID Multiplexing Workaround
* **The Constraint**: In MCPE 0.10.x, blocks had no directional permutations or block states.
* **The Solution**: Every single wall slab required **four separate global block IDs** from Minecraft's limited 0–255 ID range to represent its four cardinal rotations:
  * Stone Wall Slab consumed IDs `249`, `248`, `242`, and `241` (plus ID `192` for combined full blocks).
  * Across 13 slab variants, the mod consumed over 52 hardcoded block IDs!
* **Combining Logic**: Full-block merging was achieved through massive chains of `if (blockId == X && itemId == Y && side == Z)` statements calling `setTile(x, y, z, fullBlockId)` and `setTile(x, y, z±1, 0)`.

---

## Tooling Archaeology: Modern Multi-Agent Git Lineage

Tracing through the repository commit history reveals how the modern Bedrock revival was constructed across multiple AI coding harnesses—built predominantly on-device in Termux:

1. **Google Labs Jules (`google-labs-jules[bot]`) — March 2026**:
   * Jules, Google Labs' autonomous repository agent, contributed commit `ebd0b68` (merged via PR #1 `358873d`), performing initial parity updates and repository alignment.
2. **Claude (Sonnet 4.6 & Opus 5.5) on Termux (Android Mobile) — October 2026**:
   * Commits `6e69987` through `72b7504` were developed directly on an Android device inside Termux using Claude Code.
   * Migrated block definitions from 1.19 to 1.21 and 1.26 schema formats, replaced deprecated placement events with modern cardinal direction traits, built initial Python generator scripts in `tools/`, and implemented early `@minecraft/server` slab-combining scripting.
   *(Any exploratory Warp terminal sessions occurred ~a year prior on older/separate project setups; the entire recent Bedrock development stack ran natively on Termux).*
3. **Antigravity on Termux (Android Mobile) — November 2026**:
   * Finalized the release directly on-device using Termux over loopback ADB. Overhauled touch-control slab merging across all faces, generated custom pixel-art iconography, fixed terrain texture namespace collisions, resolved engine UUID duplicate import issues, and completed release packaging for mobile Bedrock.

---

## v1.2.0 Release Notes (Bedrock Edition)

### Wall Slab Combining: FINALLY FIXED (again)
* **Background**: Version 1.9 of the ModPE script established the mechanic:  
  `"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"`  
  In the original implementation, placing or clicking matching slabs swapped tile IDs directly via ModPE hooks.
* **Modern Touch Control Resolution**: In Bedrock Edition on mobile touch controls, interacting with the rear 8px boundary of a placed wall slab is unreliable. In v1.2.0:
  * **Direct Merge**: Interacting with any face of an existing wall slab while holding a matching slab item combines it into the full block.
  * **Adjacent Merge**: Placing a matching slab into the open half of an existing wall slab automatically combines them.
  * **Build Mode**: Sneaking allows placing adjacent wall slabs without triggering combining.
  * **Survival Parity**: Verifies build permissions, deducts the slab from the active inventory slot, and includes entity collision checks to avoid player or mob suffocation.

### Directional Placement: FINALLY FIXED (again)... Mostly
* **Background**: Original block orientation logic was implemented using player coordinate calculations, preserved in the legacy comment:  
  `"The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!"`
* **Current Status**:
  * **Wall Slabs**: FINALLY FIXED (again). Wall slabs utilize native Bedrock cardinal placement direction traits (`minecraft:placement_direction`) to face the player upon placement.
  * **Mini Blocks**: Mini dirt places and renders as an 8x8x8 centered cube, but directional facing traits remain in development.

### Asset & System Polish
* **Correct Lighting Parity (`minecraft:light_dampening: 0`)**: Directly honors the original headline v1.9 feature (*"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"*), ensuring sunlight and ambient light pass through the empty half of all wall slabs without casting harsh opaque full-block shadows.
* **Flammability Physics (`minecraft:flammable`)**: Wood wall slabs (Oak, Spruce, Birch, Jungle, Acacia, Dark Oak) now catch and burn with vanilla plank fire physics, while stone, metal, and Nether wood slabs remain fire-resistant.
* **Audio Feedback**: Added dynamic placement sound effects (`dimension.playSound`) upon slab combining, matching the block material (`use.wood`, `use.stone`, `use.deepslate`, `use.copper`, etc.) for authentic game feel.
* **Script Hardening**: Added entity validity and AABB checks to `isObstructed`, and runtime active hotbar slot re-verification inside `system.run` to safeguard survival item deduction against slot-scrolling desyncs.
* **Geometry Modernization**: Aligned `mini_block.geo.json` and `slab.geo.json` to modern Bedrock `format_version: "1.21.0"` with standardized visible bounds.
* **Packaging Tooling**: Added `tools/package.py` and `--package` flag in `tools/generate_addon.py` for automated `.mcpack` and `.mcaddon` bundle creation, shared storage deployment, and media scanner triggering.
* **Pack Icon**: Added a custom 128x128 pixel-art `pack_icon.png` illustrating oak and stone brick wall slabs alongside the mini dirt block.
* **Manifests & Localization**: Formally branded manifests as `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Namespace**: Resolved terrain texture collisions with vanilla cobblestone and deepslate definitions.
* **Import Stability**: Generated fresh UUIDs and bumped versioning to `1.2.0`, resolving Bedrock's "Duplicate pack detected" import errors.
* **Engine Requirements**: Pinned `@minecraft/server` to stable `1.14.0` / `1.26.20` with `min_engine_version` set to `[1, 21, 0]`.

---

## Historical Version Archive

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

**Original Author:** [@thejaustin](https://github.com/thejaustin)  
**Historical Social:** [@thejaustin on Twitter/X](https://twitter.com/thejaustin) (archived: `@thejaustin_old`)  
*Original ModPE Code Notice: Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
