import Redis from "ioredis";

import { env } from "./env";
import { logger } from "./logger";

const redisLogger = logger.child({ scope: "redis" });

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1
});

redis.on("connect", () => {
  redisLogger.info("Redis connected");
});

redis.on("error", (error) => {
  redisLogger.error({ err: error }, "Redis error");
});

export async function connectRedis(): Promise<void> {
  if (redis.status === "ready" || redis.status === "connecting") {
    return;
  }

  await redis.connect();
}
