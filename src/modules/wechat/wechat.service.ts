import { Prisma } from "@prisma/client";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { redis } from "../../config/redis";
import { prisma } from "../../db/prisma";
import { AppError } from "../common/app-error";
import { kingdeeClient } from "../kingdee/kingdee.client";

const serviceLogger = logger.child({ scope: "wechat-signoff-service" });

export interface CreateSignoffInput {
  deliveryNo: string;
  signer: string;
  receivedAt?: string;
  remark?: string;
  idempotencyKey: string;
  requestId: string;
}

class WechatSignoffService {
  async createSignoff(input: CreateSignoffInput) {
    const lockKey = `idempotency:signoff:${input.idempotencyKey}`;
    const lockResult = await redis.set(
      lockKey,
      input.requestId,
      "EX",
      env.IDEMPOTENCY_TTL_SECONDS,
      "NX"
    );

    if (lockResult !== "OK") {
      throw new AppError(409, "DUPLICATE_REQUEST", "重复请求，请勿重复提交");
    }

    const receivedAtDate = input.receivedAt ? new Date(input.receivedAt) : new Date();

    if (Number.isNaN(receivedAtDate.getTime())) {
      await redis.del(lockKey);
      throw new AppError(400, "INVALID_RECEIVED_AT", "receivedAt 必须是合法的时间字符串");
    }

    try {
      const deliveryDetail = await kingdeeClient.fetchDeliveryOrder(input.deliveryNo, input.requestId);

      const kingdeeResponse = await kingdeeClient.submitSignoff(
        {
          deliveryNo: input.deliveryNo,
          signer: input.signer,
          receivedAt: receivedAtDate.toISOString(),
          remark: input.remark,
          source: "wechat-mini-program",
          requestId: input.requestId
        },
        input.requestId
      );

      const persistencePayload = this.toInputJsonValue({
        deliveryDetail,
        signoffResult: kingdeeResponse
      });

      serviceLogger.info(
        {
          requestId: input.requestId,
          deliveryNo: input.deliveryNo
        },
        "Signoff synced to Kingdee"
      );

      return prisma.deliverySignoff.upsert({
        where: {
          deliveryNo: input.deliveryNo
        },
        update: {
          signer: input.signer,
          receivedAt: receivedAtDate,
          remark: input.remark,
          kingdeeRequestId: input.requestId,
          kingdeeResponse: persistencePayload
        },
        create: {
          deliveryNo: input.deliveryNo,
          signer: input.signer,
          receivedAt: receivedAtDate,
          remark: input.remark,
          kingdeeRequestId: input.requestId,
          kingdeeResponse: persistencePayload
        }
      });
    } catch (error) {
      await redis.del(lockKey);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(500, "SIGNOFF_CREATE_FAILED", "创建签收记录失败");
    }
  }

  async getSignoffByDeliveryNo(deliveryNo: string) {
    return prisma.deliverySignoff.findUnique({
      where: {
        deliveryNo
      }
    });
  }

  private toInputJsonValue(data: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
  }
}

export const wechatSignoffService = new WechatSignoffService();
