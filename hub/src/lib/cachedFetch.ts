// Cache-first HTTP fetch for build-time data imports (wire, spokes).
// Refreshes over the network; falls back to cache when the remote is
// unreachable; returns null when neither exists. Never throws.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'

const CACHE_ROOT = join(process.cwd(), '.wire-cache')

export const cachedFetch = async (
  url: string,
  cacheKey: string,
  label: string,
): Promise<string | null> => {
  const cacheFile = join(CACHE_ROOT, cacheKey)
  let cached: string | null = null
  if (existsSync(cacheFile)) cached = readFileSync(cacheFile, 'utf8')

  // A failed URL is remembered on disk: Astro renders routes in isolated
  // module contexts (not even globalThis is shared), so in-memory memos
  // warn once per route. Filesystem state is shared across all of them.
  const missMarker = `${cacheFile}.miss`
  if (existsSync(missMarker)) return null
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    const text = await res.text()
    mkdirSync(dirname(cacheFile), { recursive: true })
    writeFileSync(cacheFile, text)
    rmSync(missMarker, { force: true })
    return text
  } catch {
    if (cached) {
      console.warn(`[${label}] using cached ${cacheKey} (fetch failed)`)
      return cached
    }
    console.warn(`[${label}] no cache and fetch failed for ${cacheKey}; skipping`)
    mkdirSync(dirname(cacheFile), { recursive: true })
    writeFileSync(missMarker, '')
    return null
  }
}
