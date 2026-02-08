#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

export KD_MOCK_MODE="${KD_MOCK_MODE:-true}"
export DB_URL="${DB_URL:-file:./prisma/core/dev.db}"
export ADMIN_TOKEN="${ADMIN_TOKEN:-dev-admin-token}"

echo "[smoke-mall] doctor:env"
npm run doctor:env >/dev/null

echo "[smoke-mall] core:db:push"
npm run core:db:push >/dev/null

echo "[smoke-mall] extract:endpoints"
npm run extract:endpoints >/dev/null

echo "[smoke-mall] start server"
npm run dev >/tmp/smoke-mall-server.log 2>&1 &
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

RAND="$(date +%s)"
PRODUCT_CODE="SMOKE-${RAND}"
SKU_CODE="SMOKE-SKU-${RAND}"
KINGDEE_MATERIAL_ID="MAT-${RAND}"
UNIT_ID="Pcs"
KINGDEE_CUSTOMER_ID="KD-CUST-${RAND}"


echo "[smoke-mall] upsert product"
PRODUCT_JSON="$(curl -fsS -X POST "http://localhost:3000/api/admin/products/upsert" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"${PRODUCT_CODE}\",\"name\":\"商城烟测商品-${RAND}\",\"description\":\"smoke mall\",\"status\":\"ACTIVE\",\"defaultUnitId\":\"${UNIT_ID}\",\"kingdeeMaterialId\":\"${KINGDEE_MATERIAL_ID}\"}")"
PRODUCT_ID="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.id||"")' "${PRODUCT_JSON}")"
if [[ -z "${PRODUCT_ID}" ]]; then
  echo "[smoke-mall] 创建商品失败" >&2
  exit 1
fi

echo "[smoke-mall] upsert sku"
SKU_JSON="$(curl -fsS -X POST "http://localhost:3000/api/admin/products/${PRODUCT_ID}/sku/upsert" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"skuCode\":\"${SKU_CODE}\",\"skuName\":\"标准件\",\"price\":88.5,\"stock\":50,\"status\":\"ACTIVE\",\"unitId\":\"${UNIT_ID}\",\"kingdeeMaterialId\":\"${KINGDEE_MATERIAL_ID}\",\"specs\":{\"颜色\":\"蓝色\",\"尺码\":\"L\"}}")"
SKU_ID="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.id||"")' "${SKU_JSON}")"
if [[ -z "${SKU_ID}" ]]; then
  echo "[smoke-mall] 创建 SKU 失败" >&2
  exit 1
fi

echo "[smoke-mall] issue mini customer token"
ISSUE_JSON="$(curl -fsS -X POST "http://localhost:3000/api/admin/customers/token/issue" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"kingdeeCustomerId\":\"${KINGDEE_CUSTOMER_ID}\",\"name\":\"烟测客户-${RAND}\",\"ttlDays\":30}")"
CUSTOMER_TOKEN="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.accessToken||"")' "${ISSUE_JSON}")"
if [[ -z "${CUSTOMER_TOKEN}" ]]; then
  echo "[smoke-mall] 签发客户 token 失败" >&2
  exit 1
fi


echo "[smoke-mall] mini login"
LOGIN_JSON="$(curl -fsS -X POST "http://localhost:3000/api/mini/login" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"${CUSTOMER_TOKEN}\"}")"
LOGIN_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && x?.data?.customer?.id)))' "${LOGIN_JSON}")"
if [[ "${LOGIN_OK}" != "true" ]]; then
  echo "[smoke-mall] mini/login 失败" >&2
  exit 1
fi

echo "[smoke-mall] add cart item"
CART_JSON="$(curl -fsS -X POST "http://localhost:3000/api/mini/cart/items" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"skuId\":\"${SKU_ID}\",\"qty\":2}")"
CART_COUNT="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String((x?.data?.items||[]).length))' "${CART_JSON}")"
if [[ "${CART_COUNT}" -lt 1 ]]; then
  echo "[smoke-mall] 加购物车失败" >&2
  exit 1
fi

