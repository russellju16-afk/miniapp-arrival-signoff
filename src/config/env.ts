import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  ADMIN_TOKEN: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  IDEMPOTENCY_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  KINGDEE_BASE_URL: z.string().url(),
  KINGDEE_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  KINGDEE_AUTH_PATH: z.string().min(1),
  KINGDEE_DELIVERY_DETAIL_PATH: z.string().min(1),
  KINGDEE_SIGNOFF_PATH: z.string().min(1),
  KINGDEE_APP_TOKEN_BASE_URL: z.string().url().default("https://api.kingdee.com"),
  KINGDEE_APP_TOKEN_PATH: z
    .string()
    .min(1)
    .default("/jdyconnector/app_management/kingdee_auth_token"),
  KINGDEE_APP_TOKEN_METHOD: z.enum(["GET", "POST"]).default("GET"),
  KINGDEE_APP_TOKEN_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  KINGDEE_TOKEN_REFRESH_WINDOW_SECONDS: z.coerce.number().int().positive().default(600),
  SYNC_SCHEDULER_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  SYNC_MASTER_DAILY_CRON: z.string().default("0 2 * * *"),
  SYNC_DOCUMENT_HOURLY_CRON: z.string().default("0 * * * *"),
  UPLOAD_DIR: z.string().default("./uploads"),
  UPLOAD_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  KINGDEE_APP_ID: z.string().min(1),
  KINGDEE_APP_SECRET: z.string().min(1),
  KINGDEE_TENANT_ID: z.string().min(1)
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
