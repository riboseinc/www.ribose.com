// The deep Article interface — every news source projects onto this.
// The interface IS the test surface: adapters are tested by producing
// Articles, consumers are tested by rendering them. Adding a source
// = writing an adapter, never touching a page.
export interface Article {
  /** globally unique id, e.g. urn:ribose:news:2024-08-27:metanorma:commenter */
  urn: string
  /** site path, e.g. /news/2024-08-27-metanorma-commenter */
  href: string
  /** ISO date YYYY-MM-DD */
  date: string
  title: string
  subheadline?: string
  /** rendered body as HTML (AsciiDoc-converted or XHTML-from-NewsML) */
  bodyHtml: string
  /** raw source body (AsciiDoc for wire/posts; empty for spoke) */
  bodyAdoc?: string
  authors: { name: string }[]
  /** origin label for chips, e.g. "Metanorma", "ribose.com" */
  origin: string
  /** absolute canonical URL (points at the spoke for imported articles) */
  canonical: string
  lang: string
  archived?: boolean
  media?: { href: string; alt?: string; credit?: string }[]
  dateline?: { place?: string; country?: string; date?: string }
}

// The seam: anything that produces Articles.
export interface NewsSource {
  id: string
  articles(): Article[] | Promise<Article[]>
}
