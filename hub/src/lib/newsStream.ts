// The publishable news stream: a feed-shaped projection of the news index
// (newsmlg2.js/ninjs/Atom all derive from this one list).
import { newsStreamArticles } from './newsIndex'

export interface StreamItem {
  urn: string            // guid, e.g. urn:ribose:news:2023-04-25:press-cna
  href: string           // site path
  date: string           // ISO date
  title: string
  description: string
  by: string
  origin: string         // label, e.g. ribose.com / PubID
  canonical: string      // absolute canonical URL
}

export const SITE = 'https://www.ribose.com'

export const newsStream = async (): Promise<StreamItem[]> =>
  (await newsStreamArticles()).map((a) => ({
    urn: a.urn,
    href: a.href,
    date: a.date,
    title: a.title,
    description: a.subheadline ?? '',
    by: a.authors.length > 0 ? a.authors.map((x) => x.name).join(', ') : 'Ribose',
    origin: a.origin,
    canonical: a.canonical,
  }))

export const escapeXml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
