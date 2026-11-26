# 07 — Rollout, cutover, and risks

## Milestones

| M | Deliverable | Gate |
|---|-------------|------|
| 1 | `newsmlg2-ts` v0.1 (parse/build subset + catalogs + conformance) | golden files + XSD CI green |
| 2 | Contract doc frozen (03); `@ribose/newsml-spoke` emits it | byte-stable, XSD-valid sample tree |
| 3 | Pilot spoke live: pubid.github.io `/news-data/` | spoke CI gate green, pages unchanged |
| 4 | Hub `NewsmlSpokeReader` behind a flag (`SPOKES=pubid`) | /news Network shows pubid articles, canonicals verified |
| 5 | lutaml + metanorma.org adapters | per-spoke acceptance from 04 |
| 6 | Default-on; spokes ping hub (`repository_dispatch`) on publish | nightly canary green for 1 week |
| 7 | Retire the interim manual sync path (if any) | — |

## Relationship to existing plans

- Supersedes the "HTTP wire reader cutover" open question in
  `TODO.impl/10` — the same cache-first fetch pattern, extended to spokes.
- Independent of `TODO.impl/09` (deploy/cutover) but lands after it: the
  import needs the hub on its real origin for canonical URLs to settle.

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| TS/Ruby drift breaks round-trip | shared golden files pinned in both CI suites (02) |
| AsciiDoc→XHTML fidelity loss on spokes without adoc rendition | adoc rendition is REQUIRED in v1; XHTML is the fallback only |
| Spoke downtime blocks builds | cache-first; strict mode only where demanded |
| guid collisions across spokes | spoke segment in guid + registry validation in hub CI |
| Content licensing for republication | network spokes are ours; origin+license footer already rendered; external feeds explicitly out of scope |
| Build-time fetch resembles the rejected prexian model | plain HTTP of static files with cache + no git/credentials; documented in 01 decision 3 |
| Scope creep into PackageItem/PlanningItem | explicitly out of v1 (02) |

## Success metrics

- Time from spoke publish → hub Network listing ≤ one hub rebuild.
- Zero manual steps to add a spoke (registry entry + adapter config).
- XSD-valid output from every spoke, every commit, forever.

## Status 2026-10-24

M1–M3 DONE (codec, contract, pubid pilot). M4 DONE differently (hub spoke
reader live un-flagged from the start). M5 PARTIAL (konneal wired; serialbench,
lutaml, metanorma pending). M6 PARTIAL (byte-stability + structural gates in
the spoke package; XSD pending). M7 PENDING.
