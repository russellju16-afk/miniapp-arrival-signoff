import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { AppError } from "../common/app-error";
import { coreService } from "./core.service";

const miniLoginBodySchema = z.object({
  token: z.string().min(1, "token 不能为空")
});

const miniDeliveriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  status: z.string().optional()
});

const miniDeliveryParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const miniSignBodySchema = z.object({
  signerName: z.string().min(1, "signerName 不能为空"),
  remark: z.string().max(500).optional(),
  signatureBase64: z.string().optional(),
  photosBase64: z.array(z.string()).max(9).optional(),
  signedAt: z.string().optional(),
  idempotencyKey: z.string().min(8).max(128).optional()
});

const miniStatementQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional()
});

const miniStatementParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const miniConfirmBodySchema = z.object({
  confirmedAt: z.string().optional(),
  remark: z.string().max(500).optional()
});

declare module "fastify" {
  interface FastifyRequest {
    miniCompatCustomer?: Awaited<ReturnType<typeof coreService.authenticateMiniCustomerByAuthorizationHeader>>;
  }
}

export async function coreMiniCompatRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("onRequest", async (_request, reply) => {
    reply.header("Deprecation", "true");
    reply.header("Sunset", "Mon, 30 Jun 2026 00:00:00 GMT");
    reply.header("Link", '</api/mini/login>; rel="successor-version"');
  });

  app.post("/mini/login", async (request) => {
    const body = miniLoginBodySchema.parse(request.body ?? {});
    const data = await coreService.loginMini(body);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get(
    "/mini/deliveries",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const query = miniDeliveriesQuerySchema.parse(request.query ?? {});
      const data = await coreService.listMiniDeliveries(ensureMiniCustomer(request), query);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/deliveries/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniDeliveryParamsSchema.parse(request.params ?? {});
      const data = await coreService.getMiniDeliveryDetail(ensureMiniCustomer(request), params.id);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/deliveries/:id/sign",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniDeliveryParamsSchema.parse(request.params ?? {});
      const body = miniSignBodySchema.parse(request.body ?? {});
      const headerIdempotencyKey =
        typeof request.headers["x-idempotency-key"] === "string"
          ? request.headers["x-idempotency-key"]
          : undefined;

      const data = await coreService.signMiniDelivery(ensureMiniCustomer(request), {
        deliveryId: params.id,
        signerName: body.signerName,
        remark: body.remark,
        signatureImageBase64: body.signatureBase64,
        photosBase64: body.photosBase64,
        signedAt: body.signedAt,
        idempotencyKey: body.idempotencyKey ?? headerIdempotencyKey
      });

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/statements",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const query = miniStatementQuerySchema.parse(request.query ?? {});
      const data = await coreService.listMiniStatements(ensureMiniCustomer(request), query.from, query.to);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/statements/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniStatementParamsSchema.parse(request.params ?? {});
      const data = await coreService.getMiniStatementDetail(ensureMiniCustomer(request), params.id);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/statements/:id/confirm",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniStatementParamsSchema.parse(request.params ?? {});
      const body = miniConfirmBodySchema.parse(request.body ?? {});
      const data = await coreService.confirmMiniStatement(ensureMiniCustomer(request), {
        statementId: params.id,
        confirmedAt: body.confirmedAt,
        remark: body.remark
      });

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );
}

async function ensureMiniAuthorization(request: FastifyRequest): Promise<void> {
  request.miniCompatCustomer = await coreService.authenticateMiniCustomerByAuthorizationHeader(
    request.headers.authorization
  );
}

function ensureMiniCustomer(request: FastifyRequest) {
  if (!request.miniCompatCustomer) {
    throw new AppError(401, "MINI_UNAUTHORIZED", "小程序鉴权失败");
  }
  return request.miniCompatCustomer;
}
