import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourcesPath = path.join(root, 'config', 'sources.json')
const outDataPath = path.join(root, 'data', 'news.json')
const outPublicPath = path.join(root, 'public', 'news.json')

const summarize = (text = '') => {
  const cleaned = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&amp;|&quot;|&#39;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return '要約なし'
  return cleaned.slice(0, 120) + (cleaned.length > 120 ? '…' : '')
}

const parseItems = (xml) => {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1])
  return items.map((item) => {
    const pick = (tag) => {
      const mm = item.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))
      return mm?.[1]?.trim() ?? ''
    }
    const title = pick('title').replace(/<!\[CDATA\[|\]\]>/g, '').trim()
    const link = pick('link').replace(/<!\[CDATA\[|\]\]>/g, '').trim()
    const pubDate = pick('pubDate')
    const description = pick('description').replace(/<!\[CDATA\[|\]\]>/g, '').trim()
    return { title, link, pubDate, description }
  })
}

const collect = async () => {
  const sources = JSON.parse(await fs.readFile(sourcesPath, 'utf8'))
  const all = []

  for (const source of sources) {
    try {
      const res = await fetch(source.url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const xml = await res.text()
      const items = parseItems(xml)
        .slice(0, 10)
        .map((i) => ({
          source: source.name,
          category: source.category,
          title: i.title,
          link: i.link,
          publishedAt: i.pubDate,
          summary: summarize(i.description || i.title),
        }))
      all.push(...items)
    } catch (e) {
      console.error(`[collect] failed: ${source.name}`, e.message)
    }
  }

  all.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))

  const payload = {
    generatedAt: new Date().toISOString(),
    count: all.length,
    items: all,
  }

  await fs.mkdir(path.join(root, 'data'), { recursive: true })
  await fs.mkdir(path.join(root, 'public'), { recursive: true })
  await fs.writeFile(outDataPath, JSON.stringify(payload, null, 2), 'utf8')
  await fs.writeFile(outPublicPath, JSON.stringify(payload, null, 2), 'utf8')

  console.log(`[collect] done: ${all.length} items`)
}

collect()
