# Mini Blocks Add-on for Minecraft: Bedrock Edition
*A modern Bedrock Edition port of the classic Pocket Edition Mini Blocks Mod by thejaustin.*

```text
// =========================================================================
// Mini Blocks Mod v1.9 -> v2.6.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// Originally created for MCPE 0.10.x / 0.11.1; updated for Bedrock 1.26.60.
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

### Core Features (v2.6.0 — Bedrock 26.60)
* **57 Auto-Connecting Wall Slab Variants**: Complete parity across all vanilla stair-family woods, stones, deepslate, tuff, mud/resin bricks, sandstone, quartz, prismarine, nether/end bricks, weathered cut copper, and seam-free Glass. Auto-connects cross-material into `inner`/`outer` corners with Wall Slabs, Vanilla Stairs, Open Trapdoors, and Wall-Mounted Mini Pillars; crouching locks straight (`locked`) and prevents combining.
* **71 Mini Blocks (57/57 Wall Slab Parity + 14 Extended Blocks)**: Exact 3D octant volume physics (`1 Full Block = 2 Wall Slabs = 8 Mini Blocks`; `1 Wall Slab = 4 Mini Blocks`; `1 Vanilla Stair = 6 Mini Blocks`).
* **Geometrically Accurate 1-by-1 Octant Combining & Synthesis**:
  * Stack Mini Blocks `1→2→3→4→5→6→7→8` one cube per tap (`pillar`, `beam`, `corner`, `step`), auto-forming real **Wall Slabs** (`4/8` vertical), real **Vanilla Stairs** (`6/8`, 53 verified variants), and **Full Vanilla Blocks** (`8/8`).
  * Build Mini Blocks directly onto matching **Wall Slabs (`4/8`)**, **Vanilla Horizontal Slabs (`4/8`)**, and **Vanilla Stair (`6/8`)** open cutouts `1` cube at a time (`4→5→6 Stairs→7→8 Full Block`) — never requiring 2 or 4 blocks at once.
  * Combine a **Wall Slab (`4/8`)** with physically non-overlapping Mini Blocks (`single 1/8 → 5/8`, `beam 2/8 → 6/8 Stairs`, `pillar 2/8 → 6/8`, `step 3/8 → 7/8`); perpendicular/overlapping shapes (horizontal slabs, `corner`, `slab_half`, `5/8`–`7/8`, stairs) never falsely merge.
* **Survival-First Economy & 848 Zero-Conflict Recipes**:
  * Breaking a Wall Slab drops **`4× Mini Blocks`** natively (mirroring vanilla double slabs); **Silk Touch** preserves **`1× Wall Slab`** intact.
  * **Sneak + Break ("Pop 1 Off")** removes `1/8` at a time from multi-cube Mini Blocks and Wall Slabs without shattering the whole block.
  * Full explosion drop conservation and `2×2` pocket-grid + Stonecutter conversions with 100% exact 8-octant volume conservation.
* **Clean Creative Menus & Vanilla Textures**: Expandable **Wall Slabs (+)** and **Mini Blocks (+)** drawers under Construction with centered icons and verified `v1.26.60.5` vanilla textures.
* **Nostalgic One-Time In-Game Greeting**: Welcome greeting on initial world join referencing the original 2015 script release.

---

## Code Archaeology: The 2014–2015 ModPE Heritage

Looking at the original `miniblocks_v1.9.bin` script reflects an authentic snapshot of early MCPE modding culture—an enthusiastic patchwork of community-shared code snippets, reverse-engineered hacks, and creative workarounds:

* **The "Copy Paste Edit" Tradition**: Despite the iconic header warning (`"//Don't steal this code! Do not take it as your own!"`), the codebase was built in that classic modding tradition of copy, paste, and edit—taking community snippets, adjusting and tweaking them, and stitching them together into new mechanics.
* **Directional Placement (`findYaw()`) & androidKaghon**: Directional math was adopted from **androidKaghon** (known for the MCPE 0.9.x–0.11.x *Ender Chest Mod*). To simulate directional facing without block states, `findYaw()` calculated player yaw (`getYaw() + 45`), normalized the angle recursively, and placed one of four discrete block IDs (complete with stone click sounds playing during recursion).
* **In-Game Auto-Updater**: The background Java thread and `AlertDialog.Builder` popup (`MiniBlocksVersion`) were adapted from community templates popularized by **Desno365** and **500ISE**, leveraging **Zhuowei Zhang**'s `net.zhuoweizhang.mcpelauncher.ScriptManager` to hot-reload scripts live.
* **The 52-Block ID Workaround**: Because MCPE 0.10.x lacked rotation permutations, every wall slab required four separate global block IDs (e.g. Stone Wall Slabs consumed IDs 249, 248, 242, and 241, plus 192 for the full block), consuming over 52 IDs across the mod.
* **Modern Bedrock Resolution**: All 52 legacy block IDs and recursive yaw calculations have been replaced with single unified identifiers using Bedrock cardinal placement direction traits and `@minecraft/server` scripting.

---

## Release Notes — v1.5.0 (Bedrock Edition)

### Key Improvements

#### Launch Crash Fix & Engine Realignment
* **Stable Block Schema (`1.21.0`)**: Normalized all block schema definitions from experimental `"1.26.20"` down to stable `"1.21.0"`, eliminating startup schema parser crashes on Bedrock 1.21 releases.
* **Engine Version Realignment**: Restored `min_engine_version` to `[1, 21, 0]` across behavior and resource manifests.
* **Experimental Catalog Removal**: Removed preview-only `crafting_item_catalog.json` (format `1.21.60`) that caused startup crashes on stable releases, relying on native, proven `menu_category` block definitions.
* **Fresh UUID Cache-Busting**: Generated fresh UUIDs across all pack headers and modules to ensure Minecraft cleanly reloads the add-on without stale or corrupted cache data.

#### Multi-Slot 8-Octant Sub-Block Tap Placement
* **True Multi-Mini-Block Grid ($2 \times 2 \times 2$)**: A single 1×1×1 coordinate space can now contain up to **8 mini blocks** simultaneously, occupying distinct 8×8×8 octants:
  * Slots 0..3: Bottom North-West, North-East, South-West, South-East.
  * Slots 4..7: Top North-West, North-East, South-West, South-East.
* **Natural Touch-Screen Tap Placement**:
  * Utilizes Bedrock `@minecraft/server` `faceLocation` tap coordinates (`x, y, z` normalized from $0.0$ to $1.0$).
  * Tapping any surface on mobile touch controls or mouse directly places the mini block into the specific quadrant/octant your finger tapped.
  * When tapping an existing mini block space, tapping an open sub-slot fills that specific quadrant immediately.
  * When tapping against an already-occupied sub-block face, it naturally steps into the adjacent sub-slot or neighbor block space along the tapped surface direction.
* **8-to-1 Full Vanilla Block Synthesis**:
  * As you place matching mini blocks into the same space, each sub-slot fills dynamically.
  * When all 8 sub-slots of the same material are filled, the block automatically transforms into the full vanilla block (e.g. 8 Mini Dirt $\rightarrow$ 1 Vanilla Dirt, 8 Mini Cobblestone $\rightarrow$ 1 Vanilla Cobblestone).
* **Survival Item Conservation & Multi-Drop**:
  * When mining a cluster with $N$ mini blocks ($1 < N \le 8$) in Survival mode, the script refunds the remaining $N - 1$ mini blocks so all placed resources are fully conserved!
* **Sub-Slot Obstruction Precision**:
  * Collision obstruction checks operate at exact 8×8×8 sub-cube bounds with epsilon tolerances, allowing players to build mini block layers beneath their feet without being falsely blocked.

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

#### Lighting, Sound & Combining Polish
* **Organic Sound Variation**: Added natural pitch modulation (`pitch: 0.9..1.1`) so placement and merging sound dynamic rather than monotonous.
* **Audio Fixes**: Mapped glass merging to glass shattering audio (`random.glass`), mapped Mini Dirt to vanilla `dirt` sounds.
* **Smooth Contact Lighting**: Enabled `ambient_occlusion: 1.0` and `face_dimming: true` on opaque blocks to render soft contact shadows and directional sunlight shading, while preserving transparent glass clarity.
* **Obstruction Tolerance**: Added a 5cm epsilon margin to `isObstructed`, ensuring players standing near adjacent block edges don't accidentally block combining.

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

Detailed forum archive notes and historical context can be viewed in [CHANGELOG.md](CHANGELOG.md).

```text
=== v2.6.0 (Bedrock 26.60 — Survival Volume Economy, 4-Mini Wall Slab Drops, Silk Touch, Sneak-Pop Undo & Vanilla Slab Synergy — 2026) ===
* [Survival/Loot] Vanilla-Consistent Wall Slab Drops + Silk Touch:
  - Added 57 native Bedrock block loot tables (`loot_tables/blocks/*_wall_slab.json`) so breaking a Wall Slab in Survival (or via explosion!) drops 4 Mini Blocks—matching vanilla double-slab economics and keeping Mini Blocks as the universal 1/8 building currency.
  - Mining a Wall Slab with Silk Touch in Survival preserves and drops 1 intact Wall Slab (respecting tool durability & Unbreaking!).
