import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '../server/prisma';
const root = process.cwd();
const sourcesPath = path.join(root, 'config', 'sources.json');
const summarize = (text = '') => {
    const cleaned = text
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;|&amp;|&quot;|&#39;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!cleaned)
        return '要約なし';
    return cleaned.slice(0, 120) + (cleaned.length > 120 ? '…' : '');
};
const parseItems = (xml) => {
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    return items.map((item) => {
        const pick = (tag) => {
            const mm = item.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
            return mm?.[1]?.trim() ?? '';
        };
        return {
            title: pick('title').replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
            link: pick('link').replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
            pubDate: pick('pubDate'),
            description: pick('description').replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
        };
    });
};
async function run() {
    const sources = JSON.parse(await fs.readFile(sourcesPath, 'utf8'));
    let total = 0;
    for (const source of sources) {
        try {
            const res = await fetch(source.url);
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const xml = await res.text();
            const items = parseItems(xml).slice(0, 20);
            for (const i of items) {
                if (!i.title || !i.link)
                    continue;
                const publishedAt = i.pubDate ? new Date(i.pubDate) : null;
                await prisma.article.upsert({
                    where: { link: i.link },
                    create: {
                        source: source.name,
                        category: source.category,
                        title: i.title,
                        link: i.link,
                        publishedAt: Number.isNaN(publishedAt?.getTime()) ? null : publishedAt,
                        summary: summarize(i.description || i.title),
                    },
                    update: {
                        source: source.name,
                        category: source.category,
                        title: i.title,
                        publishedAt: Number.isNaN(publishedAt?.getTime()) ? null : publishedAt,
                        summary: summarize(i.description || i.title),
                    },
                });
                total++;
            }
        }
        catch (e) {
            console.error(`[collect] failed: ${source.name}`, e);
        }
    }
    console.log(`[collect] upserted: ${total}`);
    await prisma.$disconnect();
}
run().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
