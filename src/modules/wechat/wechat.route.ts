import { FastifyInstance } from "fastify";
import { ZodError, z } from "zod";

import { AppError } from "../common/app-error";
import { wechatSignoffService } from "./wechat.service";

const createSignoffBodySchema = z.object({
  deliveryNo: z.string().min(1, "deliveryNo 不能为空"),
  signer: z.string().min(1, "signer 不能为空"),
  receivedAt: z.string().optional(),
  remark: z.string().max(500).optional(),
  idempotencyKey: z.string().min(8).max(128).optional()
});

const signoffParamsSchema = z.object({
  deliveryNo: z.string().min(1, "deliveryNo 不能为空")
});

export async function wechatRoutes(app: FastifyInstance): Promise<void> {
  app.post("/wechat/signoffs", async (request, reply) => {
    try {
      const body = createSignoffBodySchema.parse(request.body ?? {});

      const headerIdempotencyKey =
        typeof request.headers["x-idempotency-key"] === "string"
          ? request.headers["x-idempotency-key"]
          : undefined;

      const idempotencyKey = body.idempotencyKey ?? headerIdempotencyKey;
      if (!idempotencyKey) {
        throw new AppError(
          400,
          "IDEMPOTENCY_KEY_REQUIRED",
          "请通过请求体 idempotencyKey 或 x-idempotency-key 请求头传入幂等键"
        );
      }

      request.log.info(
        {
          requestId: request.id,
          deliveryNo: body.deliveryNo,
          idempotencyKey
        },
        "Received signoff request"
      );

      const result = await wechatSignoffService.createSignoff({
        ...body,
        idempotencyKey,
        requestId: request.id
      });

      reply.status(201);
      return {
        ok: true,
        requestId: request.id,
        data: result
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(400, "INVALID_REQUEST", "请求参数校验失败", error.flatten());
      }
      throw error;
    }
  });

  app.get("/wechat/signoffs/:deliveryNo", async (request) => {
    const params = signoffParamsSchema.parse(request.params ?? {});
    const result = await wechatSignoffService.getSignoffByDeliveryNo(params.deliveryNo);

    if (!result) {
      throw new AppError(404, "SIGNOFF_NOT_FOUND", "未找到对应签收记录");
    }

    return {
      ok: true,
      requestId: request.id,
      data: result
    };
  });
}
