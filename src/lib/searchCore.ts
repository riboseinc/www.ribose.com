export interface SearchHit {
  title: string
  url: string
  section: string
}

export const debounce = (fn: () => void, ms = 140): (() => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, ms)
  }
}

// The one result-list renderer — both search UIs (palette and /search
// page) delegate to it so a row-design change lands everywhere at once.
// `decorate` lets the palette attach keyboard-nav semantics per row.
export const renderResults = (
  container: HTMLElement,
  hits: SearchHit[],
  note?: string,
  decorate?: (row: HTMLAnchorElement, hit: SearchHit, index: number) => void,
): void => {
  container.replaceChildren()
  if (note) {
    const p = document.createElement('p')
    p.className = 'px-3 py-8 text-center text-sm text-slate-500'
    p.textContent = note
    container.append(p)
    return
  }
  hits.forEach((hit, i) => {
    const a = document.createElement('a')
    a.href = hit.url
    a.className = 'sp-row block no-underline'
    const title = document.createElement('span')
    title.className = 'truncate font-medium'
    title.textContent = hit.title
    const meta = document.createElement('span')
    meta.className = 'sp-meta'
    meta.textContent = hit.section
    a.append(title, meta)
    decorate?.(a, hit, i)
    container.append(a)
  })
}

// Pagefind assets exist only after the post-build indexing step, so the
// specifier is assembled at runtime — no bundler can try to resolve it.
const pagefindUrl = ['/pagefind', 'pagefind.js'].join('/')
let pagefind: any

export async function loadPagefind(): Promise<any> {
  if (pagefind !== undefined) return pagefind
  try {
    pagefind = await import(/* @vite-ignore */ pagefindUrl)
  } catch {
    pagefind = null
  }
  return pagefind
}

const SECTION_LABELS: Record<string, string> = {
  '': 'Home',
  platforms: 'Platform',
  technologies: 'Technology',
  news: 'News',
  company: 'Company',
  customers: 'Customers',
  security: 'Security',
  for: 'Audience',
  legal: 'Legal',
}

export const sectionOf = (url: string): string => {
  const seg = url.replace(/(^\/|\/$)/g, '').split('/')[0]
  return SECTION_LABELS[seg] ?? 'Page'
}

export async function search(query: string, limit = 8): Promise<SearchHit[]> {
  const pf = await loadPagefind()
  if (!pf || !query.trim()) return []
  const results = await pf.search(query)
  const hits = await Promise.all(results.results.slice(0, limit).map((r: any) => r.data()))
  return hits.map((h: any) => ({
    title: h.meta?.title || decodeURIComponent(h.url),
    url: h.url,
    section: sectionOf(h.url),
  }))
}
