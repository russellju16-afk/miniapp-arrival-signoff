import { buildApp } from "./app";
import { env } from "./config/env";
import { connectRedis, redis } from "./config/redis";
import { connectPrisma, prisma } from "./db/prisma";
import { startSyncScheduler, stopSyncScheduler } from "./modules/sync";

const app = buildApp();

async function start(): Promise<void> {
  try {
    await connectRedis();
    await connectPrisma();

    await app.listen({
      host: "0.0.0.0",
      port: env.PORT
    });

    startSyncScheduler();

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

async function shutdown(signal: string): Promise<void> {
  app.log.info({ signal }, "Received shutdown signal");

  try {
    stopSyncScheduler();
    await app.close();
    await prisma.$disconnect();

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
