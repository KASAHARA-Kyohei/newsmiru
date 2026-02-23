import { buildDateWhere, listArticles } from './repository'
import type { NewsPayloadDto } from './types'

export async function getNewsPayload(date = ''): Promise<NewsPayloadDto> {
  const where = buildDateWhere(date)
  const rows = await listArticles(where)

  return {
    generatedAt: new Date().toISOString(),
    count: rows.length,
    items: rows.map((r) => ({
      source: r.source,
      category: r.category,
      title: r.title,
      link: r.link,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      summary: r.summary,
    })),
  }
}
