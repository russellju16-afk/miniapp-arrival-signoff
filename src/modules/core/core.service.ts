import { createHash, randomBytes, randomUUID } from "node:crypto";

import axios from "axios";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { EndpointItem } from "../../lib/kingdee-doc-parser";
import { AppError } from "../common/app-error";
import { coreRepo, ReconciliationLineInput } from "./core.repo";
import { decryptKnownSensitiveFields } from "./crypto.util";
import { CoreEndpointKey, endpointCatalog } from "./endpoint-catalog";
import { maskSecret } from "./sanitize.util";
import { kingdeeClient } from "./kingdee-client";
import { kingdeeTokenProvider } from "./token-provider";

interface WechatLoginInput {
  code?: string;
  mockOpenid?: string;
  customerName?: string;
}

interface MiniLoginInput {
  token: string;
}

interface MiniOrderLineInput {
  skuId: string;
  qty: number;
}

interface MiniCreateOrderInput {
  remark?: string;
  items?: MiniOrderLineInput[];
}

interface IssueCustomerTokenInput {
  customerId?: string;
  kingdeeCustomerId?: string;
  name?: string;
  phone?: string;
  ttlDays?: number;
}

interface MiniAuthCustomer {
  id: string;
  name: string;
  phone: string | null;
  kingdeeCustomerId: string | null;
  accessToken: string;
  tokenExpiresAt: Date | null;
}

interface PageInput {
  page?: number;
  pageSize?: number;
  status?: string;
}

interface SignDeliveryInput {
  customerId?: string;
  deliveryId: string;
  signerName: string;
  remark?: string;
  signatureImageBase64?: string;
  photosBase64?: string[];
  signedAt?: string;
  idempotencyKey?: string;
}

interface ReconcileInput {
  customerId: string;
  from?: string;
  to?: string;
}

interface ConfirmReconcileInput {
  customerId: string;
  statementId: string;
  confirmedAt?: string;
  remark?: string;
}

interface SyncInput {
  fromTime?: number;
  toTime?: number;
}

interface AdminSyncRunInput extends SyncInput {
  tenantId?: string;
  jobName: string;
}

interface SyncCursor {
  modifyStartTime: number;
  modifyEndTime: number;
  lastPage: number;
  updatedAt: string;
}

interface SyncResult {
  jobName: string;
  fromTime: number;
  toTime: number;
  pages: number;
  totalRows: number;
  inserted: number;
  skipped: number;
  warnings: string[];
}

type CoreSyncJobName = "sync:deliveries" | "sync:receipts" | "sync:all";
type OrderStatus = "CREATED" | "CONFIRMED" | "CANCELED" | "WRITEBACK_FAILED";

interface AdminOrderListInput {
  page?: number;
  pageSize?: number;
  status?: string;
  customerId?: string;
  orderNo?: string;
}

interface WritebackResult {
  success: boolean;
  statusCode: number;
  code: string;
  message: string;
  requestId: string;
  traceId: string | null;
  summary: string;
  remoteErrcode?: number | null;
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const DEFAULT_CUSTOMER_TOKEN_TTL_DAYS = 3650;
const DEFAULT_ORDER_PAGE_SIZE = 20;
const RECON_BIZ_TYPE_LIST = ["销售出库单详情", "收款单详情"];

const coreLogger = logger.child({ scope: "core-service" });

class CoreService {
  async pingKingdee() {
    const endpoint = this.getEndpoint("customerList");
    const query = this.buildListQuery(endpoint, {}, Date.now() - 24 * 60 * 60 * 1000, Date.now());

    try {
      await kingdeeTokenProvider.getValidToken();
    } catch (error) {
      return {
        tokenOk: false,
        apiOk: false,
        endpoint: this.endpointMeta(endpoint),
        error: error instanceof Error ? error.message : "获取 token 失败"
      };
    }

    try {
      const sample = await kingdeeClient.request({
        method: "GET",
        path: endpoint.path,
        query
      });

      return {
        tokenOk: true,
        apiOk: true,
        endpoint: this.endpointMeta(endpoint),
        sample: decryptKnownSensitiveFields(sample)
      };
    } catch (error) {
      return {
        tokenOk: true,
        apiOk: false,
        endpoint: this.endpointMeta(endpoint),
        error: error instanceof Error ? error.message : "调用金蝶接口失败"
      };
    }
  }

  async getCustomerList(query: Record<string, string>) {
    const endpoint = this.getEndpoint("customerList");
    const mergedQuery = this.buildListQuery(endpoint, query);

    const data = await kingdeeClient.request({
      method: "GET",
      path: endpoint.path,
      query: mergedQuery
    });

    return {
      endpoint: this.endpointMeta(endpoint),
      query: mergedQuery,
      data: decryptKnownSensitiveFields(data)
    };
  }

  async getSalesOutboundList(query: Record<string, string>) {
    const endpoint = this.getEndpoint("salesOutboundList");
    const mergedQuery = this.buildListQuery(endpoint, query);

    const data = await kingdeeClient.request({
      method: "GET",
      path: endpoint.path,
      query: mergedQuery
    });

    return {
      endpoint: this.endpointMeta(endpoint),
      query: mergedQuery,
      data: decryptKnownSensitiveFields(data)
    };
  }

  async getSalesOutboundDetail(query: Record<string, string>) {
    const endpoint = this.getEndpoint("salesOutboundDetail");
    const mergedQuery = this.buildDetailQuery(endpoint, query);

    const data = await kingdeeClient.request({
      method: "GET",
      path: endpoint.path,
      query: mergedQuery
    });

    return {
      endpoint: this.endpointMeta(endpoint),
      query: mergedQuery,
      data: decryptKnownSensitiveFields(data)
    };
  }

  async getReceiptList(query: Record<string, string>) {
    const endpoint = this.getEndpoint("receiptList");
    const mergedQuery = this.buildListQuery(endpoint, query);

    const data = await kingdeeClient.request({
      method: "GET",
      path: endpoint.path,
      query: mergedQuery
    });

    return {
      endpoint: this.endpointMeta(endpoint),
      query: mergedQuery,
      data: decryptKnownSensitiveFields(data)
    };
  }

  async getReceiptDetail(query: Record<string, string>) {
    const endpoint = this.getEndpoint("receiptDetail");
    const mergedQuery = this.buildDetailQuery(endpoint, query);

    const data = await kingdeeClient.request({
      method: "GET",
      path: endpoint.path,
      query: mergedQuery
    });

    return {
      endpoint: this.endpointMeta(endpoint),
      query: mergedQuery,
      data: decryptKnownSensitiveFields(data)
    };
  }

  async issueCustomerAccessToken(input: IssueCustomerTokenInput) {
    const ttlDays = this.normalizeTokenTtlDays(input.ttlDays);
    let customer = await this.findIssueTargetCustomer(input);

    if (!customer) {
      customer = await coreRepo.createCustomer({
        name: input.name?.trim() || input.kingdeeCustomerId?.trim() || `客户-${Date.now()}`,
        phone: input.phone?.trim() || null,
        kingdeeCustomerId: input.kingdeeCustomerId?.trim() || null
      });
    } else if (input.name?.trim() || typeof input.phone !== "undefined") {
      customer = await coreRepo.updateCustomerProfile(customer.id, {
        ...(input.name?.trim() ? { name: input.name.trim() } : {}),
        ...(typeof input.phone !== "undefined" ? { phone: input.phone?.trim() || null } : {}),
        ...(input.kingdeeCustomerId?.trim()
          ? {
              kingdeeCustomerId: input.kingdeeCustomerId.trim()
            }
          : {})
      });
    }

    const accessToken = await this.generateUniqueCustomerToken();
    const tokenExpiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    const updated = await coreRepo.setCustomerAccessToken(customer.id, accessToken, tokenExpiresAt);

    return {
      customer: this.serializeCustomer(updated),
      accessToken,
      tokenExpiresAt: tokenExpiresAt.toISOString()
    };
  }

  async listCustomersForAdmin() {
    const customers = await coreRepo.listCustomers();
    return customers.map((customer) => ({
      ...this.serializeCustomer(customer),
      accessTokenMasked: customer.accessToken ? maskSecret(customer.accessToken) : null
    }));
  }

  async adminUpsertProduct(input: {
    id?: string;
    code: string;
    name: string;
    description?: string;
    coverImageUrl?: string;
    status?: string;
    defaultUnitId?: string;
    kingdeeMaterialId?: string;
  }) {
    if (!input.code.trim() || !input.name.trim()) {
      throw new AppError(400, "PRODUCT_REQUIRED_FIELDS", "code 和 name 不能为空");
    }

    const product = await coreRepo.upsertProduct({
      id: input.id?.trim() || undefined,
      code: input.code.trim(),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      coverImageUrl: input.coverImageUrl?.trim() || null,
      status: (input.status?.trim() || "ACTIVE").toUpperCase(),
      defaultUnitId: input.defaultUnitId?.trim() || null,
      kingdeeMaterialId: input.kingdeeMaterialId?.trim() || null
    });

    return this.serializeProduct(product);
  }

  async adminUpsertProductSku(input: {
    id?: string;
    productId: string;
    skuCode: string;
    skuName: string;
    specs?: Record<string, unknown>;
    price: number;
    stock: number;
    status?: string;
    unitId?: string;
    kingdeeMaterialId?: string;
  }) {
    if (!input.productId.trim()) {
      throw new AppError(400, "PRODUCT_ID_REQUIRED", "productId 不能为空");
    }
    if (!input.skuCode.trim() || !input.skuName.trim()) {
      throw new AppError(400, "SKU_REQUIRED_FIELDS", "skuCode 和 skuName 不能为空");
    }
    if (!Number.isFinite(input.price) || input.price < 0) {
      throw new AppError(400, "SKU_PRICE_INVALID", "price 必须大于等于 0");
    }
    if (!Number.isInteger(input.stock) || input.stock < 0) {
      throw new AppError(400, "SKU_STOCK_INVALID", "stock 必须是大于等于 0 的整数");
    }

    const product = await coreRepo.findProductById(input.productId.trim());
    if (!product) {
      throw new AppError(404, "PRODUCT_NOT_FOUND", "商品不存在");
    }

    const sku = await coreRepo.upsertProductSku({
      id: input.id?.trim() || undefined,
      productId: input.productId.trim(),
      skuCode: input.skuCode.trim(),
      skuName: input.skuName.trim(),
      specsJson: input.specs ? JSON.stringify(input.specs) : null,
      price: Number(input.price),
      stock: input.stock,
      status: (input.status?.trim() || "ACTIVE").toUpperCase(),
      unitId: input.unitId?.trim() || null,
      kingdeeMaterialId: input.kingdeeMaterialId?.trim() || null
    });

    return this.serializeSku(sku);
  }

