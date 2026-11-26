# 04 — Spoke adapters: emit the contract at build time

One integration per site stack; all adapters share the same output
generator (part of `newsmlg2-ts` or a thin `@ribose/newsml-spoke` package)
so contract logic lives in exactly one place (OCP: new spoke = config, not
new contract code).

## Common package: `@ribose/newsml-spoke`

`emitNewsml({ posts, spoke, outDir })` — takes a normalized post list
(id/date/title/authors/bodyAdoc/subjects/media/canonicalUrl), renders the
tree from 03 via `newsmlg2-ts`, writes `outDir`. Post normalization is the
only per-stack code.

## Adapters

1. **Astro integration** (`astro-integration` hook) — posts from content
   collections; runs `emitNewsml` into `dist/` at build end.
   Targets: lutaml.github.io, pubid.github.io (and future Astro spokes).
2. **Jekyll generator plugin** — a `Generator` that mirrors `_posts` into
   `news-data/` at build. Target: metanorma.org (Jekyll).
3. **CLI** — `newsml-spoke emit --posts <dir> --config spoke.yaml` for any
   other stack (reads frontmatter, AsciiDoc bodies via Asciidoctor.js for
   the XHTML rendition).

## Per-spoke config (`spoke.yaml`, committed in the spoke repo)

    id: pubid            # used in guid + provider qcode
    base: https://pubid.github.io
    lang: en
    subjects: { map: { from: categories, to: ribose-topics } }

## Pilot order (smallest first, proving each adapter type)

1. **pubid.github.io** (Astro, tiny post volume) — proves contract + Astro
   adapter + hub import end-to-end.
2. **lutaml.github.io** (Astro) — volume + zh variants (xml:lang handling).
3. **metanorma.org** (Jekyll) — proves the Jekyll generator at real scale
   (largest newsroom in the network).

## Acceptance per spoke

- `newsml.xml` + every item XSD-valid (CI gate, see 06).
- All media referenced by renditions exist (link checker).
- Spoke's own pages unchanged; output is purely additive (`/news-data/`).

## Status 2026-10-24

DONE: @riboseinc/newsml-spoke package (emit + validate + CLI, byte-stable);
pubid migrated off its bespoke emitter (output byte-identical except the
deterministic index `sent`); konneal wired with an empty feed. PENDING:
serialbench onboarding (site repo not checked out locally); metanorma and
lutaml adapters.
