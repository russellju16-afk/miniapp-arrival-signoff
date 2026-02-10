#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

export KD_MOCK_MODE="${KD_MOCK_MODE:-true}"
export DB_URL="${DB_URL:-file:./prisma/core/smoke.db}"
export ADMIN_TOKEN="${ADMIN_TOKEN:-dev-admin-token}"

BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "[smoke-admin] doctor:env"
npm run doctor:env >/dev/null

echo "[smoke-admin] core:db:push"
npm run core:db:push >/dev/null

echo "[smoke-admin] start server"
npm run dev >/tmp/smoke-admin-server.log 2>&1 &
SERVER_PID=$!
cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in {1..40}; do
  if curl -fsS "${BASE_URL}/api/health" >/dev/null 2>/dev/null; then
    break
  fi
  sleep 0.5
done

if ! curl -fsS "${BASE_URL}/api/health" >/dev/null 2>/dev/null; then
  echo "[smoke-admin] server did not become ready" >&2
  exit 1
fi

RAND="$(date +%s)"
PRODUCT_CODE="ADM-SMOKE-${RAND}"
SKU_CODE="ADM-SMOKE-SKU-${RAND}"
KINGDEE_MATERIAL_ID="ADM-MAT-${RAND}"
SETTING_MARKER="SMOKE-PICKUP-${RAND}"

admin_get() {
  local path="$1"
  curl -fsS "${BASE_URL}${path}" -H "Authorization: Bearer ${ADMIN_TOKEN}"
}

admin_post() {
  local path="$1"
  local body="$2"
  curl -fsS -X POST "${BASE_URL}${path}" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "${body}"
}

echo "[smoke-admin] customers list"
CUSTOMERS_JSON="$(admin_get "/api/admin/customers")"
CUSTOMERS_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && Array.isArray(x?.data))));' "${CUSTOMERS_JSON}")"
if [[ "${CUSTOMERS_OK}" != "true" ]]; then
  echo "[smoke-admin] customers list failed" >&2
  exit 1
fi

FIRST_CUSTOMER_ID="$(node -e 'const x=JSON.parse(process.argv[1]);const c=(x?.data||[])[0];process.stdout.write(c?.id||"");' "${CUSTOMERS_JSON}")"

if [[ -n "${FIRST_CUSTOMER_ID}" ]]; then
  echo "[smoke-admin] issue token for existing customer"
  ISSUE_JSON="$(admin_post "/api/admin/customers/token/issue" "{\"customerId\":\"${FIRST_CUSTOMER_ID}\",\"ttlDays\":30}")"
else
  echo "[smoke-admin] issue token by kingdeeCustomerId"
  ISSUE_JSON="$(admin_post "/api/admin/customers/token/issue" "{\"kingdeeCustomerId\":\"KD-SMOKE-${RAND}\",\"name\":\"Smoke客户\",\"ttlDays\":30}")"
fi
ISSUE_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && x?.data?.accessToken)));' "${ISSUE_JSON}")"
if [[ "${ISSUE_OK}" != "true" ]]; then
  echo "[smoke-admin] issue token failed" >&2
  exit 1
fi

echo "[smoke-admin] upsert product"
PRODUCT_JSON="$(admin_post "/api/admin/products/upsert" "{\"code\":\"${PRODUCT_CODE}\",\"name\":\"后台烟测商品-${RAND}\",\"status\":\"ACTIVE\",\"defaultUnitId\":\"Pcs\",\"kingdeeMaterialId\":\"${KINGDEE_MATERIAL_ID}\"}")"
PRODUCT_ID="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.id||"")' "${PRODUCT_JSON}")"
if [[ -z "${PRODUCT_ID}" ]]; then
  echo "[smoke-admin] upsert product failed" >&2
  exit 1
fi

echo "[smoke-admin] upsert sku"
SKU_JSON="$(admin_post "/api/admin/products/${PRODUCT_ID}/sku/upsert" "{\"skuCode\":\"${SKU_CODE}\",\"skuName\":\"标准件\",\"specs\":{\"颜色\":\"蓝色\"},\"price\":88.8,\"stock\":12,\"status\":\"ACTIVE\",\"unitId\":\"Pcs\",\"kingdeeMaterialId\":\"${KINGDEE_MATERIAL_ID}-01\"}")"
SKU_ID="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.id||"")' "${SKU_JSON}")"
if [[ -z "${SKU_ID}" ]]; then
  echo "[smoke-admin] upsert sku failed" >&2
  exit 1
fi

echo "[smoke-admin] products list"
PRODUCTS_JSON="$(admin_get "/api/admin/products?status=ACTIVE")"
PRODUCT_HIT="$(node -e 'const x=JSON.parse(process.argv[1]);const code=process.argv[2];const list=x?.data||[];process.stdout.write(String(list.some((p)=>p.code===code)));' "${PRODUCTS_JSON}" "${PRODUCT_CODE}")"
if [[ "${PRODUCT_HIT}" != "true" ]]; then
  echo "[smoke-admin] products list missing newly upserted product" >&2
  exit 1
fi

