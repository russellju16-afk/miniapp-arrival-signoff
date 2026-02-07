# Kingdee WeChat Backend

一个可运行、可部署的 Node.js 20 + TypeScript 后端项目，用于对接 **金蝶云星辰 OpenAPI**，并向 **微信小程序** 提供接口。

## 技术栈

- Node.js 20
- TypeScript
- Fastify
- PostgreSQL 16
- Redis
- Prisma ORM
- Docker + docker-compose

## 项目结构

```text
.
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
├── docker-compose.yml
├── docs
│   ├── api.md
│   └── architecture.md
├── package.json
├── prisma
│   ├── migrations
│   │   ├── 20260206195000_init
│   │   │   └── migration.sql
│   │   ├── 20260206202000_add_kingdee_tenant
│   │   │   └── migration.sql
│   │   ├── 20260206211000_add_sync_tables
│   │   │   └── migration.sql
│   │   ├── 20260206233000_add_mini_program_tables
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── scripts
│   ├── bootstrap.sh
│   └── health-check.sh
├── src
│   ├── app.ts
│   ├── config
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   └── redis.ts
│   ├── db
│   │   └── prisma.ts
│   ├── lib
│   │   └── kingdee-signature.ts
│   ├── modules
│   │   ├── common
│   │   │   ├── admin-auth.ts
│   │   │   └── app-error.ts
│   │   ├── health
│   │   │   └── health.route.ts
│   │   ├── kingdee
│   │   │   ├── kingdee-api.client.ts
│   │   │   └── kingdee.client.ts
│   │   ├── kingdee-tenant
│   │   │   ├── kingdee-tenant.repo.ts
│   │   │   ├── kingdee-tenant.route.ts
│   │   │   ├── kingdee-tenant.service.ts
│   │   │   └── kingdee-token.service.ts
│   │   ├── mini
│   │   │   ├── mini.repo.ts
│   │   │   ├── mini.route.ts
│   │   │   ├── mini.service.ts
│   │   │   └── mini.types.ts
│   │   ├── sync
│   │   │   ├── index.ts
│   │   │   ├── sync.repo.ts
│   │   │   ├── sync.route.ts
│   │   │   ├── sync.scheduler.ts
│   │   │   ├── sync.service.ts
│   │   │   └── sync.types.ts
│   │   └── wechat
│   │       ├── wechat.route.ts
│   │       └── wechat.service.ts
│   └── server.ts
└── tsconfig.json
```

## 环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

关键变量：

- `ADMIN_TOKEN`（管理接口 Bearer Token）
- `DATABASE_URL`
- `REDIS_URL`
- `KINGDEE_APP_TOKEN_BASE_URL`（默认 `https://api.kingdee.com`）
- `KINGDEE_APP_TOKEN_PATH`（默认 `/jdyconnector/app_management/kingdee_auth_token`）
- `KINGDEE_APP_TOKEN_METHOD`（默认 `GET`）
- `KINGDEE_APP_TOKEN_TIMEOUT_MS`（默认 `10000`）
- `KINGDEE_TOKEN_REFRESH_WINDOW_SECONDS`（默认 `600`，提前 10 分钟刷新）
- `SYNC_SCHEDULER_ENABLED`（默认 `true`）
- `SYNC_MASTER_DAILY_CRON`（默认 `0 2 * * *`）
- `SYNC_DOCUMENT_HOURLY_CRON`（默认 `0 * * * *`）
- `UPLOAD_DIR`（默认 `./uploads`）
- `UPLOAD_PUBLIC_BASE_URL`（默认 `http://localhost:3000`，用于拼接签名图片 URL）

## 本机启动命令

1. 安装依赖

```bash
npm install
```

2. 生成 Prisma Client

```bash
npm run prisma:generate
```

3. 执行数据库迁移

```bash
npm run prisma:migrate:dev -- --name init
```

4. 启动服务（开发模式）

```bash
npm run dev
```

## Docker 启动命令（app + postgres + redis）

1. 准备环境变量

```bash
cp .env.example .env
```

2. 一键启动

```bash
docker compose up -d --build
```

3. 查看 app 日志

```bash
docker compose logs -f app
```

## 数据库迁移命令

本机：

```bash
npm run prisma:migrate:dev -- --name add_mini_program_tables
```

Docker（运行中容器）：

```bash
docker compose exec app npm run prisma:migrate:deploy
```

## 健康检查

```bash
curl http://localhost:3000/health
```

