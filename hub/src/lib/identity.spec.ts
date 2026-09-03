import { describe, expect, it } from 'vitest'
import { clientMark, productMarkFor, suiteMark } from './identity'

describe('suiteMark', () => {
  it('resolves a suite with only a light symbol', () => {
    const mark = suiteMark('rnp', 'RNP')
    expect(mark?.light).toBe('/suites/rnp/symbol.svg')
    expect(mark?.dark).toBeUndefined()
    expect(mark?.treatment).toBeUndefined()
  })

  it('resolves a light/dark pair', () => {
    const mark = suiteMark('metanorma', 'Metanorma')
    expect(mark?.light).toBe('/suites/metanorma/symbol.svg')
    expect(mark?.dark).toBe('/suites/metanorma/symbol-dark.svg')
  })

  it('marks dark-monochrome artwork for dark-mode inversion', () => {
    expect(suiteMark('plurimath', 'Plurimath')?.treatment).toBe('darkMono')
  })

  it('returns undefined when the suite has no symbol file', () => {
    expect(suiteMark('no-such-suite', 'Nothing')).toBeUndefined()
  })
})

describe('productMarkFor', () => {
  it('maps spoke origins to their chip marks', () => {
    expect(productMarkFor('Metanorma')?.light).toBe('/suites/metanorma/symbol.svg')
    expect(productMarkFor('PubID')?.light).toBe('/logos/pubid.svg')
  })

  it('returns undefined for unknown origins', () => {
    expect(productMarkFor('Nobody')).toBeUndefined()
  })
})

describe('clientMark', () => {
  it('prefixes /logos/ and maps the dark variant', () => {
    const mark = clientMark({ name: 'Acme', logo: 'acme.svg', logo_dark: 'acme-dark.svg' })
    expect(mark.light).toBe('/logos/acme.svg')
    expect(mark.dark).toBe('/logos/acme-dark.svg')
    expect(mark.treatment).toBeUndefined()
  })

  it('applies the large treatment where verified', () => {
    expect(clientMark({ name: 'Thunderbird', logo: 'thunderbird.svg' }).treatment).toBe('large')
  })

  it('applies the lightInk treatment to white artwork on paper', () => {
    expect(clientMark({ name: 'NGI', logo: 'ngi-zero-pet.svg' }).treatment).toBe('lightInk')
  })
})