echo "[smoke-admin] orders list"
ORDERS_JSON="$(admin_get "/api/admin/orders?page=1&pageSize=20")"
ORDERS_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && Array.isArray(x?.data?.items))));' "${ORDERS_JSON}")"
if [[ "${ORDERS_OK}" != "true" ]]; then
  echo "[smoke-admin] orders list failed" >&2
  exit 1
fi

ORDER_DETAIL_ID="$(node -e 'const x=JSON.parse(process.argv[1]);const first=(x?.data?.items||[])[0];process.stdout.write(first?.id||"");' "${ORDERS_JSON}")"
if [[ -n "${ORDER_DETAIL_ID}" ]]; then
  echo "[smoke-admin] order detail"
  DETAIL_JSON="$(admin_get "/api/admin/orders/${ORDER_DETAIL_ID}")"
  DETAIL_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && x?.data?.id)));' "${DETAIL_JSON}")"
  if [[ "${DETAIL_OK}" != "true" ]]; then
    echo "[smoke-admin] order detail failed" >&2
    exit 1
  fi
fi

RETRY_CANDIDATE_ID="$(node -e 'const x=JSON.parse(process.argv[1]);const item=(x?.data?.items||[]).find((o)=>o.status==="WRITEBACK_FAILED"||o.status==="CREATED");process.stdout.write(item?.id||"");' "${ORDERS_JSON}")"
if [[ -n "${RETRY_CANDIDATE_ID}" ]]; then
  echo "[smoke-admin] retry writeback on eligible order"
  RETRY_CODE="$(curl -s -o /tmp/smoke-admin-retry.json -w '%{http_code}' -X POST "${BASE_URL}/api/admin/orders/${RETRY_CANDIDATE_ID}/retry-writeback" -H "Authorization: Bearer ${ADMIN_TOKEN}" -H "Content-Type: application/json")"
  if [[ "${RETRY_CODE}" != "200" && "${RETRY_CODE}" != "409" ]]; then
    echo "[smoke-admin] retry-writeback unexpected status ${RETRY_CODE}" >&2
    exit 1
  fi
else
  echo "[smoke-admin] no eligible order for retry-writeback, skip"
fi

CANCEL_CANDIDATE_ID="$(node -e 'const x=JSON.parse(process.argv[1]);const item=(x?.data?.items||[]).find((o)=>o.status==="WRITEBACK_FAILED"||o.status==="CREATED");process.stdout.write(item?.id||"");' "${ORDERS_JSON}")"
if [[ -n "${CANCEL_CANDIDATE_ID}" ]]; then
  echo "[smoke-admin] cancel eligible order"
  CANCEL_CODE="$(curl -s -o /tmp/smoke-admin-cancel.json -w '%{http_code}' -X POST "${BASE_URL}/api/admin/orders/${CANCEL_CANDIDATE_ID}/cancel" -H "Authorization: Bearer ${ADMIN_TOKEN}" -H "Content-Type: application/json" -d '{"remark":"smoke-admin cancel"}')"
  if [[ "${CANCEL_CODE}" != "200" && "${CANCEL_CODE}" != "409" ]]; then
    echo "[smoke-admin] cancel unexpected status ${CANCEL_CODE}" >&2
    exit 1
  fi
else
  echo "[smoke-admin] no eligible order for cancel, skip"
fi

echo "[smoke-admin] run sync:deliveries"
RUN_SYNC_JSON="$(admin_post "/api/admin/sync/run" '{"jobName":"sync:deliveries"}')"
RUN_SYNC_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && x?.data?.jobName)));' "${RUN_SYNC_JSON}")"
if [[ "${RUN_SYNC_OK}" != "true" ]]; then
  echo "[smoke-admin] sync run failed" >&2
  exit 1
fi

echo "[smoke-admin] sync status"
SYNC_STATUS_JSON="$(admin_get "/api/admin/sync/status?jobName=sync:deliveries")"
SYNC_STATUS_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && Array.isArray(x?.data))));' "${SYNC_STATUS_JSON}")"
if [[ "${SYNC_STATUS_OK}" != "true" ]]; then
  echo "[smoke-admin] sync status failed" >&2
  exit 1
fi

echo "[smoke-admin] save settings (POST)"
SETTINGS_POST_JSON="$(admin_post "/api/admin/settings" "{\"PICKUP_ADDRESS\":\"${SETTING_MARKER}\",\"ORDER_WEBHOOK\":\"\"}")"
SETTINGS_POST_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok)));' "${SETTINGS_POST_JSON}")"
if [[ "${SETTINGS_POST_OK}" != "true" ]]; then
  echo "[smoke-admin] settings post failed" >&2
  exit 1
fi

SETTINGS_GET_JSON="$(admin_get "/api/admin/settings")"
SETTING_HIT="$(node -e 'const x=JSON.parse(process.argv[1]);const expected=process.argv[2];process.stdout.write(String(x?.data?.PICKUP_ADDRESS===expected));' "${SETTINGS_GET_JSON}" "${SETTING_MARKER}")"
if [[ "${SETTING_HIT}" != "true" ]]; then
  echo "[smoke-admin] settings readback mismatch" >&2
  exit 1
fi

echo "[smoke-admin] done (product=${PRODUCT_ID}, sku=${SKU_ID})"
