import { describe, expect, it } from 'vitest'
import { articleKind, withStoryGrouping } from './newsIndex'
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

// One entry per story: editions sharing a `story` fold into the EN primary.
describe('withStoryGrouping', () => {
  const en = article({ href: '/news/2026-03-01-cna', title: 'CNA', story: '2026-03-01-cna' })
  const zh = article({
    href: '/news/zh-hant/2026-03-01-cna',
    title: 'CNA（繁體中文）',
    lang: 'zh-hant',
    story: '2026-03-01-cna',
    canonical: 'https://www.ribose.com/news/zh-hant/2026-03-01-cna',
  })
  const spoke = article({ href: '/news/2026-03-02-x', origin: 'PubID', story: 'urn:ribose:news:2026-03-02:pubid:x' })

  it('folds same-story language editions into the EN entry', () => {
    const out = withStoryGrouping([en, zh, spoke])
    expect(out.length).toBe(2)
    const story = out.find((a) => a.story === '2026-03-01-cna')!
    expect(story.translations).toEqual([{ lang: 'zh-hant', href: '/news/zh-hant/2026-03-01-cna' }])
  })

  it('keeps single-edition stories untouched', () => {
    const out = withStoryGrouping([spoke, article({ href: '/news/2026-03-03-solo', story: '2026-03-03-solo' })])
    expect(out.length).toBe(2)
    expect(out.every((a) => a.translations === undefined)).toBe(true)
  })

  it('keeps every edition rendered as its own page', () => {
    // allArticles (page surface) is untouched by grouping — zh pages still exist
    expect(zh.href).toBe('/news/zh-hant/2026-03-01-cna')
  })
})
