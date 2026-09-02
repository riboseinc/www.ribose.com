import { githubOrgs } from './registry'

// The one canonical site origin (Base.astro derives its URLs from
// Astro.site; this constant serves the data pipelines).
export const SITE = 'https://www.ribose.com'

export const canonicalUrl = (pathStr = '/') => new URL(pathStr, SITE).href

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ribose',
  url: SITE,
  logo: canonicalUrl('/favicon.svg'),
  sameAs: githubOrgs().map((org) => `https://github.com/${org}`),
})

export const softwareJsonLd = (suite: {
  name: string; tagline: string; org: string; id: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: suite.name,
  description: suite.tagline,
  codeRepository: `https://github.com/${suite.org}`,
  url: canonicalUrl(`/technologies/${suite.id}`),
  publisher: { '@type': 'Organization', name: 'Ribose', url: SITE },
})

export const newsArticleJsonLd = (article: {
  headline: string; canonical: string; published?: string | null
  language: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: article.headline,
  url: article.canonical,
  mainEntityOfPage: article.canonical,
  ...(article.published ? { datePublished: article.published } : {}),
  inLanguage: article.language,
  publisher: { '@type': 'Organization', name: 'Ribose', url: SITE },
})

export const breadcrumbJsonLd = (crumbs: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.name, item: canonicalUrl(c.path),
  })),
})
