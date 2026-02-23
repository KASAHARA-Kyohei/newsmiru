export type NewsItem = {
  source: string
  category: string
  title: string
  link: string
  publishedAt: string | null
  summary: string
}

export type NewsPayload = {
  generatedAt: string
  count: number
  items: NewsItem[]
}
