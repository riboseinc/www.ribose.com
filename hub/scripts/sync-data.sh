#!/usr/bin/env bash
# Hub consumes wire data; it never edits it (SSOT: riboseinc/wire).
# The portfolio registry is a package dependency (@riboseinc/portfolio) — no sync.
set -euo pipefail
cd "$(dirname "$0")/.."

WIRE="${WIRE_DIR:-../wire}"

mkdir -p data/wire
cp "$WIRE"/registries/sites.yaml data/wire/
rm -rf data/wire/publish
cp -R "$WIRE"/publish data/wire/publish
# Feeds (/news-data/*, /news/feed.xml) are generated endpoints built from
# the site's news stream — they no longer mirror the wire publish output
# (which may be empty between wire releases).

echo "wire data synced from $WIRE"
