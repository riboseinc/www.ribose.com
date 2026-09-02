// ninjs (IPTC News in JSON) projection of the news stream.
import { newsStream } from '../../lib/newsStream'
import { SITE } from '../../lib/seo'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const body = JSON.stringify({
    uri: SITE,
    items: (await newsStream()).map((i) => ({
      uri: i.canonical,
      type: 'text',
      headline: i.title,
      description: i.description,
      language: 'en',
      by: i.by,
      version: 1,
      versioncreated: i.date,
      subjectcodes: [] as string[],
    })),
  }, null, 2)
  return new Response(body + '\n', { headers: { 'Content-Type': 'application/json' } })
}
