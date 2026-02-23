import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { NewsPayload, NewsItem } from './types'

const rawApiBase = import.meta.env.VITE_API_BASE_URL ?? ''
const isRemoteClient = !['localhost', '127.0.0.1'].includes(window.location.hostname)
const API_BASE = isRemoteClient && rawApiBase.includes('localhost') ? '' : rawApiBase

const jstDate = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function App() {
  const [data, setData] = useState<NewsPayload>({ generatedAt: '', count: 0, items: [] })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const load = async (dateArg = dateFilter) => {
    const params = new URLSearchParams({ t: String(Date.now()) })
    if (dateArg !== 'all') params.set('date', dateArg)

    const res = await fetch(`${API_BASE}/api/news?${params.toString()}`)
    const json: NewsPayload = await res.json()
    setData(json)
  }

  useEffect(() => {
    void load('all')
  }, [])

  const categories = useMemo(() => {
    const set = new Set(data.items.map((i) => i.category))
    return ['all', ...set]
  }, [data.items])

  const filtered = useMemo(() => {
    return data.items.filter((item) => {
      const hitCategory = category === 'all' || item.category === category
      const text = `${item.title} ${item.summary} ${item.source}`.toLowerCase()
      const hitQuery = query.trim() === '' || text.includes(query.toLowerCase())
      return hitCategory && hitQuery
    })
  }, [data.items, category, query])

  const grouped = useMemo(() => {
    const map = new Map<string, NewsItem[]>()
    for (const item of filtered) {
      const key = item.publishedAt
        ? new Date(item.publishedAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '日付不明'
      const arr = map.get(key) ?? []
      arr.push(item)
      map.set(key, arr)
    }
    return [...map.entries()]
  }, [filtered])

  const categoryClass = (label: string) => {
    switch (label) {
      case '海外':
        return 'chip-overseas'
      case '国内':
        return 'chip-domestic'
      case 'テック':
        return 'chip-tech'
      case '開発':
        return 'chip-dev'
      case 'AI':
        return 'chip-ai'
      default:
        return 'chip-default'
    }
  }

  const applyDateFilter = async (next: string) => {
    setDateFilter(next)
    await load(next)
  }

  return (
    <main className="app">
      <header className="top">
        <h1>Newsmiru</h1>
        <p>定期収集したニュースをスマホでまとめ見</p>
        <div className="meta">
          <span>件数: {data.count}</span>
          <span>更新: {data.generatedAt ? new Date(data.generatedAt).toLocaleString('ja-JP') : '-'}</span>
          <button onClick={() => void load()}>再読み込み</button>
        </div>
      </header>

      <section className="filters">
        <input
          placeholder="キーワード検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'すべて' : c}</option>
          ))}
        </select>
      </section>

      <section className="date-filters">
        <button onClick={() => void applyDateFilter('all')} className={dateFilter === 'all' ? 'active' : ''}>全期間</button>
        <button onClick={() => void applyDateFilter(jstDate(new Date()))}>
          今日
        </button>
        <button
          onClick={() => {
            const d = new Date()
            d.setDate(d.getDate() - 1)
            void applyDateFilter(jstDate(d))
          }}
        >
          昨日
        </button>
        <input
          type="date"
          value={dateFilter === 'all' ? '' : dateFilter}
          onChange={(e) => {
            const v = e.target.value
            void applyDateFilter(v || 'all')
          }}
        />
      </section>

      <section className="list">
        {grouped.length === 0 ? (
          <p className="empty">記事がありません</p>
        ) : (
          grouped.map(([day, items]) => (
            <div key={day} className="day-group">
              <h3 className="day-title">{day}</h3>
              {items.map((item, idx) => (
                <article key={`${item.link}-${idx}`} className="card">
                  <div className="row">
                    <span className={`chip ${categoryClass(item.category)}`}>{item.category}</span>
                    <span className="source">{item.source}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <div className="row bottom">
                    <time>{item.publishedAt ? new Date(item.publishedAt).toLocaleString('ja-JP') : '-'}</time>
                    <a href={item.link} target="_blank" rel="noreferrer">元記事</a>
                  </div>
                </article>
              ))}
            </div>
          ))
        )}
      </section>
    </main>
  )
}

export default App
