# Newsmiru

Newsmiru は、定期収集したニュースを iPhone/PC で見やすく一覧表示するアプリです。

- Frontend: Vite + React + TypeScript
- API: Express + TypeScript
- DB: Prisma + SQLite

---

## 1. セットアップ

```bash
cd ~/dev/newsmiru
npm install
cp .env.example .env
```

`.env` は通常このままでOKです:

```env
DATABASE_URL="file:./dev.db"
VITE_API_BASE_URL="http://localhost:3001"
```

---

## 2. DB初期化（初回のみ）

```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## 3. ニュース収集（手動実行）

```bash
npm run collect
```

収集元は `config/sources.json` で編集できます。

---

## 4. 開発起動

```bash
npm run dev
```

- Vite (フロント): `5173`
- API (Express): `3001`

### iPhone から見る

同一ネットワーク上で、以下にアクセス:

```text
http://<ラズパイIP>:5173
```

---

## 5. ビルド確認

```bash
npm run build
```

---

## 6. 本番運用手順（おすすめ）

### 6-1. 定期収集（cron）

30分ごとに収集する例:

```bash
crontab -e
```

以下を追加:

```cron
*/30 * * * * cd /home/kasa/dev/newsmiru && /usr/bin/npm run collect >> /home/kasa/dev/newsmiru/logs/collect.log 2>&1
```

事前にログディレクトリを作成:

```bash
mkdir -p /home/kasa/dev/newsmiru/logs
```

---

### 6-2. 再起動時にAPI/フロントを自動起動（systemd）

`newsmiru.service` を作成:

```bash
sudo tee /etc/systemd/system/newsmiru.service > /dev/null <<'EOF'
[Unit]
Description=Newsmiru (Vite + API)
After=network.target

[Service]
Type=simple
User=kasa
WorkingDirectory=/home/kasa/dev/newsmiru
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

有効化:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now newsmiru
sudo systemctl status newsmiru
```

> 注: 本番では `npm run dev` より、将来的に `build + preview` や nginx 経由にするのが安定です。

---

### 6-3. DBバックアップ（SQLite）

日次バックアップ例:

```bash
mkdir -p /home/kasa/dev/newsmiru/backups
cp /home/kasa/dev/newsmiru/dev.db /home/kasa/dev/newsmiru/backups/dev-$(date +%F).db
```

定期化（毎日3:30）:

```cron
30 3 * * * cp /home/kasa/dev/newsmiru/dev.db /home/kasa/dev/newsmiru/backups/dev-$(date +\%F).db
```

---

## 便利コマンド

```bash
# Prisma Client再生成
npm run prisma:generate

# マイグレーション追加（スキーマ変更後）
npm run prisma:migrate

# 収集だけ再実行
npm run collect
```
