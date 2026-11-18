#!/usr/bin/env python3
"""Packaging script for MiniBlocks Addon.

Generates all add-on assets, packages them into .mcpack and .mcaddon bundles
in dist/, and synchronizes them to /storage/emulated/0/Download/ on Android.
"""

import os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, "tools"))

from generate_addon import package_addon

if __name__ == "__main__":
    package_addon()
