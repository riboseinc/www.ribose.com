// The primary navigation, declared once. Header, Footer, and 404 all
// consume this — a nav change lands everywhere at once and the 404 can
// never again advertise sections that were removed.
import { t, type Locale } from './i18n'

export interface NavItem {
  href: string
  /** i18n key for the label */
  key: string
  /** one-line description (404 link cards) */
  desc: string
}

export const navItems: readonly NavItem[] = Object.freeze([
  { href: '/platforms', key: 'nav.platforms', desc: 'Metanorma & Primmel Digital CAB' },
  { href: '/technologies', key: 'nav.technologies', desc: 'Our open-source product suites' },
  { href: '/news', key: 'nav.news', desc: 'Press archive since 2012' },
  { href: '/customers', key: 'nav.customers', desc: 'The organizations we work for' },
  { href: '/company', key: 'nav.company', desc: 'About Ribose and awards' },
  { href: '/security', key: 'nav.security', desc: 'Advisories, CVE program, disclosure' },
])

export const navLabel = (item: NavItem, locale: Locale = 'en'): string =>
  t(item.key, locale)
