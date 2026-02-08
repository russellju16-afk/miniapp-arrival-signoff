import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { env } from "../../config/env";
import { ensureAdminAuthorization } from "../common/admin-auth";
import { AppError } from "../common/app-error";
import { coreService } from "./core.service";

const wechatLoginSchema = z.object({
  code: z.string().optional(),
  mockOpenid: z.string().optional(),
  customerName: z.string().optional()
});

const queryAsStringRecordSchema = z.record(
  z.string(),
  z.string().or(z.number()).or(z.boolean()).or(z.null())
);

const deliveriesQuerySchema = z.object({
  customerId: z.string().min(1, "customerId 不能为空"),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  status: z.string().optional()
});

const deliveryDetailParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const deliveryDetailQuerySchema = z.object({
  customerId: z.string().min(1, "customerId 不能为空")
});

const signDeliveryParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const signDeliveryBodySchema = z.object({
  signerName: z.string().min(1, "signerName 不能为空"),
  remark: z.string().max(500).optional(),
  signatureImageBase64: z.string().optional(),
  signedAt: z.string().optional(),
  idempotencyKey: z.string().min(8).max(128).optional()
});

const reconcileQuerySchema = z.object({
  customerId: z.string().min(1, "customerId 不能为空"),
  from: z.string().optional(),
  to: z.string().optional()
});

const reconcileDetailParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const reconcileDetailQuerySchema = z.object({
  customerId: z.string().min(1, "customerId 不能为空")
});

const reconcileConfirmBodySchema = z.object({
  customerId: z.string().min(1, "customerId 不能为空"),
  confirmedAt: z.string().optional(),
  remark: z.string().max(500).optional()
});

const syncBodySchema = z.object({
  fromTime: z.coerce.number().int().optional(),
  toTime: z.coerce.number().int().optional()
});

const miniLoginBodySchema = z.object({
  token: z.string().min(1, "token 不能为空")
});

const miniProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional()
});

const miniProductParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const miniCartAddBodySchema = z.object({
  skuId: z.string().min(1, "skuId 不能为空"),
  qty: z.coerce.number().int().positive()
});

const miniCartItemParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const miniCartUpdateBodySchema = z.object({
  qty: z.coerce.number().int().positive()
});

const miniOrderCreateBodySchema = z.object({
  remark: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        skuId: z.string().min(1),
        qty: z.coerce.number().int().positive()
      })
    )
    .optional()
});

const miniOrderListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  orderNo: z.string().optional()
});

const miniOrderParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const miniOrderCancelBodySchema = z.object({
  remark: z.string().max(500).optional()
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

const issueCustomerTokenBodySchema = z.object({
  customerId: z.string().optional(),
  kingdeeCustomerId: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  ttlDays: z.coerce.number().int().positive().optional()
});

const adminProductUpsertBodySchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "code 不能为空"),
  name: z.string().min(1, "name 不能为空"),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  status: z.string().optional(),
  defaultUnitId: z.string().optional(),
  kingdeeMaterialId: z.string().optional()
});

const adminProductsQuerySchema = z.object({
  status: z.string().optional()
});

const adminSkuUpsertBodySchema = z.object({
  id: z.string().optional(),
  skuCode: z.string().min(1, "skuCode 不能为空"),
  skuName: z.string().min(1, "skuName 不能为空"),
  specs: z.record(z.string(), z.unknown()).optional(),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  status: z.string().optional(),
  unitId: z.string().optional(),
  kingdeeMaterialId: z.string().optional()
});

const adminProductParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const adminOrderParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const adminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  customerId: z.string().optional(),
  orderNo: z.string().optional()
});

const adminOrderCancelBodySchema = z.object({
  remark: z.string().max(500).optional()
});

const adminSyncRunBodySchema = z.object({
  tenantId: z.string().optional(),
  jobName: z.string().min(1, "jobName 不能为空"),
  fromTime: z.coerce.number().int().optional(),
  toTime: z.coerce.number().int().optional()
});

const adminSyncStatusQuerySchema = z.object({
  tenantId: z.string().optional(),
  jobName: z.string().optional()
});

declare module "fastify" {
  interface FastifyRequest {
    coreMiniCustomer?: Awaited<ReturnType<typeof coreService.authenticateMiniCustomerByAuthorizationHeader>>;
  }
}

