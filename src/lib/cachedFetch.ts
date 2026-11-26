// Cache-first HTTP fetch for build-time data imports (wire, spokes).
// LAZY: the network is touched only when the cache is missing or older
// than the TTL (or WIRE_REFRESH=1 forces a refresh). Astro instantiates
// lib modules per route, so any eager fetch is multiplied by every page;
// the on-disk cache with a fresh-enough mtime short-circuits that.
// Writes are atomic (tmp + rename) so parallel route renders never read
// a torn file; a failure writes a .miss marker shared by all renderers.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, statSync, renameSync } from 'node:fs'
import { join, dirname } from 'node:path'

const CACHE_ROOT = join(process.cwd(), '.wire-cache')
const TTL_MS = (Number(process.env.WIRE_TTL_HOURS ?? 6)) * 3600_000

const fresh = (file: string): boolean => {
  try { return Date.now() - statSync(file).mtimeMs < TTL_MS }
  catch { return false }
}

export const cachedFetch = async (
  url: string,
  cacheKey: string,
  label: string,
): Promise<string | null> => {
  const cacheFile = join(CACHE_ROOT, cacheKey)
  if (existsSync(cacheFile) && !process.env.WIRE_REFRESH && fresh(cacheFile)) {
    return readFileSync(cacheFile, 'utf8')
  }

  const missMarker = `${cacheFile}.miss`
  if (existsSync(missMarker)) return null
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    const text = await res.text()
    mkdirSync(dirname(cacheFile), { recursive: true })
    const tmp = `${cacheFile}.tmp-${process.pid}`
    writeFileSync(tmp, text)
    renameSync(tmp, cacheFile)
    rmSync(missMarker, { force: true })
    return text
  } catch {
    if (existsSync(cacheFile)) {
      console.warn(`[${label}] using cached ${cacheKey} (fetch failed)`)
      return readFileSync(cacheFile, 'utf8')
    }
    console.warn(`[${label}] no cache and fetch failed for ${cacheKey}; skipping`)
    mkdirSync(dirname(cacheFile), { recursive: true })
    writeFileSync(missMarker, '')
    return null
  }
}
