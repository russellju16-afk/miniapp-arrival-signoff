import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  // 新核心配置（按本轮需求）
  KD_BASE_URL: z.string().url().default("https://api.kingdee.com"),
  KD_GW_ROUTER_ADDR: z.string().url().default("https://tf.jdy.com"),
  KD_CLIENT_ID: z.string().default(""),
  KD_CLIENT_SECRET: z.string().default(""),
  KD_APP_KEY: z.string().default(""),
  KD_APP_SECRET: z.string().default(""),
  KD_APP_TOKEN_PATH: z.string().default("/jdyconnector/app_management/kingdee_auth_token"),
  KD_APP_TOKEN_METHOD: z.enum(["GET", "POST"]).default("GET"),
  KD_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  KD_TOKEN_CACHE_HOURS: z.coerce.number().int().positive().default(24),
  KD_MOCK_MODE: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),

  DB_URL: z.string().default("file:./prisma/core/dev.db"),

  // 微信登录骨架配置
  WECHAT_LOGIN_MOCK_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  WECHAT_MOCK_OPENID: z.string().default("mock-openid-dev"),
  WECHAT_APPID: z.string().optional(),
  WECHAT_APPSECRET: z.string().optional(),

  // 兼容旧模块（避免编译/启动断裂）
  ADMIN_TOKEN: z.string().default("dev-admin-token"),
  DATABASE_URL: z.string().default("postgresql://app:app@localhost:5432/kingdee_gateway?schema=public"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  IDEMPOTENCY_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  KINGDEE_BASE_URL: z.string().url().default("https://api.kingdee.com"),
  KINGDEE_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  KINGDEE_AUTH_PATH: z.string().default("/openapi/auth/token"),
  KINGDEE_DELIVERY_DETAIL_PATH: z.string().default("/openapi/delivery-orders"),
  KINGDEE_SIGNOFF_PATH: z.string().default("/openapi/delivery-signoffs"),
  KINGDEE_APP_TOKEN_BASE_URL: z.string().url().default("https://api.kingdee.com"),
  KINGDEE_APP_TOKEN_PATH: z.string().default("/jdyconnector/app_management/kingdee_auth_token"),
  KINGDEE_APP_TOKEN_METHOD: z.enum(["GET", "POST"]).default("GET"),
  KINGDEE_APP_TOKEN_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  KINGDEE_TOKEN_REFRESH_WINDOW_SECONDS: z.coerce.number().int().positive().default(600),
  SYNC_SCHEDULER_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  SYNC_MASTER_DAILY_CRON: z.string().default("0 2 * * *"),
  SYNC_DOCUMENT_HOURLY_CRON: z.string().default("0 * * * *"),
  UPLOAD_DIR: z.string().default("./uploads"),
  UPLOAD_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  KINGDEE_APP_ID: z.string().default(""),
  KINGDEE_APP_SECRET: z.string().default(""),
  KINGDEE_TENANT_ID: z.string().default("")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`环境变量校验失败: ${errors}`);
}

export const env = parsedEnv.data;
export type Env = typeof env;

if (env.NODE_ENV === "production") {
  const missing = [
    ["KD_CLIENT_ID", env.KD_CLIENT_ID],
    ["KD_CLIENT_SECRET", env.KD_CLIENT_SECRET],
    ["KD_APP_KEY", env.KD_APP_KEY],
    ["KD_APP_SECRET", env.KD_APP_SECRET]
  ]
    .filter(([, value]) => !value.trim())
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`生产环境缺少必要金蝶配置: ${missing.join(", ")}`);
  }
}
