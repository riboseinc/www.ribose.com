import {
  domains as registryDomains,
  platforms as registryPlatforms,
  suites as registrySuites,
} from '@riboseinc/portfolio'

// Types live with the data (SSOT: riboseinc/portfolio).
export type { Domain, Platform, PlatformEdition, Software, Suite } from '@riboseinc/portfolio'
import type { Domain, Platform, Suite } from '@riboseinc/portfolio'

// The hub's stable query surface over the registry package; pages and
// components consume only this module, never the package directly.
export const suites: readonly Suite[] = Object.freeze([...registrySuites])
export const domains: readonly Domain[] = Object.freeze([...registryDomains])
export const platforms: readonly Platform[] = Object.freeze([...registryPlatforms])

export const suitesByDomain = (): Map<string, Suite[]> => {
  const map = new Map<string, Suite[]>()
  for (const suite of suites) {
    const bucket = map.get(suite.domain) ?? []
    bucket.push(suite)
    map.set(suite.domain, bucket)
  }
  return map
}

export const suiteById = (id: string): Suite | undefined =>
  suites.find((s) => s.id === id)

export const platformById = (id: string): Platform | undefined =>
  platforms.find((p) => p.id === id)

export const suitesOfPlatform = (platform: Platform): Suite[] =>
  platform.suites.map((id) => suiteById(id)).filter((s): s is Suite => Boolean(s))

export const platformConsumerSuites = (suite: Suite): Platform[] =>
  platforms.filter((p) => p.suites.includes(suite.id))

export const domainById = (id: string): Domain | undefined =>
  domains.find((d) => d.id === id)

export const githubOrgs = (): string[] => {
  const orgs = new Set(suites.map((s) => s.org))
  return [...orgs].sort()
}

export const stats = () => ({
  suites: suites.length,
  domains: domains.length,
  platforms: platforms.length,
  softwares: suites.reduce((n, s) => n + s.softwares.length, 0),
})
