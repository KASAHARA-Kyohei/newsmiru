import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './prisma';
const app = express();
const port = Number(process.env.API_PORT || 3001);
app.use(cors({ origin: true }));
app.use(express.json());
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
app.get('/api/news', async (_req, res) => {
    const rows = await prisma.article.findMany({
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        take: 200,
    });
    res.json({
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
    });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`[api] listening on :${port}`);
});
