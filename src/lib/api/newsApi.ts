import type { NewsPayload } from '../../types'

const rawApiBase = import.meta.env.VITE_API_BASE_URL ?? ''
const isRemoteClient = !['localhost', '127.0.0.1'].includes(window.location.hostname)
const API_BASE = isRemoteClient && rawApiBase.includes('localhost') ? '' : rawApiBase

export async function fetchNews(params: { date?: string } = {}): Promise<NewsPayload> {
  const search = new URLSearchParams({ t: String(Date.now()) })
  if (params.date && params.date !== 'all') search.set('date', params.date)

  const res = await fetch(`${API_BASE}/api/news?${search.toString()}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() as Promise<NewsPayload>
}
