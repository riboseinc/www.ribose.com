// Legacy collections copied verbatim from the retired Jekyll site
// (ribosei/www.ribose.com). Frontmatter is data; body text is content;
// neither is rewritten here. Glob patterns must be literals so Vite can
// inline the files at build time.
import { parse as parseYaml } from 'yaml'
import { readDocs } from './frontmatter'
export interface CollectionDoc {
  id: string
  frontmatter: Record<string, any>
  body: string
}

const teamFiles = import.meta.glob('../content/team/*.adoc', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const advisorFiles = import.meta.glob('../content/advisors/*.adoc', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const awardFiles = import.meta.glob('../content/awards/*.adoc', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const hofFiles = import.meta.glob('../content/hof/hall-of-fame.yaml', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
import clientsRaw from '../../data/clients.yaml?raw'

const toDocs = (files: Record<string, string>): CollectionDoc[] =>
  readDocs(files, (key) => key.split('/').pop()!.replace(/\.(adoc|html)$/, ''))

export const team = (): CollectionDoc[] => toDocs(teamFiles)
export const advisors = (): CollectionDoc[] => toDocs(advisorFiles)
export const awards = (): CollectionDoc[] => toDocs(awardFiles)

export const hallOfFame = (): { years_hofs?: { research_heading: string; hofs: string[] }[] } => {
  const raw = Object.values(hofFiles)[0] ?? ''
  return (raw ? parseYaml(raw) : {}) as any
}

export interface Client {
  id: string; group: string; logo: string; logo_dark?: string; name: string; note?: string
}
export const clients = (): Client[] =>
  Object.freeze((parseYaml(clientsRaw) as { clients: Client[] }).clients)

import partnersRaw from '../../data/partners.yaml?raw'
export interface PartnerOrSupporter {
  id: string; logo: string; logo_dark?: string; name: string
}
const partnerFile = parseYaml(partnersRaw) as { partners: PartnerOrSupporter[]; supporters: PartnerOrSupporter[] }
export const partners = (): PartnerOrSupporter[] => Object.freeze(partnerFile.partners)
export const supporters = (): PartnerOrSupporter[] => Object.freeze(partnerFile.supporters)