## 数据同步模块

### 支持拉取的金蝶接口（GET）

- 客户列表: `/v2/bd/customer`
- 供应商列表: `/v2/bd/supplier`
- 销售订单列表/详情: `/v2/scm/sal_order` / `/v2/scm/sal_order_detail`
- 销售出库单列表/详情: `/v2/scm/sal_out_bound` / `/v2/scm/sal_out_bound_detail`
- 销售发票列表/详情: `/v2/scm/sal_invoice_list` / `/v2/scm/sal_invoice_detail`
- 采购订单列表/详情: `/v2/scm/pur_order` / `/v2/scm/pur_order_detail`
- 采购入库列表/详情: `/v2/scm/pur_inbound` / `/v2/scm/pur_inbound_detail`
- 采购发票列表: `/v2/scm/pur_invoice`
- 付款单列表/详情: `/v2/arap/ap_credit` / `/v2/arap/ap_credit_detail`
- 收款单列表/详情: `/v2/arap/ar_credit` / `/v2/arap/ar_credit_detail`
- 凭证列表: `/v2/fi/voucher`
- 商品库存列表: `/v2/scm/inventory`
- 仓库库存查询: `/v2/scm/inventory_stock`

### 分页与增量规则

- 通用分页参数：`page`（默认 1）、`page_size`（默认 50）
- 增量优先使用：`modify_start_time` / `modify_end_time`（毫秒）
- 接口不支持增量参数时自动降级为全量分页，并写入 warning

### 落库表

- `kingdee_raw`：原始数据 JSON（`tenant_id`, `biz_type`, `biz_id`, `data`, `hash`, `pulled_at`）
- `sync_job`：同步任务状态（`tenant_id`, `job_name`, `last_success_at`, `last_cursor`, `status`, `error`）

同一 `tenant_id + biz_type + biz_id` 下，如果最新 `hash` 未变化则跳过写入。

### 管理接口

1) 手动触发同步：

```bash
curl -X POST http://localhost:3000/admin/sync/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "tenantId": "your-tenant-id",
    "jobName": "sal_out_bound",
    "fromTime": 1738771200000,
    "toTime": 1738857600000
  }'
```

2) 查看同步状态：

```bash
curl "http://localhost:3000/admin/sync/status?tenantId=your-tenant-id" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### 定时任务（node-cron）

- 每天凌晨 2 点：`master_data_full`（客户、供应商、商品、库存）
- 每小时：`documents_incremental`（订单、出入库、发票、收付款）

### 演示：销售出库单列表 -> 详情 同步

1. 先写入 tenant（确保有 `clientId/clientSecret/app_key/app_secret/domain`）。
2. 手动触发：

```bash
curl -X POST http://localhost:3000/admin/sync/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "tenantId": "your-tenant-id",
    "jobName": "sal_out_bound"
  }'
```

3. 查询状态：

```bash
curl "http://localhost:3000/admin/sync/status?tenantId=your-tenant-id" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

4. 查库看 raw 数据（列表和详情）：

```bash
psql "$DATABASE_URL" -c "
SELECT biz_type, biz_id, pulled_at
FROM kingdee_raw
WHERE tenant_id = 'your-tenant-id'
  AND biz_type IN ('sal_out_bound', 'sal_out_bound_detail')
ORDER BY pulled_at DESC
LIMIT 20;
"
```

## KingdeeApiClient（通用调用器）

代码位置：`src/modules/kingdee/kingdee-api.client.ts`

类型定义：

- `KingdeeHttpMethod = "GET" | "POST"`
- `KingdeeQueryValue = string | number | boolean | null | undefined`
- `KingdeeApiRequest`

行为说明：

- 固定请求基址：`https://api.kingdee.com/jdy`
- 自动注入签名、token、router 头
- `query` 同时用于 URL 与签名
- 可靠性策略：
  - `5xx/网络错误`：指数退避重试 3 次
  - `401/鉴权失败`：自动刷新 token 后重试 1 次
  - `重复提交/时间戳过期`：刷新 timestamp/nonce 立即重试 1 次

## 小程序业务接口

鉴权规则：

- `POST /mini/login`：请求体传 `{ token }`
- 其他 `/mini/*` 接口：请求头 `Authorization: Bearer <customer_access_token>`
- `GET /mini/qrcode`：管理端接口，使用 `Authorization: Bearer <ADMIN_TOKEN>`

### 一次性准备演示数据（SQL）

先查一个 tenant：

