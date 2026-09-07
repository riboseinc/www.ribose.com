# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Source for the live Ribose corporate site **https://www.ribose.com** (staging: https://staging.ribose.com). The repo was renamed from `open.ribose.com` (2026-09); the old name redirects on GitHub.

Two sites coexist:

- **`hub/`** — the live site. Astro 7 (static output) + Vite 8 + Vue 3 islands + Tailwind 4 + pagefind search. All day-to-day work happens here.
- **Repo root** — the legacy Jekyll site (`_config.yml`, `Makefile`, `Gemfile`, `jekyll-theme-rop` + `jekyll-polyglot`). **Deprecated: do not build or redeploy it.** Its posts were *moved* into `hub/src/content/`; the Jekyll config stays only until the final cutover (TODO.impl/09) has explicit sign-off.

## Commands

Run inside `hub/` (Node 22, `npm ci`):

```
npm run dev      # astro dev server
npm run build    # astro build && pagefind --site dist
npm run preview  # serve dist/
npm run sync     # copy registry/news data from sibling repos (see Data flow)
npm test         # vitest run
```

- Single test: `npx vitest run src/lib/seo.spec.ts` (tests are co-located `src/**/*.spec.ts`).
- The root `package.json` only delegates: `npm run build` at root = `npm --prefix hub run build`. Root `make serve`/`make build` are the deprecated Jekyll path.
- Search in `npm run dev` needs a prior `npm run build`: the dev server doesn't serve `dist/`, so `astro.config.mjs` proxies `/pagefind/*` to the last built index.

## Data flow — SSOT, never edit `hub/data/`

`hub/data/` is generated. Sources of truth are sibling repos checked out next to this one:

- `platforms.yaml`, `domains.yaml`, `suites.yaml` ← `riboseinc/portfolio` (`../portfolio`)
- `wire/*` (sites registry + published news) ← `riboseinc/wire` (`../wire`)

`hub/scripts/sync-data.sh` (npm run sync) performs the copy and writes `data/PROVENANCE.md`. CI does **not** run sync — it builds from the committed `data/`. Exception: `data/audiences.yaml` and `data/clients.yaml` are hub-owned site content.

Consumption: `src/lib/registry.ts` inlines registry YAML at build time via `?raw`; `src/lib/wire.ts` implements the wire contract. `src/lib/sources/{post,spoke,wire}Source.ts` are the news source adapters.

## Architecture notes

- **News**: AsciiDoc bodies rendered at build time (`asciidoctor`); EN posts in `src/content/posts/`, zh-hant in `src/content/posts-zh-hant/` (rendered at `/news/zh-hant/…`). Feed endpoints are generated pages under `src/pages/news-data/` (`feed.xml`, `feed.json`, `newsml.xml`) plus `/news/feed.xml` — they are built from the site's news stream, not mirrored from wire publish output.
- **Redirects**: `astro.config.mjs` builds the legacy-URL map from the *migrated post filenames themselves* plus `data/legacy-blog-redirects.json` (old paths verified via archive.org CDX). Never hand-type legacy slugs — add/keep files with the `YYYY-MM-DD-slug.adoc` naming and the redirects follow.
- **i18n**: scaffold in `src/lib/i18n.ts` (en/fr/ja/zh-hant/zh-hans UI strings); localized route generation is still pending (TODO.impl/08). Astro i18n is configured with `prefixDefaultLocale: false`.
- **SEO**: all canonicals/OG/JSON-LD go through `src/lib/seo.ts`; sitemap via `@astrojs/sitemap`. Canonicals for spoke articles point at the origin site.
- **`/customers`** renders only verified claims from `data/clients.yaml`.
- Commit style: conventional prefixes (`feat:`, `fix:`, `refactor:`).

## CI/CD

- `.github/workflows/deploy.yml` — push to `main` or `staging` (plus manual triggers): `npm ci` → `npm run build` in `hub/`, then `wrangler pages deploy dist` to Cloudflare Pages project **`ribose-com`** (`--branch` = ref name, so `main` → production at www.ribose.com, `staging` → a Pages preview). Requires repo secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`. Custom domains `www.ribose.com` and `ribose.com` are attached to the project; `open.ribose.com` still points at the old CloudFront distribution as the rollback path — don't decommission the AWS side until TODO.ribose/04 (the AWS repo secrets are kept for manual-rollback redeploy until then).
- `.github/workflows/build.yml` — PRs and non-main/staging branches: build only.
- `.github/workflows/links.yml` — lychee link check on push/PR + daily cron 18:00 UTC; exclusions live in `.lycheeignore` (rate-limited hosts, upstream artifacts) — add entries there rather than editing content.
- `.github/workflows/hub-build.yml` — manual `workflow_dispatch` artifact build (pre-cutover).

## Planning docs in-repo

- `TODO.impl/01–10` — hub implementation plan; 09 records migration/cutover status.
- `TODO.import-network/01–07` — the wire/news import network plan.
