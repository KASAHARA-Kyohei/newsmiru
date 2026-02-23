import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import type { Prisma } from '@prisma/client'
import { prisma } from './prisma'

const app = express()
const port = Number(process.env.API_PORT || 3001)

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/news', async (req, res) => {
  const date = typeof req.query.date === 'string' ? req.query.date : ''

  let where: Prisma.ArticleWhereInput | undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // JST day range [00:00, 24:00)
    const start = new Date(`${date}T00:00:00+09:00`)
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
    where = {
      publishedAt: {
        gte: start,
        lt: end,
      },
    }
  }

  const rows = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    take: 300,
  })

  res.json({
    generatedAt: new Date().toISOString(),
    count: rows.length,
    items: rows.map((r: { source: string; category: string; title: string; link: string; publishedAt: Date | null; summary: string }) => ({
      source: r.source,
      category: r.category,
      title: r.title,
      link: r.link,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      summary: r.summary,
    })),
  })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`[api] listening on :${port}`)
})
