#!/usr/bin/env bash
# Fetch the pinned PaperMod theme into themes/PaperMod (git-ignored).
# Used by CI and for local preview. Bump THEME_REF to upgrade.
#
# Pinned to a commit on master because the latest tag (v8.0) predates the
# Hugo 0.146 layout changes and fails to build on Hugo >= 0.146.
set -euo pipefail

THEME_REF="${THEME_REF:-d3768854d00ad003b0a8dbdba254ce9224377a01}"
DEST="themes/PaperMod"

rm -rf "$DEST"
git init --quiet "$DEST"
git -C "$DEST" fetch --quiet --depth 1 \
  https://github.com/adityatelange/hugo-PaperMod.git "$THEME_REF"
git -C "$DEST" checkout --quiet FETCH_HEAD
rm -rf "$DEST/.git"
echo "PaperMod $THEME_REF installed in $DEST"
