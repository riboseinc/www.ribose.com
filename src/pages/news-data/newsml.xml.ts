// NewsML-G2 (IPTC 2.35) projection of the news stream. Interim generator;
// swaps to the newsmlg2-ts library once it lands (TODO.import-network/02).
import { newsStream, escapeXml } from '../../lib/newsStream'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const items = (await newsStream()).slice(0, 100).map((i) => `    <newsItem xml:lang="en" standard="NewsML-G2" standardversion="2.35" conformance="power" guid="${escapeXml(i.urn)}" version="1">
      <itemMeta>
        <itemClass qcode="ninat:text"/>
        <provider qcode="nprov:ribose">
          <name>Ribose</name>
        </provider>
        <versionCreated>${i.date}T00:00:00Z</versionCreated>
      </itemMeta>
      <contentMeta>
        <contentCreated>${i.date}T00:00:00Z</contentCreated>
        <headline>${escapeXml(i.title)}</headline>
        ${i.description ? `<description>${escapeXml(i.description)}</description>` : '<description/>'}
        <by>${escapeXml(i.by)}</by>
      </contentMeta>
    </newsItem>`)
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<newsMessage xmlns="http://iptc.org/std/nar/2006-10-01/">
  <header>
    <sent>${new Date().toISOString()}</sent>
    <sender>Ribose</sender>
  </header>
  <itemSet>
${items.join('\n')}
  </itemSet>
</newsMessage>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
