import { toJpDateTime } from '../lib/utils/date'

type Props = {
  count: number
  generatedAt: string
  onReload: () => void
}

export function Header({ count, generatedAt, onReload }: Props) {
  return (
    <header className="top">
      <h1>Newsmiru</h1>
      <p>定期収集したニュースをスマホでまとめ見</p>
      <div className="meta">
        <span>件数: {count}</span>
        <span>更新: {toJpDateTime(generatedAt)}</span>
        <button onClick={onReload}>再読み込み</button>
      </div>
    </header>
  )
}
