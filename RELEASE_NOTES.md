# Mini Blocks Add-on v1.2.0 (Bedrock Edition)
### *"Correct Lighting, & Wall Slabs can be combined!" — by thejaustin*

The official Bedrock Edition successor to the classic Pocket Edition (MCPE 0.11.1) **Mini Blocks Mod v1.9** by **@thejaustin**!

```text
// =========================================================================
// Mini Blocks Mod v1.2.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// This was made for MCPE 0.11.1 ... and now reborn for Bedrock 1.26.x!
// The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!
// =========================================================================
```

---

## 🚀 What's New in v1.2.0

### ✨ Wall Slabs Can Be Combined (Touch Control Overhaul)
* In the original `miniblocks_v1.9.bin`, wall slabs merged when placing a matching slab into the open side.
* In modern Minecraft Bedrock on mobile touch controls, aiming at the narrow 8px back side is frustrating.
* **v1.2.0 Solution**:
  * **Direct Face Merge**: Tap or right-click **any face** of a placed wall slab while holding the matching slab item to combine it into the full block!
  * **Adjacent Placement Merge**: Placing a matching slab into the open half of an existing wall slab will merge it seamlessly.
  * **Build Mode**: Crouch / sneak while placing to build adjacent slabs without merging.
  * **Survival Parity**: Respects block protection, deducts from active inventory slot in Survival, and includes collision checks to prevent suffocation.

### 🧭 Directional Placement & androidKaghon Shoutout
* **Wall Slabs**: Directional facing works cleanly with modern Bedrock traits (`minecraft:placement_direction`). Slabs automatically orient towards the player upon placement, carrying forward the legacy logic originally credited to **androidKaghon**.
* **Mini Blocks**: Mini dirt places as a crisp 8x8x8 centered cube with collision. *(Mini block directional placement is currently work-in-progress—they're still looking where they want to look!)*

### 🎨 Custom Iconography & Clean In-Game Branding
* **Custom Pack Icon**: Added custom 128x128 pixel-art `pack_icon.png` depicting classic Oak & Stone Brick Wall Slabs alongside the floating Mini Dirt block.
* **Manifest Clean-Up**: Renamed packs to `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Texture Fix**: Resolved texture namespace collisions with vanilla cobblestone and deepslate terrain entries.

### 📦 Import & Engine Stability
* **Resolved "Duplicate Pack Detected"**: Assigned brand new UUIDs and bumped version to `1.2.0` so Bedrock imports cleanly.
* **Stable Script API**: Pinned `@minecraft/server` to `1.14.0` / `1.26.20` and set `min_engine_version` to `[1, 21, 0]` for maximum mobile and cross-platform compatibility.

---

## 📋 Full Changelog

```text
=== v1.2.0 (Bedrock Port) ===
* [Feature] Added custom 128x128 pixel-art pack icon featuring Oak Wall Slab, Stone Brick Wall Slab & Mini Block.
* [Feature] Wall Slabs can be combined on touch controls: tap any face or place adjacent with matching slab.
* [Feature] Crouching allows placing wall slabs adjacent without combining.
* [Fix] Fixed Bedrock import failure: "Duplicate pack detected" (fresh UUIDs & 1.2.0 versioning).
* [Fix] Renamed in-game manifests to 'Mini Blocks Add-on (Behaviors)' and '(Resources)'.
* [Fix] Fixed terrain texture collisions with vanilla cobblestone and deepslate.
* [Fix] Lowered min_engine_version to [1, 21, 0] and aligned @minecraft/server to stable runtime.
* [Known Issue] Mini block directional placement needs work (mini blocks place and render, directional facing WIP).
* [Humor] Fixed raw.githubusercontent.com update check failing when airplane mode is on.
* Removed Herobrine.

=== v1.9 (MCPE 0.11.1 - The Classic ModPE Era) ===
* Correct Lighting, & Wall Slabs can be combined!
* 'Blocks turn in the direction you're facing' code by androidKaghon added!
* Added in-game update checker via raw.githubusercontent.com/thejaustin/ModPE.
* Creative inventory support for Stone, Cobble, Wood variants, Brick, Sandstone, Stone Brick, Quartz, and Glass Wall Slabs.
* Follow me on Twitter, @thejaustin!
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

Follow on Twitter: **[@thejaustin](https://twitter.com/thejaustin)**  
*Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
