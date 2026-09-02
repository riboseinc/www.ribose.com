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

/** all articles, newest first */
export const allArticles = async (): Promise<Article[]> => {
  const lists = await Promise.all(SOURCES.map((s) => s.articles()))
  return lists.flat().sort((a, b) => b.date.localeCompare(a.date))
}

/** the public stream (excludes archive) for feeds and homepage */
export const newsStreamArticles = async (): Promise<Article[]> => {
  const all = await allArticles()
  return all.filter((a) => !a.archived)
}

/** articles by kind, for filter chips */
export const byKind = async (kind: ArticleKind): Promise<Article[]> =>
  (await allArticles()).filter((a) => articleKind(a) === kind)

/** one article by its URL path segment, for getStaticPaths */
export const byHref = async (href: string): Promise<Article | undefined> =>
  (await allArticles()).find((a) => a.href === href)
