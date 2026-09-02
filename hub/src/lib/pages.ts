// Legal/security pages moved verbatim from the Jekyll _pages tree.
// AsciiDoc bodies render unchanged; Jekyll-only frontmatter is ignored.
import { readDocs } from './frontmatter'
export interface LegalPage {
  slug: string
  title: string
  description?: string
  revisionDate?: string
  bodyAdoc: string
}

const files = import.meta.glob('../content/pages/*.adoc', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>

export const legalPages = (): LegalPage[] =>
  readDocs(files, (key) => key.split('/').pop()!.replace(/\.adoc$/, '')).map((doc) => {
    const fm = doc.frontmatter
    const permalink = typeof fm.permalink === 'string' ? fm.permalink.replace(/^\//, '').replace(/\/$/, '') : null
    return {
      slug: permalink ?? doc.id,
      title: String(fm.title ?? doc.id),
      description: fm.description as string | undefined,
      revisionDate: fm.revision_date as string | undefined,
      bodyAdoc: doc.body,
    }
  })