  async adminListProducts(status?: string) {
    const products = await coreRepo.listProducts(status?.trim() || undefined);
    return products.map((item) => this.serializeProduct(item, true));
  }

  async adminListOrders(input: AdminOrderListInput) {
    const page = this.normalizePage(input.page);
    const pageSize = this.normalizeOrderPageSize(input.pageSize);
    const data = await coreRepo.listSalesOrdersForAdmin({
      page,
      pageSize,
      status: input.status?.trim() || undefined,
      customerId: input.customerId?.trim() || undefined,
      orderNo: input.orderNo?.trim() || undefined
    });

    return {
      ...data,
      items: data.items.map((item) => ({
        ...this.serializeOrderSummary(item),
        customer: item.customer
          ? {
              id: item.customer.id,
              name: item.customer.name,
              phone: item.customer.phone,
              kingdeeCustomerId: item.customer.kingdeeCustomerId
            }
          : null,
        latestWriteback: item.writebackLogs[0]
          ? this.serializeWritebackLog(item.writebackLogs[0])
          : null
      }))
    };
  }

  async adminGetOrderDetail(orderId: string) {
    const order = await coreRepo.findSalesOrderByIdForAdmin(orderId);
    if (!order) {
      throw new AppError(404, "ORDER_NOT_FOUND", "订单不存在");
    }

    return {
      ...this.serializeOrderDetail(order),
      customer: {
        id: order.customer.id,
        name: order.customer.name,
        phone: order.customer.phone,
        kingdeeCustomerId: order.customer.kingdeeCustomerId
      },
      writebackLogs: order.writebackLogs.map((log) => this.serializeWritebackLog(log))
    };
  }

  async adminCancelOrder(orderId: string, remark?: string) {
    const order = await coreRepo.findSalesOrderByIdForAdmin(orderId);
    if (!order) {
      throw new AppError(404, "ORDER_NOT_FOUND", "订单不存在");
    }
    if (order.status === "CANCELED") {
      return this.adminGetOrderDetail(order.id);
    }
    if (!["CREATED", "WRITEBACK_FAILED"].includes(order.status)) {
      throw new AppError(409, "ORDER_CANCEL_NOT_ALLOWED", "当前状态不允许取消");
    }

    await coreRepo.updateSalesOrder({
      id: order.id,
      status: "CANCELED",
      canceledAt: new Date(),
      writebackError: remark?.trim() || order.writebackError
    });

    return this.adminGetOrderDetail(order.id);
  }

  async listMiniProducts(customer: MiniAuthCustomer, input: PageInput) {
    void customer;
    const page = this.normalizePage(input.page);
    const pageSize = this.normalizePageSize(input.pageSize);
    const products = await coreRepo.listProducts("ACTIVE");
    const total = products.length;
    const sliced = products.slice((page - 1) * pageSize, page * pageSize);
    return {
      total,
      page,
      pageSize,
      items: sliced.map((item) => this.serializeProduct(item, true))
    };
  }

  async getMiniProductDetail(customer: MiniAuthCustomer, productId: string) {
    void customer;
    const product = await coreRepo.findProductById(productId);
    if (!product || product.status !== "ACTIVE") {
      throw new AppError(404, "PRODUCT_NOT_FOUND", "商品不存在");
    }
    return this.serializeProduct(product, true);
  }

  async getMiniCart(customer: MiniAuthCustomer) {
    await coreRepo.ensureCustomerCart(customer.id);
    const cart = await coreRepo.getCartByCustomer(customer.id);
    return this.serializeCart(cart);
  }

  async addMiniCartItem(
    customer: MiniAuthCustomer,
    input: {
      skuId: string;
      qty: number;
    }
  ) {
    if (!input.skuId.trim()) {
      throw new AppError(400, "SKU_ID_REQUIRED", "skuId 不能为空");
    }
    if (!Number.isInteger(input.qty) || input.qty <= 0) {
      throw new AppError(400, "QTY_INVALID", "qty 必须是大于 0 的整数");
    }

    const sku = await coreRepo.findSkuById(input.skuId.trim());
    if (!sku || sku.status !== "ACTIVE" || sku.product.status !== "ACTIVE") {
      throw new AppError(404, "SKU_NOT_FOUND", "SKU 不存在或已下架");
    }
    if (sku.stock < input.qty) {
      throw new AppError(409, "SKU_STOCK_NOT_ENOUGH", "库存不足");
    }

    await coreRepo.upsertCartItem({
      customerId: customer.id,
      productId: sku.productId,
      skuId: sku.id,
      qty: input.qty
    });

    return this.getMiniCart(customer);
  }

  async updateMiniCartItemQty(
    customer: MiniAuthCustomer,
    cartItemId: string,
    qty: number
  ) {
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new AppError(400, "QTY_INVALID", "qty 必须是大于 0 的整数");
    }

    const item = await coreRepo.findCartItemByIdAndCustomer(cartItemId, customer.id);
    if (!item) {
      throw new AppError(404, "CART_ITEM_NOT_FOUND", "购物车项目不存在");
    }

    const sku = await coreRepo.findSkuById(item.skuId);
    if (!sku || sku.status !== "ACTIVE") {
      throw new AppError(409, "SKU_NOT_ACTIVE", "SKU 已下架");
    }
    if (sku.stock < qty) {
      throw new AppError(409, "SKU_STOCK_NOT_ENOUGH", "库存不足");
    }

    await coreRepo.updateCartItemQty(item.id, qty);
    return this.getMiniCart(customer);
  }

  async removeMiniCartItem(customer: MiniAuthCustomer, cartItemId: string) {
    const item = await coreRepo.findCartItemByIdAndCustomer(cartItemId, customer.id);
    if (!item) {
      throw new AppError(404, "CART_ITEM_NOT_FOUND", "购物车项目不存在");
    }
    await coreRepo.removeCartItem(item.id);
    return this.getMiniCart(customer);
  }

