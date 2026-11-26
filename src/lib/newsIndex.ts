// The deepened news index: composes all sources behind the Article
// interface and provides the queries every consumer needs. Adding a
// source = adding an adapter to the SOURCES array.
import type { Article, NewsSource } from './article'
import { wireSource } from './sources/wireSource'
import { spokeSource } from './sources/spokeSource'
import { postSource } from './sources/postSource'

const SOURCES: NewsSource[] = [wireSource, spokeSource, postSource]

export type ArticleKind = 'news' | 'products' | 'archive'

export const articleKind = (a: Article): ArticleKind => {
  if (a.archived) return 'archive'
  if (a.origin !== 'ribose.com') return 'products'
  return 'news'
}

/** all articles, newest first — including hub translation editions
 * (zh-hant pages render from this; indexes and feeds use indexArticles) */
export const allArticles = async (): Promise<Article[]> => {
  const lists = await Promise.all(SOURCES.map((s) => s.articles()))
  return lists.flat().sort((a, b) => b.date.localeCompare(a.date))
}

/** One entry per story: language editions sharing a `story` fold into
 * the primary (EN) edition as `translations`, so multilingual news
 * appears once. */
export const withStoryGrouping = (all: Article[]): Article[] => {
  const groups = new Map<string, Article[]>()
  for (const a of all) {
    const editions = groups.get(a.story) ?? []
    editions.push(a)
    groups.set(a.story, editions)
  }
  const out: Article[] = []
  for (const editions of groups.values()) {
    const primary = editions.find((e) => e.lang === 'en') ?? editions[0]
    const rest = editions.filter((e) => e !== primary)
    out.push(rest.length
      ? { ...primary, translations: rest.map((e) => ({ lang: e.lang, href: e.href })) }
      : primary)
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}

/** the index/feed surface: one entry per story (translations folded in) */
export const indexArticles = async (): Promise<Article[]> =>
  withStoryGrouping(await allArticles())

/** the public stream (excludes archive) for feeds and homepage */
export const newsStreamArticles = async (): Promise<Article[]> => {
  const all = await indexArticles()
  return all.filter((a) => !a.archived)
}
