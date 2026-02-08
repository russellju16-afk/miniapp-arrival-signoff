# 金蝶云星辰 + 微信小程序后端（M4 联调加固版）

在现有仓库上增量演进，当前策略：

- 主线：`/api/*`
- 兼容：`/mini/*`（deprecated，仅兼容旧调用）
- 双库保留：`core(SQLite)` + `legacy(Postgres)`，新功能只进 `core`

提示：`/api/admin/sync/*` 与 `/admin/sync/*` 都已转发到 core(SQLite) 主线；`/admin/sync/*` 仅作为 deprecated 兼容入口保留。

## 1. 路由分层

- `core` 主线接口：`/api/*`
- `legacy` 兼容接口：`/mini/*`

`/mini/*` 会返回弃用响应头（`Deprecation/Sunset/Link`），建议尽快迁移到 `/api/mini/*`。

## 2. 环境变量

先复制模板：

```bash
cp .env.example .env
```

核心配置：

```env
NODE_ENV=development
PORT=3000
DB_URL=file:./prisma/core/dev.db
ADMIN_TOKEN=dev-admin-token

KD_BASE_URL=https://api.kingdee.com
KD_GW_ROUTER_ADDR=https://tf.jdy.com
KD_CLIENT_ID=
KD_CLIENT_SECRET=
KD_APP_KEY=
KD_APP_SECRET=
KD_APP_TOKEN_PATH=/jdyconnector/app_management/kingdee_auth_token
KD_APP_TOKEN_METHOD=GET
KD_TIMEOUT_MS=10000
KD_TOKEN_CACHE_HOURS=24
KD_MOCK_MODE=true
KD_LIVE_CHECK_WRITEBACK_PROBE=false
KD_LIVE_CHECK_PROBE_ORDER_ID=
```

说明：

- `KD_MOCK_MODE=true`：可在无真实凭据时完成同步与烟测。
- `NODE_ENV=production` 会强校验 `KD_CLIENT_ID/KD_CLIENT_SECRET/KD_APP_KEY/KD_APP_SECRET`。
- `KD_LIVE_CHECK_WRITEBACK_PROBE=true`：启用 `kd:live-check` 写回探测（需提供 `KD_LIVE_CHECK_PROBE_ORDER_ID`，且订单状态必须是 `CREATED` 或 `WRITEBACK_FAILED`）。

## 3. 常用命令

```bash
npm run doctor:env
npm run core:prisma:generate
npm run core:db:push
npm run extract:endpoints
npm run dev
npm run build
npm run test

npm run kd:ping
npm run kd:live-check

npm run sync:deliveries
npm run sync:receipts
npm run sync:demo

npm run smoke:core
npm run smoke:mini
npm run smoke:mall
npm run smoke:mall:live
```

## 4. 本地启动

```bash
npm install
npm run core:prisma:generate
npm run core:db:push
npm run extract:endpoints
npm run dev
```

健康检查：

```bash
curl http://localhost:3000/api/health
```

## 5. M2 联调主线（小程序）

### 5.1 管理同步（core 主线）

```bash
curl -X POST http://localhost:3000/api/admin/sync/run \
  -H 'Authorization: Bearer dev-admin-token' \
  -H 'Content-Type: application/json' \
  -d '{"jobName":"sync:deliveries"}'

curl "http://localhost:3000/api/admin/sync/status" \
  -H 'Authorization: Bearer dev-admin-token'
```

`jobName` 支持：`sync:deliveries`、`sync:receipts`、`sync:all`（兼容 `deliveries/receipts`）。

### 5.2 管理员签发客户 token

```bash
curl -X POST http://localhost:3000/api/admin/customers/token/issue \
  -H 'Authorization: Bearer dev-admin-token' \
  -H 'Content-Type: application/json' \
  -d '{"customerId":"<customerId>","ttlDays":30}'
```

### 5.3 小程序登录

```bash
curl -X POST http://localhost:3000/api/mini/login \
  -H 'Content-Type: application/json' \
  -d '{"token":"<customer_access_token>"}'
```

### 5.4 发货单与签收

```bash
curl "http://localhost:3000/api/mini/deliveries?page=1&pageSize=20" \
  -H "Authorization: Bearer <customer_access_token>"

curl "http://localhost:3000/api/mini/deliveries/<deliveryId>" \
  -H "Authorization: Bearer <customer_access_token>"

curl -X POST "http://localhost:3000/api/mini/deliveries/<deliveryId>/sign" \
  -H "Authorization: Bearer <customer_access_token>" \
  -H 'Content-Type: application/json' \
  -H 'x-idempotency-key: sign-idem-0001' \
  -d '{"signerName":"张三","remark":"已签收"}'
```

### 5.5 对账与确认

先生成对账单（core 业务接口）：

```bash
curl "http://localhost:3000/api/reconcile/statement?customerId=<customerId>&from=2026-02-01&to=2026-02-28"
```

再走小程序查询/确认：

