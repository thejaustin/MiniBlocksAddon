# [0.10.x - 1.26.x] [MOD] Mini Blocks Mod & Wall Slabs v1.2.0
### *Created by @thejaustin — "Correct Lighting, & Wall Slabs can be combined!"*

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
> **Status:** Officially Reborn for Minecraft Bedrock 1.26.x! 🎉

---

```text
// =========================================================================
// Mini Blocks Mod v1.2.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// This was made for MCPE 0.10.x / 0.11.1 ... and now reborn for Bedrock 1.26.x!
// The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!
// =========================================================================
```

### 💬 On Entering World:
```text
[Chat] Welcome back to Minecraft PE!
[Chat] You are using the Mini Blocks Mod v1.2.0!
[Chat] This Mod was created by thejaustin
[Chat] v1.2.0 Changelog: Wall Slabs can be combined (FINALLY FIXED... AGAIN!)
[Chat] Directional placement: FINALLY FIXED (again)! ...Well, for wall slabs at least.
[Chat] Follow me on Twitter, @thejaustin!
```

### 🔔 Update Available Dialog:
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

## 👋 Hey everyone! It's Austin (@thejaustin)

If you were playing Minecraft Pocket Edition on an Android phone back in 2014–2015, you probably remember the absolute golden age of **BlockLauncher** and ModPE `.js` scripts.

I started the **Mini Blocks Mod** back on MCPE 0.10.x because I was obsessed with vertical half-blocks. Normal slabs existed, but vertical walls were always missing from vanilla. What started as super rough beta tests with glitchy lighting and hacked block IDs turned into a massive project that thousands of builders used to detail their worlds!

Over a decade later, we are officially back. No BlockLauncher, no sketchy `.bin` file downloads, no Android memory crashes—just pure native Bedrock goodness. Let's get right into the history, the updates, and what's new!

---

## 🛠️ What's New in v1.2.0 (Bedrock Edition)

### ✨ Wall Slabs Can Be Combined: FINALLY FIXED (again)!
* In the original `miniblocks_v1.9.bin`, the changelog proudly declared:  
  `"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"`  
  Back then, it checked tile IDs and swapped them into full blocks when you clicked them.
* Fast-forward a decade into Bedrock on mobile touch controls: wall slabs once again resisted combining because tapping the narrow 8px back face of a custom block on phone glass is near impossible!
* **v1.2.0 Solution — FINALLY FIXED (again):**
  * **Direct Face Merge**: Tap or right-click **any face** of a placed wall slab while holding the matching slab item to combine it into the full block!
  * **Adjacent Placement Merge**: Placing a matching slab into the open half of an existing wall slab merges it seamlessly into the full block.
  * **Build Mode**: Crouch / sneak while placing to build adjacent slabs without merging.
  * **Survival Safe**: Fully respects Creative vs Survival mode, deducts from your active inventory slot, respects block protection, and checks collision boundaries so you don't suffocate yourself or mobs.

### 🧭 Directional Placement: FINALLY FIXED (again)... Mostly!
* Back in MCPE 0.11.1, getting blocks to face the direction you're looking was a notorious ordeal until the header famously recorded:  
  `"The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!"`
* In Bedrock 1.26, history repeats itself:
  * **Wall Slabs**: **FINALLY FIXED (again)!** Using modern Bedrock cardinal placement direction traits (`minecraft:placement_direction`), wall slabs reliably orient to face the player upon placement.
  * **Mini Blocks**: Reliving the classic 2015 directional placement struggles! Mini dirt places and renders as a crisp 8x8x8 centered cube with collision, but directional facing is still stubborn (mini blocks currently look wherever they feel like looking—we might need to call androidKaghon back).

### 🎨 Custom Iconography & Clean In-Game Branding
* **Custom Pack Icon**: Added custom 128x128 pixel-art `pack_icon.png` depicting classic Oak & Stone Brick Wall Slabs alongside the floating Mini Dirt block. No more generic placeholder textures in world settings.
* **Manifest Polish**: Renamed packs to clear, readable titles:
  * `Mini Blocks Add-on (Behaviors)`
  * `Mini Blocks Add-on (Resources)`
* **Texture Namespace Fix**: Resolved texture key conflicts with vanilla cobblestone and deepslate terrain entries.

### 📦 Import & Engine Stability
* **Fixed "Duplicate Pack Detected"**: Regenerated fresh UUIDs and bumped versioning to `1.2.0` so Minecraft Bedrock imports cleanly without corrupting existing worlds.
* **Stable Script API**: Pinned `@minecraft/server` to `1.14.0` / `1.26.20` and set `min_engine_version` to `[1, 21, 0]` for broad compatibility across mobile, console, and desktop.
* Fixed container packing so `.mcaddon` properly wraps behavior and resource `.mcpack` files.

---

## 📜 Complete Version History & Throwback Archive

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
* Added a period. 😂 It was missing! :P

=== v1.4 (GitHub Debut — January 19, 2015) ===
* First public push to the thejaustin/ModPE repository!
* Implemented MiniBlocksVersion remote update checker.
* Initial creative inventory hooks for all primary wood and stone types.

=== v1.0 — v1.3 (MCPE 0.10.x Release Era) ===
* Transitioned out of beta into full release!
* Added Sandstone, Quartz, and Brick Wall Slabs.
* Basic collision boxes matching 8px wall boundaries.

=== Early Betas: v0.1 — v0.9 (The Wild West of MCPE 0.10.0 Betas) ===
* First experimental vertical wall slab tests on MinecraftForum.net!
* Fighting crazy lighting glitches (black blocks everywhere).
* Figuring out BlockLauncher's custom block API.
* So many crashes, but the vision was born!
```

---

## 📥 Installation

1. Download **`MiniBlocksAddon.mcaddon`** (or the individual `.mcpack` files).
2. Open with **Minecraft** (Bedrock Edition).
3. In your world settings:
   * Activate **Mini Blocks Add-on (Resources)** under Resource Packs.
   * Activate **Mini Blocks Add-on (Behaviors)** under Behavior Packs.
   * Enable **Beta APIs** under the **Experiments** toggle.
4. Jump in and start building!

---

Follow me on Twitter / X: **[@thejaustin](https://twitter.com/thejaustin)**  
GitHub: **[@thejaustin](https://github.com/thejaustin)**  
*Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
