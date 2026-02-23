# Newsmiru

Newsmiru is a personal news dashboard that periodically collects RSS feeds and lets you read them on mobile/PC.

- Frontend: Vite + React + TypeScript
- API: Express + TypeScript
- DB: Prisma + SQLite
- Scheduler: OpenClaw Cron (optional)

---

## Prerequisites

- Node.js 20+
- npm
- Git
- (Optional) OpenClaw installed and running

---

## Quick Start

```bash
git clone <YOUR_REPO_URL>
cd newsmiru
npm install
cp .env.example .env
```

Initialize DB:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Collect initial news:

```bash
npm run collect
```

Run app (frontend + API):

```bash
npm run dev
```

Open:

- Web UI: `http://localhost:5173`
- API health: `http://localhost:3001/health`

---

## Environment Variables

`.env.example`

```env
DATABASE_URL="file:./dev.db"
VITE_API_BASE_URL="http://localhost:3001"
```

Notes:
- For local development, defaults are usually fine.
- If you access from another device (LAN/Tailscale), keep API reachable from that device.

---

## Commands

```bash
npm run dev              # frontend + API
npm run dev:web          # frontend only
npm run dev:api          # API only
npm run collect          # fetch RSS and upsert into DB
npm run build            # type-check + production build
npm run prisma:generate
npm run prisma:migrate
```

---

## Access from iPhone / Other Devices

If your machine is reachable from iPhone (LAN or Tailscale), open:

```text
http://<YOUR_MACHINE_IP>:5173
```

Examples:
- LAN: `http://192.168.x.x:5173`
- Tailscale: `http://100.x.y.z:5173`

---

## OpenClaw Cron (Optional)

Run collection every 3 hours:

```bash
openclaw cron add \
  --name newsmiru:collect \
  --every 3h \
  --session isolated \
  --no-deliver \
  --message "Run: cd <PROJECT_DIR> && npm run collect"
```

Check jobs:

```bash
openclaw cron list
```

Run once immediately:

```bash
openclaw cron run <CRON_JOB_ID>
```

---

## Troubleshooting

### UI shows 0 items

1. Ensure data exists:

```bash
npm run collect
curl -s http://127.0.0.1:3001/api/news | head
```

2. Ensure API is running:

```bash
npm run dev:api
curl -s http://127.0.0.1:3001/health
```

3. Ensure frontend is running:

```bash
npm run dev:web
```

### Cron doesn’t run

- Cron runs only when machine + OpenClaw are running.
- After reboot/offline time, missed runs are not replayed automatically.

---

## Repository Hygiene

Ignored by default:

- `dev.db`
- `.env`
- `dist-node/`
- `*.tsbuildinfo`
- `blog/`

Keep local/private files out of git to avoid accidental leaks.
