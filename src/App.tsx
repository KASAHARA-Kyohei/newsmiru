import './App.css'
import { useNews } from './hooks/useNews'
import { Header } from './components/Header'
import { Filters } from './components/Filters'
import { DateFilters } from './components/DateFilters'
import { NewsList } from './components/NewsList'

function App() {
  const {
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
    reload,
  } = useNews()

  return (
    <main className="app">
      <Header count={data.count} generatedAt={data.generatedAt} onReload={() => void reload()} />

      <Filters
        query={query}
        onQueryChange={setQuery}
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
      />

      <DateFilters
        dateFilter={dateFilter}
        onAll={() => void applyDateFilter('all')}
        onToday={() => void setToday()}
        onYesterday={() => void setYesterday()}
        onDatePick={(v) => void applyDateFilter(v || 'all')}
      />

      <section className="list">
        <NewsList grouped={grouped} />
      </section>
    </main>
  )
}

export default App
