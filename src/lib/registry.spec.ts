import { describe, expect, it } from 'vitest'
import { domains, domainById, platformById, platforms, stats, suiteById, suites } from './registry'

describe('registry (portfolio package)', () => {
  it('loads the full catalog', () => {
    const s = stats()
    expect(s.suites).toBeGreaterThanOrEqual(39)
    expect(s.domains).toBeGreaterThanOrEqual(11)
    expect(s.platforms).toBeGreaterThanOrEqual(2)
    expect(s.softwares).toBeGreaterThan(100)
  })

  it('flags retired suites', () => {
    expect(suiteById('cryptode')?.deprecated).toBe(true)
    // ribose-platform is deprecated via its domain
    expect(domainById(suiteById('ribose-platform')!.domain)?.deprecated).toBe(true)
  })

  it('resolves every platform → suite reference', () => {
    for (const p of platforms) {
      for (const id of p.suites) {
        expect(suiteById(id), `platform ${p.id} → suite ${id}`).toBeDefined()
      }
    }
  })

  it('resolves every suite → domain/powers/uses reference', () => {
    for (const s of suites) {
      expect(domainById(s.domain), `suite ${s.id} → domain ${s.domain}`).toBeDefined()
      for (const p of s.powers ?? []) {
        expect(platformById(p), `suite ${s.id} → powers ${p}`).toBeDefined()
      }
    }
  })
})
