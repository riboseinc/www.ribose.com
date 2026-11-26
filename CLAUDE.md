# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Source for the live Ribose corporate site **https://www.ribose.com** (staging: https://staging.ribose.com). Astro 7 (static output) + Vite 8 + Vue 3 islands + Tailwind 4 + pagefind search. The legacy Jekyll site was retired at cutover (TODO.impl/09); `open.ribose.com` still points at the old AWS/CloudFront distribution as the rollback path — don't decommission the AWS side until TODO.ribose/04.

## Commands

```
npm ci           # Node 22
npm run dev      # astro dev server
npm run build    # astro build && fix-redirect-stubs && pagefind --site dist
npm run preview  # serve dist/
npm test         # vitest run
```

- Single test: `npx vitest run src/lib/seo.spec.ts` (tests are co-located `src/**/*.spec.ts`).
- Search in `npm run dev` needs a prior `npm run build`: the dev server doesn't serve `dist/`, so `astro.config.mjs` proxies `/pagefind/*` to the last built index.

## Data flow

Two package dependencies, no copied data, both pinned to git tags of sibling repos:

- `@riboseinc/portfolio` (`riboseinc/portfolio`) — the registry (platforms/domains/suites).
  Canonical `Suite`/`Domain`/`Platform` types live in the package; `src/lib/registry.ts`
  is the only module pages may import. Bump the pin when a registry tag is cut.
- `@riboseinc/wire` (`riboseinc/wire`) — published news output (`index-full.json`) and the
  sites registry, consumed by `src/lib/wire.ts` and `src/lib/sources/spokeSource.ts`.

Nothing in this repo mirrors their data. Hub-owned site content lives in `data/`:
`audiences.yaml`, `clients.yaml`, `partners.yaml`, `legacy-blog-redirects.json`.

Spoke sites (pubid, konneal, …) emit NewsML-G2 via `@riboseinc/newsml-spoke`
(`spoke.yaml` + build hook); the hub imports them at build time through the
`newsml:` URLs in the wire sites registry.

## Architecture notes

- **News**: AsciiDoc bodies rendered at build time (`asciidoctor`); EN posts in `src/content/posts/`, zh-hant in `src/content/posts-zh-hant/` (rendered at `/news/zh-hant/…`). Feed endpoints are generated pages under `src/pages/news-data/` (`feed.xml`, `feed.json`, `newsml.xml`) plus `/news/feed.xml` — they are built from the site's news stream, not mirrored from wire publish output.
- **Redirects**: `astro.config.mjs` builds the legacy-URL map from the *migrated post filenames themselves* plus `data/legacy-blog-redirects.json` (old paths verified via archive.org CDX). Never hand-type legacy slugs — add/keep files with the `YYYY-MM-DD-slug.adoc` naming and the redirects follow.
- **i18n**: scaffold in `src/lib/i18n.ts` (en/fr/ja/zh-hant/zh-hans UI strings); localized route generation is still pending (TODO.impl/08). Astro i18n is configured with `prefixDefaultLocale: false`.
- **SEO**: all canonicals/OG/JSON-LD go through `src/lib/seo.ts`; sitemap via `@astrojs/sitemap`. Canonicals for spoke articles point at the origin site.
- **Deprecation**: suites carry `deprecated: true` (or sit under a deprecated domain) in the registry; `technologies/index.astro` and `technologies/[id].astro` render the badge from the flags — no hardcoded sets.
- **`/customers`** renders only verified claims from `data/clients.yaml`.
- Commit style: conventional prefixes (`feat:`, `fix:`, `refactor:`).

## CI/CD

- `.github/workflows/deploy.yml` — push to `main` or `staging` (plus manual triggers): `npm ci` → test → build, then `wrangler pages deploy dist` to Cloudflare Pages project **`ribose-com`** (`--branch` = ref name, so `main` → production at www.ribose.com, `staging` → a Pages preview). Requires repo secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`. Custom domains `www.ribose.com` and `ribose.com` are attached to the project.
- `.github/workflows/build.yml` — PRs and non-main/staging branches: build only.
- `.github/workflows/links.yml` — lychee link check on push/PR + daily cron 18:00 UTC; exclusions live in `.lycheeignore` (rate-limited hosts, upstream artifacts) — add entries there rather than editing content.

## Planning docs in-repo

- `TODO.impl/01–10` — hub implementation plan; 09 records migration/cutover status.
- `TODO.import-network/01–07` — the wire/news import network plan.