* [Survival/Sculpting] Sneak + Break ("Pop 1 Off") Undo:
  - Crouching while breaking any multi-cube Mini Block (`2/8`..`7/8`) or Wall Slab (`4/8`) removes just 1 Mini Block at a time (`7->6->5->4->3->2->1` and `Wall Slab -> 3/8 Step`) instead of shattering the whole cluster!
* [Survival/Explosions] Full Explosion Drop Conservation:
  - `world.beforeEvents.explosion` conserves exact Mini Block counts for `2/8`..`7/8` Mini Blocks destroyed by TNT/Creepers and refreshes adjacent auto-connecting Wall Slabs.
* [Feature] Vanilla Horizontal Slab (4/8) + Mini Block Combining (56 verified v1.26.60.5 slabs):
  - Tapping the open inner face of any matching Vanilla Slab (`4/8`) with 2 Mini Blocks upgrades it into the matching Vanilla Stair (`6/8`, matching top/bottom half & player facing), or fills non-stair slabs (`smooth_stone`, `cut_sandstone`) with 4 Mini Blocks into the Full Block (`8/8`).
* [Recipes] Complete Pocket-Grid (`2x2`) & Stonecutter Survival Economy (zero conflicts, zero dupes):
  - `1 Wall Slab` (2x2 shapeless) -> `4 Mini Blocks` (no Stonecutter needed for wood/field edits!)
  - `2 Wall Slabs` (`##`, 2x2) -> `1 Full Block`
  - `1 Vanilla Stair` (2x2 shapeless) -> `6 Mini Blocks`
  - `8 Mini Blocks` (3x3 hollow ring) -> `1 Full Block`
  - `1 Vanilla Horizontal Slab` (2x2 shapeless) -> `1 Wall Slab` (+ Stonecutter `1 Wall Slab -> 1 Vanilla Slab` & `1 Vanilla Slab -> 4 Mini Blocks`)