```bash
psql "$DATABASE_URL" -c "SELECT id, app_key FROM kingdee_tenant LIMIT 1;"
```

写入 customer / delivery / statement 示例（把 `tenant-id` 和 `customer-id` 替换成真实值）：

```bash
psql "$DATABASE_URL" -c "
INSERT INTO customer (id, tenant_id, name, phone, kingdee_customer_id, access_token, token_expires_at, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'tenant-id',
  '张三门店',
  '13800000000',
  'KD_CUST_001',
  'mini-token-001',
  NOW() + INTERVAL '30 day',
  NOW(),
  NOW()
)
ON CONFLICT (access_token) DO UPDATE SET updated_at = NOW();

INSERT INTO delivery (id, tenant_id, customer_id, kingdee_doc_no, kingdee_doc_id, ship_date, items, status, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'tenant-id',
  '11111111-1111-1111-1111-111111111111',
  'SAL-OUT-20260206-001',
  'KD_DOC_001',
  NOW(),
  '[{\"sku\":\"A001\",\"name\":\"测试商品\",\"qty\":2}]'::jsonb,
  'PENDING',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

INSERT INTO statement (id, tenant_id, customer_id, period_start, period_end, total_amount, currency, status, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'tenant-id',
  '11111111-1111-1111-1111-111111111111',
  '2026-02-01T00:00:00.000Z',
  '2026-02-28T23:59:59.999Z',
  1999.50,
  'CNY',
  'PENDING',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

INSERT INTO statement_line (id, statement_id, doc_type, doc_no, doc_date, amount, raw, created_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'sal_out_bound',
  'SAL-OUT-20260206-001',
  NOW(),
  1999.50,
  '{\"demo\":true}'::jsonb,
  NOW()
)
ON CONFLICT DO NOTHING;
"
```

### 小程序端调用示例

1) 登录

```bash
curl -X POST http://localhost:3000/mini/login \
  -H "Content-Type: application/json" \
  -d '{"token":"mini-token-001"}'
```

2) 待签收列表

```bash
curl http://localhost:3000/mini/deliveries \
  -H "Authorization: Bearer mini-token-001"
```

3) 发货单详情

```bash
curl http://localhost:3000/mini/deliveries/22222222-2222-2222-2222-222222222222 \
  -H "Authorization: Bearer mini-token-001"
```

4) 签收提交（`signatureBase64`/`photosBase64` 可传 data URL 或纯 base64）

```bash
curl -X POST http://localhost:3000/mini/deliveries/22222222-2222-2222-2222-222222222222/sign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mini-token-001" \
  -d '{
    "signerName": "张三",
    "signedAt": "2026-02-06T13:00:00.000Z",
    "signatureBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "photosBase64": [],
    "remark": "货物完好"
  }'
```

5) 对账单列表

```bash
curl "http://localhost:3000/mini/statements?from=2026-02-01&to=2026-02-28" \
  -H "Authorization: Bearer mini-token-001"
```

6) 对账单详情

```bash
curl http://localhost:3000/mini/statements/33333333-3333-3333-3333-333333333333 \
  -H "Authorization: Bearer mini-token-001"
```

7) 确认对账单

```bash
curl -X POST http://localhost:3000/mini/statements/33333333-3333-3333-3333-333333333333/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mini-token-001" \
  -d '{
    "confirmedAt": "2026-02-06T14:00:00.000Z",
    "remark": "确认无误"
  }'
```

8) 生成客户登录二维码（管理端）

```bash
curl "http://localhost:3000/mini/qrcode?token=mini-token-001" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

## 已实现接口

- `GET /`
- `GET /health`
- `POST /webhook/kingdee/auth`
- `POST /admin/kingdee/tenant/upsert`
- `GET /admin/kingdee/tenant/list`
- `POST /admin/kingdee/token/refresh`
- `GET /admin/kingdee/token/status`
- `POST /admin/kingdee/proxy`
- `POST /admin/sync/run`
- `GET /admin/sync/status`
- `POST /mini/login`
- `GET /mini/deliveries`
- `GET /mini/deliveries/:id`
- `POST /mini/deliveries/:id/sign`
- `GET /mini/statements`
- `GET /mini/statements/:id`
- `POST /mini/statements/:id/confirm`
- `GET /mini/qrcode`
- `POST /api/wechat/signoffs`
- `GET /api/wechat/signoffs/:deliveryNo`

详细示例见 `docs/api.md`。
