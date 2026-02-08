import path from "node:path";

import { PrismaClient } from "../generated/core-prisma-client";

import { logger } from "../config/logger";

if (!process.env.DB_URL) {
  process.env.DB_URL = "file:./prisma/core/dev.db";
}
process.env.DB_URL = normalizeDbUrl(process.env.DB_URL);

const coreDbLogger = logger.child({ scope: "core-prisma" });

const globalForCorePrisma = globalThis as unknown as {
  corePrisma?: PrismaClient;
};

export const corePrisma =
  globalForCorePrisma.corePrisma ??
  new PrismaClient({
    log: ["warn", "error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForCorePrisma.corePrisma = corePrisma;
}

export async function connectCorePrisma(): Promise<void> {
  await corePrisma.$connect();
  coreDbLogger.info("Core SQLite connected");
}

function normalizeDbUrl(dbUrl: string): string {
  if (!dbUrl.startsWith("file:./")) {
    return dbUrl;
  }

  const relativePath = dbUrl.slice("file:".length);
  const absolutePath = path.resolve(process.cwd(), relativePath);
  return `file:${absolutePath}`;
}
