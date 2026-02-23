import type { Prisma } from '@prisma/client'
import { db } from '../db/client'

export function buildDateWhere(date: string): Prisma.ArticleWhereInput | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined

  const start = new Date(`${date}T00:00:00+09:00`)
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)

  return {
    publishedAt: {
      gte: start,
      lt: end,
    },
  }
}

export async function listArticles(where?: Prisma.ArticleWhereInput) {
  return db.article.findMany({
    where,
    orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    take: 300,
  })
}

export async function upsertArticle(input: {
  source: string
  category: string
  title: string
  link: string
  publishedAt: Date | null
  summary: string
}) {
  return db.article.upsert({
    where: { link: input.link },
    create: input,
    update: {
      source: input.source,
      category: input.category,
      title: input.title,
      publishedAt: input.publishedAt,
      summary: input.summary,
    },
  })
}
