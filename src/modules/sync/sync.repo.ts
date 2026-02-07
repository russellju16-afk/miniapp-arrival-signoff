import { Prisma } from "@prisma/client";

import { prisma } from "../../db/prisma";

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
  async findLatestRawByBizId(tenantId: string, bizType: string, bizId: string) {
    const db = prisma as any;
    return db.kingdeeRaw.findFirst({
      where: {
        tenantId,
        bizType,
        bizId
      },
      orderBy: {
        pulledAt: "desc"
      }
    });
  }

  async createRaw(input: CreateRawInput) {
    const db = prisma as any;
    return db.kingdeeRaw.create({
      data: {
        tenantId: input.tenantId,
        bizType: input.bizType,
        bizId: input.bizId ?? null,
        data: input.data,
        hash: input.hash,
        pulledAt: input.pulledAt
      }
    });
  }

  async upsertSyncJob(input: UpsertSyncJobInput) {
    const db = prisma as any;

    return db.syncJob.upsert({
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
    });
  }

  async findSyncJob(tenantId: string, jobName: string) {
    const db = prisma as any;
    return db.syncJob.findUnique({
      where: {
        tenantId_jobName: {
          tenantId,
          jobName
        }
      }
    });
  }

  async listSyncJobs(tenantId?: string) {
    const db = prisma as any;
    return db.syncJob.findMany({
      where: tenantId
        ? {
            tenantId
          }
        : undefined,
      orderBy: [{ tenantId: "asc" }, { jobName: "asc" }]
    });
  }

  async listTenantIds(): Promise<string[]> {
    const db = prisma as any;
    const tenants = await db.kingdeeTenant.findMany({
      select: {
        id: true
      }
    });

    return tenants
      .map((item: Record<string, unknown>) => (typeof item.id === "string" ? item.id : null))
      .filter((id: string | null): id is string => Boolean(id));
  }
}

export const syncRepo = new SyncRepo();
