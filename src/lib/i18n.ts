export const locales = ['en', 'fr', 'ja', 'zh-hant', 'zh-hans'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

type Dict = Record<string, string>
const dictionaries: Record<Locale, Dict> = {
  en: {
    'nav.platforms': 'Platforms', 'nav.technologies': 'Products',
    'nav.customers': 'Customers', 'nav.news': 'News', 'nav.company': 'Company',
    'nav.security': 'Security', 'tagline': 'Open infrastructure for an interoperable world',
    'cta.explore': 'Explore the technology', 'cta.talk': 'Talk to us',
    'home.latest': 'Latest news', 'home.domains': 'Technology domains',
    'tech.poweredBy': 'Powers', 'tech.uses': 'Uses', 'tech.softwares': 'Notable software',
    'news.origin': 'Published on', 'news.index': 'All news',
  },
  fr: {
    'nav.platforms': 'Plateformes', 'nav.technologies': 'Products',
    'nav.customers': 'Clients', 'nav.news': 'Actualités', 'nav.company': 'Entreprise',
    'nav.security': 'Sécurité', 'tagline': 'Infrastructure ouverte pour un monde interopérable',
    'cta.explore': 'Explorer la technologie', 'cta.talk': 'Nous contacter',
    'home.latest': 'Dernières actualités', 'home.domains': 'Domaines technologiques',
    'tech.poweredBy': 'Alimente', 'tech.uses': 'Utilise', 'tech.softwares': 'Logiciels',
    'news.origin': 'Publié sur', 'news.index': 'Toutes les actualités',
  },
  ja: {
    'nav.platforms': 'プラットフォーム', 'nav.technologies': 'テクノロジー',
    'nav.customers': '導入事例', 'nav.news': 'ニュース', 'nav.company': '会社情報',
    'nav.security': 'セキュリティ', 'tagline': '相互運用可能な世界のためのオープンなインフラ',
    'cta.explore': '技術を探す', 'cta.talk': 'お問い合わせ',
    'home.latest': '最新ニュース', 'home.domains': '技術ドメイン',
    'tech.poweredBy': '支える', 'tech.uses': '利用', 'tech.softwares': 'ソフトウェア',
    'news.origin': '公開元', 'news.index': 'ニュース一覧',
  },
  'zh-hant': {
    'nav.platforms': '平台', 'nav.technologies': '技術', 'nav.customers': '客戶',
    'nav.news': '最新消息', 'nav.company': '公司', 'nav.security': '安全',
    'tagline': '為可互通的世界而建的開放基礎設施',
    'cta.explore': '探索技術', 'cta.talk': '聯絡我們',
    'home.latest': '最新消息', 'home.domains': '技術領域',
    'tech.poweredBy': '驅動', 'tech.uses': '使用', 'tech.softwares': '軟件',
    'news.origin': '發布於', 'news.index': '所有消息',
  },
  'zh-hans': {
    'nav.platforms': '平台', 'nav.technologies': '技术', 'nav.customers': '客户',
    'nav.news': '最新消息', 'nav.company': '公司', 'nav.security': '安全',
    'tagline': '为可互通的世界而建的开放基础设施',
    'cta.explore': '探索技术', 'cta.talk': '联系我们',
    'home.latest': '最新消息', 'home.domains': '技术领域',
    'tech.poweredBy': '驱动', 'tech.uses': '使用', 'tech.softwares': '软件',
    'news.origin': '发布于', 'news.index': '所有消息',
  },
}

export const t = (key: string, locale: Locale = defaultLocale): string =>
  dictionaries[locale]?.[key] ?? dictionaries[defaultLocale][key] ?? key
