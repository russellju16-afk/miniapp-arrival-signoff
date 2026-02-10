# Core API 文档（主线：`/api/*`）

## 1. 通用响应

成功：

```json
{
  "ok": true,
  "requestId": "xxx",
  "data": {}
}
```

失败：

```json
{
  "ok": false,
  "code": "ERROR_CODE",
  "message": "错误描述",
  "requestId": "xxx",
  "details": null
}
```

## 2. 健康与诊断

- `GET /api/health`
- `GET /api/kd/ping`
- 命令行诊断：`npm run kd:live-check`

## 3. 金蝶业务读取（首批）

- `GET /api/kd/customer/list`
- `GET /api/kd/sales/outbound/list`
- `GET /api/kd/sales/outbound/detail?id=...|number=...`
- `GET /api/kd/receipt/list`
- `GET /api/kd/receipt/detail?id=...|number=...`

说明：query 参数会参与签名。

## 4. 同步任务

- `POST /api/kd/sync/deliveries`
- `POST /api/kd/sync/receipts`

请求体：

```json
{
  "fromTime": 1738771200000,
  "toTime": 1738857600000
}
```

响应会包含 `warnings`（例如详情接口 id 失败后自动回退 number）。

## 5. 小程序主线接口（Bearer customer access token）

### 5.1 登录

- `POST /api/mini/login`

请求体：

```json
{
  "token": "customer_access_token"
}
```

### 5.2 发货单

- `GET /api/mini/deliveries?page=1&pageSize=20`
- `GET /api/mini/deliveries/:id`
- `POST /api/mini/deliveries/:id/sign`

签收请求体：

```json
{
  "signerName": "张三",
  "signedAt": "2026-02-08T10:00:00.000Z",
  "signatureBase64": "data:image/png;base64,...",
  "photosBase64": ["data:image/jpeg;base64,..."],
  "remark": "货物完好",
  "idempotencyKey": "sign-idem-0001"
}
```

幂等键支持：
- header: `x-idempotency-key`
- body: `idempotencyKey`

### 5.3 对账单

- `GET /api/mini/statements?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/mini/statements/:id`
- `POST /api/mini/statements/:id/confirm`

确认请求体：

```json
{
  "confirmedAt": "2026-02-08T12:00:00.000Z",
  "remark": "确认无误"
}
```

### 5.4 商城（M3）

- `GET /api/mini/products?page=1&pageSize=20`
- `GET /api/mini/products/:id`
- `GET /api/mini/cart`
- `POST /api/mini/cart/items`
- `PATCH /api/mini/cart/items/:id`
- `DELETE /api/mini/cart/items/:id`
- `POST /api/mini/orders`
- `GET /api/mini/orders?page=1&pageSize=20&status=CONFIRMED`
- `GET /api/mini/orders/:id`
- `POST /api/mini/orders/:id/cancel`

加购物车请求体：

```json
{
  "skuId": "sku-uuid",
  "qty": 2
}
```

下单请求体（`items` 为空时默认按当前购物车下单）：

```json
{
  "remark": "线下结算",
  "items": [
    { "skuId": "sku-uuid", "qty": 2 }
  ]
}
```

下单幂等要求：

- header: `x-idempotency-key`（推荐）
- 同 `customer + key` 重复提交会直接返回首单结果

## 6. 管理接口（Bearer ADMIN_TOKEN）

- `POST /api/admin/customers/token/issue`
- `GET /api/admin/customers`
- `POST /api/admin/products/upsert`
- `GET /api/admin/products`
- `POST /api/admin/products/:id/sku/upsert`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `POST /api/admin/orders/:id/retry-writeback`
- `POST /api/admin/orders/:id/cancel`
- `POST /api/admin/sync/run`
- `GET /api/admin/sync/status`
- `GET /api/admin/settings`
- `POST /api/admin/settings`
- `POST /api/admin/settings/test-webhook?type=ORDER|LOGISTICS|FINANCE|QUOTE|REGISTRATION`

说明：`/api/admin/sync/*` 已迁移到 core 同步引擎（SQLite），支持 `jobName=sync:deliveries|sync:receipts|sync:all`（兼容别名如 `deliveries/receipts`）。

### 6.1 签发/刷新客户访问 token

`POST /api/admin/customers/token/issue`

请求体（`customerId` 和 `kingdeeCustomerId` 至少一个）：

```json
{
  "customerId": "uuid",
  "kingdeeCustomerId": "KD-CUST-001",
  "name": "客户A",
  "phone": "13800000000",
  "ttlDays": 30
}
```

### 6.2 触发同步任务（core）

`POST /api/admin/sync/run`

请求体：

```json
{
  "jobName": "sync:deliveries",
  "fromTime": 1738771200000,
  "toTime": 1738857600000
}
```

`GET /api/admin/sync/status?jobName=sync:deliveries`

