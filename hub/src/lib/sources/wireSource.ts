// Wire adapter: projects the wire publisher's output onto Article.
import { wire } from '../wire'
import { SITE } from '../seo'
import type { Article, NewsSource } from '../article'

const asciidoctor = (await import('asciidoctor')).default
const adoc = asciidoctor()

export const wireSource: NewsSource = {
  id: 'wire',
  articles(): Article[] {
    return wire().index().map((a) => {
      const full = wire().article(a)
      return {
        urn: a.id,
        href: `/news/${a.id.replace(/^urn:ribose:news:/, '').replace(/:/g, '-')}`,
        date: a.published ? a.published.slice(0, 10) : '',
        title: full.headline,
        subheadline: full.subheadline,
        bodyHtml: adoc.convert(full.bodyAdoc, { safe: 'safe' }) as string,
        bodyAdoc: full.bodyAdoc,
        authors: full.authors,
        origin: a.originSite.replace(/-/g, '.'),
        canonical: full.canonical ?? SITE,
        lang: full.language,
        media: full.media.map((m) => ({ href: m.href, alt: m.alt, credit: m.credit })),
        dateline: full.dateline,
      }
    })
  },
}
