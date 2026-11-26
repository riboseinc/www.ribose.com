# 10 — Open questions

Done this session:
- HTTP wire reader: HttpWireReader implemented in hub/src/lib/wire.ts
  (plain-HTTPS fetch, cache in consumer cwd, offline fallback); pages
  switch to it at cutover via WIRE_SOURCE=<url>.
- Clients registry: hub/data/clients.yaml; only verified claims render.

Still open:
- Wire item signing (IntegrityValue) rollout -- needs key decisions.
- body.md derivation (AsciiDoc -> Markdown) -- decide converter or drop.
- Remaining registry `todo:` notes (sites without URLs: riffol, nereon,
  cryptode, retrace, bacman, ammitto; edoxen canonical site).
- Claricle `powers` the Metanorma platform? (probable, unconfirmed)
- Verify claim wording for ISO/TC 211, CalConnect, IETF on /customers/.
- Legacy team portraits + award images pipeline.

## Update 2026-10-24

- cryptode: retired (`deprecated: true` in the registry; cryptode.com is dead).
- retrace, ammitto, konneal, serialbench: confirmed valid (`curated: true`).
- arrolio: valid but not yet finished.
- Site `todo:` markers remaining: riffol, nereon, retrace, bacman, ammitto,
  arrolio, edoxen (canonical URL).
- untded, oimlsmart, ommisa (client work), sasil, kaohi, hanology: deliberately
  not listed (owner decision 2026-10-23).
