# [0.10.x - 1.26.x] [MOD] [WIP] Mini Blocks Mod & Wall Slabs v1.2.0
### *IT LIVES! (Now with 100% less BlockLauncher crashes!)*

---

```
   __  __ _       _   ____  _            _          __  __           _ 
  |  \/  (_)_ __ (_) | __ )| | ___   ___| | _____  |  \/  | ___   __| |
  | |\/| | | '_ \| | |  _ \| |/ _ \ / __| |/ / __| | |\/| |/ _ \ / _` |
  | |  | | | | | | | | |_) | | (_) | (__|   <\__ \ | |  | | (_) | (_| |
  |_|  |_|_|_| |_|_| |____/|_|\___/ \___|_|\_\___/ |_|  |_|\___/ \__,_|
               --- Pocket Edition & Bedrock Edition ---
```

> **MinecraftForum.net Thread Archive**  
> **Posted:** November 16, 2026 | **Views:** 1,337,420 | **Replies:** 9,001  
> **Rating:** ★★★★★ (Diamond +1)

---

## 📜 Welcome Back to 2014... in 2026!

Hey everyone! 

After more than a decade since the golden era of **BlockLauncher** and ModPE `.js` scripts (RIP Zhuowei Zhang's masterpieces, you will never be forgotten 🫡), the **Mini Blocks Mod** is officially reborn as a full native Bedrock Add-on!

No more patching `.so` libraries, no more *"BlockLauncher has stopped responding"* right as you open your world, and no more texture pack ID conflicts that turn your sheep into dirt blocks!

---

## 🛠️ What's New in v1.2.0

### ✨ Features & Polished Polish:
* **Brand New Mod Iconography**:
  * Added custom 128x128 pixel-art `pack_icon.png` depicting classic oak & stone brick wall slabs alongside the iconic floating mini dirt block. No more generic blank pack icon in the pack menu!
* **Fixed Pack & Texture Names**:
  * Cleaned up in-game branding from generic identifiers to proper, polished names:
    * `Mini Blocks Add-on (Resources)`
    * `Mini Blocks Add-on (Behaviors)`
* **Touch-Friendly Wall Slab Combining**:
  * Overhauled the merge script (`behavior_pack/scripts/main.js`). You no longer need pixel-perfect desktop mouse crosshairs aiming at an invisible 8px rear face:
    * **Direct Merge**: Tap or right-click *any* face of a wall slab while holding the matching slab item to instantly combine it into the full block!
    * **Adjacent Placement Merge**: Placing a matching slab into the open side of an existing wall slab will merge it seamlessly.
    * **Build Adjacent**: Sneaking (crouching) lets you place additional slabs adjacent without merging them.
* **Bedrock Engine & UUID Modernization**:
  * Bumped manifest versions to `1.2.0` and assigned brand new UUIDs, completely resolving the infamous *"Duplicate pack detected"* import brick.
  * Pinned module dependencies to stable Bedrock Script API (`@minecraft/server 1.14.0` / `1.26.20`).
* **Stonecutter & Crafting Parity**:
  * 3 blocks in vertical column $\rightarrow$ 6 wall slabs (Crafting Table).
  * 1 stone-type block $\rightarrow$ 2 wall slabs (Stonecutter).

---

## 🐛 Known Issues & The "To-Do" List

* **Mini Blocks Directional Placement**:
  * Mini blocks place and render, but directional face placement is currently stubborn and needs work. They currently look where they want to look (we are teaching them manners in the next patch).
* **Wall Slab Combination Boundary**:
  * Entity bounding-box detection prevents merging if a player or mob is inside the block coordinate to avoid suffocation glitches.

---

## 📋 Classic Changelog

```text
=== v1.2.0 ===
* Added custom pack icon featuring Oak Wall Slab, Stone Brick Wall Slab & Mini Block.
* Renamed packs to 'Mini Blocks Add-on' in manifests and language files.
* Fixed Wall Slabs failing to combine on touch controls / mobile screens.
* Added support for merging from any slab face or adjacent placed face.
* Fixed Bedrock 1.26 engine import error: "Duplicate pack detected".
* Lowered min_engine_version to [1, 21, 0] for wide version compatibility.
* Aligned @minecraft/server version to stable runtime.
* Fixed cobblestone and deepslate terrain texture namespace collisions.
* Removed Herobrine.

=== v1.1.0 ===
* Upgraded blocks to Bedrock traits format (minecraft:placement_direction).
* Added 36 wall slab variants across all vanilla wood and stone types.
* Added stonecutter recipes for all stone variants.
* Added Mini Dirt with 8x8x8 collision box.
* Tree leaves still do not drop wall slabs.
* Removed Herobrine (again).

=== v1.0.0 ===
* Initial port from BlockLauncher / Pocket Edition to Bedrock Add-on format.
* RIP ModPE scripts.
```

---

## 📥 Installation

1. Download **`MiniBlocksAddon.mcaddon`**.
2. Open with **Minecraft**.
3. Activate both **Resource Pack** and **Behavior Pack** in World Settings.
4. Enable **Beta APIs** under the **Experiments** tab!
5. Enjoy your half-meter vertical building freedom!

---

*Don't forget to hit that **Diamond (Green +1)** button if this brought back 2014 memories!*  
*Leave your bug reports and suggestions in the thread below.*  

---
*Signature:*  
`[||||||||||||||||||||] 99% done with my castle made entirely of wall slabs`  
*Sent from my Samsung Galaxy using Tapatalk*
