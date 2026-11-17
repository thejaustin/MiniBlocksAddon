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
> **Original Thread:** `[0.10.x - 0.11.1] [MOD] Mini Blocks Mod - Wall Slabs, Correct Lighting & Auto-Updates! [by thejaustin]`  
> **Bedrock Edition Target:** Minecraft 1.26.x

---

### Historical Code Header (miniblocks_v1.9.bin)
```text
// =========================================================================
// Mini Blocks Mod v1.2.0 by thejaustin
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
│ Current version: v1.9 (MCPE 0.11.1)                             │
│ New version: v1.2.0 (Bedrock 1.26.x)                            │
│                                                                 │
│           [ Maybe Later ]         [ Update it! ]                │
└─────────────────────────────────────────────────────────────────┘
> [Mini Blocks] thejaustin's Mini Blocks Mod has been downloaded and is enabled!
```

---

## Project History: MCPE 0.10.x to Bedrock 1.26.x

The **Mini Blocks Mod** was initially released during the Minecraft Pocket Edition 0.10.x and 0.11.x eras as a ModPE script for BlockLauncher. The primary focus of the mod was introducing vertical half-blocks (Wall Slabs) to overcome vanilla architectural limitations on mobile, accompanied by custom miniature decorative blocks.

The project progressed through early experimental forum betas into GitHub releases under `thejaustin/ModPE`, introducing automatic in-game update verification, directional orientation math, and wall slab combining mechanics.

This Bedrock release ports the mod's architecture from legacy ModPE JavaScript into native Bedrock components, using JSON block schemas, cardinal direction traits, and `@minecraft/server` scripting.

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
* **Pack Icon**: Added a custom 128x128 pixel-art `pack_icon.png` illustrating oak and stone brick wall slabs alongside the mini dirt block.
* **Manifests & Localization**: Formally branded manifests as `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Namespace**: Resolved terrain texture collisions with vanilla cobblestone and deepslate definitions.
* **Import Stability**: Generated fresh UUIDs and bumped versioning to `1.2.0`, resolving Bedrock's "Duplicate pack detected" import errors.
* **Engine Requirements**: Pinned `@minecraft/server` to stable `1.14.0` / `1.26.20` with `min_engine_version` set to `[1, 21, 0]`.

---

## Historical Version Archive

```text
=== v1.2.0 (Bedrock Port — 2026) ===
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

**Original Author:** [@thejaustin](https://github.com/thejaustin)  
**Historical Social:** [@thejaustin on Twitter/X](https://twitter.com/thejaustin)  
*Original ModPE Code Notice: Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