export async function coreRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => {
    return {
      ok: true,
      time: new Date().toISOString(),
      env: env.NODE_ENV
    };
  });

  app.get("/kd/ping", async (request) => {
    const data = await coreService.pingKingdee();

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/kd/customer/list", async (request) => {
    const query = normalizeQuery(queryAsStringRecordSchema.parse(request.query ?? {}));
    const data = await coreService.getCustomerList(query);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/kd/sales/outbound/list", async (request) => {
    const query = normalizeQuery(queryAsStringRecordSchema.parse(request.query ?? {}));
    const data = await coreService.getSalesOutboundList(query);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/kd/sales/outbound/detail", async (request) => {
    const query = normalizeQuery(queryAsStringRecordSchema.parse(request.query ?? {}));
    const data = await coreService.getSalesOutboundDetail(query);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/kd/receipt/list", async (request) => {
    const query = normalizeQuery(queryAsStringRecordSchema.parse(request.query ?? {}));
    const data = await coreService.getReceiptList(query);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/kd/receipt/detail", async (request) => {
    const query = normalizeQuery(queryAsStringRecordSchema.parse(request.query ?? {}));
    const data = await coreService.getReceiptDetail(query);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.post("/kd/sync/deliveries", async (request) => {
    const body = syncBodySchema.parse(request.body ?? {});
    const data = await coreService.syncDeliveries(body);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.post("/kd/sync/receipts", async (request) => {
    const body = syncBodySchema.parse(request.body ?? {});
    const data = await coreService.syncReceipts(body);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.post("/wechat/login", async (request) => {
    const body = wechatLoginSchema.parse(request.body ?? {});
    const data = await coreService.loginWechat(body);

    return {
      ok: true,
      requestId: request.id,
      data
    };
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
    "/mini/products",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const query = miniProductsQuerySchema.parse(request.query ?? {});
      const data = await coreService.listMiniProducts(ensureMiniCustomer(request), query);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/products/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniProductParamsSchema.parse(request.params ?? {});
      const data = await coreService.getMiniProductDetail(ensureMiniCustomer(request), params.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/cart",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const data = await coreService.getMiniCart(ensureMiniCustomer(request));
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/cart/items",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const body = miniCartAddBodySchema.parse(request.body ?? {});
      const data = await coreService.addMiniCartItem(ensureMiniCustomer(request), body);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.patch(
    "/mini/cart/items/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniCartItemParamsSchema.parse(request.params ?? {});
      const body = miniCartUpdateBodySchema.parse(request.body ?? {});
      const data = await coreService.updateMiniCartItemQty(ensureMiniCustomer(request), params.id, body.qty);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.delete(
    "/mini/cart/items/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniCartItemParamsSchema.parse(request.params ?? {});
      const data = await coreService.removeMiniCartItem(ensureMiniCustomer(request), params.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/orders",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const body = miniOrderCreateBodySchema.parse(request.body ?? {});
      const idempotencyKey =
        typeof request.headers["x-idempotency-key"] === "string"
          ? request.headers["x-idempotency-key"]
          : undefined;
      const data = await coreService.createMiniOrder(ensureMiniCustomer(request), body, idempotencyKey);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/orders",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const query = miniOrderListQuerySchema.parse(request.query ?? {});
      const data = await coreService.listMiniOrders(ensureMiniCustomer(request), query);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/orders/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniOrderParamsSchema.parse(request.params ?? {});
      const data = await coreService.getMiniOrderDetail(ensureMiniCustomer(request), params.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/orders/:id/cancel",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniOrderParamsSchema.parse(request.params ?? {});
      const body = miniOrderCancelBodySchema.parse(request.body ?? {});
      const data = await coreService.cancelMiniOrder(ensureMiniCustomer(request), params.id, body.remark);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

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

  app.post(
    "/admin/customers/token/issue",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = issueCustomerTokenBodySchema.parse(request.body ?? {});
      const data = await coreService.issueCustomerAccessToken(body);

      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/admin/customers",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const data = await coreService.listCustomersForAdmin();
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/products/upsert",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminProductUpsertBodySchema.parse(request.body ?? {});
      const data = await coreService.adminUpsertProduct(body);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/admin/products",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = adminProductsQuerySchema.parse(request.query ?? {});
      const data = await coreService.adminListProducts(query.status);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/products/:id/sku/upsert",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminProductParamsSchema.parse(request.params ?? {});
      const body = adminSkuUpsertBodySchema.parse(request.body ?? {});
      const data = await coreService.adminUpsertProductSku({
        ...body,
        productId: params.id
      });
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/orders/:id/retry-writeback",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminOrderParamsSchema.parse(request.params ?? {});
      const data = await coreService.retryOrderWriteback(params.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/admin/orders",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = adminOrdersQuerySchema.parse(request.query ?? {});
      const data = await coreService.adminListOrders(query);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/admin/orders/:id",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminOrderParamsSchema.parse(request.params ?? {});
      const data = await coreService.adminGetOrderDetail(params.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/orders/:id/cancel",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminOrderParamsSchema.parse(request.params ?? {});
      const body = adminOrderCancelBodySchema.parse(request.body ?? {});
      const data = await coreService.adminCancelOrder(params.id, body.remark);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/sync/run",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminSyncRunBodySchema.parse(request.body ?? {});
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
    }
  );

  app.get(
    "/admin/sync/status",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = adminSyncStatusQuerySchema.parse(request.query ?? {});
      const data = await coreService.listAdminSyncStatus(query.jobName);
      const warnings =
        query.tenantId && query.tenantId.trim() ? ["core 同步为单租户模式，tenantId 参数已忽略"] : [];

      return {
        ok: true,
        requestId: request.id,
        data,
        warnings
      };
    }
  );

  app.get("/deliveries", async (request) => {
    const query = deliveriesQuerySchema.parse(request.query ?? {});
    const data = await coreService.listDeliveries(query.customerId, {
      page: query.page,
      pageSize: query.pageSize,
      status: query.status
    });

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/deliveries/:id", async (request) => {
    const params = deliveryDetailParamsSchema.parse(request.params ?? {});
    const query = deliveryDetailQuerySchema.parse(request.query ?? {});

    const data = await coreService.getDeliveryDetail(query.customerId, params.id);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.post("/deliveries/:id/sign", async (request) => {
    const params = signDeliveryParamsSchema.parse(request.params ?? {});
    const body = signDeliveryBodySchema.parse(request.body ?? {});
    const headerIdempotencyKey =
      typeof request.headers["x-idempotency-key"] === "string"
        ? request.headers["x-idempotency-key"]
        : undefined;

    const data = await coreService.signDelivery({
      deliveryId: params.id,
      signerName: body.signerName,
      remark: body.remark,
      signatureImageBase64: body.signatureImageBase64,
      signedAt: body.signedAt,
      idempotencyKey: body.idempotencyKey ?? headerIdempotencyKey
    });

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/reconcile/statement", async (request) => {
    const query = reconcileQuerySchema.parse(request.query ?? {});
    const data = await coreService.buildReconcileStatement({
      customerId: query.customerId,
      from: query.from,
      to: query.to
    });

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.get("/reconcile/statement/:id", async (request) => {
    const params = reconcileDetailParamsSchema.parse(request.params ?? {});
    const query = reconcileDetailQuerySchema.parse(request.query ?? {});
    const data = await coreService.getReconcileStatementDetail(query.customerId, params.id);

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });

  app.post("/reconcile/statement/:id/confirm", async (request) => {
    const params = reconcileDetailParamsSchema.parse(request.params ?? {});
    const body = reconcileConfirmBodySchema.parse(request.body ?? {});
    const data = await coreService.confirmReconcileStatement({
      customerId: body.customerId,
      statementId: params.id,
      confirmedAt: body.confirmedAt,
      remark: body.remark
    });

    return {
      ok: true,
      requestId: request.id,
      data
    };
  });
}

async function ensureMiniAuthorization(request: FastifyRequest): Promise<void> {
  request.coreMiniCustomer = await coreService.authenticateMiniCustomerByAuthorizationHeader(
    request.headers.authorization
  );
}

function ensureMiniCustomer(request: FastifyRequest) {
  if (!request.coreMiniCustomer) {
    throw new AppError(401, "MINI_UNAUTHORIZED", "小程序鉴权失败");
  }
  return request.coreMiniCustomer;
}

function normalizeQuery(input: Record<string, string | number | boolean | null>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === null || typeof value === "undefined") {
      continue;
    }
    result[key] = String(value);
  }

  return result;
}
