#!/usr/bin/env bash
# Builds the full website into build/site for Firebase Hosting:
#   /          the 3D developer room (web3d/)
#   /classic/  the Flutter portfolio
# Used by both GitHub Actions workflows. Run from the repository root.
set -euo pipefail

flutter pub get
flutter build web --release --base-href /classic/

rm -rf build/site
mkdir -p build/site/classic
cp -R web3d/. build/site/
rm -f build/site/README.md
cp -R build/web/. build/site/classic/

echo "Site assembled in build/site"
