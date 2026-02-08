#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

export KD_MOCK_MODE=true
export DB_URL="${DB_URL:-file:./prisma/core/dev.db}"

echo "[smoke] doctor:env"
npm run doctor:env >/dev/null

echo "[smoke] core:db:push"
npm run core:db:push >/dev/null

echo "[smoke] extract:endpoints"
npm run extract:endpoints >/dev/null

echo "[smoke] sync:deliveries"
npm run sync:deliveries >/dev/null

echo "[smoke] start server"
npm run dev >/tmp/smoke-core-server.log 2>&1 &
SERVER_PID=$!
cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in {1..30}; do
  if curl -fsS "http://localhost:3000/api/health" >/dev/null 2>/dev/null; then
    break
  fi
  sleep 0.5
done

echo "[smoke] read first delivery"
DELIVERY_ROW="$(sqlite3 ./prisma/core/dev.db "SELECT customer_id || '|' || id FROM deliveries LIMIT 1;")"
if [[ -z "${DELIVERY_ROW}" ]]; then
  echo "[smoke] deliveries 表为空，无法继续" >&2
  exit 1
fi
CUSTOMER_ID="${DELIVERY_ROW%%|*}"
DELIVERY_ID="${DELIVERY_ROW##*|}"

echo "[smoke] reset delivery status for deterministic sign flow"
sqlite3 ./prisma/core/dev.db \
  "UPDATE deliveries SET status='PENDING', signed_at=NULL, signed_payload_json=NULL, sign_idempotency_key=NULL WHERE id='${DELIVERY_ID}';"

echo "[smoke] deliveries list"
curl -fsS "http://localhost:3000/api/deliveries?customerId=${CUSTOMER_ID}&page=1&pageSize=20" >/tmp/smoke-deliveries.json

echo "[smoke] delivery detail"
curl -fsS "http://localhost:3000/api/deliveries/${DELIVERY_ID}?customerId=${CUSTOMER_ID}" >/tmp/smoke-delivery-detail.json

echo "[smoke] sign delivery"
curl -fsS -X POST "http://localhost:3000/api/deliveries/${DELIVERY_ID}/sign" \
  -H 'Content-Type: application/json' \
  -H 'x-idempotency-key: smoke-idem-0001' \
  -d '{"signerName":"smoke","remark":"ok"}' >/tmp/smoke-sign.json

echo "[smoke] build statement"
STATEMENT_JSON="$(curl -fsS "http://localhost:3000/api/reconcile/statement?customerId=${CUSTOMER_ID}&from=2026-02-01&to=2026-02-28")"
STATEMENT_ID="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x.data.statementId||"")' "${STATEMENT_JSON}")"

if [[ -z "${STATEMENT_ID}" ]]; then
  echo "[smoke] statementId 为空" >&2
  exit 1
fi

echo "[smoke] statement detail"
curl -fsS "http://localhost:3000/api/reconcile/statement/${STATEMENT_ID}?customerId=${CUSTOMER_ID}" >/tmp/smoke-statement-detail.json

echo "[smoke] statement confirm"
curl -fsS -X POST "http://localhost:3000/api/reconcile/statement/${STATEMENT_ID}/confirm" \
  -H 'Content-Type: application/json' \
  -d "{\"customerId\":\"${CUSTOMER_ID}\",\"remark\":\"smoke confirmed\"}" >/tmp/smoke-statement-confirm.json

echo "[smoke] done"
