// Security advisories moved verbatim from the Jekyll _advisories tree.
import { readDocs } from './frontmatter'
export interface Advisory {
  slug: string; id: string; title: string; date: string
  cveId?: string; excerpt?: string; bodyAdoc: string
}

const files = import.meta.glob('../content/advisories/*.adoc', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>

export const advisories = (): Advisory[] =>
  readDocs(files, (key) => key.split('/').pop()!.replace(/\.adoc$/, '')).map((doc) => {
    const fm = doc.frontmatter
    return {
      slug: doc.id,
      id: String(fm.id ?? fm.title ?? doc.id),
      title: String(fm.title ?? doc.id),
      date: String(fm.date ?? '').slice(0, 10),
      cveId: fm.cve_id as string | undefined,
      excerpt: fm.excerpt as string | undefined,
      bodyAdoc: doc.body,
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
