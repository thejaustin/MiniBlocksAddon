# Mini Blocks Add-on for Minecraft: Bedrock Edition
*A modern Bedrock Edition port of the classic Pocket Edition Mini Blocks Mod by thejaustin.*

```text
// =========================================================================
// Mini Blocks Mod v1.9 -> v1.2.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// Originally created for MCPE 0.10.x / 0.11.1; updated for Bedrock 1.26.x.
// Directional placement logic originally credited to androidKaghon.
// =========================================================================
```

---

## Overview

Mini Blocks brings vertical half-blocks (**Wall Slabs**) and scaled decorative blocks (**Mini Blocks**) to Minecraft: Bedrock Edition.

The mod was originally created by **thejaustin** in 2014–2015 as a ModPE JavaScript mod for Minecraft Pocket Edition (running under BlockLauncher). Following the popular v1.9 release, development ventured into an experimental **v2.0 Beta** teased on Minecraft Forum before MCPE evolved away from ModPE scripting. This modern edition rebuilds the mod as a native Bedrock add-on utilizing custom block geometry, cardinal placement direction traits, and Bedrock Script API (`@minecraft/server`) runtime behavior.

The modern Bedrock port also marks a shift in engineering workflow: moving from manual, single-file JavaScript hacking in mobile text editors to on-device AI-assisted development. Working in Termux on Android, human direction and AI pair-programming (with Antigravity) were used to automate JSON block permutations, navigate modern Bedrock schemas, and resolve low-level engine quirks.

### Core Features
* **36 Wall Slab Variants**: Full coverage across vanilla wood types (Oak, Spruce, Birch, Jungle, Acacia, Dark Oak, Crimson, Warped), stone variants (Cobblestone, Granite, Diorite, Andesite, Deepslate, Blackstone, Bricks), sandstone, quartz, and copper.
* **Interactive Slab Combining**: Tap any face or place adjacent with a matching wall slab to merge into the full block. Sneaking allows building adjacent slabs without merging.
* **Directional Placement**: Wall slabs orient automatically toward the player upon placement.
* **Mini Blocks**: 8x8x8 centered custom blocks (starting with Mini Dirt).
* **Survival & Stonecutter Parity**:
  * 3 stacked blocks in crafting grid -> 6 wall slabs.
  * 1 stone-type block in stonecutter -> 2 wall slabs.

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
* **Pack Iconography**: Added a custom 128x128 pixel-art `pack_icon.png` depicting oak and stone brick wall slabs alongside the floating mini dirt block.
* **In-Game Localization & Naming**: Standardized pack names to `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Namespace Fix**: Resolved namespace collisions with vanilla cobblestone and deepslate terrain entries.
* **UUID & Versioning**: Updated pack manifests to version `1.2.0` with fresh UUIDs, resolving engine "Duplicate pack detected" errors during import.
* **API Pinning**: Pinned `@minecraft/server` dependency to stable `1.14.0` / `1.26.20` with `min_engine_version` set to `[1, 21, 0]`.

#### Development & Tooling Evolution
* **AI-Assisted Workflow**: Shifted from manual 2015 ModPE scripting to on-device AI pair-programming via Termux. Used AI assistance (Antigravity) to generate Python block schema toolchains, diagnose server script touch events, and eliminate namespace collisions.

---

## Version History & Archive

Detailed forum archive notes and historical context can be viewed in [CHANGELOG.md](file:///data/data/com.termux/files/home/miniblocks-work/MiniBlocksAddon/CHANGELOG.md).

```text
=== v1.2.0 (Bedrock Port — 2026) ===
* [Development] Shifted from manual 2015 ModPE scripting to on-device AI-assisted engineering (pair-programmed with Antigravity via Termux) to automate schema generation, debug engine quirks, and modernize the codebase.
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
**Historical Social:** [@thejaustin on Twitter/X](https://twitter.com/thejaustin)  
*Original ModPE Code Notice: Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
