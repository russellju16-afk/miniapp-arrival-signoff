# 金蝶 + 小程序联调清单（M4）

## 1. 最小配置集合

1. `KD_CLIENT_ID`
2. `KD_CLIENT_SECRET`
3. `KD_APP_KEY`
4. `KD_APP_SECRET`
5. `KD_GW_ROUTER_ADDR`
6. `ADMIN_TOKEN`
7. （可选）`KD_LIVE_CHECK_WRITEBACK_PROBE=true`
8. （可选）`KD_LIVE_CHECK_PROBE_ORDER_ID=<CREATED|WRITEBACK_FAILED 订单ID>`

可选：

1. `WECHAT_APPID`
2. `WECHAT_APPSECRET`

## 2. 推荐联调顺序

1. `npm run doctor:env`
2. `npm run kd:live-check`
3. `POST /api/admin/products/upsert` + `POST /api/admin/products/:id/sku/upsert`
4. `POST /api/admin/customers/token/issue`
5. `POST /api/mini/login`
6. `POST /api/mini/cart/items` -> `POST /api/mini/orders`
7. `GET /api/admin/orders` -> `GET /api/admin/orders/:id`
8. `POST /api/admin/orders/:id/retry-writeback`（仅失败单）
9. `POST /api/admin/sync/run`（`jobName=sync:deliveries`）
10. `GET /api/mini/deliveries` -> `POST /api/mini/deliveries/:id/sign`
11. `GET /api/reconcile/statement?customerId=...`
12. `GET /api/mini/statements` -> `POST /api/mini/statements/:id/confirm`

## 3. 通过标准

1. `kd:live-check` 关键步骤均 `pass`。
2. `sync:deliveries` 连跑两次，第二次以 `skipped` 为主。
3. 小程序链路（登录 -> 下单 -> 查单 -> 签收 -> 对账 -> 确认）全通。
4. `npm run test` + `smoke:core` + `smoke:mini` + `smoke:mall` 全通过。

## 4. 阻塞项定位矩阵

| 阻塞现象 | 快速定位 | 处理建议 |
|---|---|---|
| token 刷新失败 | `kd:live-check` 的 `token-refresh` | 检查 `clientId/appKey/appSecret/clientSecret` |
| 鉴权失败/签名失败 | `kd:live-check` 的业务步骤 | 对照签名规则（path 编码、参数双重编码、末尾换行） |
| 小程序 401 | `/api/mini/login` 或 `/api/mini/*` | 重新签发客户 token，确认 `token_expires_at` |
| 同步没有数据 | `sync:deliveries` 返回 `totalRows=0` | 检查沙箱账套是否有样例数据、时间窗口是否过窄 |
| 签收重复冲突 | `DELIVERY_ALREADY_SIGNED` | 使用相同 `idempotencyKey` 重试，确认业务是否已签收 |
| 对账金额异常 | statement 明细不符合预期 | 检查 raw 数据里 customer_id 与当前 customer 映射关系 |
| 下单写回失败 | `ORDER_WRITEBACK_*` | 到 `/api/admin/orders/:id` 看 `writebackLogs` 里的 `requestId/traceId/summary` |
