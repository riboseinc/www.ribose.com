import { describe, expect, it } from 'vitest'
import { articleKind } from './newsIndex'
import type { Article } from './article'

const article = (over: Partial<Article>): Article => ({
  urn: 'urn:ribose:news:2026-01-01:press-x',
  href: '/news/2026-01-01-press-x',
  date: '2026-01-01',
  title: 'T',
  bodyHtml: '<p>x</p>',
  authors: [],
  origin: 'ribose.com',
  canonical: 'https://www.ribose.com/news/2026-01-01-press-x',
  lang: 'en',
  ...over,
})

// The three public streams: corporate news, product articles, platform archive.
describe('articleKind', () => {
  it('classifies ribose.com non-archived articles as news', () => {
    expect(articleKind(article({}))).toBe('news')
  })

  it('classifies spoke-origin articles as products', () => {
    expect(articleKind(article({ origin: 'Metanorma' }))).toBe('products')
    expect(articleKind(article({ origin: 'PubID' }))).toBe('products')
  })

  it('classifies archived posts as archive regardless of origin', () => {
    expect(articleKind(article({ archived: true }))).toBe('archive')
    expect(articleKind(article({ archived: true, origin: 'Metanorma' }))).toBe('archive')
  })
})