* [Geometry] Strict 3D Octant Physics & 1-by-1 Building:
  - Building Mini Blocks onto a matching Wall Slab (`4/8`), Vanilla Horizontal Slab (`4/8`), or Vanilla Stair (`6/8`) open cutout now adds 1 Mini Block per tap (`4->5->6 Stairs->7->8 Full Block`) — zero multi-item barriers and exact 3D cutout detection (`isStairOpenFace`).
  - Wall Slabs (`4/8`) combine cleanly with physically non-overlapping Mini Blocks (`single 1/8 -> 5/8`, `beam 2/8 -> 6/8 Stairs`, `pillar 2/8 -> 6/8`, `step 3/8 -> 7/8`), while rejecting perpendicular/overlapping merges (`corner`, `slab_half`, `5/8`..`7/8`, horizontal slabs, and stairs).
* [Cleanup] Hid legacy `addon:cobblestone_slab` from Creative menu & Survival recipes in favor of real vanilla `minecraft:cobblestone_slab` (kept registered for backward world compatibility).

=== v2.5.0 (Bedrock 26.60 — Mini Blocks Build Real Vanilla Stairs at 6/8 Volume! — 2026) ===
* [Feature] Complete 3D Volume Synthesis (`4 Mini = Wall Slab`, `6 Mini = Stairs`, `8 Mini = Full Block`):
  - Building a 6th Mini Block onto a 5/8 cluster automatically transforms into the real Vanilla Stair (53 verified v1.26.60.5 stair variants, facing player direction and matching floor/ceiling `upside_down_bit`!) and auto-connects adjacent Wall Slabs. Non-stair materials (Glass, Glowstone, Obsidian, Smooth Stone, etc.) use our custom 6/8 Mini Stair shape.
  - Tapping a Wall Slab's open inner face with 2 matching Mini Blocks upgrades it directly into a real Vanilla Stair (`4 + 2 = 6`, right-side-up when tapping bottom half, upside-down when tapping top half!).
  - Tapping a matching Vanilla Stair (`6/8`) with 2 Mini Blocks completes the Full Vanilla Block (`6 + 2 = 8`)!
  - Tapping a matching Vanilla Stair (`6/8`) with a Wall Slab (`4/8`) completes the Full Vanilla Block and refunds 2 Mini Blocks (`6 + 4 = 8 + 2`)!
