import wireIndex from '@riboseinc/wire'
import { parse as parseYaml } from 'yaml'

// The wire reader contract. LocalAdapter consumes the published wire
// output inlined at build time from the @riboseinc/wire package; the
// HTTP adapter at cutover implements the same interface against the
// live news host -- pages never change.
export interface WireArticle {
  id: string; version: number; status: string; headline: string
  language: string; originSite: string; canonical: string; path: string
  published: string | null; subjects: string[]; topics: string[]
}
export interface WireArticleFull extends WireArticle {
  subheadline?: string
  bodyAdoc: string
  authors: { name: string }[]
  media: { id: string; href: string; credit?: string; alt?: string }[]
  dateline?: { place?: string; country?: string; date?: string }
}
export interface WireReader {
  index(): WireArticle[]
  article(entry: WireArticle): WireArticleFull
}

const fullIndex = wireIndex as { generatedAt: string; articles: WireArticleFull[] }
const articleByPath = new Map(fullIndex.articles.map((a) => [a.path, a]))

export class LocalWireReader implements WireReader {
  index(): WireArticle[] {
    return fullIndex.articles
  }

  article(entry: WireArticle): WireArticleFull {
    const full = articleByPath.get(entry.path)
    if (!full) throw new Error(`wire article missing for ${entry.id}`)
    return {
      ...full,
      media: full.media.map((m) => ({
        ...m,
        href: `/news-data/${entry.path.replace(/\/$/, '')}/${m.href}`.replace(/\/+/g, '/'),
      })),
    }
  }
}

export const wire = (): WireReader => new LocalWireReader()

// HTTP reader for cutover: downloads the published news files over
// plain HTTPS, caching into the consumer's working directory (the
// package never writes into itself). Pages switch to it by selecting
// `WIRE_SOURCE=<url>` at build time; rendering code is unchanged.
import { cachedFetch } from './cachedFetch'

export class HttpWireReader {
  readonly #base: string

  constructor(baseUrl: string) {
    this.#base = baseUrl.replace(/\/$/, '')
  }

  async #fetchCached(rel: string): Promise<string> {
    const body = await cachedFetch(
      `${this.#base}/${rel.replace(/^\//, '')}`,
      rel.replace(/^\//, '').replace(/\//g, '__'),
      'wire',
    )
    if (body === null) throw new Error(`wire fetch failed: ${rel}`)
    return body
  }

  async index(): Promise<WireArticle[]> {
    const parsed = JSON.parse(await this.#fetchCached('/news.json')) as { articles: WireArticle[] }
    return parsed.articles
  }

  async article(entry: WireArticle): Promise<WireArticleFull> {
    const envelope = parseYaml(await this.#fetchCached(`/${entry.path}item.yaml`)) as any
    const bodyAdoc = await this.#fetchCached(`/${entry.path}body.adoc`)
    return {
      ...entry,
      subheadline: envelope.subheadline?.content,
      bodyAdoc,
      authors: envelope.authors ?? [],
      media: (envelope.media ?? []).map((m: any) => ({
        id: m.id, href: `${this.#base}/${entry.path}${m.href}`, credit: m.credit, alt: m.altText?.content,
      })),
      dateline: envelope.dateline,
    }
  }
}