  async createMiniOrder(
    customer: MiniAuthCustomer,
    input: MiniCreateOrderInput,
    idempotencyKey?: string
  ) {
    const key = idempotencyKey?.trim() || null;
    if (key) {
      const existing = await coreRepo.findSalesOrderByIdempotencyKey(customer.id, key);
      if (existing) {
        const detail = await coreRepo.findSalesOrderByIdAndCustomer(existing.id, customer.id);
        return this.serializeOrderDetail(detail);
      }
    }

    const hasExplicitItemsInput = Array.isArray(input.items);
    const normalizedLines = await this.resolveOrderLinesFromInput(customer, input.items);
    if (normalizedLines.length === 0) {
      throw new AppError(400, "ORDER_ITEMS_EMPTY", "至少需要一个商品");
    }

    const orderNo = `SO${Date.now()}${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;
    const totalAmount = normalizedLines.reduce((sum, line) => sum + line.lineAmount, 0);

    const order = await coreRepo.createSalesOrderWithLines({
      orderNo,
      customerId: customer.id,
      status: "CREATED",
      settlementMode: "OFFLINE",
      currency: "CNY",
      totalAmount,
      remark: input.remark?.trim() || null,
      idempotencyKey: key,
      lines: normalizedLines
    });

    if (hasExplicitItemsInput) {
      await coreRepo.clearCartItemsByCustomerSkuIds(
        customer.id,
        normalizedLines.map((line) => line.skuId)
      );
    } else {
      await coreRepo.clearCartByCustomer(customer.id);
    }

    const fresh = await coreRepo.findSalesOrderById(order.id);
    if (!fresh) {
      throw new AppError(500, "ORDER_CREATE_FAILED", "订单创建失败");
    }

    const writeback = await this.createOrderAndWritebackKingdee(fresh);
    if (!writeback.success) {
      throw new AppError(writeback.statusCode, writeback.code, writeback.message, {
        orderId: fresh.id,
        orderNo: fresh.orderNo,
        requestId: writeback.requestId,
        traceId: writeback.traceId,
        summary: writeback.summary
      });
    }

    const confirmed = await coreRepo.findSalesOrderByIdAndCustomer(order.id, customer.id);
    return this.serializeOrderDetail(confirmed);
  }

  async listMiniOrders(
    customer: MiniAuthCustomer,
    input: {
      page?: number;
      pageSize?: number;
      status?: string;
      orderNo?: string;
    }
  ) {
    const page = this.normalizePage(input.page);
    const pageSize = this.normalizeOrderPageSize(input.pageSize);
    const data = await coreRepo.listSalesOrdersByCustomer({
      customerId: customer.id,
      page,
      pageSize,
      status: input.status?.trim() || undefined,
      orderNo: input.orderNo?.trim() || undefined
    });
    return {
      ...data,
      items: data.items.map((item) => this.serializeOrderSummary(item))
    };
  }

  async getMiniOrderDetail(customer: MiniAuthCustomer, orderId: string) {
    const order = await coreRepo.findSalesOrderByIdAndCustomer(orderId, customer.id);
    return this.serializeOrderDetail(order);
  }

  async cancelMiniOrder(customer: MiniAuthCustomer, orderId: string, remark?: string) {
    const order = await coreRepo.findSalesOrderByIdAndCustomer(orderId, customer.id);
    if (!order) {
      throw new AppError(404, "ORDER_NOT_FOUND", "订单不存在");
    }
    if (order.status === "CANCELED") {
      return this.serializeOrderDetail(order);
    }
    if (!["CREATED", "WRITEBACK_FAILED"].includes(order.status)) {
      throw new AppError(409, "ORDER_CANCEL_NOT_ALLOWED", "当前状态不允许取消");
    }

    await coreRepo.updateSalesOrder({
      id: order.id,
      status: "CANCELED",
      canceledAt: new Date(),
      writebackError: remark?.trim() || order.writebackError
    });

    const updated = await coreRepo.findSalesOrderByIdAndCustomer(order.id, customer.id);
    return this.serializeOrderDetail(updated);
  }

  async retryOrderWriteback(orderId: string) {
    const before = await coreRepo.findSalesOrderByIdForAdmin(orderId);
    if (!before) {
      throw new AppError(404, "ORDER_NOT_FOUND", "订单不存在");
    }
    if (!["WRITEBACK_FAILED", "CREATED"].includes(before.status)) {
      throw new AppError(409, "ORDER_RETRY_NOT_ALLOWED", "当前状态不允许重试写回");
    }

    const order = await coreRepo.findSalesOrderById(orderId);
    if (!order) {
      throw new AppError(404, "ORDER_NOT_FOUND", "订单不存在");
    }

    const writeback = await this.createOrderAndWritebackKingdee(order);
    if (!writeback.success) {
      throw new AppError(writeback.statusCode, writeback.code, writeback.message, {
        orderId: order.id,
        orderNo: order.orderNo,
        requestId: writeback.requestId,
        traceId: writeback.traceId,
        summary: writeback.summary
      });
    }

    const fresh = await coreRepo.findSalesOrderByIdForAdmin(order.id);
    if (!fresh) {
      throw new AppError(500, "ORDER_NOT_FOUND_AFTER_RETRY", "重试成功后读取订单失败");
    }

    return {
      retriedAt: new Date().toISOString(),
      beforeStatus: before.status,
      afterStatus: fresh.status,
      writeback: {
        code: writeback.code,
        message: writeback.message,
        requestId: writeback.requestId,
        traceId: writeback.traceId,
        summary: writeback.summary
      },
      order: {
        ...this.serializeOrderDetail(fresh),
        customer: {
          id: fresh.customer.id,
          name: fresh.customer.name,
          phone: fresh.customer.phone,
          kingdeeCustomerId: fresh.customer.kingdeeCustomerId
        },
        writebackLogs: fresh.writebackLogs.map((log) => this.serializeWritebackLog(log))
      }
    };
  }

  async loginMini(input: MiniLoginInput) {
    const customer = await this.resolveMiniCustomerByAccessToken(input.token);
    return {
      customer: this.serializeCustomer(customer)
    };
  }

  async authenticateMiniCustomerByAuthorizationHeader(
    authorizationHeader: string | undefined
  ): Promise<MiniAuthCustomer> {
    const token = parseBearerToken(authorizationHeader);
    if (!token) {
      throw new AppError(401, "MINI_UNAUTHORIZED", "缺少或无效的 Bearer Token");
    }

    return this.resolveMiniCustomerByAccessToken(token);
  }

  async listMiniDeliveries(customer: MiniAuthCustomer, pageInput: PageInput) {
    const page = this.normalizePage(pageInput.page);
    const pageSize = this.normalizePageSize(pageInput.pageSize);

    const data = await coreRepo.listDeliveriesByCustomerId(customer.id, {
      page,
      pageSize,
      status: pageInput.status?.trim() || "PENDING"
    });

      return {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          orderId: item.salesOrder?.id ?? null,
          orderNo: item.salesOrder?.orderNo ?? null,
          orderStatus: item.salesOrder?.status ?? null,
          details: safeParseJson(item.detailsJson),
          signedPayload: safeParseJson(item.signedPayloadJson)
        }))
    };
  }

  async getMiniDeliveryDetail(customer: MiniAuthCustomer, deliveryId: string) {
    return this.getDeliveryDetail(customer.id, deliveryId);
  }

  async signMiniDelivery(customer: MiniAuthCustomer, input: SignDeliveryInput) {
    return this.signDelivery({
      ...input,
      customerId: customer.id
    });
  }

  async listMiniStatements(customer: MiniAuthCustomer, from?: string, to?: string) {
    const periodStart = parseDayStart(from);
    const periodEnd = parseDayEnd(to);
    if (periodStart.getTime() > periodEnd.getTime()) {
      throw new AppError(400, "INVALID_DATE_RANGE", "from 不能晚于 to");
    }

    const data = await coreRepo.listReconciliationsByCustomer({
      customerId: customer.id,
      periodStart,
      periodEnd,
      page: 1,
      pageSize: 200
    });

    return {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        statement: safeParseJson(item.statementJson),
        orderNoList: this.extractOrderNoListFromStatement(item.statementJson),
        orderLinks: this.extractOrderLinksFromStatement(item.statementJson)
      }))
    };
  }

  async getMiniStatementDetail(customer: MiniAuthCustomer, statementId: string) {
    return this.getReconcileStatementDetail(customer.id, statementId);
  }

  async confirmMiniStatement(
    customer: MiniAuthCustomer,
    input: {
      statementId: string;
      confirmedAt?: string;
      remark?: string;
    }
  ) {
    return this.confirmReconcileStatement({
      customerId: customer.id,
      statementId: input.statementId,
      confirmedAt: input.confirmedAt,
      remark: input.remark
    });
  }

  async loginWechat(input: WechatLoginInput) {
    const openid = await this.resolveOpenid(input);
    let customer = await coreRepo.findCustomerByOpenid(openid);

    if (!customer) {
      customer = await coreRepo.createCustomer({
        name: input.customerName?.trim() || `测试客户-${openid.slice(-6)}`,
        wechatOpenid: openid
      });
    } else if (input.customerName?.trim() && customer.name !== input.customerName.trim()) {
      customer = await coreRepo.updateCustomerName(customer.id, input.customerName.trim());
    }

    return {
      openid,
      customer: {
        id: customer.id,
        name: customer.name,
        wechatOpenid: customer.wechatOpenid
      }
    };
  }

  async listDeliveries(customerId: string, pageInput: PageInput) {
    await this.ensureCustomerExists(customerId);

    const page = this.normalizePage(pageInput.page);
    const pageSize = this.normalizePageSize(pageInput.pageSize);

    const data = await coreRepo.listDeliveriesByCustomerId(customerId, {
      page,
      pageSize,
      status: pageInput.status?.trim() || "PENDING"
    });

      return {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          orderId: item.salesOrder?.id ?? null,
          orderNo: item.salesOrder?.orderNo ?? null,
          orderStatus: item.salesOrder?.status ?? null,
          details: safeParseJson(item.detailsJson)
        }))
      };
  }

  async getDeliveryDetail(customerId: string, deliveryId: string) {
    await this.ensureCustomerExists(customerId);
    const delivery = await coreRepo.findDeliveryByIdAndCustomer(deliveryId, customerId);
    if (!delivery) {
      throw new AppError(404, "DELIVERY_NOT_FOUND", "未找到对应 delivery");
    }

    return {
      ...delivery,
      orderId: delivery.salesOrder?.id ?? null,
      orderNo: delivery.salesOrder?.orderNo ?? null,
      orderStatus: delivery.salesOrder?.status ?? null,
      details: safeParseJson(delivery.detailsJson),
      signedPayload: safeParseJson(delivery.signedPayloadJson)
    };
  }

  async signDelivery(input: SignDeliveryInput) {
    const delivery = await coreRepo.findDeliveryById(input.deliveryId);
    if (!delivery) {
      throw new AppError(404, "DELIVERY_NOT_FOUND", "未找到对应 delivery");
    }

    if (input.customerId && delivery.customerId !== input.customerId) {
      throw new AppError(403, "DELIVERY_FORBIDDEN", "无权签收该 delivery");
    }

    if (delivery.status === "SIGNED") {
      if (input.idempotencyKey && delivery.signIdempotencyKey === input.idempotencyKey) {
        return {
          id: delivery.id,
          status: delivery.status,
          signedAt: delivery.signedAt,
          signedPayloadJson: delivery.signedPayloadJson,
          idempotent: true
        };
      }

      throw new AppError(409, "DELIVERY_ALREADY_SIGNED", "该单据已签收");
    }

    const signedAt = input.signedAt ? new Date(input.signedAt) : new Date();
    if (Number.isNaN(signedAt.getTime())) {
      throw new AppError(400, "INVALID_SIGNED_AT", "signedAt 时间格式不正确");
    }

    const signedPayloadJson = JSON.stringify({
      signerName: input.signerName,
      remark: input.remark ?? null,
      signatureImageBase64: input.signatureImageBase64 ?? null,
      photosBase64: input.photosBase64 ?? [],
      signedAt: signedAt.toISOString(),
      idempotencyKey: input.idempotencyKey ?? null
    });

    const updated = await coreRepo.signDelivery({
      id: delivery.id,
      signedAt,
      signedPayloadJson,
      idempotencyKey: input.idempotencyKey ?? null
    });

    return {
      id: updated.id,
      status: updated.status,
      signedAt: updated.signedAt,
      signedPayloadJson: updated.signedPayloadJson,
      idempotent: false
    };
  }

  async buildReconcileStatement(input: ReconcileInput) {
    const customer = await this.ensureCustomerExists(input.customerId);

    const periodStart = parseDayStart(input.from);
    const periodEnd = parseDayEnd(input.to);
    if (periodStart.getTime() > periodEnd.getTime()) {
      throw new AppError(400, "INVALID_DATE_RANGE", "from 不能晚于 to");
    }

    const docs = await coreRepo.listRawDocumentsByRangeAndTypes(RECON_BIZ_TYPE_LIST, periodStart, periodEnd);
    const lines: ReconciliationLineInput[] = [];

    for (const doc of docs) {
      const parsed = safeParseJson(doc.payloadJson);
      const docNo = doc.number ?? doc.kingdeeId ?? null;
      const sourceOrderNo = isRecord(parsed) ? pickSourceDocNo(parsed, parsed) : null;
      const candidate = {
        docType: doc.docType,
        docNo,
        docDate: doc.fetchedAt,
        customerId: pickDocumentCustomerId(parsed),
        customerName: pickDocumentCustomerName(parsed),
        amount: extractAmount(parsed),
        rawJson: doc.payloadJson
      };
      if (!this.matchStatementLineToCustomer(candidate, customer)) {
        continue;
      }

      const linkedOrderNo = sourceOrderNo ?? docNo;
      const linkedOrder = linkedOrderNo
        ? await coreRepo.findSalesOrderByKingdeeOrderNumber(linkedOrderNo)
        : null;
      const wrappedRaw = JSON.stringify({
        source: safeParseJson(doc.payloadJson),
        orderNo: linkedOrder?.orderNo ?? null,
        orderStatus: linkedOrder?.status ?? null
      });

      lines.push({
        docType: candidate.docType,
        docNo: candidate.docNo,
        docDate: candidate.docDate,
        amount: candidate.amount,
        rawJson: wrappedRaw
      });
    }

    const totalAmount = lines.reduce((sum, line) => sum + (line.amount ?? 0), 0);
    const statement = {
      customerId: input.customerId,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      currency: "CNY",
      totalAmount,
      docCount: lines.length,
      lines: lines.map((line) => ({
        docType: line.docType,
        docNo: line.docNo,
        amount: line.amount,
        raw: safeParseJson(line.rawJson)
      }))
    };

    const reconciliation = await coreRepo.createReconciliation({
      customerId: input.customerId,
      periodStart,
      periodEnd,
      statementJson: JSON.stringify(statement),
      status: "GENERATED"
    });

    await coreRepo.replaceReconciliationLines(reconciliation.id, lines);

    return {
      statementId: reconciliation.id,
      ...statement,
      lines
    };
  }

  async getReconcileStatementDetail(customerId: string, statementId: string) {
    await this.ensureCustomerExists(customerId);

    const detail = await coreRepo.findReconciliationDetail(statementId);
    if (!detail || detail.customerId !== customerId) {
      throw new AppError(404, "RECONCILIATION_NOT_FOUND", "未找到对账单");
    }

    return {
      ...detail,
      statement: safeParseJson(detail.statementJson),
      lines: detail.lines.map((line) => ({
        ...line,
        raw: safeParseJson(line.rawJson),
        orderNo: this.pickOrderNoFromReconcileLine(line),
        orderStatus: this.pickOrderStatusFromReconcileLine(line)
      }))
    };
  }

  async confirmReconcileStatement(input: ConfirmReconcileInput) {
    await this.ensureCustomerExists(input.customerId);

    const found = await coreRepo.findReconciliationById(input.statementId);
    if (!found || found.customerId !== input.customerId) {
      throw new AppError(404, "RECONCILIATION_NOT_FOUND", "未找到对账单");
    }

    const confirmedAt = input.confirmedAt ? new Date(input.confirmedAt) : new Date();
    if (Number.isNaN(confirmedAt.getTime())) {
      throw new AppError(400, "INVALID_CONFIRMED_AT", "confirmedAt 时间格式不正确");
    }

    const updated = await coreRepo.confirmReconciliation({
      id: found.id,
      confirmedAt,
      confirmRemark: input.remark ?? null
    });

    return {
      id: updated.id,
      status: updated.status,
      confirmedAt: updated.confirmedAt,
      confirmRemark: updated.confirmRemark
    };
  }

  async syncDeliveries(input: SyncInput = {}): Promise<SyncResult> {
    const endpointList = this.getEndpoint("salesOutboundList");
    const endpointDetail = this.getEndpoint("salesOutboundDetail");
    const scope = `${env.NODE_ENV}:sync:deliveries`;

    if (env.KD_MOCK_MODE) {
      const mockRows = createMockSalesRows();
      let inserted = 0;
      let skipped = 0;
      const warnings: string[] = [];

      for (const row of mockRows) {
        const result = await this.persistDocumentAndDelivery({
          docType: endpointDetail.title,
          record: row,
          details: row
        });
        inserted += result.inserted;
        skipped += result.skipped;
      }

      await coreRepo.upsertSyncCheckpoint({
        scope,
        jobName: "sync:deliveries",
        cursorJson: JSON.stringify({
          modifyStartTime: Date.now() - 3600000,
          modifyEndTime: Date.now(),
          lastPage: 1,
          updatedAt: new Date().toISOString()
        } satisfies SyncCursor),
        status: "SUCCESS",
        errorMessage: null
      });

      return {
        jobName: "sync:deliveries",
        fromTime: Date.now() - 3600000,
        toTime: Date.now(),
        pages: 1,
        totalRows: mockRows.length,
        inserted,
        skipped,
        warnings
      };
    }

    const cursor = await this.loadSyncCursor(scope);
    const fromTime = input.fromTime ?? cursor?.modifyEndTime ?? Date.now() - 24 * 60 * 60 * 1000;
    const toTime = input.toTime ?? Date.now();

    const pageSize = 50;
    let page = 1;
    let pages = 0;
    let totalRows = 0;
    let inserted = 0;
    let skipped = 0;
    const warnings: string[] = [];

    while (true) {
      const query = this.buildListQuery(
        endpointList,
        {
          page: String(page),
          page_size: String(pageSize)
        },
        fromTime,
        toTime
      );

      const listResponse = await kingdeeClient.request({
        method: "GET",
        path: endpointList.path,
        query
      });

      const rows = extractRows(listResponse);
      const totalPages = extractTotalPages(listResponse, pageSize, rows.length);
      pages += 1;
      totalRows += rows.length;

      for (const row of rows) {
        const record = isRecord(row) ? row : {};
        let details: unknown = record;
        if (pickDocumentId(record) || pickDocumentNumber(record)) {
          details = await this.fetchDetailPreferId({
            endpointPath: endpointDetail.path,
            record,
            warnings,
            bizLabel: endpointDetail.title
          });
        }

        const detailRecord = extractFirstDetailRecord(details) ?? record;
        const result = await this.persistDocumentAndDelivery({
          docType: endpointDetail.title,
          record,
          details: detailRecord
        });

        inserted += result.inserted;
        skipped += result.skipped;
      }

      if (rows.length === 0 || page >= totalPages) {
        break;
      }
      page += 1;
    }

    await coreRepo.upsertSyncCheckpoint({
      scope,
      jobName: "sync:deliveries",
      cursorJson: JSON.stringify({
        modifyStartTime: fromTime,
        modifyEndTime: toTime,
        lastPage: page,
        updatedAt: new Date().toISOString()
      } satisfies SyncCursor),
      status: "SUCCESS",
      errorMessage: null
    });

    return {
      jobName: "sync:deliveries",
      fromTime,
      toTime,
      pages,
      totalRows,
      inserted,
      skipped,
      warnings
    };
  }

  async syncReceipts(input: SyncInput = {}): Promise<SyncResult> {
    const endpointList = this.getEndpoint("receiptList");
    const endpointDetail = this.getEndpoint("receiptDetail");
    const scope = `${env.NODE_ENV}:sync:receipts`;

    if (env.KD_MOCK_MODE) {
      const mockRows = createMockReceiptRows();
      let inserted = 0;
      let skipped = 0;
      const warnings: string[] = [];

      for (const row of mockRows) {
        const payloadJson = JSON.stringify(row);
        const hash = createHash("sha256").update(payloadJson, "utf8").digest("hex");
        const bizId = pickDocumentId(row);
        const exists = await coreRepo.findRawDocumentByHash(endpointDetail.title, hash, bizId);
        if (exists) {
          skipped += 1;
          continue;
        }

        await coreRepo.insertRawDocument({
          docType: endpointDetail.title,
          kingdeeId: bizId,
          number: pickDocumentNumber(row),
          payloadJson,
          hash
        });
        inserted += 1;
      }

      await coreRepo.upsertSyncCheckpoint({
        scope,
        jobName: "sync:receipts",
        cursorJson: JSON.stringify({
          modifyStartTime: Date.now() - 3600000,
          modifyEndTime: Date.now(),
          lastPage: 1,
          updatedAt: new Date().toISOString()
        } satisfies SyncCursor),
        status: "SUCCESS",
        errorMessage: null
      });

      return {
        jobName: "sync:receipts",
        fromTime: Date.now() - 3600000,
        toTime: Date.now(),
        pages: 1,
        totalRows: mockRows.length,
        inserted,
        skipped,
        warnings
      };
    }

    const cursor = await this.loadSyncCursor(scope);
    const fromTime = input.fromTime ?? cursor?.modifyEndTime ?? Date.now() - 24 * 60 * 60 * 1000;
    const toTime = input.toTime ?? Date.now();

    const pageSize = 50;
    let page = 1;
    let pages = 0;
    let totalRows = 0;
    let inserted = 0;
    let skipped = 0;
    const warnings: string[] = [];

    while (true) {
      const query = this.buildListQuery(
        endpointList,
        {
          page: String(page),
          page_size: String(pageSize)
        },
        fromTime,
        toTime
      );

      const listResponse = await kingdeeClient.request({
        method: "GET",
        path: endpointList.path,
        query
      });

      const rows = extractRows(listResponse);
      const totalPages = extractTotalPages(listResponse, pageSize, rows.length);
      pages += 1;
      totalRows += rows.length;

      for (const row of rows) {
        const record = isRecord(row) ? row : {};
        let detailRecord: unknown = record;

        if (pickDocumentId(record) || pickDocumentNumber(record)) {
          const detailResponse = await this.fetchDetailPreferId({
            endpointPath: endpointDetail.path,
            record,
            warnings,
            bizLabel: endpointDetail.title
          });
          detailRecord = extractFirstDetailRecord(detailResponse) ?? record;
        }

        const payloadJson = JSON.stringify(detailRecord);
        const hash = createHash("sha256").update(payloadJson, "utf8").digest("hex");
        const bizId = pickDocumentId(detailRecord);
        const exists = await coreRepo.findRawDocumentByHash(endpointDetail.title, hash, bizId);

        if (exists) {
          skipped += 1;
          continue;
        }

        await coreRepo.insertRawDocument({
          docType: endpointDetail.title,
          kingdeeId: bizId,
          number: pickDocumentNumber(detailRecord),
          payloadJson,
          hash
        });
        inserted += 1;
      }

      if (rows.length === 0 || page >= totalPages) {
        break;
      }
      page += 1;
    }

    await coreRepo.upsertSyncCheckpoint({
      scope,
      jobName: "sync:receipts",
      cursorJson: JSON.stringify({
        modifyStartTime: fromTime,
        modifyEndTime: toTime,
        lastPage: page,
        updatedAt: new Date().toISOString()
      } satisfies SyncCursor),
      status: "SUCCESS",
      errorMessage: null
    });

    return {
      jobName: "sync:receipts",
      fromTime,
      toTime,
      pages,
      totalRows,
      inserted,
      skipped,
      warnings
    };
  }

  async runAdminSyncJob(input: AdminSyncRunInput) {
    const resolvedJobName = this.normalizeCoreSyncJobName(input.jobName);
    const warnings: string[] = [];
    if (input.tenantId?.trim()) {
      warnings.push("core 同步为单租户模式，tenantId 参数已忽略");
    }

    const startedAt = new Date();
    if (resolvedJobName === "sync:deliveries") {
      const result = await this.syncDeliveries({
        fromTime: input.fromTime,
        toTime: input.toTime
      });

      return {
        tenantId: input.tenantId?.trim() || null,
        jobName: resolvedJobName,
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        warnings,
        results: [result]
      };
    }

    if (resolvedJobName === "sync:receipts") {
      const result = await this.syncReceipts({
        fromTime: input.fromTime,
        toTime: input.toTime
      });

      return {
        tenantId: input.tenantId?.trim() || null,
        jobName: resolvedJobName,
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        warnings,
        results: [result]
      };
    }

    const [deliveries, receipts] = await Promise.all([
      this.syncDeliveries({
        fromTime: input.fromTime,
        toTime: input.toTime
      }),
      this.syncReceipts({
        fromTime: input.fromTime,
        toTime: input.toTime
      })
    ]);

    return {
      tenantId: input.tenantId?.trim() || null,
      jobName: resolvedJobName,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      warnings,
      results: [deliveries, receipts]
    };
  }

  async listAdminSyncStatus(jobName?: string) {
    const normalizedJobName = jobName?.trim() ? this.normalizeCoreSyncJobName(jobName) : undefined;
    const queryJobName =
      normalizedJobName === "sync:all" || typeof normalizedJobName === "undefined"
        ? undefined
        : normalizedJobName;

    const checkpoints = await coreRepo.listSyncCheckpoints(queryJobName);
    return checkpoints.map((item) => ({
      scope: item.scope,
      jobName: item.jobName,
      status: item.status,
      cursor: safeParseJson(item.cursorJson),
      errorMessage: item.errorMessage,
      lastRunAt: item.lastRunAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));
  }

  async runSyncDemo() {
    return this.syncDeliveries({});
  }

  private getEndpoint(key: CoreEndpointKey): EndpointItem {
    return endpointCatalog.getByKey(key);
  }

  private buildListQuery(
    endpoint: EndpointItem,
    query: Record<string, string>,
    overrideFromTime?: number,
    overrideToTime?: number
  ): Record<string, string> {
    const merged: Record<string, string> = { ...query };
    const keys = new Set(endpoint.params.map((param) => param.name));

    const page = this.normalizePage(Number(merged.page ?? "1"));
    const pageSize = this.normalizePageSize(Number(merged.page_size ?? merged.pageSize ?? "50"));

    if (keys.has("page") && !merged.page) {
      merged.page = String(page);
    }
    if (keys.has("page_size") && !merged.page_size) {
      merged.page_size = String(pageSize);
    }
    if (keys.has("pagesize") && !merged.pagesize) {
      merged.pagesize = String(pageSize);
    }

    if (keys.has("modify_start_time") && !merged.modify_start_time) {
      merged.modify_start_time = String(overrideFromTime ?? Date.now() - 24 * 60 * 60 * 1000);
    }
    if (keys.has("modify_end_time") && !merged.modify_end_time) {
      merged.modify_end_time = String(overrideToTime ?? Date.now());
    }

    return merged;
  }

  private buildDetailQuery(endpoint: EndpointItem, query: Record<string, string>): Record<string, string> {
    const merged: Record<string, string> = { ...query };
    const keys = new Set(endpoint.params.map((param) => param.name));
    if ((keys.has("id") || keys.has("number")) && !merged.id && !merged.number) {
      throw new AppError(400, "KD_DETAIL_QUERY_REQUIRED", "详情接口至少需要 id 或 number");
    }

    return merged;
  }

  private endpointMeta(endpoint: EndpointItem) {
    return {
      title: endpoint.title,
      fullTitle: endpoint.fullTitle,
      method: endpoint.method,
      path: endpoint.path
    };
  }

  private normalizePage(value: number | undefined): number {
    if (!value || Number.isNaN(value) || value < 1) {
      return 1;
    }
    return Math.floor(value);
  }

  private normalizePageSize(value: number | undefined): number {
    if (!value || Number.isNaN(value) || value < 1) {
      return DEFAULT_PAGE_SIZE;
    }
    return Math.min(Math.floor(value), MAX_PAGE_SIZE);
  }

  private normalizeOrderPageSize(value: number | undefined): number {
    if (!value || Number.isNaN(value) || value < 1) {
      return DEFAULT_ORDER_PAGE_SIZE;
    }
    return Math.min(Math.floor(value), 100);
  }

  private normalizeCoreSyncJobName(jobName: string): CoreSyncJobName {
    const normalized = jobName.trim().toLowerCase();
    const deliveriesAliases = new Set([
      "sync:deliveries",
      "deliveries",
      "delivery",
      "sal_out_bound",
      "sal_order",
      "documents_incremental"
    ]);
    if (deliveriesAliases.has(normalized)) {
      return "sync:deliveries";
    }

    const receiptsAliases = new Set([
      "sync:receipts",
      "receipts",
      "receipt",
      "ar_credit",
      "ap_credit",
      "sal_invoice",
      "pur_invoice"
    ]);
    if (receiptsAliases.has(normalized)) {
      return "sync:receipts";
    }

    const allAliases = new Set(["sync:all", "all", "full", "both", "master_data_full"]);
    if (allAliases.has(normalized)) {
      return "sync:all";
    }

    throw new AppError(
      400,
      "SYNC_JOB_UNSUPPORTED",
      "不支持的 jobName。可选值: sync:deliveries, sync:receipts, sync:all"
    );
  }

  private serializeProduct(
    product: {
      id: string;
      code: string;
      name: string;
      description: string | null;
      coverImageUrl: string | null;
      status: string;
      defaultUnitId: string | null;
      kingdeeMaterialId: string | null;
      createdAt?: Date;
      updatedAt?: Date;
      skus?: Array<{
        id: string;
        skuCode: string;
        skuName: string;
        specsJson: string | null;
        price: number;
        stock: number;
        status: string;
        unitId: string | null;
        kingdeeMaterialId: string | null;
      }>;
    },
    withSkus = false
  ) {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      coverImageUrl: product.coverImageUrl,
      status: product.status,
      defaultUnitId: product.defaultUnitId,
      kingdeeMaterialId: product.kingdeeMaterialId,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
      skus: withSkus && Array.isArray(product.skus) ? product.skus.map((item) => this.serializeSku(item)) : undefined
    };
  }

  private serializeSku(sku: {
    id: string;
    skuCode: string;
    skuName: string;
    specsJson: string | null;
    price: number;
    stock: number;
    status: string;
    unitId: string | null;
    kingdeeMaterialId: string | null;
  }) {
    return {
      id: sku.id,
      skuCode: sku.skuCode,
      skuName: sku.skuName,
      specs: safeParseJson(sku.specsJson),
      price: Number(sku.price),
      stock: Number(sku.stock),
      status: sku.status,
      unitId: sku.unitId,
      kingdeeMaterialId: sku.kingdeeMaterialId
    };
  }

  private serializeCart(
    cart:
      | {
          id: string;
          customerId: string;
          items: Array<{
            id: string;
            qty: number;
            product: {
              id: string;
              code: string;
              name: string;
              coverImageUrl: string | null;
            };
            sku: {
              id: string;
              skuCode: string;
              skuName: string;
              specsJson: string | null;
              price: number;
              stock: number;
              status: string;
            };
          }>;
        }
      | null
  ) {
    const items =
      cart?.items.map((item) => {
        const lineAmount = Number(item.qty) * Number(item.sku.price);
        return {
          id: item.id,
          productId: item.product.id,
          skuId: item.sku.id,
          productCode: item.product.code,
          productName: item.product.name,
          coverImageUrl: item.product.coverImageUrl,
          skuCode: item.sku.skuCode,
          skuName: item.sku.skuName,
          specs: safeParseJson(item.sku.specsJson),
          qty: Number(item.qty),
          unitPrice: Number(item.sku.price),
          lineAmount,
          stock: Number(item.sku.stock),
          skuStatus: item.sku.status
        };
      }) ?? [];
    const totalAmount = items.reduce((sum, item) => sum + item.lineAmount, 0);
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    return {
      id: cart?.id ?? null,
      customerId: cart?.customerId ?? null,
      totalQty,
      totalAmount,
      items
    };
  }

  private serializeOrderSummary(order: {
    id: string;
    orderNo: string;
    status: string;
    settlementMode: string;
    currency: string;
    totalAmount: number;
    kingdeeOrderNumber: string | null;
    writebackError: string | null;
    createdAt: Date;
    canceledAt: Date | null;
    lines?: Array<{ id: string }>;
    deliveries?: Array<{ id: string; status: string }>;
  }) {
    return {
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      settlementMode: order.settlementMode,
      currency: order.currency,
      totalAmount: Number(order.totalAmount),
      kingdeeOrderNumber: order.kingdeeOrderNumber,
      writebackError: order.writebackError,
      createdAt: order.createdAt.toISOString(),
      canceledAt: order.canceledAt ? order.canceledAt.toISOString() : null,
      lineCount: order.lines?.length ?? 0,
      deliveryCount: order.deliveries?.length ?? 0
    };
  }

  private serializeOrderDetail(
    order:
      | {
          id: string;
          orderNo: string;
          status: string;
          settlementMode: string;
          currency: string;
          totalAmount: number;
          remark: string | null;
          idempotencyKey: string | null;
          kingdeeOrderId: string | null;
          kingdeeOrderNumber: string | null;
          writebackError: string | null;
          createdAt: Date;
          updatedAt: Date;
          canceledAt: Date | null;
          lines: Array<{
            id: string;
            productId: string;
            skuId: string;
            productName: string;
            skuName: string;
            skuCode: string;
            qty: number;
            unitPrice: number;
            lineAmount: number;
            rawJson: string | null;
          }>;
          deliveries?: Array<{
            id: string;
            kingdeeBillNumber: string | null;
            status: string;
            signedAt: Date | null;
          }>;
        }
      | null
  ) {
    if (!order) {
      throw new AppError(404, "ORDER_NOT_FOUND", "订单不存在");
    }
    return {
      ...this.serializeOrderSummary(order),
      remark: order.remark,
      idempotencyKey: order.idempotencyKey,
      kingdeeOrderId: order.kingdeeOrderId,
      updatedAt: order.updatedAt.toISOString(),
      lines: order.lines.map((line) => ({
        id: line.id,
        productId: line.productId,
        skuId: line.skuId,
        productName: line.productName,
        skuName: line.skuName,
        skuCode: line.skuCode,
        qty: line.qty,
        unitPrice: Number(line.unitPrice),
        lineAmount: Number(line.lineAmount),
        raw: safeParseJson(line.rawJson)
      })),
      deliveries:
        order.deliveries?.map((item) => ({
          id: item.id,
          kingdeeBillNumber: item.kingdeeBillNumber,
          status: item.status,
          signedAt: item.signedAt ? item.signedAt.toISOString() : null
        })) ?? []
    };
  }

  private serializeWritebackLog(log: {
    id: string;
    success: boolean;
    requestId: string | null;
    traceId: string | null;
    summary: string | null;
    requestJson: string;
    responseJson: string | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: Date;
  }) {
    return {
      id: log.id,
      success: log.success,
      requestId: log.requestId,
      traceId: log.traceId,
      summary: log.summary,
      request: safeParseJson(log.requestJson),
      response: safeParseJson(log.responseJson),
      errorCode: log.errorCode,
      errorMessage: log.errorMessage,
      createdAt: log.createdAt.toISOString()
    };
  }

  private async resolveOrderLinesFromInput(
    customer: MiniAuthCustomer,
    itemsInput?: MiniOrderLineInput[]
  ) {
    const normalizedInput = Array.isArray(itemsInput)
      ? itemsInput
      : (await this.getMiniCart(customer)).items.map((item) => ({
          skuId: item.skuId,
          qty: item.qty
        }));
    const lines: Array<{
      productId: string;
      skuId: string;
      productName: string;
      skuName: string;
      skuCode: string;
      qty: number;
      unitPrice: number;
      lineAmount: number;
      rawJson: string;
    }> = [];

    for (const raw of normalizedInput) {
      if (!raw.skuId?.trim()) {
        throw new AppError(400, "SKU_ID_REQUIRED", "订单项目缺少 skuId");
      }
      if (!Number.isInteger(raw.qty) || raw.qty <= 0) {
        throw new AppError(400, "QTY_INVALID", "订单项目 qty 必须大于 0");
      }
      const sku = await coreRepo.findSkuById(raw.skuId.trim());
      if (!sku || sku.status !== "ACTIVE" || sku.product.status !== "ACTIVE") {
        throw new AppError(404, "SKU_NOT_FOUND", `SKU 不存在或已下架: ${raw.skuId}`);
      }
      if (sku.stock < raw.qty) {
        throw new AppError(409, "SKU_STOCK_NOT_ENOUGH", `SKU 库存不足: ${sku.skuCode}`);
      }

      const unitPrice = Number(sku.price);
      const lineAmount = Number((unitPrice * raw.qty).toFixed(2));

      lines.push({
        productId: sku.productId,
        skuId: sku.id,
        productName: sku.product.name,
        skuName: sku.skuName,
        skuCode: sku.skuCode,
        qty: raw.qty,
        unitPrice,
        lineAmount,
        rawJson: JSON.stringify({
          specs: safeParseJson(sku.specsJson),
          unitId: sku.unitId,
          kingdeeMaterialId: sku.kingdeeMaterialId || sku.product.kingdeeMaterialId || null
        })
      });
    }

    return lines;
  }

  async createOrderAndWritebackKingdee(order: {
    id: string;
    orderNo: string;
    customerId: string;
    lines: Array<{
      id: string;
      qty: number;
      unitPrice: number;
      skuCode: string;
      productName: string;
      rawJson: string | null;
    }>;
  }): Promise<WritebackResult> {
    const endpoint = this.getEndpoint("salesOrderSave");
    const writebackRequestId = randomUUID();
    const customer = await coreRepo.findCustomerById(order.customerId);
    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "订单客户不存在");
    }
    if (!customer.kingdeeCustomerId?.trim()) {
      await coreRepo.updateSalesOrder({
        id: order.id,
        status: "WRITEBACK_FAILED",
        writebackError: "客户缺少 kingdee_customer_id，无法写回金蝶"
      });
      await coreRepo.createOrderWritebackLog({
        salesOrderId: order.id,
        success: false,
        requestId: writebackRequestId,
        traceId: null,
        summary: "customer_id missing",
        requestJson: JSON.stringify({
          requestId: writebackRequestId,
          orderId: order.id,
          orderNo: order.orderNo,
          reason: "customer_id missing"
        }),
        responseJson: null,
        errorCode: "ORDER_WRITEBACK_PARAM_INVALID",
        errorMessage: "客户缺少 kingdee_customer_id，无法写回金蝶"
      });
      return {
        success: false,
        statusCode: 400,
        code: "ORDER_WRITEBACK_PARAM_INVALID",
        message: "客户缺少 kingdee_customer_id，无法写回金蝶",
        requestId: writebackRequestId,
        traceId: null,
        summary: "customer_id missing"
      };
    }

    const materialEntity = order.lines.map((line) => {
      const parsed = safeParseJson(line.rawJson);
      const materialId =
        isRecord(parsed) && typeof parsed.kingdeeMaterialId === "string" && parsed.kingdeeMaterialId.trim()
          ? parsed.kingdeeMaterialId.trim()
          : null;
      const unitId =
        isRecord(parsed) && typeof parsed.unitId === "string" && parsed.unitId.trim()
          ? parsed.unitId.trim()
          : null;

      if (!materialId || !unitId) {
        throw new AppError(
          400,
          "ORDER_WRITEBACK_PARAM_INVALID",
          `SKU ${line.skuCode} 缺少 kingdeeMaterialId 或 unitId`
        );
      }

      return {
        is_free: false,
        material_id: materialId,
        unit_id: unitId,
        price: Number(line.unitPrice),
        qty: Number(line.qty),
        comment: line.productName
      };
    });

    const requestBody = {
      bill_date: new Date().toISOString().slice(0, 10),
      customer_id: customer.kingdeeCustomerId.trim(),
      bill_no: order.orderNo,
      operation_key: "submit",
      material_entity: materialEntity,
      remark: "来自小程序商城下单"
    };
    const requestEnvelope = {
      requestId: writebackRequestId,
      orderId: order.id,
      orderNo: order.orderNo,
      endpoint: {
        path: endpoint.path,
        method: endpoint.method
      },
      payload: requestBody,
      createdAt: new Date().toISOString()
    };

    let responsePayload: unknown = null;
    try {
      validateWritebackRequestBody(requestBody);

      if (env.KD_MOCK_MODE) {
        responsePayload = {
          errcode: 0,
          data: {
            id: `MOCK-KD-${order.orderNo}`,
            number: order.orderNo
          }
        };
      } else {
        responsePayload = await kingdeeClient.request({
          method: endpoint.method as "POST",
          path: endpoint.path,
          body: requestBody
        });
      }

      const bizError = extractBizErrorFromPayload(responsePayload);
      const traceId = pickTraceId(responsePayload);
      if (bizError) {
        const mapped = mapWritebackBizError(bizError);
        await coreRepo.updateSalesOrder({
          id: order.id,
          status: "WRITEBACK_FAILED",
          writebackError: mapped.message
        });
        await coreRepo.createOrderWritebackLog({
          salesOrderId: order.id,
          success: false,
          requestId: writebackRequestId,
          traceId,
          summary: mapped.summary,
          requestJson: JSON.stringify(requestEnvelope),
          responseJson: JSON.stringify(responsePayload),
          errorCode: mapped.code,
          errorMessage: mapped.message
        });
        return {
          success: false,
          statusCode: mapped.statusCode,
          code: mapped.code,
          message: mapped.message,
          requestId: writebackRequestId,
          traceId,
          summary: mapped.summary,
          remoteErrcode: bizError.code
        };
      }

      const writebackId = pickWritebackId(responsePayload);
      const writebackNo = pickWritebackNumber(responsePayload) ?? order.orderNo;

      await coreRepo.updateSalesOrder({
        id: order.id,
        status: "CONFIRMED",
        kingdeeOrderId: writebackId,
        kingdeeOrderNumber: writebackNo,
        writebackError: null
      });
      await coreRepo.createOrderWritebackLog({
        salesOrderId: order.id,
        success: true,
        requestId: writebackRequestId,
        traceId,
        summary: `writeback ok: ${writebackNo}`,
        requestJson: JSON.stringify(requestEnvelope),
        responseJson: JSON.stringify(responsePayload),
        errorCode: null,
        errorMessage: null
      });
      return {
        success: true,
        statusCode: 200,
        code: "ORDER_WRITEBACK_OK",
        message: "写回金蝶成功",
        requestId: writebackRequestId,
        traceId,
        summary: `writeback ok: ${writebackNo}`
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "写回金蝶失败";
      const appError = error instanceof AppError ? error : null;
      const traceId = pickTraceId(responsePayload);
      const statusCode = appError?.statusCode ?? 502;
      const code =
        appError?.code === "ORDER_WRITEBACK_PARAM_INVALID"
          ? "ORDER_WRITEBACK_PARAM_INVALID"
          : "ORDER_WRITEBACK_REMOTE_REJECTED";
      const summary =
        code === "ORDER_WRITEBACK_PARAM_INVALID"
          ? "writeback request validation failed"
          : "writeback request exception";

      await coreRepo.updateSalesOrder({
        id: order.id,
        status: "WRITEBACK_FAILED",
        writebackError: message
      });
      await coreRepo.createOrderWritebackLog({
        salesOrderId: order.id,
        success: false,
        requestId: writebackRequestId,
        traceId,
        summary,
        requestJson: JSON.stringify(requestEnvelope),
        responseJson: responsePayload ? JSON.stringify(responsePayload) : null,
        errorCode: code,
        errorMessage: message
      });
      coreLogger.warn(
        {
          requestId: writebackRequestId,
          traceId,
          orderId: order.id,
          orderNo: order.orderNo,
          endpoint: endpoint.path,
          code,
          message
        },
        "Order writeback failed"
      );
      return {
        success: false,
        statusCode,
        code,
        message,
        requestId: writebackRequestId,
        traceId,
        summary
      };
    }
  }

  private extractOrderNoListFromStatement(statementJson: string): string[] {
    const statement = safeParseJson(statementJson);
    if (!isRecord(statement) || !Array.isArray(statement.lines)) {
      return [];
    }

    const orderNoSet = new Set<string>();
    for (const line of statement.lines) {
      if (!isRecord(line)) {
        continue;
      }
      const raw = isRecord(line.raw) ? line.raw : safeParseJson(String(line.raw ?? ""));
      const orderNo = isRecord(raw) ? pickDocumentNumber(raw) : null;
      if (orderNo) {
        orderNoSet.add(orderNo);
      }
    }
    return [...orderNoSet];
  }

  private extractOrderLinksFromStatement(
    statementJson: string
  ): Array<{ orderNo: string; orderStatus: string | null }> {
    const statement = safeParseJson(statementJson);
    if (!isRecord(statement) || !Array.isArray(statement.lines)) {
      return [];
    }

    const links = new Map<string, string | null>();
    for (const line of statement.lines) {
      if (!isRecord(line)) {
        continue;
      }
      const raw = isRecord(line.raw) ? line.raw : safeParseJson(String(line.raw ?? ""));
      if (!isRecord(raw)) {
        continue;
      }
      const orderNo = pickDocumentNumber(raw);
      if (!orderNo) {
        continue;
      }
      const orderStatus = typeof raw.orderStatus === "string" ? raw.orderStatus : null;
      links.set(orderNo, orderStatus ?? null);
    }

    return [...links.entries()].map(([orderNo, orderStatus]) => ({
      orderNo,
      orderStatus
    }));
  }

  private pickOrderNoFromReconcileLine(line: { rawJson: string }): string | null {
    const raw = safeParseJson(line.rawJson);
    if (!isRecord(raw)) {
      return null;
    }
    if (typeof raw.orderNo === "string" && raw.orderNo.trim()) {
      return raw.orderNo.trim();
    }
    if (isRecord(raw.source)) {
      return pickDocumentNumber(raw.source);
    }
    return pickDocumentNumber(raw);
  }

  private pickOrderStatusFromReconcileLine(line: { rawJson: string }): string | null {
    const raw = safeParseJson(line.rawJson);
    if (!isRecord(raw)) {
      return null;
    }
    if (typeof raw.orderStatus === "string" && raw.orderStatus.trim()) {
      return raw.orderStatus.trim();
    }
    return null;
  }

  private async resolveOpenid(input: WechatLoginInput): Promise<string> {
    const useMock =
      env.WECHAT_LOGIN_MOCK_ENABLED || !env.WECHAT_APPID?.trim() || !env.WECHAT_APPSECRET?.trim();

    if (useMock) {
      return input.mockOpenid?.trim() || env.WECHAT_MOCK_OPENID;
    }

    if (!input.code?.trim()) {
      throw new AppError(
        400,
        "WECHAT_CODE_REQUIRED",
        "当前已关闭 mock 登录，请传入 code 调用 code2session"
      );
    }

    const response = await axios.get("https://api.weixin.qq.com/sns/jscode2session", {
      params: {
        appid: env.WECHAT_APPID,
        secret: env.WECHAT_APPSECRET,
        js_code: input.code,
        grant_type: "authorization_code"
      },
      timeout: 10_000,
      validateStatus: () => true
    });

    if (response.status !== 200 || !isRecord(response.data)) {
      throw new AppError(502, "WECHAT_API_ERROR", "调用微信 code2session 失败");
    }

    if (typeof response.data.openid === "string" && response.data.openid.trim()) {
      return response.data.openid;
    }

    coreLogger.error({ response: response.data }, "Wechat code2session response invalid");
    throw new AppError(502, "WECHAT_OPENID_MISSING", "微信未返回 openid");
  }

  private async ensureCustomerExists(customerId: string) {
    const customer = await coreRepo.findCustomerById(customerId);
    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "未找到 customer");
    }

    return customer;
  }

  private async ensureCustomerForKingdeeRecord(record: Record<string, unknown>) {
    const kingdeeCustomerId =
      pickStringField(record, ["customer_id", "customerId", "contact_customer_id", "cust_id"]) ?? null;
    const customerCode =
      pickStringField(record, ["customer_number", "customer_no", "customer_code", "cust_number"]) ?? null;
    const customerName =
      pickStringField(record, ["customer_name", "customerName", "name", "contact_customer_name"]) ??
      "未命名客户";
    const customerPhone = pickStringField(record, ["contact_phone", "mobile", "mobile_main", "phone"]);
    const normalizedName = customerName.trim() || "未命名客户";
    const normalizedPhone = customerPhone ?? null;
    const matchKingdeeId = kingdeeCustomerId || customerCode;

    if (matchKingdeeId) {
      const exists = await coreRepo.findCustomerByKingdeeId(matchKingdeeId);
      if (exists) {
        if (
          (normalizedName && exists.name !== normalizedName) ||
          normalizedPhone !== (exists.phone ?? null) ||
          (kingdeeCustomerId?.trim() && exists.kingdeeCustomerId !== kingdeeCustomerId.trim())
        ) {
          return coreRepo.updateCustomerProfile(exists.id, {
            name: normalizedName || exists.name,
            phone: normalizedPhone ?? exists.phone ?? null,
            ...(kingdeeCustomerId?.trim() ? { kingdeeCustomerId: kingdeeCustomerId.trim() } : {})
          });
        }
        return exists;
      }

      return coreRepo.createCustomer({
        name: normalizedName || `客户-${matchKingdeeId}`,
        phone: normalizedPhone,
        kingdeeCustomerId: matchKingdeeId
      });
    }

    if (normalizedName) {
      const existsByName = await coreRepo.findCustomerByName(normalizedName);
      if (existsByName) {
        if (normalizedPhone !== (existsByName.phone ?? null)) {
          return coreRepo.updateCustomerProfile(existsByName.id, {
            phone: normalizedPhone ?? existsByName.phone ?? null
          });
        }
        return existsByName;
      }
    }

    return coreRepo.createCustomer({
      name: normalizedName || `客户-${Date.now()}`,
      phone: normalizedPhone
    });
  }

  private matchStatementLineToCustomer(
    line: {
      customerId: string | null;
      customerName: string | null;
    },
    customer: {
      name: string;
      kingdeeCustomerId: string | null;
    }
  ): boolean {
    if (customer.kingdeeCustomerId?.trim()) {
      return line.customerId?.trim() === customer.kingdeeCustomerId.trim();
    }

    if (line.customerName?.trim()) {
      return line.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase();
    }

    return false;
  }

  private normalizeTokenTtlDays(ttlDays?: number): number {
    if (typeof ttlDays === "number" && Number.isFinite(ttlDays) && ttlDays > 0) {
      return Math.min(Math.floor(ttlDays), 36500);
    }

    return DEFAULT_CUSTOMER_TOKEN_TTL_DAYS;
  }

  private async findIssueTargetCustomer(input: IssueCustomerTokenInput) {
    if (input.customerId?.trim()) {
      return coreRepo.findCustomerById(input.customerId.trim());
    }

    if (input.kingdeeCustomerId?.trim()) {
      return coreRepo.findCustomerByKingdeeId(input.kingdeeCustomerId.trim());
    }

    return null;
  }

  private async generateUniqueCustomerToken(): Promise<string> {
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const candidate = randomBytes(24).toString("hex");
      const exists = await coreRepo.findCustomerByAccessToken(candidate);
      if (!exists) {
        return candidate;
      }
    }

    throw new AppError(500, "CUSTOMER_TOKEN_GENERATE_FAILED", "生成客户 token 失败，请重试");
  }

  private async resolveMiniCustomerByAccessToken(rawToken: string): Promise<MiniAuthCustomer> {
    const token = rawToken.trim();
    if (!token) {
      throw new AppError(401, "MINI_UNAUTHORIZED", "token 不能为空");
    }

    const customer = await coreRepo.findCustomerByAccessToken(token);
    if (!customer) {
      throw new AppError(401, "MINI_UNAUTHORIZED", "token 无效");
    }

    if (customer.tokenExpiresAt && customer.tokenExpiresAt.getTime() <= Date.now()) {
      throw new AppError(401, "MINI_TOKEN_EXPIRED", "token 已过期");
    }

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      kingdeeCustomerId: customer.kingdeeCustomerId,
      accessToken: customer.accessToken ?? token,
      tokenExpiresAt: customer.tokenExpiresAt
    };
  }

  private serializeCustomer(customer: {
    id: string;
    name: string;
    phone: string | null;
    kingdeeCustomerId: string | null;
    tokenExpiresAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      kingdeeCustomerId: customer.kingdeeCustomerId,
      tokenExpiresAt: customer.tokenExpiresAt ? customer.tokenExpiresAt.toISOString() : null,
      createdAt: customer.createdAt ? customer.createdAt.toISOString() : undefined,
      updatedAt: customer.updatedAt ? customer.updatedAt.toISOString() : undefined
    };
  }

  private async persistDocumentAndDelivery(input: {
    docType: string;
    record: Record<string, unknown>;
    details: Record<string, unknown>;
  }) {
    const payloadJson = JSON.stringify(input.details);
    const hash = createHash("sha256").update(payloadJson, "utf8").digest("hex");
    const kingdeeId = pickDocumentId(input.details) ?? pickDocumentId(input.record);
    const number = pickDocumentNumber(input.details) ?? pickDocumentNumber(input.record);

    const existed = await coreRepo.findRawDocumentByHash(input.docType, hash, kingdeeId);
    if (!existed) {
      await coreRepo.insertRawDocument({
        docType: input.docType,
        kingdeeId,
        number,
        payloadJson,
        hash
      });
    }

    const sourceDocNo = pickSourceDocNo(input.record, input.details);
    const fallbackOrderNo = pickStringField(input.details, ["order_no", "sale_order_no", "src_bill_no"]);
    const linkedOrder = sourceDocNo
      ? await coreRepo.findSalesOrderByKingdeeOrderNumber(sourceDocNo)
      : number
        ? await coreRepo.findSalesOrderByKingdeeOrderNumber(number)
        : fallbackOrderNo
          ? await coreRepo.findSalesOrderByKingdeeOrderNumber(fallbackOrderNo)
          : null;

    const customer = await this.ensureCustomerForKingdeeRecord(input.details);
    await coreRepo.upsertDeliveryFromSync({
      customerId: customer.id,
      salesOrderId: linkedOrder?.id ?? null,
      kingdeeBillId: kingdeeId,
      kingdeeBillNumber: number,
      sourceDocNo,
      detailsJson: payloadJson,
      syncedAt: new Date(),
      status: "PENDING"
    });

    return {
      inserted: existed ? 0 : 1,
      skipped: existed ? 1 : 0
    };
  }

  private async loadSyncCursor(scope: string): Promise<SyncCursor | null> {
    const checkpoint = await coreRepo.getSyncCheckpoint(scope);
    if (!checkpoint) {
      return null;
    }

    const parsed = safeParseJson(checkpoint.cursorJson);
    if (!isRecord(parsed)) {
      return null;
    }

    const modifyStartTime = Number(parsed.modifyStartTime);
    const modifyEndTime = Number(parsed.modifyEndTime);
    const lastPage = Number(parsed.lastPage);
    const updatedAt = String(parsed.updatedAt ?? checkpoint.updatedAt.toISOString());

    if (!Number.isFinite(modifyStartTime) || !Number.isFinite(modifyEndTime)) {
      return null;
    }

    return {
      modifyStartTime,
      modifyEndTime,
      lastPage: Number.isFinite(lastPage) ? lastPage : 1,
      updatedAt
    };
  }

  private async fetchDetailPreferId(input: {
    endpointPath: string;
    record: Record<string, unknown>;
    warnings: string[];
    bizLabel: string;
  }): Promise<unknown> {
    const id = pickDocumentId(input.record);
    const number = pickDocumentNumber(input.record);

    if (id) {
      try {
        return await kingdeeClient.request({
          method: "GET",
          path: input.endpointPath,
          query: { id }
        });
      } catch (error) {
        if (!number) {
          throw error;
        }

        input.warnings.push(`${input.bizLabel}: id=${id} 详情失败，已回退 number=${number}`);
      }
    }

    if (number) {
      return kingdeeClient.request({
        method: "GET",
        path: input.endpointPath,
        query: { number }
      });
    }

    return input.record;
  }
}

function parseDayStart(value?: string): Date {
  if (!value) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, "INVALID_FROM_DATE", "from 日期格式错误，需 YYYY-MM-DD");
  }
  return date;
}

function parseDayEnd(value?: string): Date {
  if (!value) {
    return new Date();
  }

  const date = new Date(`${value}T23:59:59.999Z`);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, "INVALID_TO_DATE", "to 日期格式错误，需 YYYY-MM-DD");
  }
  return date;
}

function safeParseJson(value: string | null | undefined): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.rows)) {
    return payload.rows;
  }

  if (!isRecord(payload.data)) {
    return [];
  }

  if (Array.isArray(payload.data.rows)) {
    return payload.data.rows;
  }

  if (Array.isArray(payload.data.list)) {
    return payload.data.list;
  }

  if (Array.isArray(payload.data.items)) {
    return payload.data.items;
  }

  return [];
}

function extractFirstDetailRecord(payload: unknown): Record<string, unknown> | null {
  if (isRecord(payload)) {
    if (isRecord(payload.data)) {
      if (Array.isArray(payload.data.rows) && payload.data.rows.length > 0 && isRecord(payload.data.rows[0])) {
        return payload.data.rows[0];
      }

      if (Array.isArray(payload.data.list) && payload.data.list.length > 0 && isRecord(payload.data.list[0])) {
        return payload.data.list[0];
      }

      if (Array.isArray(payload.data.items) && payload.data.items.length > 0 && isRecord(payload.data.items[0])) {
        return payload.data.items[0];
      }

      return payload.data;
    }

    return payload;
  }

  return null;
}

function extractTotalPages(payload: unknown, pageSize: number, currentRows: number): number {
  if (isRecord(payload) && isRecord(payload.data)) {
    const data = payload.data;
    const totalPage = Number(data.total_page);
    if (Number.isFinite(totalPage) && totalPage > 0) {
      return Math.floor(totalPage);
    }

    const count = Number(data.count);
    if (Number.isFinite(count) && count > 0) {
      return Math.max(1, Math.ceil(count / pageSize));
    }
  }

  return currentRows < pageSize ? 1 : 999;
}

function extractBizErrorFromPayload(payload: unknown): { code: number; description: string } | null {
  if (!isRecord(payload)) {
    return null;
  }
  const errcode = Number(payload.errcode);
  if (!Number.isFinite(errcode) || errcode === 0) {
    return null;
  }
  const description =
    (typeof payload.description === "string" && payload.description) ||
    (typeof payload.message === "string" && payload.message) ||
    "unknown error";
  return {
    code: errcode,
    description
  };
}

function mapWritebackBizError(input: {
  code: number;
  description: string;
}): {
  statusCode: number;
  code: string;
  message: string;
  summary: string;
} {
  const text = input.description.toLowerCase();

  if (text.includes("参数") || text.includes("parameter") || text.includes("必填")) {
    return {
      statusCode: 400,
      code: "ORDER_WRITEBACK_PARAM_INVALID",
      message: `金蝶参数校验失败(errcode=${input.code}): ${input.description}`,
      summary: "remote parameter validation failed"
    };
  }

  if (
    text.includes("signature") ||
    text.includes("验签") ||
    text.includes("sign") ||
    text.includes("timestamp") ||
    text.includes("时间戳")
  ) {
    return {
      statusCode: 502,
      code: "ORDER_WRITEBACK_REMOTE_REJECTED",
      message: `金蝶鉴权或签名校验失败(errcode=${input.code}): ${input.description}`,
      summary: "remote signature/timestamp rejected"
    };
  }

  if (
    text.includes("未授权") ||
    text.includes("无权限") ||
    text.includes("permission") ||
    text.includes("auth")
  ) {
    return {
      statusCode: 502,
      code: "ORDER_WRITEBACK_REMOTE_REJECTED",
      message: `金蝶权限校验失败(errcode=${input.code}): ${input.description}`,
      summary: "remote permission rejected"
    };
  }

  if (text.includes("router") || text.includes("domain") || text.includes("网关")) {
    return {
      statusCode: 502,
      code: "ORDER_WRITEBACK_REMOTE_REJECTED",
      message: `金蝶网关路由异常(errcode=${input.code}): ${input.description}`,
      summary: "remote router rejected"
    };
  }

  return {
    statusCode: 502,
    code: "ORDER_WRITEBACK_REMOTE_REJECTED",
    message: `金蝶写回失败(errcode=${input.code}): ${input.description}`,
    summary: "remote business rejected"
  };
}

function pickTraceId(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }
  const direct = pickStringField(payload, ["trace_id", "traceId", "request_id", "requestId", "traceid"]);
  if (direct) {
    return direct;
  }
  if (isRecord(payload.data)) {
    return (
      pickStringField(payload.data, ["trace_id", "traceId", "request_id", "requestId", "traceid"]) ?? null
    );
  }
  return null;
}

function validateWritebackRequestBody(body: {
  customer_id: string;
  material_entity: Array<{
    unit_id: string;
    material_id: string;
    qty: number;
    price: number;
  }>;
}) {
  if (!body.customer_id?.trim()) {
    throw new AppError(400, "ORDER_WRITEBACK_PARAM_INVALID", "写回请求缺少 customer_id");
  }
  if (!Array.isArray(body.material_entity) || body.material_entity.length === 0) {
    throw new AppError(400, "ORDER_WRITEBACK_PARAM_INVALID", "写回请求缺少 material_entity");
  }

  for (let index = 0; index < body.material_entity.length; index += 1) {
    const row = body.material_entity[index];
    const rowNo = index + 1;
    if (!row.material_id?.trim()) {
      throw new AppError(
        400,
        "ORDER_WRITEBACK_PARAM_INVALID",
        `写回请求第 ${rowNo} 行缺少 material_id`
      );
    }
    if (!row.unit_id?.trim()) {
      throw new AppError(400, "ORDER_WRITEBACK_PARAM_INVALID", `写回请求第 ${rowNo} 行缺少 unit_id`);
    }
    if (!Number.isFinite(row.price) || Number(row.price) < 0) {
      throw new AppError(400, "ORDER_WRITEBACK_PARAM_INVALID", `写回请求第 ${rowNo} 行 price 非法`);
    }
    if (!Number.isFinite(row.qty) || Number(row.qty) <= 0) {
      throw new AppError(400, "ORDER_WRITEBACK_PARAM_INVALID", `写回请求第 ${rowNo} 行 qty 非法`);
    }
  }
}

function pickWritebackId(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }
  if (isRecord(payload.data)) {
    return pickStringField(payload.data, ["id", "bill_id", "fid"]);
  }
  return pickStringField(payload, ["id", "bill_id", "fid"]);
}

function pickWritebackNumber(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }
  if (isRecord(payload.data)) {
    return pickStringField(payload.data, ["number", "bill_no", "code"]);
  }
  return pickStringField(payload, ["number", "bill_no", "code"]);
}

function buildDetailQueryByRecord(record: Record<string, unknown>): Record<string, string> | null {
  const id = pickDocumentId(record);
  const number = pickDocumentNumber(record);
  if (!id && !number) {
    return null;
  }

  return {
    ...(id ? { id } : {}),
    ...(number ? { number } : {})
  };
}

function pickSourceDocNo(
  record: Record<string, unknown>,
  detail: Record<string, unknown>
): string | null {
  const fields = [
    "src_bill_no",
    "source_bill_no",
    "src_order_no",
    "source_order_no",
    "source_no",
    "sale_order_no",
    "order_no"
  ];

  return pickStringField(record, fields) ?? pickStringField(detail, fields);
}

function pickDocumentId(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }
  return pickStringField(value, ["id", "bill_id", "doc_id", "number_id"]);
}

function pickDocumentNumber(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }
  return pickStringField(value, ["number", "bill_no", "doc_no", "code"]);
}

function pickDocumentCustomerId(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  return pickStringField(value, ["customer_id", "customerId", "contact_customer_id", "cust_id"]);
}

function pickDocumentCustomerName(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  return pickStringField(value, ["customer_name", "customerName", "contact_customer_name", "name"]);
}

function pickStringField(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function extractAmount(payload: unknown): number {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }

  if (typeof payload === "string") {
    const parsed = Number(payload);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (Array.isArray(payload)) {
    return payload.reduce((sum, item) => sum + extractAmount(item), 0);
  }

  if (!isRecord(payload)) {
    return 0;
  }

  const amountKeys = ["amount", "total_amount", "totalAmount", "receivable_amount", "should_amount"];
  for (const key of amountKeys) {
    const value = extractAmount(payload[key]);
    if (value !== 0) {
      return value;
    }
  }

  return 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseBearerToken(header: string | undefined): string | null {
  if (!header) {
    return null;
  }

  const parts = header.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1] ?? null;
}

function createMockSalesRows(): Record<string, unknown>[] {
  return [
    {
      id: "MOCK-SOB-001",
      number: "SAL-OUT-001",
      customer_id: "MOCK-CUST-001",
      customer_name: "模拟客户A",
      amount: 1200,
      entry: [
        {
          material_number: "SKU-001",
          qty: 2,
          amount: 1200
        }
      ]
    }
  ];
}

function createMockReceiptRows(): Record<string, unknown>[] {
  return [
    {
      id: "MOCK-RCP-001",
      number: "AR-001",
      customer_id: "MOCK-CUST-001",
      customer_name: "模拟客户A",
      amount: 1200,
      bill_date: new Date().toISOString().slice(0, 10)
    }
  ];
}

export const coreService = new CoreService();
