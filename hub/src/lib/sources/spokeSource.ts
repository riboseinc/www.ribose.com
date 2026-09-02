// Spoke adapter: pulls NewsML-G2 feeds from spoke sites at build time
// (cache-first) and projects their items onto Article.
import { parse as parseYaml } from 'yaml'
import { parseNewsMessage, parseNewsItem } from 'newsmlg2-ts'
import { cachedFetch } from '../cachedFetch'
import type { Article, NewsSource } from '../article'

interface SpokeSite { id: string; name: string; url: string; newsml?: string }

const registryRaw = import.meta.glob('../../../data/wire/sites.yaml', {
  eager: true, import: 'default', query: '?raw',
}) as Record<string, string>

const spokeSites = (): SpokeSite[] => {
  const raw = Object.values(registryRaw)[0] ?? ''
  const sites = (parseYaml(raw) as { sites?: SpokeSite[] }).sites ?? []
  return sites.filter((s) => s.newsml)
}

const stripHtmlWrapper = (xhtml: string): string =>
  xhtml.replace(/^\s*<html[^>]*>/, '').replace(/<\/html>\s*$/, '').trim()

export const spokeSource: NewsSource = {
  id: 'spoke',
  async articles(): Promise<Article[]> {
    const out: Article[] = []
    for (const site of spokeSites()) {
      const indexXml = await cachedFetch(site.newsml!, `newsml/${site.id}/newsml.xml`, `spoke:${site.id}`)
      if (!indexXml) continue
      let items
      try { items = parseNewsMessage(indexXml).items } catch (e) {
        console.warn(`[spoke:${site.id}] index parse failed: ${e}`); continue
      }
      for (const item of items) {
        if (!item.itemMeta.guid || item.itemMeta.pubStatus === 'withdrawn') continue
        const seg = item.itemMeta.guid.replace(/^urn:ribose:news:/, '').split(':')
        const [date, , slug] = seg
        if (!date || !slug) continue
        const dirRel = `articles/${date}-${slug}`
        const itemXml = await cachedFetch(
          `${site.url}/news-data/${dirRel}/newsml.xml`,
          `newsml/${site.id}/${dirRel}/newsml.xml`,
          `spoke:${site.id}`,
        )
        if (!itemXml) continue
        let full
        try { full = parseNewsItem(itemXml) } catch { continue }
        let bodyHtml = full.contentMeta?.bodyXhtml ? stripHtmlWrapper(full.contentMeta.bodyXhtml) : ''
        if (!bodyHtml) continue
        bodyHtml = bodyHtml.replace(/(href|src)="\/(?!\/)/g, `$1="${site.url}/`)
        out.push({
          urn: item.itemMeta.guid,
          href: `/news/${seg.join('-')}`,
          date,
          title: full.contentMeta?.headline ?? item.contentMeta?.headline ?? slug,
          subheadline: full.contentMeta?.description,
          bodyHtml,
          authors: full.contentMeta?.by ? [{ name: full.contentMeta.by }] : [],
          origin: site.name,
          canonical: full.itemMeta.canonical ?? `${site.url}/blog/${date}-${slug}`,
          lang: item.itemMeta.lang ?? 'en',
        })
      }
    }
    return out.sort((a, b) => b.date.localeCompare(a.date))
  },
}
