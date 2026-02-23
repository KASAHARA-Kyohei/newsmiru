export type NewsItemDto = {
  source: string
  category: string
  title: string
  link: string
  publishedAt: string | null
  summary: string
}

export type NewsPayloadDto = {
  generatedAt: string
  count: number
  items: NewsItemDto[]
}
