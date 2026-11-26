// Post-build fixup for Astro's static redirect stubs: they point at
// non-trailing-slash URLs (the live host 308s them) and ship without an
// <html> wrapper (pagefind warns). One pass makes both link-checker and
// pagefind quiet, without weakening either.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

let fixed = 0
for (const file of walk(dist)) {
  if (!file.endsWith('index.html')) continue
  const raw = readFileSync(file, 'utf8')
  if (!raw.includes('Redirecting to:')) continue
  const slashed = raw
    .replace(/(content="0;url=\/[^"]+?)(?<!\/)"/g, '$1/"')
    .replace(/(rel="canonical" href="https:\/\/www\.ribose\.com\/[^"]+?)(?<!\/)"/g, '$1/"')
    .replace(/(<a href="\/[^"]+?)(?<!\/)"/g, '$1/"')
  const wrapped = `<!doctype html><html lang="en"><head>${slashed
    .replace(/^<!doctype html>/i, '')
    .replace(/<body>/i, '</head><body>')
    .replace(/<\/body>/i, '')}</body></html>`
  writeFileSync(file, wrapped)
  fixed++
}
console.log(`redirect stubs fixed: ${fixed}`)
