# Mini Blocks Add-on v1.2.0 (Bedrock Edition)
*A modern Bedrock Edition port of the classic Pocket Edition Mini Blocks Mod by thejaustin.*

```text
// =========================================================================
// Mini Blocks Mod v1.2.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// Originally made for MCPE 0.10.x / 0.11.1; updated for Bedrock 1.26.x.
// Directional placement logic originally credited to androidKaghon.
// =========================================================================
```

---

## Overview

Mini Blocks brings vertical half-blocks (**Wall Slabs**) and scaled decorative blocks (**Mini Blocks**) to Minecraft: Bedrock Edition. Originally developed by **thejaustin** in 2014–2015 as a ModPE script for Minecraft Pocket Edition, following the v1.9 release and subsequent **v2.0 Beta** teased on Minecraft Forum, this release modernizes the project into a native Bedrock add-on.

This release also reflects a shift in development workflow: transitioning from manual ModPE JavaScript editing on mobile a decade ago to on-device AI-assisted engineering using Termux, Python generator toolchains, and Antigravity pair-programming.

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
* **Pack Icon**: Added a custom 128x128 pixel-art `pack_icon.png` illustrating oak and stone brick wall slabs alongside the mini dirt block.
* **Manifests & Localization**: Branded manifests cleanly as `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Namespace**: Resolved terrain texture collisions with vanilla cobblestone and deepslate definitions.
* **Import Stability**: Generated fresh UUIDs and bumped versioning to `1.2.0`, resolving engine "Duplicate pack detected" errors.
* **Engine Requirements**: Pinned `@minecraft/server` to stable `1.14.0` / `1.26.20` with `min_engine_version` set to `[1, 21, 0]`.

### Tooling Evolution
* **AI-Assisted Modernization**: Shifted from manual 2015 ModPE scripting to on-device AI pair-programming via Termux. Used AI assistance (Antigravity) to generate Python block schema toolchains, diagnose server script touch events, and eliminate namespace collisions.

---

## Full Version History

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

1. Download **`MiniBlocksAddon.mcaddon`** from the release assets.
2. Open with **Minecraft** (Bedrock Edition).
3. In your world settings:
   * Activate **Mini Blocks Add-on (Resources)** under Resource Packs.
   * Activate **Mini Blocks Add-on (Behaviors)** under Behavior Packs.
   * Enable **Beta APIs** under the **Experiments** toggle.
4. Launch world.

---

**Original Author:** [@thejaustin](https://github.com/thejaustin)  
**Historical Social:** [@thejaustin on Twitter/X](https://twitter.com/thejaustin)  
*Original ModPE Code Notice: Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
