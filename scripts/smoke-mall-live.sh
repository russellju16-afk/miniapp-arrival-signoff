#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

if [[ "${SMOKE_MALL_LIVE_RUN:-false}" != "true" ]]; then
  echo "[smoke-mall-live] 为避免误调用真实环境，请先设置 SMOKE_MALL_LIVE_RUN=true" >&2
  exit 1
fi

required=(KD_CLIENT_ID KD_CLIENT_SECRET KD_APP_KEY KD_APP_SECRET KD_GW_ROUTER_ADDR)
for key in "${required[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "[smoke-mall-live] 缺少环境变量: ${key}" >&2
    exit 1
  fi
done

export KD_MOCK_MODE=false
export DB_URL="${DB_URL:-file:./prisma/core/dev.db}"
export ADMIN_TOKEN="${ADMIN_TOKEN:-dev-admin-token}"

echo "[smoke-mall-live] KD_MOCK_MODE=${KD_MOCK_MODE}"
exec bash scripts/smoke-mall.sh