echo "[smoke-mall] create order"
IDEM_KEY="smoke-mall-${RAND}"
ORDER_JSON="$(curl -fsS -X POST "http://localhost:3000/api/mini/orders" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" \
  -H "x-idempotency-key: ${IDEM_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"remark":"smoke mall"}')"
ORDER_ID="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.id||"")' "${ORDER_JSON}")"
ORDER_STATUS="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.status||"")' "${ORDER_JSON}")"
if [[ -z "${ORDER_ID}" ]]; then
  echo "[smoke-mall] 下单失败" >&2
  exit 1
fi

echo "[smoke-mall] verify idempotency"
ORDER_JSON_RETRY="$(curl -fsS -X POST "http://localhost:3000/api/mini/orders" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}" \
  -H "x-idempotency-key: ${IDEM_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"remark":"smoke mall retry"}')"
ORDER_ID_RETRY="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(x?.data?.id||"")' "${ORDER_JSON_RETRY}")"
if [[ "${ORDER_ID_RETRY}" != "${ORDER_ID}" ]]; then
  echo "[smoke-mall] 幂等校验失败" >&2
  exit 1
fi

echo "[smoke-mall] order detail"
DETAIL_JSON="$(curl -fsS "http://localhost:3000/api/mini/orders/${ORDER_ID}" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}")"
DETAIL_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && x?.data?.id)))' "${DETAIL_JSON}")"
if [[ "${DETAIL_OK}" != "true" ]]; then
  echo "[smoke-mall] 订单详情失败" >&2
  exit 1
fi

echo "[smoke-mall] orders list"
LIST_JSON="$(curl -fsS "http://localhost:3000/api/mini/orders?page=1&pageSize=20" \
  -H "Authorization: Bearer ${CUSTOMER_TOKEN}")"
LIST_HIT="$(node -e 'const x=JSON.parse(process.argv[1]);const items=x?.data?.items||[];process.stdout.write(String(items.some(i=>i.id===process.argv[2])));' "${LIST_JSON}" "${ORDER_ID}")"
if [[ "${LIST_HIT}" != "true" ]]; then
  echo "[smoke-mall] 订单列表未命中" >&2
  exit 1
fi

echo "[smoke-mall] admin orders list"
ADMIN_LIST_JSON="$(curl -fsS "http://localhost:3000/api/admin/orders?page=1&pageSize=20" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}")"
ADMIN_LIST_HIT="$(node -e 'const x=JSON.parse(process.argv[1]);const items=x?.data?.items||[];process.stdout.write(String(items.some(i=>i.id===process.argv[2])));' "${ADMIN_LIST_JSON}" "${ORDER_ID}")"
if [[ "${ADMIN_LIST_HIT}" != "true" ]]; then
  echo "[smoke-mall] 管理端订单列表未命中" >&2
  exit 1
fi

echo "[smoke-mall] admin order detail"
ADMIN_DETAIL_JSON="$(curl -fsS "http://localhost:3000/api/admin/orders/${ORDER_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}")"
ADMIN_DETAIL_OK="$(node -e 'const x=JSON.parse(process.argv[1]);process.stdout.write(String(Boolean(x?.ok && x?.data?.id===process.argv[2])));' "${ADMIN_DETAIL_JSON}" "${ORDER_ID}")"
if [[ "${ADMIN_DETAIL_OK}" != "true" ]]; then
  echo "[smoke-mall] 管理端订单详情失败" >&2
  exit 1
fi

echo "[smoke-mall] admin cancel confirmed order should be rejected"
CANCEL_HTTP_CODE="$(curl -s -o /tmp/smoke-mall-cancel.json -w '%{http_code}' -X POST "http://localhost:3000/api/admin/orders/${ORDER_ID}/cancel" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"remark":"smoke cancel"}')"
if [[ "${CANCEL_HTTP_CODE}" != "409" ]]; then
  echo "[smoke-mall] 预期取消已确认订单返回 409，实际 ${CANCEL_HTTP_CODE}" >&2
  exit 1
fi

echo "[smoke-mall] done (order=${ORDER_ID}, status=${ORDER_STATUS})"