```bash
curl "http://localhost:3000/api/mini/statements?from=2026-02-01&to=2026-02-28" \
  -H "Authorization: Bearer <customer_access_token>"

curl "http://localhost:3000/api/mini/statements/<statementId>" \
  -H "Authorization: Bearer <customer_access_token>"

curl -X POST "http://localhost:3000/api/mini/statements/<statementId>/confirm" \
  -H "Authorization: Bearer <customer_access_token>" \
  -H 'Content-Type: application/json' \
  -d '{"remark":"确认无误"}'
```

### 5.6 商城下单（M3）

管理端先创建商品与 SKU（SKU 需配置 `unitId` 与 `kingdeeMaterialId`，用于写回金蝶）：

```bash
curl -X POST http://localhost:3000/api/admin/products/upsert \
  -H 'Authorization: Bearer dev-admin-token' \
  -H 'Content-Type: application/json' \
  -d '{"code":"SPU-1001","name":"演示商品","status":"ACTIVE","defaultUnitId":"Pcs","kingdeeMaterialId":"MAT-1001"}'

curl -X POST http://localhost:3000/api/admin/products/<productId>/sku/upsert \
  -H 'Authorization: Bearer dev-admin-token' \
  -H 'Content-Type: application/json' \
  -d '{"skuCode":"SKU-1001","skuName":"标准件","price":88.5,"stock":50,"unitId":"Pcs","kingdeeMaterialId":"MAT-1001","status":"ACTIVE","specs":{"颜色":"蓝色"}}'
```

小程序链路：

```bash
curl "http://localhost:3000/api/mini/products?page=1&pageSize=20" \
  -H "Authorization: Bearer <customer_access_token>"

curl -X POST "http://localhost:3000/api/mini/cart/items" \
  -H "Authorization: Bearer <customer_access_token>" \
  -H 'Content-Type: application/json' \
  -d '{"skuId":"<skuId>","qty":2}'

curl -X POST "http://localhost:3000/api/mini/orders" \
  -H "Authorization: Bearer <customer_access_token>" \
  -H 'x-idempotency-key: order-idem-0001' \
  -H 'Content-Type: application/json' \
  -d '{"remark":"线下结算"}'
```

说明：

- 下单会同步调用金蝶销售订单保存接口（从 `kingdee_endpoints.json` 读取）。
- 成功状态：`CONFIRMED`；失败状态：`WRITEBACK_FAILED`（写入 `order_writeback_logs`，可走管理接口重试）。

### 5.7 订单运营后台（M4）

```bash
curl "http://localhost:3000/api/admin/orders?page=1&pageSize=20&status=WRITEBACK_FAILED" \
  -H "Authorization: Bearer dev-admin-token"

curl "http://localhost:3000/api/admin/orders/<orderId>" \
  -H "Authorization: Bearer dev-admin-token"

curl -X POST "http://localhost:3000/api/admin/orders/<orderId>/retry-writeback" \
  -H "Authorization: Bearer dev-admin-token"

curl -X POST "http://localhost:3000/api/admin/orders/<orderId>/cancel" \
  -H "Authorization: Bearer dev-admin-token" \
  -H 'Content-Type: application/json' \
  -d '{"remark":"客户申请取消"}'
```

## 6. 同步与幂等

- `sync:deliveries`：销售出库 list -> detail，同步到 raw + deliveries。
- `sync:receipts`：收款 list -> detail，同步到 raw。
- raw 幂等：`docType + kingdeeId + hash`。
- 签收幂等：`delivery + idempotencyKey`，重复请求返回幂等成功。

## 7. 数据模型（core）

`prisma/core/schema.prisma` 当前核心表：

- `kingdee_tokens`
- `kingdee_raw_documents`
- `customers`（含 `phone/access_token/token_expires_at`）
- `deliveries`
- `reconciliations`
- `reconciliation_lines`
- `sync_checkpoints`

## 8. 验收命令

```bash
npm run kd:live-check
npm run smoke:core
npm run smoke:mini
npm run smoke:mall
npm run smoke:mall:live
npm run test
```

## 9. 常见报错排查

| 问题 | 现象 | 排查建议 |
|---|---|---|
| 缺少凭据 | `KD_CONFIG_MISSING` | 检查 `.env` 的 `KD_CLIENT_ID/KD_CLIENT_SECRET/KD_APP_KEY/KD_APP_SECRET` |
| 签名不一致 | 鉴权失败 | 检查 path 编码、参数双重编码、末尾换行 |
| 时间戳过期 | 重复提交/时间偏差报错 | 校准服务器时间，保证毫秒时间戳 |
| 网关地址错误 | 接口不可达或鉴权异常 | 核对 `KD_GW_ROUTER_ADDR` 与授权 domain |
| token 失效 | `401` | 使用 `kd:live-check` 验证 refresh 链路 |
| 无法小程序登录 | `MINI_UNAUTHORIZED` | 先调用 `/api/admin/customers/token/issue` 签发 token |
| 订单写回参数错误 | `ORDER_WRITEBACK_PARAM_INVALID` | 检查 `customer_id/material_entity/unit_id/price/qty` 与 SKU 映射 |
| 订单写回被远端拒绝 | `ORDER_WRITEBACK_REMOTE_REJECTED` | 看订单 `writebackLogs` 的 `requestId/traceId/summary` 并复核签名、权限、网关 |

## 10. 联调清单

详见 `/Users/russell/小程序到货签收/docs/integration-checklist.md`。
