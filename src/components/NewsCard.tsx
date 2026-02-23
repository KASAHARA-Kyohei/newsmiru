import { categoryClass } from '../lib/utils/category'
import { toJpDateTime } from '../lib/utils/date'
import type { NewsItem } from '../types'

type Props = { item: NewsItem }

export function NewsCard({ item }: Props) {
  return (
    <article className="card">
      <div className="row">
        <span className={`chip ${categoryClass(item.category)}`}>{item.category}</span>
        <span className="source">{item.source}</span>
      </div>
      <h2>{item.title}</h2>
      <p>{item.summary}</p>
      <div className="row bottom">
        <time>{toJpDateTime(item.publishedAt)}</time>
        <a href={item.link} target="_blank" rel="noreferrer">元記事</a>
      </div>
    </article>
  )
}
