import { newsStream } from '../../lib/newsStream'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const stream = await newsStream()
  const body = JSON.stringify({
    generatedAt: new Date().toISOString(),
    articles: stream.map((i) => ({ id: i.urn, path: i.href, date: i.date, title: i.title, origin: i.origin })),
  }, null, 2)
  return new Response(body + '\n', { headers: { 'Content-Type': 'application/json' } })
}
