export const toYmd = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const toJpDate = (iso: string | null) => {
  if (!iso) return '日付不明'
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const toJpDateTime = (iso: string | null) => {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ja-JP')
}
