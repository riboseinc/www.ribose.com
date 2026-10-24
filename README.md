# Ribose hub (www.ribose.com)

Astro 7 + Vite 8 + Vue islands + Tailwind 4. Builds to fully static pages.

## Architecture

- Data layer: `src/lib/registry.ts` (portfolio registries, inlined at build
  via `?raw`), `src/lib/wire.ts` (published news files, same contract the
  HTTP reader will implement at cutover). SSOT: `riboseinc/portfolio` and
  `riboseinc/wire` -- never edit `data/` here; run `npm run sync`.
- SEO: `src/lib/seo.ts` (canonicals, OG, JSON-LD: Organization+sameAs,
  SoftwareSourceCode, NewsArticle, Breadcrumbs); sitemap via integration.
- i18n scaffold: `src/lib/i18n.ts` (en/fr/ja/zh-hant/zh-hans UI strings);
  localized route generation pending (TODO.impl/08).
- News articles render AsciiDoc bodies at build time; canonical points to
  the origin site; media served from `/news-data/` (synced publish output).

## Commands

    npm run sync     # pull registries + published news from sibling repos
    npm run dev      # local dev
    npm run build    # build + pagefind index
    npm run preview  # serve dist/

## Status

Pre-cutover scaffold of the new hub inside the existing site repository.
The Jekyll site at the repository root remains authoritative until the
cutover in TODO.impl/09.
