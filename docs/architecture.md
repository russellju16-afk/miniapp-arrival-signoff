# 架构说明

本项目定位为微信小程序的后端网关，负责：

1. 提供小程序签收接口。
2. 对接金蝶云星辰 OpenAPI。
3. 接收金蝶授权回调并持久化 tenant 授权信息。
4. 提供管理员接口手工维护授权信息。
5. 将签收数据落库（PostgreSQL）。
6. 使用 Redis 做 token 缓存、幂等防重。
7. 提供数据同步模块，定时/手动从金蝶拉取数据并以 raw JSON 入库。

## 分层结构

- `src/config`：环境变量、日志、Redis 客户端。
- `src/db`：Prisma 客户端。
- `src/modules/health`：健康检查。
- `src/modules/kingdee`：金蝶 OpenAPI 客户端（包含通用调用器 KingdeeApiClient）。
- `src/modules/kingdee-tenant`：金蝶 tenant 授权信息（repo + service + route）。
- `src/modules/sync`：数据同步模块（repo + service + route + scheduler）。
- `src/modules/wechat`：小程序业务接口。
- `prisma`：模型与迁移。
- `scripts`：启动和健康检查脚本。

## 关键点

- 所有密钥只通过 `.env` 注入。
- 请求日志由 Fastify + pino 输出，包含 `requestId`。
- 管理接口使用 `ADMIN_TOKEN` 做 Bearer 鉴权。
- Webhook 和管理接口日志会对 `app_secret`、`client_secret`、`app_token` 脱敏。
- 通用调用器会自动注入签名相关 headers，并内置重试、鉴权刷新、时间戳重试策略。
- 幂等键重复提交会返回 `409 DUPLICATE_REQUEST`。
- 金蝶 token 使用 Redis 缓存，减少重复鉴权。
- 数据同步 raw 入库按 `tenant_id + biz_type + biz_id + hash` 去重，避免重复写入未变数据。
