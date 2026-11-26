# 09 — Migration, deploy, cutover

Status: CUTOVER DONE (2026-10-24, branch feat/cutover-hub-root): hub is the repo
root; legacy Jekyll removed; deploy via Cloudflare Pages. Deferred: legacy
`404.html`, `cves/`, `fr/`, `ja/`, `zh-hans/`, `zh-hant/`, `openpgp_keys/`
removal pending a redirect/lychee audit; AWS/CloudFront rollback stays until
TODO.ribose/04.

Done (content moved as files, never retyped; rendered via Asciidoctor):
- 79 EN posts: MOVED from _posts/ -> hub/src/content/posts/ (within this repo)
- 79 zh-hant posts: MOVED from zh-hant/_posts/ -> hub/src/content/posts-zh-hant/
  (rendered at /news/zh-hant/YYYY-MM-DD/slug/, linked from EN pages)
- Team (3), advisors (4), awards (9): COPIED verbatim from the retired
  ribosei/www.ribose.com collections (originals untouched there) into
  hub/src/content/{team,advisors,awards}/
- Hall of Fame: frontmatter (the researcher names -- the content) extracted
  mechanically to hub/src/content/hof/hall-of-fame.yaml
- Redirects: legacy pages (/about /careers /commitments /features
  /developers /security/hall_of_fame /blog) + every post URL
  (/blog/YYYY-MM-DD/slug/ and /zh-hant/blog/... -> /news/...) generated
  from the migrated filenames in astro.config.mjs
- clients.yaml claims registry: /customers renders verified claims only
  (OIML, Mozilla live; ISO/TC 211, CalConnect, IETF pending verification)
- hub-build.yml workflow: manual (workflow_dispatch) only

NOTE: the Jekyll site at the repo root no longer has its posts (they moved
into hub/). It is deprecated; do not redeploy it.

Pending (needs decisions/credentials/approval):
- Portraits and award images (need the image pipeline from the legacy repo)
- S3/CloudFront deploy wiring for hub/dist (secrets + environment)
- Cutover: move hub/* to repo root, retire Jekyll config -- explicit
  approval required (no deletions without sign-off)
- Repository rename
