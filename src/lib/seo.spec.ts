import { describe, expect, it } from 'vitest'
import {
  breadcrumbJsonLd,
  canonicalUrl,
  newsArticleJsonLd,
  organizationJsonLd,
  softwareJsonLd,
} from './seo'

describe('canonicalUrl', () => {
  it('resolves paths against the site origin', () => {
    expect(canonicalUrl('/platforms/metanorma')).toBe('https://www.ribose.com/platforms/metanorma')
    expect(canonicalUrl()).toBe('https://www.ribose.com/')
  })
})

describe('organizationJsonLd', () => {
  it('is a valid Organization with GitHub sameAs entries', () => {
    const org = organizationJsonLd()
    expect(org['@type']).toBe('Organization')
    expect(org.url).toBe('https://www.ribose.com')
    expect(org.sameAs.every((u: string) => u.startsWith('https://github.com/'))).toBe(true)
    expect(org.sameAs).toContain('https://github.com/riboseinc')
  })
})

describe('softwareJsonLd', () => {
  it('describes a suite with its repository and publisher', () => {
    const ld = softwareJsonLd({ name: 'RNP', tagline: 'OpenPGP', org: 'riboseinc', id: 'rnp' })
    expect(ld['@type']).toBe('SoftwareSourceCode')
    expect(ld.codeRepository).toBe('https://github.com/riboseinc')
    expect(ld.url).toBe('https://www.ribose.com/technologies/rnp')
    expect(ld.publisher.name).toBe('Ribose')
  })
})

describe('newsArticleJsonLd', () => {
  it('carries the canonical origin URL, publication date, and language', () => {
    const ld = newsArticleJsonLd({
      headline: 'Ribose wins award',
      canonical: 'https://www.metanorma.org/blog/2026-01-01-x/',
      published: '2026-01-01',
      language: 'en',
    })
    expect(ld.mainEntityOfPage).toBe('https://www.metanorma.org/blog/2026-01-01-x/')
    expect(ld.datePublished).toBe('2026-01-01')
    expect(ld.inLanguage).toBe('en')
  })

  it('omits datePublished when the date is unknown', () => {
    const ld = newsArticleJsonLd({ headline: 'H', canonical: 'https://x/', published: null, language: 'en' })
    expect('datePublished' in ld).toBe(false)
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers the trail from 1 with absolute URLs', () => {
    const ld = breadcrumbJsonLd([
      { name: 'News', path: '/news' },
      { name: 'Press', path: '/news/2026-01-01-x' },
    ])
    expect(ld.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'News', item: 'https://www.ribose.com/news' },
      { '@type': 'ListItem', position: 2, name: 'Press', item: 'https://www.ribose.com/news/2026-01-01-x' },
    ])
  })
})
