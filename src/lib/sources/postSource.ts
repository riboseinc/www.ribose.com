// Post adapter: projects migrated blog posts onto Article.
import { posts } from '../posts'
import { SITE } from '../seo'
import { cachedConvert } from '../renderCache'
import type { Article, NewsSource } from '../article'

const asciidoctor = (await import('asciidoctor')).default
const adoc = asciidoctor()

export const postSource: NewsSource = {
  id: 'posts',
  articles(): Article[] {
    return posts.map((p) => ({
      urn: `urn:ribose:news:${p.slug}`,
      href: `/news/${p.lang === 'en' ? '' : `${p.lang}/`}${p.slug}`,
      date: p.date,
      title: p.title,
      subheadline: p.excerpt,
      bodyHtml: cachedConvert(adoc, 'posts', p.bodyAdoc, { doctype: 'book' }),
      bodyAdoc: p.bodyAdoc,
      authors: [],
      origin: 'ribose.com',
      canonical: `${SITE}/news/${p.lang === 'en' ? '' : `${p.lang}/`}${p.slug}`,
      lang: p.lang,
      story: p.slug,
      archived: p.archived,
    }))
  },
}