* [Recipes] Bidirectional Mini Block <-> Vanilla Stair Recipes (443 total recipes, 0 conflicts):
  - 6 Mini Blocks in stair pattern -> 1 Vanilla Stair; 1 Vanilla Stair in Stonecutter -> 6 Mini Blocks!

=== v2.4.0 (Bedrock 26.60 — Exact 3D Volume Physics: 8 Mini Blocks = 1 Block, 4 Mini Blocks = 1 Wall Slab — 2026) ===
* [Fix/Feature] True 3D Octant Volume Conservation (`1 Full Block = 2 Wall Slabs = 8 Mini Blocks`, `1 Wall Slab = 4 Mini Blocks`):
  - Full 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 progressive mini-block building in a single space with exact multi-box 1.26.60 collisions (`slab_half` 4/8, `five` 5/8, `six` 6/8 mini stair, `seven` 7/8, and full vanilla block at 8/8!).
  - Building a 4th Mini Block onto a vertical Mini Step (`step_x`/`step_z`) transforms it directly into the real auto-connecting Wall Slab (4/8)!
  - Tapping a Wall Slab's open inner face with 4 matching Mini Blocks fills it into the full vanilla block (`4 + 4 = 8`)!
  - Tapping a 4/8..7/8 Mini Block with its matching Wall Slab (4/8) completes the full vanilla block and refunds any surplus Mini Blocks in Survival (`5+4 -> Full + 1`, `6+4 -> Full + 2`, `7+4 -> Full + 3`)!
  - Survival break conservation drops exact 1..7 Mini Blocks for every shape.
* [Recipes] Exact 1:8 / 1:4 Crafting & Stonecutter Ratios (337 recipes):
  - 2 Full Blocks (diagonal 2x2) -> 16 Mini Blocks; 1 Full Block in Stonecutter -> 8 Mini Blocks.
  - 4 Mini Blocks (2x2 square) -> 1 Wall Slab; 1 Wall Slab in Stonecutter -> 4 Mini Blocks!

=== v2.3.0 (Bedrock 26.60 — Face-Aware Building, Vertical Corner Continuity, Mini Block <-> Wall Slab Synergy & Smarter Connections — 2026) ===
* [Feature] Face-Aware Wall Slab & Floor Slab Building (Fixes classic accidental combine friction!):
  - Tapping the OPEN INNER FACE of a Wall Slab (or inner cavity of a corner) combines 2:1 into the full vanilla block—matching vanilla horizontal slab intuition and fixing the original MCPE v1.9 adjacent-block wipe bug!
  - Tapping TOP/BOTTOM stacks a matching Wall Slab directly above/below in the same facing direction.
  - Tapping LEFT/RIGHT narrow edges extends the thin wall sideways in the same facing direction—build long or tall thin walls tap-tap-tap with zero crouching!
  - Tapping BACK places flush back-to-back behind the wall.
  - Cobblestone Floor Slab gets identical face-aware combining (top of bottom / bottom of top combines; sides extend matching half).
* [Feature] Vertical Corner Continuity:
  - Stacking a Wall Slab onto Top/Bottom of an Outer Corner (1/4 post) or Inner Corner (3/4 L-wall) automatically inherits the corner shape vertically when no horizontal neighbors override it (crouch to lock straight!).
