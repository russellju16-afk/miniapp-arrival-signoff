import { buildApp } from "./app";
import { env } from "./config/env";
import { connectRedis, redis } from "./config/redis";
import { connectCorePrisma, corePrisma } from "./db/core-prisma";
import { connectPrisma, prisma } from "./db/prisma";
import { startCoreScheduler, stopCoreScheduler } from "./modules/core/core.scheduler";
import { startSyncScheduler, stopSyncScheduler } from "./modules/sync";

const app = buildApp();

async function start(): Promise<void> {
  try {
    await connectCorePrisma();
    await connectLegacyDependencies();

    await app.listen({
      host: "0.0.0.0",
      port: env.PORT
    });

    startSyncScheduler();
    startCoreScheduler();

    app.log.info(
      {
        port: env.PORT,
        env: env.NODE_ENV
      },
      "Server started"
    );
  } catch (error) {
    app.log.fatal({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

async function connectLegacyDependencies(): Promise<void> {
  try {
    await connectRedis();
  } catch (error) {
    app.log.warn({ err: error }, "Redis 未连接，将以降级模式继续启动");
    redis.disconnect();
  }

  try {
    await connectPrisma();
  } catch (error) {
    app.log.warn({ err: error }, "PostgreSQL 未连接，将以 core(SQLite) 模式继续启动");
  }
}

async function shutdown(signal: string): Promise<void> {
  app.log.info({ signal }, "Received shutdown signal");

  try {
    stopSyncScheduler();
    stopCoreScheduler();
    await app.close();
    await prisma.$disconnect();
    await corePrisma.$disconnect();

    if (redis.status === "ready" || redis.status === "connecting") {
      await redis.quit();
    }

    process.exit(0);
  } catch (error) {
    app.log.error({ err: error }, "Shutdown failed");
    process.exit(1);
  }
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

void start();
