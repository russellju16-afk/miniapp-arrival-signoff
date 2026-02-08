import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { ensureAdminAuthorization } from "../common/admin-auth";
import { coreService } from "../core/core.service";

const runBodySchema = z.object({
  tenantId: z.string().optional(),
  jobName: z.string().min(1, "jobName 不能为空"),
  fromTime: z.number().int().optional(),
  toTime: z.number().int().optional()
});

const statusQuerySchema = z.object({
  tenantId: z.string().optional(),
  jobName: z.string().optional()
});

export async function syncRoutes(app: FastifyInstance): Promise<void> {
  const runHandler = async (request: FastifyRequest) => {
    const body = runBodySchema.parse(request.body ?? {});
    const data = await coreService.runAdminSyncJob({
      tenantId: body.tenantId,
      jobName: body.jobName,
      fromTime: body.fromTime,
      toTime: body.toTime
    });

    return {
      ok: true,
      requestId: request.id,
      data
    };
  };

  const statusHandler = async (request: FastifyRequest) => {
    const query = statusQuerySchema.parse(request.query ?? {});
    const data = await coreService.listAdminSyncStatus(query.jobName);
    const warnings =
      query.tenantId && query.tenantId.trim() ? ["core 同步为单租户模式，tenantId 参数已忽略"] : [];

    return {
      ok: true,
      requestId: request.id,
      data,
      warnings
    };
  };

  const authPreHandler = async (request: FastifyRequest) => ensureAdminAuthorization(request);

  // legacy 兼容路由（deprecated），主线已迁移到 core: /api/admin/sync/*
  app.post("/admin/sync/run", { preHandler: authPreHandler }, runHandler);
  app.get("/admin/sync/status", { preHandler: authPreHandler }, statusHandler);
}
