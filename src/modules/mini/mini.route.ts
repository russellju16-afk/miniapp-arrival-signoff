import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { ensureAdminAuthorization } from "../common/admin-auth";
import { AppError } from "../common/app-error";
import { miniService } from "./mini.service";
import { MiniCustomerProfile } from "./mini.types";

declare module "fastify" {
  interface FastifyRequest {
    miniCustomer?: MiniCustomerProfile;
  }
}

const loginBodySchema = z.object({
  token: z.string().trim().min(1, "token 不能为空")
});

const deliveryParamsSchema = z.object({
  id: z.string().uuid("id 必须是 UUID")
});

const signBodySchema = z.object({
  signerName: z.string().trim().min(1, "signerName 不能为空"),
  signedAt: z.string().optional(),
  signatureBase64: z.string().trim().min(1, "signatureBase64 不能为空"),
  photosBase64: z.array(z.string().trim().min(1)).max(9).optional(),
  remark: z.string().max(500).optional()
});

const statementsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional()
});

const statementParamsSchema = z.object({
  id: z.string().uuid("id 必须是 UUID")
});

const confirmBodySchema = z.object({
  confirmedAt: z.string().optional(),
  remark: z.string().max(500).optional()
});

const qrcodeQuerySchema = z.object({
  token: z.string().trim().min(1, "token 不能为空")
});

export async function miniRoutes(app: FastifyInstance): Promise<void> {
  const miniAuthPreHandler = async (request: FastifyRequest) => {
    request.miniCustomer = await miniService.authenticateByAuthorizationHeader(request.headers.authorization);
  };

  app.post("/mini/login", async (request) => {
    const body = loginBodySchema.parse(request.body ?? {});

    request.log.info(
      {
        requestId: request.id
      },
      "Mini login request received"
    );

    const data = await miniService.loginByToken(body.token);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get(
    "/mini/deliveries",
    {
      preHandler: miniAuthPreHandler
    },
    async (request) => {
      const customer = ensureMiniCustomer(request);
      const data = await miniService.listPendingDeliveries(customer);

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
      preHandler: miniAuthPreHandler
    },
    async (request) => {
      const customer = ensureMiniCustomer(request);
      const params = deliveryParamsSchema.parse(request.params ?? {});

      const data = await miniService.getDeliveryDetail(customer, params.id);

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
      preHandler: miniAuthPreHandler
    },
    async (request) => {
      const customer = ensureMiniCustomer(request);
      const params = deliveryParamsSchema.parse(request.params ?? {});
      const body = signBodySchema.parse(request.body ?? {});

      request.log.info(
        {
          requestId: request.id,
          customerId: customer.id,
          deliveryId: params.id
        },
        "Mini delivery sign request received"
      );

      const data = await miniService.signDelivery(customer, {
        deliveryId: params.id,
        signerName: body.signerName,
        signedAt: body.signedAt,
        signatureBase64: body.signatureBase64,
        photosBase64: body.photosBase64,
        remark: body.remark
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
      preHandler: miniAuthPreHandler
    },
    async (request) => {
      const customer = ensureMiniCustomer(request);
      const query = statementsQuerySchema.parse(request.query ?? {});

      const data = await miniService.listStatements(customer, query.from, query.to);

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
      preHandler: miniAuthPreHandler
    },
    async (request) => {
      const customer = ensureMiniCustomer(request);
      const params = statementParamsSchema.parse(request.params ?? {});

      const data = await miniService.getStatementDetail(customer, params.id);

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
      preHandler: miniAuthPreHandler
    },
    async (request) => {
      const customer = ensureMiniCustomer(request);
      const params = statementParamsSchema.parse(request.params ?? {});
      const body = confirmBodySchema.parse(request.body ?? {});

      const data = await miniService.confirmStatement(customer, {
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

  app.get(
    "/mini/qrcode",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = qrcodeQuerySchema.parse(request.query ?? {});
      const data = await miniService.generateLoginQrcode(query.token);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );
}

function ensureMiniCustomer(request: FastifyRequest): MiniCustomerProfile {
  if (!request.miniCustomer) {
    throw new AppError(401, "MINI_UNAUTHORIZED", "小程序鉴权失败");
  }

  return request.miniCustomer;
}
