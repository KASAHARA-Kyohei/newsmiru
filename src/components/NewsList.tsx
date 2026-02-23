import { NewsCard } from './NewsCard'
import type { NewsItem } from '../types'

type Props = {
  grouped: Array<[string, NewsItem[]]>
}

export function NewsList({ grouped }: Props) {
  if (grouped.length === 0) {
    return <p className="empty">記事がありません</p>
  }

  return (
    <>
      {grouped.map(([day, items]) => (
        <div key={day} className="day-group">
          <h3 className="day-title">{day}</h3>
          {items.map((item, idx) => (
            <NewsCard key={`${item.link}-${idx}`} item={item} />
          ))}
        </div>
      ))}
    </>
  )
}
