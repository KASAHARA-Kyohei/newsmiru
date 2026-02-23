type Props = {
  dateFilter: string
  onAll: () => void
  onToday: () => void
  onYesterday: () => void
  onDatePick: (value: string) => void
}

export function DateFilters({ dateFilter, onAll, onToday, onYesterday, onDatePick }: Props) {
  return (
    <section className="date-filters">
      <button onClick={onAll} className={dateFilter === 'all' ? 'active' : ''}>全期間</button>
      <button onClick={onToday}>今日</button>
      <button onClick={onYesterday}>昨日</button>
      <input
        type="date"
        value={dateFilter === 'all' ? '' : dateFilter}
        onChange={(e) => onDatePick(e.target.value)}
      />
    </section>
  )
}
