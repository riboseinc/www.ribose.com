# 06 — Validation, QA, and CI gates

## Per-commit (spokes)

- `newsml-spoke validate`: every emitted XML validates against the IPTC
  NewsML-G2 2.35 Power XSD (the schema set already vendored by the Ruby
  gem; reused here). Fails the spoke's build on invalid output.
- Rendition integrity: every `remoteContent` href and every media ref in
  XHTML bodies resolves to a file in the emitted tree; every article in
  the index has its full item file (bidirectional link check).
- Byte-stability: rebuild on a clean checkout of the same commit must be
  byte-identical (catches nondeterministic serialization early).

## Per-commit (hub)

- `newsmlg2-ts` conformance suite (IPTC fixtures subset + Ruby golden
  files + round-trip properties) — the pin between TS and Ruby.
- Import dry-run against committed cache snapshots: assert projected
  article counts, guid uniqueness across registry, canonical URLs are
  spoke origins, no guid collides with a wire item without `editionOf`.

## Nightly / scheduled

- `news:sync --strict` against live spokes; diffs the cache. New/changed
  items → open a tracking issue (or trigger hub rebuild via
  `repository_dispatch` per 07).
- Canary: after hub deploy, a `canary.spec` fetches three known spoke
  articles through the live /news pages and compares headlines/guids
  against the spoke's own index.

## Invariants (documented, tested)

1. The hub's Network stream is a pure projection — republished bodies are
   byte-derived from a spoke rendition, never edited.
2. Canonical URLs always point at the spoke (SEO: no duplicate-content
   self-canonicals).
3. Every displayed network badge's origin label matches the registry id.
4. Retracted/withdrawn items never serve a full body from the hub.

## Status 2026-10-24

PARTIAL: structural validation, rendition-integrity, and byte-stability gates
live in @riboseinc/newsml-spoke (`validate` command + tests). PENDING: XSD
2.35 gate (awaits newsmlg2-ts validation support); hub nightly strict sync.