### 6.3 商品与订单管理（M3）

`POST /api/admin/products/upsert`

```json
{
  "code": "SPU-1001",
  "name": "演示商品",
  "description": "可选",
  "status": "ACTIVE",
  "defaultUnitId": "Pcs",
  "kingdeeMaterialId": "MAT-1001"
}
```

`POST /api/admin/products/:id/sku/upsert`

```json
{
  "skuCode": "SKU-1001",
  "skuName": "标准件",
  "price": 88.5,
  "stock": 50,
  "status": "ACTIVE",
  "unitId": "Pcs",
  "kingdeeMaterialId": "MAT-1001",
  "specs": { "颜色": "蓝色", "尺码": "L" }
}
```

`POST /api/admin/orders/:id/retry-writeback`：

- 仅允许状态 `CREATED` / `WRITEBACK_FAILED` 重试
- 重试成功后订单状态更新为 `CONFIRMED`
- 响应包含 `beforeStatus/afterStatus/writeback(requestId/traceId/summary)` 便于追踪

`GET /api/admin/orders?page=1&pageSize=20&status=WRITEBACK_FAILED&customerId=...&orderNo=SO`

`GET /api/admin/orders/:id`：

- 返回订单基础信息、客户信息、行项目、关联签收单、最近写回日志

`POST /api/admin/orders/:id/cancel`：

```json
{
  "remark": "客户申请取消"
}
```

- 仅允许状态 `CREATED` / `WRITEBACK_FAILED`
- 成功后状态变更为 `CANCELED`

### 6.4 系统设置（持久化）

`GET /api/admin/settings`：

- 读取 settings 表中的配置（JSON 值原样返回）

`POST /api/admin/settings`（推荐）：

```json
{
  "ORDER_WEBHOOK": "https://open.feishu.cn/open-apis/bot/v2/hook/xxx",
  "LOGISTICS_WEBHOOK": "https://open.feishu.cn/open-apis/bot/v2/hook/yyy",
  "FINANCE_WEBHOOK": "",
  "QUOTE_WEBHOOK": "",
  "REGISTRATION_WEBHOOK": "",
  "PICKUP_ADDRESS": "深圳市南山区科技园仓A-1号门",
  "EXCLUDED_WAREHOUSE_CODES": ["DEFECT", "BAD-STOCK"],
  "PRICING_CONTEXT": {
    "billTypeId": "BT-001",
    "currencyId": "CNY",
    "exchangeRate": "1",
    "currency": "CNY"
  }
}
```

兼容写法：`PUT /api/admin/settings`（与 `POST` 等价）。

`POST /api/admin/settings/test-webhook?type=ORDER`：

```json
{
  "title": "ORDER webhook 测试",
  "lines": ["source=admin-ui", "time=2026-02-08T07:00:00.000Z"]
}
```

说明：

- `type` 会映射到内部 key：`ORDER_WEBHOOK` / `LOGISTICS_WEBHOOK` / `FINANCE_WEBHOOK` / `QUOTE_WEBHOOK` / `REGISTRATION_WEBHOOK`
- 也可直接调用 `POST /api/admin/settings/webhook/test` 并在 body 传 `key` / `webhookUrl`

## 7. 兼容接口（deprecated）

`/mini/*` 与 `/admin/sync/*` 仍可用，但响应头会返回：

说明：`/admin/sync/*` 仅保留历史路径，内部已转发到与 `/api/admin/sync/*` 相同的 core 同步逻辑。

- `Deprecation: true`
- `Sunset: Mon, 30 Jun 2026 00:00:00 GMT`
- `Link: </api/mini/login>; rel="successor-version"`（小程序）
- `Link: </api/admin/sync/run>; rel="successor-version"`（同步管理）

## 8. 常见错误码

- `KD_CONFIG_MISSING`：缺少金蝶凭据
- `KD_REQUIRED_PARAMS_MISSING`：调用接口缺少必填参数
- `KD_HTTP_ERROR`：金蝶返回非 200
- `KD_NETWORK_ERROR`：网络异常
- `MINI_UNAUTHORIZED`：小程序 token 无效或缺失
- `MINI_TOKEN_EXPIRED`：小程序 token 已过期
- `DELIVERY_NOT_FOUND`：未找到签收单
- `DELIVERY_ALREADY_SIGNED`：重复签收
- `RECONCILIATION_NOT_FOUND`：未找到对账单
- `ORDER_ITEMS_EMPTY`：下单商品为空
- `ORDER_WRITEBACK_PARAM_INVALID`：订单写回请求参数不合法
- `ORDER_WRITEBACK_REMOTE_REJECTED`：订单写回被金蝶远端拒绝
- `ORDER_RETRY_NOT_ALLOWED`：当前订单状态不可重试写回
- `ORDER_CANCEL_NOT_ALLOWED`：当前订单状态不可取消
