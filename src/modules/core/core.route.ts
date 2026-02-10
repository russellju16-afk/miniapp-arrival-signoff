import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { env } from "../../config/env";
import { ensureAdminAuthorization } from "../common/admin-auth";
import { AppError } from "../common/app-error";
import { coreService } from "./core.service";

const wechatLoginSchema = z.object({
  code: z.string().optional(),
  mockOpenid: z.string().optional(),
  customerName: z.string().optional(),
  registration: z
    .object({
      companyName: z.string().optional(),
      contactName: z.string().optional(),
      contactPhone: z.string().optional(),
      remark: z.string().optional()
    })
    .optional()
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
  acceptPriceChange: z.boolean().optional(),
  delivery: z
    .object({
      mode: z.enum(["DELIVERY", "PICKUP"]),
      addressId: z.string().optional(),
      expectedDate: z.string().optional(),
      timeSlot: z.enum(["7-10", "10-12", "13-15", "15-18"]).optional(),
      unloadingRequirement: z.string().max(500).optional(),
      note: z.string().max(500).optional()
    })
    .optional(),
  items: z
    .array(
      z.object({
        skuId: z.string().min(1),
        qty: z.coerce.number().int().positive(),
        expectedUnitPrice: z.coerce.number().nonnegative().optional()
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

const miniAddressBodySchema = z.object({
  id: z.string().optional(),
  receiverName: z.string().min(1),
  receiverPhone: z.string().min(1),
  province: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  detail: z.string().min(1),
  isDefault: z.boolean().optional()
});

const miniAddressParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const miniQuoteRequestBodySchema = z.object({
  items: z
    .array(
      z.object({
        skuId: z.string().min(1),
        qty: z.coerce.number().int().positive(),
        specText: z.string().optional()
      })
    )
    .min(1),
  remark: z.string().max(500).optional()
});

const miniInvoiceProfileBodySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  taxNo: z.string().min(1),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  addressPhone: z.string().optional(),
  email: z.string().optional(),
  isDefault: z.boolean().optional()
});

const miniInvoiceProfileParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const miniInvoiceRequestBodySchema = z.object({
  orderIds: z.array(z.string().min(1)).min(1),
  invoiceProfileId: z.string().optional(),
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

const adminImageUploadBodySchema = z.object({
  dataUrl: z.string().min(1, "dataUrl 不能为空"),
  filename: z.string().optional(),
  folder: z.string().optional()
});

const adminProductsQuerySchema = z.object({
  status: z.string().optional()
});

const adminKingdeeMaterialListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  search: z.string().optional()
});

const adminKingdeeOneClickListingBodySchema = z.object({
  items: z
    .array(
      z.object({
        materialId: z.string().optional(),
        materialNumber: z.string().optional(),
        materialName: z.string().optional(),
        materialModel: z.string().optional(),
        unitId: z.string().optional(),
        coverImageUrl: z.string().optional()
      })
    )
    .min(1, "items 不能为空")
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

const adminRegistrationApplicationsQuerySchema = z.object({
  status: z.string().optional()
});

const adminRegistrationApplicationParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const adminReviewRegistrationBodySchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  remark: z.string().max(500).optional()
});

const adminBindCustomerBodySchema = z.object({
  kingdeeCustomerId: z.string().min(1, "kingdeeCustomerId 不能为空")
});

const adminUpdateCustomerStatusBodySchema = z.object({
  status: z.enum(["ACTIVE", "REJECTED"]),
  remark: z.string().max(500).optional()
});

const adminRemoveCustomerBodySchema = z.object({
  remark: z.string().max(500).optional()
});

const adminCustomerParamsSchema = z.object({
  id: z.string().min(1, "id 不能为空")
});

const adminSettingsUpdateBodySchema = z.record(z.string(), z.unknown());
const adminWebhookTestBodySchema = z.object({
  key: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  title: z.string().max(200).optional(),
  lines: z.array(z.string().max(500)).max(20).optional()
});
const adminSettingsTestWebhookQuerySchema = z.object({
  type: z.enum(["ORDER", "LOGISTICS", "FINANCE", "QUOTE", "REGISTRATION"]).optional()
});

const ADMIN_WEBHOOK_KEY_BY_TYPE: Record<string, string> = {
  ORDER: "ORDER_WEBHOOK",
  LOGISTICS: "LOGISTICS_WEBHOOK",
  FINANCE: "FINANCE_WEBHOOK",
  QUOTE: "QUOTE_WEBHOOK",
  REGISTRATION: "REGISTRATION_WEBHOOK"
};

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

const adminDiagnosticsRetryWritebackBodySchema = z.object({
  orderNo: z.string().min(1, "orderNo 不能为空")
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
    "/mini/profile",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const data = await coreService.getMiniProfile(ensureMiniCustomer(request));
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

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

  app.get(
    "/mini/addresses",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const data = await coreService.listMiniAddresses(ensureMiniCustomer(request));
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/addresses/upsert",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const body = miniAddressBodySchema.parse(request.body ?? {});
      const data = await coreService.upsertMiniAddress(ensureMiniCustomer(request), body);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.delete(
    "/mini/addresses/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniAddressParamsSchema.parse(request.params ?? {});
      const data = await coreService.removeMiniAddress(ensureMiniCustomer(request), params.id);
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

  app.post(
    "/mini/quote-requests",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const body = miniQuoteRequestBodySchema.parse(request.body ?? {});
      const data = await coreService.createMiniQuoteRequest(ensureMiniCustomer(request), body);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/quote-requests",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const data = await coreService.listMiniQuoteRequests(ensureMiniCustomer(request));
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

  app.get(
    "/mini/invoice/profiles",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const data = await coreService.listMiniInvoiceProfiles(ensureMiniCustomer(request));
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/invoice/profiles/upsert",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const body = miniInvoiceProfileBodySchema.parse(request.body ?? {});
      const data = await coreService.upsertMiniInvoiceProfile(ensureMiniCustomer(request), body);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.delete(
    "/mini/invoice/profiles/:id",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const params = miniInvoiceProfileParamsSchema.parse(request.params ?? {});
      const data = await coreService.removeMiniInvoiceProfile(ensureMiniCustomer(request), params.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/mini/invoice/requests",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const data = await coreService.listMiniInvoiceRequests(ensureMiniCustomer(request));
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/mini/invoice/requests",
    {
      preHandler: async (request) => ensureMiniAuthorization(request)
    },
    async (request) => {
      const body = miniInvoiceRequestBodySchema.parse(request.body ?? {});
      const data = await coreService.createMiniInvoiceRequest(ensureMiniCustomer(request), body);
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

  app.get(
    "/admin/registration-applications",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = adminRegistrationApplicationsQuerySchema.parse(request.query ?? {});
      const data = await coreService.listRegistrationApplicationsForAdmin(query.status);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/registration-applications/:id/review",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminRegistrationApplicationParamsSchema.parse(request.params ?? {});
      const body = adminReviewRegistrationBodySchema.parse(request.body ?? {});
      const data = await coreService.reviewRegistrationApplicationForAdmin({
        id: params.id,
        action: body.action,
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
    "/admin/customers/:id/bind",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminCustomerParamsSchema.parse(request.params ?? {});
      const body = adminBindCustomerBodySchema.parse(request.body ?? {});
      const data = await coreService.bindKingdeeCustomerForAdmin({
        customerId: params.id,
        kingdeeCustomerId: body.kingdeeCustomerId
      });
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/customers/:id/unbind",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminCustomerParamsSchema.parse(request.params ?? {});
      const data = await coreService.unbindKingdeeCustomerForAdmin(params.id);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/customers/:id/status",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminCustomerParamsSchema.parse(request.params ?? {});
      const body = adminUpdateCustomerStatusBodySchema.parse(request.body ?? {});
      const data = await coreService.updateCustomerStatusForAdmin({
        customerId: params.id,
        status: body.status,
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
    "/admin/customers/:id/remove",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const params = adminCustomerParamsSchema.parse(request.params ?? {});
      const body = adminRemoveCustomerBodySchema.parse(request.body ?? {});
      const data = await coreService.removeCustomerForAdmin(params.id, body.remark);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/settings/webhook/test",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminWebhookTestBodySchema.parse(request.body ?? {});
      const data = await coreService.testAdminWebhook({
        key: body.key,
        webhookUrl: body.webhookUrl,
        title: body.title,
        lines: body.lines
      });
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/settings/test-webhook",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = adminSettingsTestWebhookQuerySchema.parse(request.query ?? {});
      const body = adminWebhookTestBodySchema.parse(request.body ?? {});
      const typeKey = query.type ? ADMIN_WEBHOOK_KEY_BY_TYPE[query.type] : undefined;
      const data = await coreService.testAdminWebhook({
        key: body.key ?? typeKey,
        webhookUrl: body.webhookUrl,
        title: body.title ?? (query.type ? `${query.type} webhook 测试` : undefined),
        lines: body.lines
      });
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.get(
    "/admin/settings",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const data = await coreService.getAdminSettings();
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.put(
    "/admin/settings",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminSettingsUpdateBodySchema.parse(request.body ?? {});
      const data = await coreService.updateAdminSettings(body);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/settings",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminSettingsUpdateBodySchema.parse(request.body ?? {});
      const data = await coreService.updateAdminSettings(body);
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/uploads/image",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminImageUploadBodySchema.parse(request.body ?? {});
      const data = await coreService.adminUploadImage({
        dataUrl: body.dataUrl,
        filename: body.filename,
        folder: body.folder
      });
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

  app.get(
    "/admin/products/kingdee/list",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const query = adminKingdeeMaterialListQuerySchema.parse(request.query ?? {});
      const data = await coreService.adminListKingdeeMaterials({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search
      });
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/products/kingdee/one-click-listing",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminKingdeeOneClickListingBodySchema.parse(request.body ?? {});
      const data = await coreService.adminOneClickListKingdeeProducts({
        items: body.items
      });
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

  app.get(
    "/admin/diagnostics/kingdee",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const data = await coreService.runAdminKingdeeDiagnostics();
      return {
        ok: true,
        requestId: request.id,
        data
      };
    }
  );

  app.post(
    "/admin/diagnostics/orders/retry-writeback",
    {
      preHandler: async (request) => ensureAdminAuthorization(request)
    },
    async (request) => {
      const body = adminDiagnosticsRetryWritebackBodySchema.parse(request.body ?? {});
      const data = await coreService.retryOrderWritebackByOrderNo(body.orderNo);
      return {
        ok: true,
        requestId: request.id,
        data
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
