# MiniBlocksAddon

Bedrock add-on (mini blocks + wall slabs), port of the author's 2015 MCPE mod. Branch `feat/bedrock-26.50`; remote `thejaustin/MiniBlocksAddon`.

- Layout: `behavior_pack/` (blocks, scripts, loot, recipes), `resource_pack/` (models, textures), `tools/` (generators). Built `.mcaddon` is in `dist/`.
- Old path `~/miniblocks-work/MiniBlocksAddon` is a symlink here; `~/miniblocks-work/generate_addon.py` still points at it.
- Read `AI_DEVLOG.md` first for current state. Append a short entry at the end of each session.
- Stage files by name; never push without being told; CHANGELOG entries are user-facing only.
- Volume rules (keep consistent everywhere): 8 mini blocks = 1 full block, 4 mini blocks = 1 wall slab; 6/8 minis and wall slabs convert to vanilla stairs.
- Test on device by importing the `.mcaddon` into Minecraft; there is no local test harness.
