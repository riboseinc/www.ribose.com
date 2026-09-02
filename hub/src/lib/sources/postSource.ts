// Post adapter: projects migrated blog posts onto Article.
import { posts } from '../posts'
import { SITE } from '../seo'
import type { Article, NewsSource } from '../article'

const asciidoctor = (await import('asciidoctor')).default
const adoc = asciidoctor()

export const postSource: NewsSource = {
  id: 'posts',
  articles(): Article[] {
    return posts.map((p) => ({
      urn: `urn:ribose:news:${p.slug}`,
      href: `/news/${p.lang === 'zh-hant' ? `zh-hant/` : ''}${p.slug}`,
      date: p.date,
      title: p.title,
      subheadline: p.excerpt,
      bodyHtml: adoc.convert(p.bodyAdoc, { safe: 'safe', doctype: 'book' }) as string,
      bodyAdoc: p.bodyAdoc,
      authors: [],
      origin: 'ribose.com',
      canonical: `${SITE}/news/${p.slug}`,
      lang: p.lang,
      archived: p.archived,
    }))
  },
}
