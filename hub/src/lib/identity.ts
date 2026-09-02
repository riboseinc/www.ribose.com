// Brand identity — the visual mark of every entity on the site: suites,
// platforms, products (spoke-site origins), clients and partners. One type,
// one resolver per entity kind, one renderer (BrandMark.astro). Adding an
// entity's identity = dropping a file in public/{suites,platforms}/, adding
// a row to PRODUCT_MARKS, or an entry in clients.yaml. Nothing else changes.
import { logoFor, logoDarkFor, platformLogoFor } from './logos'

export interface BrandMark {
  name: string
  /** path to the light-mode mark */
  light: string
  /** path to the dark-mode mark (omit if the light mark works on both) */
  dark?: string
  treatment?: 'darkMono' | 'lightInk' | 'large'
}

// ---- Suites: symbol pairs under public/suites/{id}/symbol* ----

// plurimath's mark is dark artwork with no dark variant — render it as a
// white monochrome mark in dark mode (verified against #0d1117).
const SUITE_DARK_MONO = new Set(['plurimath'])

export const suiteMark = (id: string, name: string): BrandMark | undefined => {
  const light = logoFor(id)
  if (!light) return undefined
  return {
    name,
    light,
    dark: logoDarkFor(id),
    ...(SUITE_DARK_MONO.has(id) ? { treatment: 'darkMono' as const } : {}),
  }
}

// ---- Platforms: symbols and lockups under public/platforms/{id}/ ----

export const platformMark = (
  platformId: string,
  variant: 'symbol' | 'logo' = 'symbol',
): BrandMark | undefined => {
  const pair = platformLogoFor(platformId, variant)
  if (!pair) return undefined
  return { name: platformId, light: pair.light, dark: pair.dark }
}

// ---- Products: spoke-site origins get their chip mark here ----

const PRODUCT_MARKS: Record<string, BrandMark> = {
  Metanorma: {
    name: 'Metanorma',
    light: '/suites/metanorma/symbol.svg',
    dark: '/suites/metanorma/symbol-dark.svg',
  },
  PubID: {
    name: 'PubID',
    light: '/logos/pubid.svg',
  },
  Ribose: {
    name: 'Ribose',
    light: '/brand/ribose-r.svg',
  },
}

export const productMarkFor = (origin: string): BrandMark | undefined =>
  PRODUCT_MARKS[origin]

// ---- Clients & partners: logo files under public/logos/ ----

// Verified by rendering every logo on light (#fcfcfa) and dark (#0d1117)
// backgrounds and measuring visibility. Files not listed are legible in
// both modes as-is.
// lightInk: white artwork, invisible on paper — sit on a small ink chip
//   in light mode (until a light variant exists).
// large: reads better slightly larger than the wall default.
const LIGHT_INK = new Set(['ngi-zero-pet.svg', 'expresslang.svg'])
const LARGE = new Set(['thunderbird.svg', 'ogc.svg'])

export const clientMark = (client: {
  name: string
  logo: string
  logo_dark?: string
}): BrandMark => ({
  name: client.name,
  light: `/logos/${client.logo}`,
  dark: client.logo_dark ? `/logos/${client.logo_dark}` : undefined,
  ...(LARGE.has(client.logo) ? { treatment: 'large' as const } : {}),
  ...(LIGHT_INK.has(client.logo) ? { treatment: 'lightInk' as const } : {}),
})
