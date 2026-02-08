#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3000}"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

cd "$ROOT_DIR"

echo "[tunnel] 启动后端服务 (PORT=$PORT)..."
PORT="$PORT" npx tsx src/server.ts >/tmp/miniapp_server_tunnel.log 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 40); do
  if curl -s "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

if ! curl -s "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
  echo "[tunnel] 后端未成功启动，请查看 /tmp/miniapp_server_tunnel.log"
  exit 1
fi

echo "[tunnel] 后端已就绪，启动 Cloudflare Tunnel..."
echo "[tunnel] 出现 https://xxxx.trycloudflare.com 后，把 miniapp/config.js 的 API_BASE_URL 改成该地址"
echo "[tunnel] 保持本终端窗口开启，关闭后隧道会失效"

exec cloudflared tunnel --url "http://127.0.0.1:${PORT}" --no-autoupdate
