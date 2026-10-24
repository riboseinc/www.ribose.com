import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

const root = path.dirname(fileURLToPath(import.meta.url))

// Pagefind writes its index into dist/ after `astro build`. The dev server
// doesn't serve dist/, so /pagefind/* 404s and search dies in dev — proxy
// those requests to the last built index.
const pagefindDevProxy = () => ({
  name: 'pagefind-dev-proxy',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url || !req.url.startsWith('/pagefind/')) return next()
      const dist = path.join(root, 'dist')
      const file = path.join(dist, path.normalize(req.url.split('?')[0]))
      if (file.startsWith(dist) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        const ext = file.split('.').pop()
        res.setHeader('Content-Type', { js: 'text/javascript', css: 'text/css', json: 'application/json', wasm: 'application/wasm' }[ext] ?? 'application/octet-stream')
        fs.createReadStream(file).pipe(res)
        return
      }
      next()
    })
  },
})

// Legacy URL equity: Jekyll-era links keep working. Post redirects are
// generated from the migrated filenames themselves (no hand-typed slugs).
// Old www.ribose.com paths verified via archive.org (CDX). Blog posts were
// /blog/YYYY/slug; sections map to their new homes.
const legacyBlog = JSON.parse(fs.readFileSync(path.join(root, 'data/legacy-blog-redirects.json'), 'utf8'))
const legacySections = {
  '/people': '/company',
  '/software': '/technologies',
  '/projects': '/technologies',
}
const postRedirects = { ...legacyBlog, ...legacySections }
for (const [dir, prefix, targetPrefix] of [
  ['src/content/posts', '/blog', '/news'],
  ['src/content/posts-zh-hant', '/zh-hant/blog', '/news/zh-hant'],
]) {
  const dirPath = path.join(root, dir)
  if (!fs.existsSync(dirPath)) continue
  for (const file of fs.readdirSync(dirPath)) {
    const base = file.replace(/\.adoc$/, '')
    const date = base.slice(0, 10)
    const rest = base.slice(11)
    postRedirects[`${prefix}/${date}/${rest}`] = `${targetPrefix}/${date}-${rest}`
    postRedirects[`/news/${date}/${rest}`] = `/news/${date}-${rest}`
    if (dir === 'src/content/posts-zh-hant') {
      postRedirects[`/news/zh-hant/${date}/${rest}`] = `/news/zh-hant/${date}-${rest}`
    }
  }
}

export default defineConfig({
  site: 'https://www.ribose.com',
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  output: 'static',
  trailingSlash: 'never',
  integrations: [vue(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ja', 'zh-hant', 'zh-hans'],
    routing: { prefixDefaultLocale: false },
  },
  redirects: {
    '/openpgp_keys': '/security',
    '/security/feedback': '/security',
    '/public_feedback': '/feedback',
    '/advisories': '/security/advisories',
    '/advisories/ra-2021-05-30': '/security/advisories/ra-2021-05-30',
    '/advisories/ra-2023-04-11': '/security/advisories/ra-2023-04-11',
    '/advisories/ra-2025-11-20': '/security/advisories/ra-2025-11-20',
    '/careers': '/company',
    '/commitments': '/company',
    '/features': '/technologies',
    '/developers': '/technologies',
    '/security/hall_of_fame': '/security/hall-of-fame',
    '/blog': '/news',
    ...postRedirects,
  },
  vite: {
    plugins: [tailwindcss(), pagefindDevProxy()],
  },
})
