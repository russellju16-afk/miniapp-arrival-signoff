# API 说明

## 1) 健康检查

- `GET /health`
- 响应示例：

```json
{
  "ok": true,
  "time": "2026-02-06T12:00:00.000Z",
  "env": "development"
}
```

## 2) 金蝶授权 Webhook

- `POST /webhook/kingdee/auth`
- 说明：接收金蝶推送授权信息并按 `app_key` upsert 到 `kingdee_tenant`。
- 请求体（示例）：

```json
{
  "name": "总部账套",
  "client_id": "client-id",
  "client_secret": "client-secret",
  "app_key": "app-key",
  "app_secret": "app-secret",
  "domain": "https://api.kingdee.com"
}
```

- 响应：

```json
{
  "ok": true
}
```

## 3) 管理接口：手工 upsert tenant

- `POST /admin/kingdee/tenant/upsert`
- Header：
  - `Authorization: Bearer <ADMIN_TOKEN>`

- 请求体：

```json
{
  "name": "总部账套",
  "clientId": "client-id",
  "clientSecret": "client-secret",
  "app_key": "app-key",
  "app_secret": "app-secret",
  "domain": "https://api.kingdee.com",
  "app_token": "optional-app-token",
  "token_expires_at": "2026-02-07T00:00:00.000Z"
}
```

## 4) 管理接口：tenant 列表

- `GET /admin/kingdee/tenant/list`
- Header：
  - `Authorization: Bearer <ADMIN_TOKEN>`

## 5) 管理接口：刷新 app-token

- `POST /admin/kingdee/token/refresh`
- Header：
  - `Authorization: Bearer <ADMIN_TOKEN>`

- 请求体：

```json
{
  "tenantId": "tenant-id"
}
```

## 6) 管理接口：token 状态

- `GET /admin/kingdee/token/status`
- Header：
  - `Authorization: Bearer <ADMIN_TOKEN>`

## 7) 管理接口：金蝶代理调试

- `POST /admin/kingdee/proxy`
- Header：
  - `Authorization: Bearer <ADMIN_TOKEN>`

- 请求体：

```json
{
  "tenantId": "tenant-id",
  "method": "POST",
  "path": "/v2/bd/customer",
  "query": {
    "pagesize": 100,
    "page": 1
  },
  "body": {
    "name": "测试客户"
  }
}
```

- 响应：
  - 透传金蝶返回 JSON（用于调试接口连通性）

## 8) 管理接口：手动触发同步

- `POST /admin/sync/run`
- Header：
  - `Authorization: Bearer <ADMIN_TOKEN>`

- 请求体：

```json
{
  "tenantId": "tenant-id",
  "jobName": "sal_out_bound",
  "fromTime": 1738771200000,
  "toTime": 1738857600000
}
```

- 响应示例：

```json
{
  "ok": true,
  "requestId": "...",
  "data": {
    "tenantId": "tenant-id",
    "jobName": "sal_out_bound",
    "fromTime": 1738771200000,
    "toTime": 1738857600000,
    "totalPulled": 120,
    "totalInserted": 95,
    "totalSkipped": 25,
    "warnings": []
  }
}
```

## 9) 管理接口：同步状态

- `GET /admin/sync/status?tenantId=tenant-id`
- Header：
  - `Authorization: Bearer <ADMIN_TOKEN>`

## 10) 微信小程序签收上报

- `POST /api/wechat/signoffs`
- Header：
  - `x-idempotency-key: <唯一幂等键>`（也可放在 body 的 `idempotencyKey`）
  - `x-request-id: <可选请求ID>`

## 11) 查询签收记录

- `GET /api/wechat/signoffs/:deliveryNo`

## 12) 小程序登录

- `POST /mini/login`
- 请求体：

```json
{
  "token": "customer_access_token"
}
```

## 13) 小程序待签收列表

- `GET /mini/deliveries`
- Header:
  - `Authorization: Bearer <customer_access_token>`

## 14) 小程序发货单详情

- `GET /mini/deliveries/:id`
- Header:
  - `Authorization: Bearer <customer_access_token>`

## 15) 小程序签收提交

- `POST /mini/deliveries/:id/sign`
- Header:
  - `Authorization: Bearer <customer_access_token>`
- 请求体：

```json
{
  "signerName": "张三",
  "signedAt": "2026-02-06T13:00:00.000Z",
  "signatureBase64": "data:image/png;base64,...",
  "photosBase64": ["data:image/jpeg;base64,..."],
  "remark": "货物完好"
}
```

## 16) 小程序对账单列表

- `GET /mini/statements?from=YYYY-MM-DD&to=YYYY-MM-DD`
- Header:
  - `Authorization: Bearer <customer_access_token>`

## 17) 小程序对账单详情

- `GET /mini/statements/:id`
- Header:
  - `Authorization: Bearer <customer_access_token>`

## 18) 小程序确认对账单

- `POST /mini/statements/:id/confirm`
- Header:
  - `Authorization: Bearer <customer_access_token>`
- 请求体：

```json
{
  "confirmedAt": "2026-02-06T14:00:00.000Z",
  "remark": "确认无误"
}
```

## 19) 生成二维码（管理端）

- `GET /mini/qrcode?token=xxx`
- Header:
  - `Authorization: Bearer <ADMIN_TOKEN>`
