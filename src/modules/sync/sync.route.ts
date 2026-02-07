import { FastifyInstance } from "fastify";
import { z } from "zod";

import { ensureAdminAuthorization } from "../common/admin-auth";
import { AppError } from "../common/app-error";
import { RunSyncJobInput, SyncJobName } from "./sync.types";
import { syncService } from "./sync.service";

const runBodySchema = z.object({
  tenantId: z.string().min(1, "tenantId 不能为空"),
  jobName: z.string().min(1, "jobName 不能为空"),
  fromTime: z.number().int().optional(),
  toTime: z.number().int().optional()
});

const statusQuerySchema = z.object({
  tenantId: z.string().optional()
});

export async function syncRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/admin/sync/run",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = runBodySchema.parse(request.body ?? {});
      const jobName = normalizeJobName(body.jobName);

      const input: RunSyncJobInput = {
        tenantId: body.tenantId,
        jobName,
        fromTime: body.fromTime,
        toTime: body.toTime
      };

      const data = await syncService.runJob(input);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/admin/sync/status",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = statusQuerySchema.parse(request.query ?? {});
      const data = await syncService.getStatus(query.tenantId);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );
}

function normalizeJobName(jobName: string): SyncJobName {
  const value = jobName.trim() as SyncJobName;
  const allowed: SyncJobName[] = [
    "customer",
    "supplier",
    "sal_order",
    "sal_out_bound",
    "sal_invoice",
    "pur_order",
    "pur_inbound",
    "pur_invoice",
    "ap_credit",
    "ar_credit",
    "voucher",
    "inventory",
    "inventory_stock",
    "master_data_full",
    "documents_incremental"
  ];

  if (!allowed.includes(value)) {
    throw new AppError(400, "SYNC_JOB_UNSUPPORTED", `不支持的 jobName: ${jobName}`);
  }

  return value;
}
