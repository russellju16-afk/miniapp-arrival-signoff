import { PrismaClient } from "@prisma/client";

import { env } from "../config/env";
import { logger } from "../config/logger";

const prismaLogger = logger.child({ scope: "prisma" });
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prismaLogLevel: Array<"warn" | "error" | "info"> =
  env.NODE_ENV === "development" ? ["warn", "error", "info"] : ["warn", "error"];

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLogLevel
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectPrisma(): Promise<void> {
  await prisma.$connect();
  prismaLogger.info("PostgreSQL connected");
}