* [Feature] Mini Blocks <-> Wall Slabs Cross-Synergy:
  - Placing ANY Mini Block onto the Top, Bottom, or Side edges of ANY Wall Slab snaps it flush onto the Wall Slab's plane with zero 4px overhang!
  - Volume-conserved cross-combining (`1 Full Block = 2 Wall Slabs = 4 Mini Blocks`): tapping a Wall Slab's open face with 2 matching Mini Blocks fills it into the full block; tapping a 2-cube or 3-cube Mini Block with its matching Wall Slab completes the full block (refunding 1 Mini Block on 3+2!).
  - Wall-Mounted Mini Block Pillars connect seamlessly with adjacent Wall Slabs.
* [Feature] Smarter Neighbor Connections Beyond Stairs:
  - Added Vanilla Stair `minecraft:corner` precision checking to prevent false corners next to narrowed outer stair corners.
  - Added auto-connections to Open Vertical Trapdoors (`open_bit == true`), updating live on place, toggle, and break.

=== v2.2.0 (Bedrock 26.60 — Cross-Material + Vanilla Stair Connections & Full Stair-Family Wall Slab Expansion — 2026) ===
* [Feature] Cross-Material & Vanilla Stair Auto-Connections:
  - Wall Slabs auto-connect seamlessly across ANY material (Wood, Stone, Deepslate, Tuff, Copper, Glass, etc.) AND directly to ANY Vanilla Stair (`weirdo_direction` exact 8px back-wall alignment!).
  - Placing or breaking a Vanilla Stair next to existing Wall Slabs dynamically updates their corners (crouching while placing either a Wall Slab or Vanilla Stair prevents connection!).
* [Feature] Expanded Wall Slabs to 57 Variants (+ 100% 1:1 Mini Block Parity -> 71 Mini Blocks / 129 Total Blocks):
  - Added full Deepslate suite (Polished Deepslate, Deepslate Bricks, Deepslate Tiles), Tuff suite (Tuff, Polished Tuff, Tuff Bricks), Mud Bricks, Resin Bricks, Polished Blackstone Bricks, Prismarine suite (Prismarine, Prismarine Bricks, Dark Prismarine), and full Cut Copper weathering suite (Exposed, Weathered, Oxidized Cut Copper).
  - Added `minecraft:chest_obstruction: {obstruction_rule: "never"}` and `minecraft:redstone_conductivity: {redstone_conductor: false}` across all slabs and mini blocks so placing them above chests never blocks chests from opening.

=== v2.1.0 (Bedrock 26.60 — Auto-Connecting Wall Slab Corners & Tap-Aware Mini Block Shapes — 2026) ===
* [Feature] Auto-Connecting Wall Slab Corners (With Crouch-to-Lock Opt-Out):
  - Placing perpendicular wall slabs automatically forms seamless Inner Corners (3/4 L-wall with zero internal glass seam) and Outer Corners (1/4 vertical corner post) using exact 1.26.60 multi-box collisions.
  - Neighbors dynamically update when placing, combining, or breaking wall slabs.
  - Crouching (Sneaking) acts as the universal opt-out: prevents combining AND locks the placed wall slab straight (`addon:shape = "locked"`) so neither it nor adjacent walls deform into corners.
* [Feature] Tap-Aware Mini Block Shapes & Directions:
  - Tapping a placed mini block now grows in the exact direction you tapped:
    - Tap Up/Down on Single -> Vertical Pillar (2-high, centered or wall-mounted!)
    - Tap East/West on Single -> East-West Horizontal Beam (2-wide)
    - Tap North/South on Single -> North-South Horizontal Beam (2-wide)
    - Tap Side on Beam -> Flat L-Corner (3) | Tap Up/Down on Beam or Side on Pillar -> Vertical Mini Step / Bracket (3)
    - Tap any 3-cube shape -> Full Vanilla Block (4)
  - Subtle Action Bar feedback shows active shape/lock state on placement.
  - Full Survival break conservation across all 7 shapes (pillar/beams drop 2, corner/steps drop 3).

