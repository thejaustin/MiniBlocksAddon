# MiniBlocksAddon

Welcome to the FUTURE of the Mini Blocks Mod! Now in Bedrock Addon form! (RIP BlockLauncher AddOns... sad face emoji)

This repository contains the files for the MiniBlocks Addon for Minecraft: Bedrock Edition.

## Project Structure

The project is organized into two main parts: a resource pack and a behavior pack.

-   `resource_pack/`: Contains all the custom textures, models, sounds, and other assets for the addon.
    -   `textures/`: Holds the image files for blocks, items, etc.
    -   `texts/`: Contains localization files (e.g., `en_US.lang`).
    -   `manifest.json`: Describes the resource pack to Minecraft.
    -   `pack_icon.png`: The icon for the resource pack.
-   `behavior_pack/`: Contains the files that define the custom behaviors of blocks, items, and entities.
    -   `blocks/`: Will contain JSON files defining custom blocks.
    -   `manifest.json`: Describes the behavior pack to Minecraft and links it to the resource pack.

## How to Use

1.  **Download:** Clone or download this repository as a ZIP file.
2.  **Installation:**
    -   To use the addon, you will need to create a `.mcaddon` file.
    -   Compress the `resource_pack` and `behavior_pack` folders into a single ZIP archive.
    -   Change the file extension from `.zip` to `.mcaddon`.
    -   Open the `.mcaddon` file with Minecraft, and it will automatically install both packs.
3.  **Activate:** In your Minecraft world settings, activate both the "MiniBlocksAddon Resources" and "MiniBlocksAddon Behaviors" packs. The behavior pack should be applied to the world, and the resource pack should be active for players.

Enjoy your mini blocks!
