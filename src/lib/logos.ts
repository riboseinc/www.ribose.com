// Logo manifest: presence-driven. Adding a logo = dropping a file in
// public/suites/{id}/ or public/platforms/{id}/; no code changes (OCP).
//
// Conventions (light = artwork for light backgrounds, dark = for dark):
//   public/suites/{id}/symbol.svg      light-mode suite icon
//   public/suites/{id}/symbol-dark.svg dark-mode suite icon
//   public/platforms/{id}/symbol*      platform icon (cards)
//   public/platforms/{id}/logo*        platform full lockup (detail pages)

const globToMap = (files: Record<string, string>, dir: string): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const key of Object.keys(files)) {
    const id = key.split('/').at(-2)!
    map[id] = `/${dir}/${id}/${key.split('/').pop()}`
  }
  return map
}

const suiteSymbols = globToMap(import.meta.glob('../../public/suites/*/symbol.*', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>, 'suites')

const suiteSymbolsDark = globToMap(import.meta.glob('../../public/suites/*/symbol-dark.*', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>, 'suites')

// Glob patterns must be literals (variable patterns silently match nothing).
const platformSymbols = globToMap(import.meta.glob('../../public/platforms/*/symbol.*', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>, 'platforms')
const platformSymbolsDark = globToMap(import.meta.glob('../../public/platforms/*/symbol-dark.*', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>, 'platforms')
const platformFulls = globToMap(import.meta.glob('../../public/platforms/*/logo.*', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>, 'platforms')
const platformFullsDark = globToMap(import.meta.glob('../../public/platforms/*/logo-dark.*', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>, 'platforms')

export const logoFor = (suiteId: string): string | undefined => suiteSymbols[suiteId]
export const logoDarkFor = (suiteId: string): string | undefined => suiteSymbolsDark[suiteId]

export interface PlatformLogo { light: string; dark?: string }
export const platformLogoFor = (platformId: string, variant: 'symbol' | 'logo' = 'symbol'): PlatformLogo | undefined => {
  const light = variant === 'symbol' ? platformSymbols[platformId] : platformFulls[platformId]
  if (!light) return undefined
  const dark = variant === 'symbol' ? platformSymbolsDark[platformId] : platformFullsDark[platformId]
  return { light, dark }
}