=== v2.0.1 (Bedrock 26.60 — Full 1:1 Slab-to-Mini-Block Material Parity — 2026) ===
* [Feature] Complete 1:1 Wall Slab -> Mini Block Parity (57 Mini Blocks total):
  - Mini Blocks now mirror all 42 Wall Slab materials FIRST in identical building order (Woods -> Stones & Bricks -> Sandstone & Quartz -> Nether, End, Copper & Glass), before extending into extra decor, lights, metals, and nature blocks.
  - Updated Mini Blocks (+) creative drawer icon to Mini Oak Planks (matching Oak Wall Slab for Wall Slabs (+)).
  - Added 24 slab-matching Mini Blocks: Mangrove, Crimson, Warped Planks; Smooth Stone, Mossy Cobblestone, Mossy Stone Bricks, Granite, Polished Granite, Diorite, Polished Diorite, Andesite, Polished Andesite; Cut/Smooth Sandstone, Red/Cut Red/Smooth Red Sandstone, Smooth Quartz; Nether Brick, Red Nether Brick, Polished Blackstone, End Stone Brick, Purpur Block, and Cut Copper.
  - Exported `WALL_SLAB_TO_MINI_BLOCK` in `slab_map.js` (42/42 complete mapping) to power upcoming Chisel/Handsaw carving tools.

=== v2.0.0 (Bedrock 26.60 — Full 1.26.60 Modernization, Expandable Creative Groups, 33 Mini Blocks & Smart Placement — 2026) ===
* [Update] Bedrock 26.60 Native Target: Upgraded min_engine_version to [1, 26, 60], block schemas to 1.26.60 (array collision_box, liquid_detection waterlogging, item_visual, destruction_particles), crafting_item_catalog to 1.26.50, and @minecraft/server to stable 2.11.0.
* [Feature] Expandable Creative Menu (+) Groups: Properly namespaced Crafting Item Catalog (`addon:itemGroup.name.wall_slab` & `addon:itemGroup.name.mini_block`) consolidates all 42 Wall Slabs and 33 Mini Blocks into clean collapsible (+) drawers in Construction without duplicating loose items.
* [Feature] Smart Directional Wall Slab Placement & Combining:
  - Tapping any horizontal wall face (N/S/E/W) snaps the wall slab flush against that wall face!
  - Tapping floor/ceiling places facing player direction via native minecraft:placement_direction + minecraft:transformation (rotates geometry, collision, and selection together with zero axis mismatch).
  - Tapping a matching wall slab (or adjacent face pointing into one) combines 2 halves into the full vanilla block; sneak to place adjacent thin walls.
  - Added Acacia Wall Slab (42 total variants) and top/bottom placement to Cobblestone Floor Slab.
* [Feature] Extended & Improved Mini Blocks (33 Variants + Progressive Stacking):
  - Expanded from 9 to 33 iconic mini blocks: Nature (multi-face Grass Block with biome tinting, Dirt, Moss, Sand), all Overworld Woods, Stones & Masonry (Stone, Cobblestone, Stone Bricks, Brick, multi-face Sandstone & Quartz, Cobbled Deepslate, Blackstone, Tuff Bricks, Obsidian), Glass, Functional Mini Lights (Glowstone & Sea Lantern with real light_emission: 15!), multi-face Bookshelf, and Metals/Gems (Iron, Gold, Diamond, Emerald, Copper, Amethyst).
  - Multi-surface attachment: mounts cleanly to floor, ceiling, and all 4 walls (bottom & top halves).
  - Progressive 1 -> 2 -> 3 -> Full Block stacking in a single space with accurate multi-box 1.26.60 collision boxes and Survival drop conservation.
  - 2x2-grid friendly diagonal crafting recipe (2 blocks -> 8 mini blocks) + stonecutter (1 -> 4).
* [Fix] Icons & Textures Overhaul:
  - Removed placeholder "D" and "C" PNGs so Dirt and Cobblestone use authentic vanilla textures (and automatically respect user texture packs!).
  - Replaced broken box-UV mapping on mini blocks with explicit per-face 16x16 UVs and multi-face material instances.
  - Added minecraft:item_visual with centered geometry.wall_slab_icon and vibrant carried Grass Block textures so every inventory/hotbar/creative icon renders crisply and centered.
  - Fixed invalid "dirt" block sound -> vanilla "gravel", plus accurate cherry_wood, bamboo_wood, moss_block, tuff_bricks, iron, metal, and amethyst_block sounds.

