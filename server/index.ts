import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getNewsPayload } from './news/service'

const app = express()
const port = Number(process.env.API_PORT || 3001)

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/news', async (req, res) => {
  const date = typeof req.query.date === 'string' ? req.query.date : ''
  const payload = await getNewsPayload(date)
  res.json(payload)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`[api] listening on :${port}`)
})
