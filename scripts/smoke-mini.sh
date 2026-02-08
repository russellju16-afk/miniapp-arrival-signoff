#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

export KD_MOCK_MODE=true
export DB_URL="${DB_URL:-file:./prisma/core/dev.db}"
export ADMIN_TOKEN="${ADMIN_TOKEN:-dev-admin-token}"

echo "[smoke-mini] doctor:env"
npm run doctor:env >/dev/null

echo "[smoke-mini] core:db:push"
npm run core:db:push >/dev/null

echo "[smoke-mini] extract:endpoints"
npm run extract:endpoints >/dev/null

echo "[smoke-mini] sync:deliveries"
npm run sync:deliveries >/dev/null

echo "[smoke-mini] start server"
npm run dev >/tmp/smoke-mini-server.log 2>&1 &
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

echo "[smoke-mini] admin sync run (core)"
ADMIN_SYNC_RUN_JSON="$(curl -fsS -X POST "http://localhost:3000/api/admin/sync/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{"jobName":"sync:deliveries"}')"
ADMIN_SYNC_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && x?.data?.results?.length)))' "${ADMIN_SYNC_RUN_JSON}")"
if [[ "${ADMIN_SYNC_OK}" != "true" ]]; then
  echo "[smoke-mini] /api/admin/sync/run 失败" >&2
  exit 1
fi

echo "[smoke-mini] admin sync status (core)"
ADMIN_SYNC_STATUS_JSON="$(curl -fsS "http://localhost:3000/api/admin/sync/status" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}")"
ADMIN_SYNC_STATUS_OK="$(node -e 'const x=JSON.parse(process.argv[1]);const ok=x?.ok===true;const hasArray=Array.isArray(x?.data);process.stdout.write(String(ok&&hasArray));' "${ADMIN_SYNC_STATUS_JSON}")"
if [[ "${ADMIN_SYNC_STATUS_OK}" != "true" ]]; then
  echo "[smoke-mini] /api/admin/sync/status 失败" >&2
  exit 1
fi

echo "[smoke-mini] pick first customer"
CUSTOMER_ID="$(sqlite3 ./prisma/core/dev.db "SELECT customer_id FROM deliveries ORDER BY created_at ASC LIMIT 1;")"
if [[ -z "${CUSTOMER_ID}" ]]; then
  CUSTOMER_ID="$(sqlite3 ./prisma/core/dev.db "SELECT id FROM customers ORDER BY created_at ASC LIMIT 1;")"
fi
if [[ -z "${CUSTOMER_ID}" ]]; then
  echo "[smoke-mini] customers 表为空，无法继续" >&2
  exit 1
fi

echo "[smoke-mini] issue customer token"
ISSUE_JSON="$(curl -fsS -X POST "http://localhost:3000/api/admin/customers/token/issue" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d "{\"customerId\":\"${CUSTOMER_ID}\",\"ttlDays\":30}")"
CUSTOMER_TOKEN="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.accessToken||"")' "${ISSUE_JSON}")"
if [[ -z "${CUSTOMER_TOKEN}" ]]; then
  echo "[smoke-mini] 客户 token 签发失败" >&2
  exit 1
fi

echo "[smoke-mini] reset one delivery to PENDING for deterministic sign flow"
sqlite3 ./prisma/core/dev.db \
  "UPDATE deliveries SET status='PENDING', signed_at=NULL, signed_payload_json=NULL, sign_idempotency_key=NULL WHERE id=(SELECT id FROM deliveries ORDER BY created_at ASC LIMIT 1);"

echo "[smoke-mini] mini login"
curl -fsS -X POST "http://localhost:3000/api/mini/login" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"${CUSTOMER_TOKEN}\"}" >/tmp/smoke-mini-login.json

echo "[smoke-mini] mini deliveries list"
DELIVERIES_JSON="$(curl -fsS "http://localhost:3000/api/mini/deliveries?page=1&pageSize=20" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}")"
DELIVERY_ID="$(node -e 'const x=JSON.parse(process.argv[1]);const items=x?.data?.items||[];process.stdout.write(items[0]?.id||"")' "${DELIVERIES_JSON}")"
if [[ -z "${DELIVERY_ID}" ]]; then
  echo "[smoke-mini] 未找到可签收 delivery（请检查 sync:deliveries 输出）" >&2
  exit 1
fi

echo "[smoke-mini] mini delivery detail"
curl -fsS "http://localhost:3000/api/mini/deliveries/${DELIVERY_ID}" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" >/tmp/smoke-mini-delivery-detail.json

echo "[smoke-mini] mini sign delivery"
curl -fsS -X POST "http://localhost:3000/api/mini/deliveries/${DELIVERY_ID}/sign" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" \
  -H "x-idempotency-key: smoke-mini-sign-0001" \
  -d '{"signerName":"smoke-mini","remark":"ok"}' >/tmp/smoke-mini-sign.json

echo "[smoke-mini] build statement (core api)"
STATEMENT_JSON="$(curl -fsS "http://localhost:3000/api/reconcile/statement?customerId=${CUSTOMER_ID}&from=2026-02-01&to=2026-02-28")"
STATEMENT_ID="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.statementId||"")' "${STATEMENT_JSON}")"
if [[ -z "${STATEMENT_ID}" ]]; then
  echo "[smoke-mini] statementId 为空" >&2
  exit 1
fi

echo "[smoke-mini] mini statements list"
curl -fsS "http://localhost:3000/api/mini/statements?from=2026-02-01&to=2026-02-28" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" >/tmp/smoke-mini-statements.json

echo "[smoke-mini] mini statement detail"
curl -fsS "http://localhost:3000/api/mini/statements/${STATEMENT_ID}" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" >/tmp/smoke-mini-statement-detail.json

echo "[smoke-mini] mini statement confirm"
curl -fsS -X POST "http://localhost:3000/api/mini/statements/${STATEMENT_ID}/confirm" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" \
  -d '{"remark":"smoke mini confirmed"}' >/tmp/smoke-mini-statement-confirm.json

echo "[smoke-mini] done"
