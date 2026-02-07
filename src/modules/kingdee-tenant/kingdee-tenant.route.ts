import { FastifyInstance } from "fastify";
import { z } from "zod";

import { ensureAdminAuthorization } from "../common/admin-auth";
import { AppError } from "../common/app-error";
import { KingdeeHttpMethod, kingdeeApiClient } from "../kingdee/kingdee-api.client";
import { kingdeeTokenService } from "./kingdee-token.service";
import { kingdeeTenantService } from "./kingdee-tenant.service";

export async function kingdeeTenantRoutes(app: FastifyInstance): Promise<void> {
  const refreshBodySchema = z.object({
    tenantId: z.string().min(1, "tenantId 不能为空")
  });

  const proxyBodySchema = z.object({
    tenantId: z.string().min(1, "tenantId 不能为空"),
    method: z.string().min(1, "method 不能为空"),
    path: z.string().min(1, "path 不能为空"),
    query: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
    body: z.unknown().optional()
  });

  app.post("/webhook/kingdee/auth", async (request) => {
    request.log.info(
      {
        requestId: request.id,
        payload: kingdeeTenantService.sanitizePayloadForLog(request.body ?? null)
      },
      "Received Kingdee auth webhook"
    );

    await kingdeeTenantService.ingestWebhook(request.body ?? null, request.id);

    return {
      ok: true
    };
  });

  app.post(
    "/admin/kingdee/tenant/upsert",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      request.log.info(
        {
          requestId: request.id,
          payload: kingdeeTenantService.sanitizePayloadForLog(request.body ?? null)
        },
        "Received admin Kingdee tenant upsert request"
      );

      const data = await kingdeeTenantService.adminUpsert(request.body ?? null, request.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/admin/kingdee/tenant/list",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const data = await kingdeeTenantService.listTenants();
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/kingdee/token/refresh",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = refreshBodySchema.parse(request.body ?? {});
      const refreshed = await kingdeeTokenService.refreshToken(body.tenantId);

      return {
        ok: true,
        requestId: request.id,
        data: {
          tenant_id: refreshed.tenantId,
          app_token: maskSecret(refreshed.appToken),
          token_expires_at: refreshed.tokenExpiresAt.toISOString()
        }
      };
    }
  );

  app.get(
    "/admin/kingdee/token/status",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const data = await kingdeeTokenService.getTokenStatus();

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/kingdee/proxy",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = proxyBodySchema.parse(request.body ?? {});
      const method = normalizeMethod(body.method);

      request.log.info(
        {
          requestId: request.id,
          tenantId: body.tenantId,
          method,
          path: body.path
        },
        "Received admin Kingdee proxy request"
      );

      const data = await kingdeeApiClient.request({
        tenantId: body.tenantId,
        method,
        path: body.path,
        query: body.query,
        body: body.body
      });

      return data;
    }
  );
}

function maskSecret(secret: string): string {
  if (secret.length <= 8) {
    return `${secret.slice(0, 1)}****${secret.slice(-1)}`;
  }

  return `${secret.slice(0, 4)}****${secret.slice(-4)}`;
}

function normalizeMethod(rawMethod: string): KingdeeHttpMethod {
  const method = rawMethod.trim().toUpperCase();
  if (method !== "GET" && method !== "POST") {
    throw new AppError(400, "INVALID_METHOD", "method 仅支持 GET/POST");
  }

  return method;
}
