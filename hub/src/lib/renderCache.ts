// Disk-memoized AsciiDoc rendering. Astro isolates lib modules per route,
// so a module-level convert runs once per page — hundreds of thousands of
// conversions across a build. The rendered HTML depends only on the source
// text + options, so it is cached under their content hash.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs'
import { join, dirname } from 'node:path'

const CACHE_ROOT = join(process.cwd(), '.wire-cache', 'render')

export const cachedConvert = (
  asciidoctor: { convert: (src: string, opts: Record<string, unknown>) => unknown },
  namespace: string,
  source: string,
  opts: Record<string, unknown> = {},
): string => {
  const hash = createHash('sha1')
    .update(JSON.stringify(opts))
    .update(source)
    .digest('hex')
  const file = join(CACHE_ROOT, namespace, `${hash}.html`)
  if (existsSync(file)) return readFileSync(file, 'utf8')
  const html = asciidoctor.convert(source, { safe: 'safe', ...opts }) as string
  mkdirSync(dirname(file), { recursive: true })
  const tmp = `${file}.tmp-${process.pid}`
  writeFileSync(tmp, html)
  renameSync(tmp, file)
  return html
}
