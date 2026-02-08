import { Prisma } from "@prisma/client";

import { prisma } from "../../db/prisma";
import { AppError } from "../common/app-error";

export interface CreateRawInput {
  tenantId: string;
  bizType: string;
  bizId?: string | null;
  data: Prisma.InputJsonValue;
  hash: string;
  pulledAt: Date;
}

export interface UpsertSyncJobInput {
  tenantId: string;
  jobName: string;
  status: string;
  error?: string | null;
  lastSuccessAt?: Date | null;
  lastCursor?: Prisma.InputJsonValue | null;
}

class SyncRepo {
  async findLatestRawByBizId(
    tenantId: string,
    bizType: string,
    bizId: string
  ): Promise<Record<string, unknown> | null> {
    const db = prisma as any;
    return this.runDb(() =>
      db.kingdeeRaw.findFirst({
        where: {
          tenantId,
          bizType,
          bizId
        },
        orderBy: {
          pulledAt: "desc"
        }
      })
    );
  }

  async createRaw(input: CreateRawInput): Promise<Record<string, unknown>> {
    const db = prisma as any;
    return this.runDb(() =>
      db.kingdeeRaw.create({
        data: {
          tenantId: input.tenantId,
          bizType: input.bizType,
          bizId: input.bizId ?? null,
          data: input.data,
          hash: input.hash,
          pulledAt: input.pulledAt
        }
      })
    );
  }

  async upsertSyncJob(input: UpsertSyncJobInput): Promise<Record<string, unknown>> {
    const db = prisma as any;

    return this.runDb(() =>
      db.syncJob.upsert({
        where: {
          tenantId_jobName: {
            tenantId: input.tenantId,
            jobName: input.jobName
          }
        },
        update: {
          status: input.status,
          error: input.error ?? null,
          lastSuccessAt: input.lastSuccessAt ?? undefined,
          lastCursor: input.lastCursor ?? undefined
        },
        create: {
          tenantId: input.tenantId,
          jobName: input.jobName,
          status: input.status,
          error: input.error ?? null,
          lastSuccessAt: input.lastSuccessAt ?? null,
          lastCursor: input.lastCursor ?? null
        }
      })
    );
  }

  async findSyncJob(tenantId: string, jobName: string): Promise<Record<string, unknown> | null> {
    const db = prisma as any;
    return this.runDb(() =>
      db.syncJob.findUnique({
        where: {
          tenantId_jobName: {
            tenantId,
            jobName
          }
        }
      })
    );
  }

  async listSyncJobs(tenantId?: string): Promise<Array<Record<string, unknown>>> {
    const db = prisma as any;
    return this.runDb(() =>
      db.syncJob.findMany({
        where: tenantId
          ? {
              tenantId
            }
          : undefined,
        orderBy: [{ tenantId: "asc" }, { jobName: "asc" }]
      })
    );
  }

  async listTenantIds(): Promise<string[]> {
    const db = prisma as any;
    const tenants = await this.runDb<Array<Record<string, unknown>>>(() =>
      db.kingdeeTenant.findMany({
        select: {
          id: true
        }
      })
    );

    return tenants
      .map((item: Record<string, unknown>) => (typeof item.id === "string" ? item.id : null))
      .filter((id: string | null): id is string => Boolean(id));
  }

  private async runDb<T>(handler: () => Promise<T>): Promise<T> {
    try {
      return await handler();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (isLegacySyncDbUnavailable(error)) {
        throw new AppError(
          503,
          "LEGACY_SYNC_DB_UNAVAILABLE",
          "legacy 同步数据库不可用，请配置 DATABASE_URL 并确保 PostgreSQL 可达，或使用 /api/kd/sync/deliveries 与 /api/kd/sync/receipts。"
        );
      }

      throw new AppError(500, "LEGACY_SYNC_DB_ERROR", "legacy 同步数据库访问失败");
    }
  }
}

function isLegacySyncDbUnavailable(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message;
  return (
    message.includes("Environment variable not found: DATABASE_URL") ||
    message.includes("Can't reach database server") ||
    message.includes("Authentication failed against database server")
  );
}

export const syncRepo = new SyncRepo();