=== v1.5.1 (Bedrock Port — Launch Crash Fix & Bulletproof Schema Parity — 2026) ===
* [Fix] Launch Crash Resolution: Fixed startup crash on Minecraft Bedrock by strictly adhering to valid vanilla creative item groups (minecraft:itemGroup.name.slab for wall slabs; top-level category registration without custom item groups for mini blocks).
* [Fix] Custom States & Permutations: Removed unmapped block states without permutations from block definitions to guarantee 100% schema compliance across all Bedrock engine releases.
* [Fix] Standardized Geometry Schemas: Realigned block model geometry format versions to stable 1.12.0 format.
* [Feature] Bulletproof Touch Combining: Direct tap combining for both wall slabs and mini blocks into full vanilla blocks via robust Script API event handling.
* [Session] Fresh UUIDs across manifests and updated in-game welcome message to v1.5.1.

=== v1.5.0 (Bedrock Port — Multi-Slot Sub-Block Placement & Touch Combining — 2026) ===
* [Fix] Launch Crash Resolution: Fixed unhandled startup crash on stable Bedrock by normalizing block schema format_version from experimental "1.26.20" to stable "1.21.0", restoring min_engine_version to [1, 21, 0], removing experimental crafting_item_catalog.json (unsupported in <1.21.60), and issuing fresh pack UUIDs to bust corrupted engine cache.
* [Fix] Canonical Molang State Queries: Standardized bone visibility queries to strict `query.block_state('...') == true / false`, eliminating parser faults.
* [Feature] 8-Octant Sub-Slot Geometry: Divided each mini block into an 8-sub-cube (2×2×2) octant grid filling the 16×16×16 coordinate space, with dedicated `slot_0` through `slot_7` bone definitions and fallback UI preview bone.
* [Feature] Natural Touch Tap Placement: Integrated `faceLocation` tap coordinates from Bedrock `@minecraft/server`. Tapping any block surface on mobile touch controls or mouse directly places the mini block into the exact sub-slot targeted by the player's touch.
* [Feature] Multi-Mini-Blocks in Single Space: Up to 8 mini blocks can now inhabit the same 1×1×1 block coordinate simultaneously. Tapping an open sub-slot adds to the cluster.
* [Feature] 8-to-1 Full Vanilla Block Synthesis: Filling all 8 sub-slots of the same material automatically transforms into the full vanilla block (e.g. 8 Mini Dirt -> Vanilla Dirt).
* [Feature] Survival Multi-Drop Conservation: Mining a multi-mini-block cluster in Survival mode drops all constituent mini blocks (refunding remaining N - 1 items via script).
* [Session] Updated welcome greeting to v1.5.0.

=== v1.4.0 (Bedrock Port — Creative Catalogs, Placement & Reactivity Overhaul — 2026) ===
* [Feature] Creative Inventory (+) Expandable Groups: Native integration with Bedrock Crafting Item Catalog (`crafting_item_catalog.json`). Wall Slabs, Mini Blocks, and Slabs now collapse into clean expandable (+) drawers within the Construction tab instead of cluttering the top-level menu.
* [Feature] Mini Block Combining Parity: Tapping any placed mini block with a matching mini block in hand combines them into the full vanilla block (with authentic sound and inventory deduction), matching the 2:1 craft-combining mechanic. Sneaking allows placing adjacent mini blocks without combining.
* [Feature] Improved Mini Block Placement Logic:
  - Added native `minecraft:placement_direction` (`minecraft:cardinal_direction`) traits so directional facing is tracked.
  - Added `minecraft:vertical_half` support to `minecraft:placement_position`: clicking the lower half of an adjacent block keeps the mini block grounded on the floor (Y: 0..8) instead of forcing mid-air positioning (Y: 4..12). Clicking the upper half mounts it at Y: 8..16.
  - Multi-surface attachment geometry expanded to 10 distinct bone states with accurate collision and selection boxes across floors, ceilings, and wall top/bottom halves.
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
