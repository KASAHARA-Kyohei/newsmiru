type Props = {
  query: string
  onQueryChange: (value: string) => void
  category: string
  categories: string[]
  onCategoryChange: (value: string) => void
}

export function Filters({ query, onQueryChange, category, categories, onCategoryChange }: Props) {
  return (
    <section className="filters">
      <input placeholder="キーワード検索" value={query} onChange={(e) => onQueryChange(e.target.value)} />
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>{c === 'all' ? 'すべて' : c}</option>
        ))}
      </select>
    </section>
  )
}
