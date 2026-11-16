# [0.11.1 - 1.26.x] [MOD] Mini Blocks Mod & Wall Slabs v1.2.0
### *Created by thejaustin — "Correct Lighting, & Wall Slabs can be combined!"*

---

```
   __  __ _       _   ____  _            _          __  __           _ 
  |  \/  (_)_ __ (_) | __ )| | ___   ___| | _____  |  \/  | ___   __| |
  | |\/| | | '_ \| | |  _ \| |/ _ \ / __| |/ / __| | |\/| |/ _ \ / _` |
  | |  | | | | | | | | |_) | | (_) | (__|   <\__ \ | |  | | (_) | (_| |
  |_|  |_|_|_| |_|_| |____/|_|\___/ \___|_|\_\___/ |_|  |_|\___/ \__,_|
        --- The Classic MCPE Mod by thejaustin, Reborn for Bedrock ---
```

> **MinecraftForum.net Archive: MCPE Mods Section**  
> **Original Thread:** `[0.11.1] [MOD] Mini Blocks Mod v1.9 - Wall Slabs, Correct Lighting & Auto-Updates! [by thejaustin]`  
> **Status:** Modernized for Minecraft Bedrock 1.26.x

---

```text
// =========================================================================
// Mini Blocks Mod v1.2.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// This was made for MCPE 0.11.1 ... and now reborn for Bedrock 1.26.x!
// The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!
// =========================================================================
```

### 💬 On Entering World:
```text
[Chat] Welcome back to Minecraft PE!
[Chat] You are using the Mini Blocks Mod v1.2.0!
[Chat] This Mod was created by thejaustin
[Chat] v1.2.0 Changelog: Wall Slabs can FINALLY be combined on touch controls!
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

## 📜 From MCPE 0.11.1 to Bedrock 1.26.x

Back in the golden days of MCPE 0.11.1, the **Mini Blocks Mod v1.9** introduced vertical half-block building with wall slabs, custom lighting fixes, and direction-facing code (huge shoutout to **androidKaghon**!). 

Over a decade later, we're bringing the original vision into modern native Bedrock Edition: no ModPE runtime or manual `.js` script importing required. Just double-click the `.mcaddon` and build!

---

## 🛠️ v1.2.0 Changelog & Release Notes

### ✨ Wall Slabs Can Be Combined (For Real On Touch Controls!)
* In the original `miniblocks_v1.9.bin`, wall slabs were combined by detecting the face and swapping tile IDs (`setTile(x, y, z, fullBlock)`).
* On modern Bedrock touch controls, tapping the narrow 8px back face was near impossible. 
* **v1.2.0 Fix:**
  * **Direct Merge**: Tap or right-click **any face** of a placed wall slab while holding the matching slab item to combine them into the full vanilla block!
  * **Adjacent Merge**: Placing a matching slab into the open 8px half of an existing wall slab will merge it seamlessly.
  * **Build Mode**: Crouch / sneak while placing to build adjacent slabs without merging.
  * **Survival Safe**: Fully respects Creative vs Survival mode, consumes the item from your active inventory slot, respects block protection, and checks collision boundaries so you don't suffocate yourself or mobs.

### 🧭 Directional Placement & androidKaghon Parity
* **Wall Slabs**: Fully use Bedrock's cardinal placement direction traits (`minecraft:placement_direction`). Slabs automatically face the player upon placement, honoring the original direction math credited to `androidKaghon`.
* **Mini Blocks**: Mini dirt places as a sharp 8x8x8 centered cube with custom geometry and collision. (Directional placement for mini blocks is currently work-in-progress—they're still looking where they want to look, but placement works!)

### 🎨 Iconography & Clean Pack Branding
* **Custom Pack Icon**: Added a custom 128x128 pixel-art `pack_icon.png` showcasing Oak Wall Slabs, Stone Brick Wall Slabs, and the floating Mini Dirt block. No more generic placeholder textures in world settings.
* **Manifest Polish**: Renamed packs to clear, readable titles:
  * `Mini Blocks Add-on (Behaviors)`
  * `Mini Blocks Add-on (Resources)`
* **Texture Namespace Fix**: Resolved texture key conflicts with vanilla cobblestone and deepslate terrain entries.

### 📦 Import & Engine Stability
* **Fixed "Duplicate Pack Detected"**: Regenerated fresh UUIDs and bumped versioning to `1.2.0` so Minecraft Bedrock imports cleanly without corrupting existing worlds.
* **Stable Script API**: Pinned `@minecraft/server` to `1.14.0` / `1.26.20` and set `min_engine_version` to `[1, 21, 0]` for broad compatibility across mobile, console, and desktop.
* Fixed container packing so `.mcaddon` properly wraps behavior and resource `.mcpack` files.

---

## 📋 Historical Changelog

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

=== v1.1.0 ===
* Added 36 wall slab variants across all wood and stone types.
* Added stonecutter recipes and vertical crafting recipes.
* Added Mini Dirt with 8x8x8 custom geometry.

=== v1.0.0 ===
* Initial port from ModPE to Bedrock Add-on structure.
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

Follow me on Twitter: **[@thejaustin](https://twitter.com/thejaustin)**  
*Don't steal this code! Do not take it as your own!*
