# Mini Blocks Add-on for Minecraft: Bedrock Edition
### *"Correct Lighting, & Wall Slabs can be combined!" — by @thejaustin*

The official modern Minecraft: Bedrock Edition successor to the classic Pocket Edition (MCPE 0.11.1) **Mini Blocks Mod v1.9** by **@thejaustin**!

```text
// =========================================================================
// Mini Blocks Mod v1.2.0 by thejaustin
// Don't steal this code! Do not take it as your own!
// This was made for MCPE 0.11.1 ... and now reborn for Bedrock 1.26.x!
// The 'Blocks turn in the direction you're facing' code was made by androidKaghon, so thanks!
// =========================================================================
```

---

## 🧱 What is Mini Blocks Add-on?

Mini Blocks brings true vertical half-block building (**Wall Slabs**) and miniature decorative blocks (**Mini Blocks**) to Minecraft Bedrock Edition!

* **36 Wall Slab Variants**: Includes every vanilla wood species (Oak, Spruce, Birch, Jungle, Acacia, Dark Oak, Crimson, Warped), stone types (Cobblestone, Granite, Diorite, Andesite, Deepslate, Blackstone, Bricks), quartz, sandstone, and copper!
* **Interactive Combining**: Tap or place matching wall slabs together to combine them into full blocks. Sneak to build adjacent without combining.
* **Directional Placement**: Wall slabs automatically orient to face the player when placed.
* **Mini Blocks**: Crisp 8x8x8 centered blocks (starting with Mini Dirt!).
* **Survival & Stonecutter Parity**:
  * 3 blocks stacked vertically in a crafting grid $\rightarrow$ 6 wall slabs.
  * 1 stone block in a stonecutter $\rightarrow$ 2 wall slabs.

---

## 📢 Release Notes & Changelog (v1.2.0)

### 🚀 Highlights in v1.2.0:
* **Wall Slabs Can Be Combined (Touch Control Overhaul)**:
  * In the original `miniblocks_v1.9.bin`, wall slabs merged when placing a matching slab into the open side.
  * In modern Minecraft Bedrock on mobile touch controls, aiming at the narrow 8px back side is frustrating.
  * **v1.2.0 Solution**:
    * **Direct Face Merge**: Tap or right-click **any face** of a placed wall slab while holding the matching slab item to combine it into the full block!
    * **Adjacent Placement Merge**: Placing a matching slab into the open half of an existing wall slab will merge it seamlessly.
    * **Build Mode**: Crouch / sneak while placing to build adjacent slabs without merging.
* **Directional Placement & androidKaghon Parity**:
  * Wall Slabs fully utilize modern Bedrock traits (`minecraft:placement_direction`), honoring the legacy direction logic credited to **androidKaghon**.
  * *(Mini block directional placement is currently work-in-progress—mini blocks place and render, but directional facing needs work!)*
* **Iconography & Clean In-Game Branding**:
  * Added custom 128x128 pixel-art `pack_icon.png` depicting classic Oak & Stone Brick Wall Slabs alongside the floating Mini Dirt block.
  * Renamed packs in world settings to `Mini Blocks Add-on (Behaviors)` and `Mini Blocks Add-on (Resources)`.
* **Import & Engine Stability**:
  * Resolved the *"Duplicate pack detected"* import brick with fresh UUIDs and `1.2.0` versioning.
  * Pinned `@minecraft/server` to stable `1.14.0` / `1.26.20` and set `min_engine_version` to `[1, 21, 0]`.
  * Fixed terrain texture collisions with vanilla cobblestone and deepslate.

### 📋 Full Version History:
For the full retro MinecraftForum thread and archive history, see [CHANGELOG.md](file:///data/data/com.termux/files/home/miniblocks-work/MiniBlocksAddon/CHANGELOG.md).

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
2. Open the file with **Minecraft** to import.
3. In your world settings:
   * Under **Resource Packs**, activate **Mini Blocks Add-on (Resources)**.
   * Under **Behavior Packs**, activate **Mini Blocks Add-on (Behaviors)**.
   * Under **Experiments**, toggle **Beta APIs** to ON.
4. Enjoy your vertical building freedom!

---

## 🛠️ Development & Building

The addon uses Python generation scripts to maintain block schemas, geometry, recipes, and script mappings:

```bash
python3 tools/generate_addon.py
```

To package the addon for distribution or device installation:
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

Follow me on Twitter: **[@thejaustin](https://twitter.com/thejaustin)**  
*Don't steal this code! Do not take it as your own!*

---
[![Co-developed with Antigravity](https://img.shields.io/badge/Co--developed%20with-Antigravity-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google)
