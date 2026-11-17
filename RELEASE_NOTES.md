# 🧱 Mini Blocks Add-on v1.2.0 (Bedrock Edition)
### *"Correct Lighting, & Wall Slabs can be combined!" — by @thejaustin*

The official Bedrock Edition successor to the classic Pocket Edition (MCPE 0.10.x / 0.11.x) **Mini Blocks Mod** by **@thejaustin**!

```text
// =========================================================================
// Mini Blocks Mod v1.2.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// This was made for MCPE 0.10.x / 0.11.1 ... and now reborn for Bedrock 1.26.x!
// The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!
// =========================================================================
```

---

## 👋 Hey everyone! It's Austin (@thejaustin)

Over a decade ago, I released the early betas of the **Mini Blocks Mod** on MinecraftForum for MCPE 0.10.x, built on BlockLauncher and ModPE. From fighting crazy lighting glitches in the early betas (v0.1–v0.9) to releasing v1.4 on GitHub, rewriting everything in v1.5, and adding wall slab combining in v1.9... it was an unforgettable era of mobile Minecraft modding.

Today, **Mini Blocks is officially reborn for modern Minecraft Bedrock Edition!** 🎉

---

## 🚀 What's New in v1.2.0

### ✨ Wall Slabs Can Be Combined: FINALLY FIXED (again)!
* In the original `miniblocks_v1.9.bin`, the changelog famously cheered:  
  `"v1.9 Changelog: Correct Lighting, & Wall Slabs can be combined!"`
* Fast forward to Bedrock on mobile: wall slabs once again resisted combining on touch controls because tapping an invisible 8px rear plane on glass is practically impossible!
* **v1.2.0 Solution — FINALLY FIXED (again)**:
  * **Direct Face Merge**: Tap or right-click **any face** of a placed wall slab while holding the matching slab item to combine it into the full block!
  * **Adjacent Placement Merge**: Placing a matching slab into the open half of an existing wall slab will merge it seamlessly.
  * **Build Mode**: Crouch / sneak while placing to build adjacent slabs without merging.
  * **Survival Parity**: Respects block protection, deducts from active inventory slot in Survival, and includes collision checks to prevent suffocation.

### 🧭 Directional Placement: FINALLY FIXED (again)... Mostly!
* In MCPE 0.11.1, directional placement was a notorious headache until the original code noted:  
  `"The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!"`
* In Bedrock 1.26, history repeats itself:
  * **Wall Slabs**: **FINALLY FIXED (again)!** Slabs use modern Bedrock traits (`minecraft:placement_direction`) to automatically orient towards the player upon placement.
  * **Mini Blocks**: Currently reliving the classic 2015 directional bug! Mini dirt places and renders as a crisp 8x8x8 centered cube with collision, but directional facing is stubborn and looks wherever it wants until the next patch (we might need to call androidKaghon back).

### 🎨 Custom Iconography & Clean In-Game Branding
* **Custom Pack Icon**: Added custom 128x128 pixel-art `pack_icon.png` depicting classic Oak & Stone Brick Wall Slabs alongside the floating Mini Dirt block.
* **Manifest Clean-Up**: Renamed packs to `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Fix**: Resolved texture namespace collisions with vanilla cobblestone and deepslate terrain entries.

### 📦 Import & Engine Stability
* **Resolved "Duplicate Pack Detected"**: Assigned brand new UUIDs and bumped version to `1.2.0` so Bedrock imports cleanly.
* **Stable Script API**: Pinned `@minecraft/server` to `1.14.0` / `1.26.20` and set `min_engine_version` to `[1, 21, 0]` for maximum mobile and cross-platform compatibility.

---

## 📋 Full Version History & Throwback Archive

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

## 📥 How to Install

1. Download **`MiniBlocksAddon.mcaddon`** from the release assets.
2. Open with **Minecraft** (Bedrock Edition).
3. In your world settings:
   * Activate **Mini Blocks Add-on (Resources)** under Resource Packs.
   * Activate **Mini Blocks Add-on (Behaviors)** under Behavior Packs.
   * Enable **Beta APIs** under the **Experiments** toggle.
4. Enjoy vertical building freedom!

---

Follow on Twitter / X: **[@thejaustin](https://twitter.com/thejaustin)**  
GitHub: **[@thejaustin](https://github.com/thejaustin)**  
*Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
