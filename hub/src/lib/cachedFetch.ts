// Cache-first HTTP fetch for build-time data imports (wire, spokes).
// Refreshes over the network; falls back to cache when the remote is
// unreachable; returns null when neither exists. Never throws.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
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
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    const text = await res.text()
    mkdirSync(dirname(cacheFile), { recursive: true })
    writeFileSync(cacheFile, text)
    return text
  } catch {
    if (cached) {
      console.warn(`[${label}] using cached ${cacheKey} (fetch failed)`)
      return cached
    }
    console.warn(`[${label}] no cache and fetch failed for ${cacheKey}; skipping`)
    return null
  }
}
