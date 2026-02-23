import { useEffect, useMemo, useState } from 'react'
import { fetchNews } from '../lib/api/newsApi'
import { toYmd, toJpDate } from '../lib/utils/date'
import type { NewsItem, NewsPayload } from '../types'

export function useNews() {
  const [data, setData] = useState<NewsPayload>({ generatedAt: '', count: 0, items: [] })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const load = async (dateArg = dateFilter) => {
    const json = await fetchNews({ date: dateArg })
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
      const key = toJpDate(item.publishedAt)
      const arr = map.get(key) ?? []
      arr.push(item)
      map.set(key, arr)
    }
    return [...map.entries()]
  }, [filtered])

  const applyDateFilter = async (next: string) => {
    setDateFilter(next)
    await load(next)
  }

  const setToday = () => applyDateFilter(toYmd(new Date()))
  const setYesterday = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return applyDateFilter(toYmd(d))
  }

  return {
    data,
    query,
    setQuery,
    category,
    setCategory,
    dateFilter,
    applyDateFilter,
    setToday,
    setYesterday,
    grouped,
    categories,
    reload: () => load(),
  }
}
