// Atom feed for the news stream.
import { newsStream, escapeXml } from '../../lib/newsStream'
import { SITE } from '../../lib/seo'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const updated = new Date().toISOString()
  const entries = (await newsStream()).slice(0, 50).map((i) => `  <entry>
    <title>${escapeXml(i.title)}</title>
    <id>${escapeXml(i.urn)}</id>
    <link href="${SITE}${i.href}"/>
    <updated>${i.date}T00:00:00Z</updated>
  </entry>`).join('\n')
  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Ribose News</title>
  <id>${SITE}/news-data/feed.xml</id>
  <link href="${SITE}/news"/>
  <updated>${updated}</updated>
${entries}
</feed>
`
  return new Response(body, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } })
}
