import { createHash, randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import axios from "axios";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { sendFeishuTextWebhook } from "../notifications/feishu-webhook.sender";
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
  registration?: {
    companyName?: string;
    contactName?: string;
    contactPhone?: string;
    remark?: string;
  };
}

interface MiniLoginInput {
  token: string;
}

interface MiniOrderLineInput {
  skuId: string;
  qty: number;
  expectedUnitPrice?: number;
}

interface MiniCreateOrderInput {
  remark?: string;
  items?: MiniOrderLineInput[];
  acceptPriceChange?: boolean;
  delivery?: {
    mode: "DELIVERY" | "PICKUP";
    addressId?: string;
    expectedDate?: string;
    timeSlot?: "7-10" | "10-12" | "13-15" | "15-18";
    unloadingRequirement?: string;
    note?: string;
  };
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
  status: string;
  companyName: string | null;
  contactName: string | null;
  contactPhone: string | null;
  wechatOpenid: string | null;
  kingdeeCustomerId: string | null;
  accessToken: string;
  tokenExpiresAt: Date | null;
}

interface MiniHomeBanner {
  id: string;
  enabled: boolean;
  tag: string;
  title: string;
  subTitle: string;
  cta: string;
  theme: string;
  action: string;
  imageUrl: string | null;
}

interface MiniBrandCenterItem {
  id: string;
  enabled: boolean;
  name: string;
  logoUrl: string | null;
}

type HomeLayoutModuleKey =
  | "banners"
  | "categories"
  | "brandCenter"
  | "notice"
  | "featured"
  | "hot";

interface MiniHomeNotice {
  title: string;
  content: string;
}

interface MiniHomeLayoutSection {
  key: HomeLayoutModuleKey;
  enabled: boolean;
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

type CoreSyncJobName =
  | "sync:deliveries"
  | "sync:receipts"
  | "sync:inventory-stock-snapshot"
  | "sync:all";
type OrderStatus = "CREATED" | "CONFIRMED" | "CANCELED" | "WRITEBACK_FAILED";

interface AdminOrderListInput {
  page?: number;
  pageSize?: number;
  status?: string;
  customerId?: string;
  orderNo?: string;
}

interface AdminKingdeeMaterialListInput {
  page?: number;
  pageSize?: number;
  search?: string;
}

interface AdminKingdeeMaterialImportItemInput {
  materialId?: string;
  materialNumber?: string;
  materialName?: string;
  materialModel?: string;
  unitId?: string;
  coverImageUrl?: string;
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

interface PriceResolutionResult {
  found: boolean;
  unitPrice: number | null;
  currency: string;
  source: "CACHE" | "KINGDEE";
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const DEFAULT_CUSTOMER_TOKEN_TTL_DAYS = 3650;
const DEFAULT_ORDER_PAGE_SIZE = 20;
const RECON_BIZ_TYPE_LIST = ["销售出库单详情", "收款单详情"];
const SETTINGS_KEY_ORDER_WEBHOOK = "ORDER_WEBHOOK";
const SETTINGS_KEY_LOGISTICS_WEBHOOK = "LOGISTICS_WEBHOOK";
const SETTINGS_KEY_FINANCE_WEBHOOK = "FINANCE_WEBHOOK";
const SETTINGS_KEY_QUOTE_WEBHOOK = "QUOTE_WEBHOOK";
const SETTINGS_KEY_REGISTRATION_WEBHOOK = "REGISTRATION_WEBHOOK";
const SETTINGS_KEY_PICKUP_ADDRESS = "PICKUP_ADDRESS";
const SETTINGS_KEY_EXCLUDED_WAREHOUSE_CODES = "EXCLUDED_WAREHOUSE_CODES";
const SETTINGS_KEY_PRICING_CONTEXT = "PRICING_CONTEXT";
const SETTINGS_KEY_HOME_BANNERS = "HOME_BANNERS";
const SETTINGS_KEY_BRAND_CENTER_ITEMS = "BRAND_CENTER_ITEMS";
const SETTINGS_KEY_HOME_NOTICE = "HOME_NOTICE";
const SETTINGS_KEY_HOME_LAYOUT = "HOME_LAYOUT";
const HOME_BANNER_MAX_COUNT = 8;
const HOME_BANNER_THEME_SET = new Set(["common", "quote", "statement", "primary"]);
const HOME_BANNER_ACTION_SET = new Set([
  "commonProducts",
  "quote",
  "statements",
  "invoiceRequest",
  "products"
]);
const HOME_BANNER_MAX_TITLE_LENGTH = 22;
const HOME_BANNER_MAX_SUB_TITLE_LENGTH = 36;
const HOME_BANNER_MAX_CTA_LENGTH = 10;
const HOME_BANNER_MAX_TAG_LENGTH = 6;
const BRAND_CENTER_MAX_COUNT = 80;
const BRAND_CENTER_MAX_NAME_LENGTH = 16;
const HOME_NOTICE_MAX_TITLE_LENGTH = 12;
const HOME_NOTICE_MAX_CONTENT_LENGTH = 120;
const HOME_LAYOUT_MODULE_KEYS: HomeLayoutModuleKey[] = [
  "banners",
  "categories",
  "brandCenter",
  "notice",
  "featured",
  "hot"
];
const HOME_LAYOUT_MODULE_KEY_SET = new Set<HomeLayoutModuleKey>(HOME_LAYOUT_MODULE_KEYS);
const STATUS_PENDING = "PENDING";
const STATUS_ACTIVE = "ACTIVE";
const STATUS_REJECTED = "REJECTED";
const ADMIN_IMAGE_UPLOAD_MAX_BYTES = 3 * 1024 * 1024;
const ADMIN_IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif"
};

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
        kingdeeCustomerId: input.kingdeeCustomerId?.trim() || null,
        status: STATUS_ACTIVE
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
      accessTokenMasked: customer.accessToken ? maskSecret(customer.accessToken) : null,
      latestRegistrationApplication: customer.registrationApplications?.[0]
        ? this.serializeRegistrationApplication(customer.registrationApplications[0])
        : null
    }));
  }

  async listRegistrationApplicationsForAdmin(status?: string) {
    const applications = await coreRepo.listCustomerRegistrationApplications(status?.trim() || undefined);
    return applications.map((item) => this.serializeRegistrationApplication(item, true));
  }

  async reviewRegistrationApplicationForAdmin(input: {
    id: string;
    action: "APPROVE" | "REJECT";
    remark?: string;
  }) {
    const app = await coreRepo.findCustomerRegistrationApplicationById(input.id);
    if (!app) {
      throw new AppError(404, "REGISTRATION_APPLICATION_NOT_FOUND", "注册申请不存在");
    }

    const nextStatus = input.action === "APPROVE" ? STATUS_ACTIVE : STATUS_REJECTED;
    await coreRepo.reviewCustomerRegistrationApplication({
      id: app.id,
      status: input.action === "APPROVE" ? "APPROVED" : "REJECTED",
      reviewedAt: new Date(),
      reviewRemark: input.remark?.trim() || null
    });
    const updatedCustomer = await coreRepo.updateCustomerProfile(app.customerId, {
      status: nextStatus
    });

    if (input.action === "APPROVE") {
      const payload = safeParseJson(app.payloadJson);
      if (isRecord(payload)) {
        await coreRepo.updateCustomerProfile(app.customerId, {
          companyName:
            typeof payload.companyName === "string" && payload.companyName.trim()
              ? payload.companyName.trim()
              : updatedCustomer.companyName,
          contactName:
            typeof payload.contactName === "string" && payload.contactName.trim()
              ? payload.contactName.trim()
              : updatedCustomer.contactName,
          contactPhone:
            typeof payload.contactPhone === "string" && payload.contactPhone.trim()
              ? payload.contactPhone.trim()
              : updatedCustomer.contactPhone
        });
      }
    }

    await this.sendWebhookBySettingKey(SETTINGS_KEY_REGISTRATION_WEBHOOK, {
      title: input.action === "APPROVE" ? "注册申请已通过" : "注册申请已驳回",
      lines: [
        `客户: ${updatedCustomer.name}`,
        `客户ID: ${updatedCustomer.id}`,
        `处理结果: ${input.action === "APPROVE" ? "APPROVED" : "REJECTED"}`,
        `备注: ${input.remark?.trim() || "-"}`
      ]
    });

    return {
      customer: this.serializeCustomer(updatedCustomer)
    };
  }

  async bindKingdeeCustomerForAdmin(input: { customerId: string; kingdeeCustomerId: string }) {
    const customer = await coreRepo.findCustomerById(input.customerId);
    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "客户不存在");
    }
    const updated = await coreRepo.updateCustomerProfile(customer.id, {
      kingdeeCustomerId: input.kingdeeCustomerId.trim(),
      status: STATUS_ACTIVE
    });
    return this.serializeCustomer(updated);
  }

  async unbindKingdeeCustomerForAdmin(customerId: string) {
    const customer = await coreRepo.findCustomerById(customerId);
    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "客户不存在");
    }
    const updated = await coreRepo.updateCustomerProfile(customer.id, {
      kingdeeCustomerId: null
    });
    return this.serializeCustomer(updated);
  }

  async updateCustomerStatusForAdmin(input: {
    customerId: string;
    status: "ACTIVE" | "REJECTED";
    remark?: string;
  }) {
    const customer = await coreRepo.findCustomerById(input.customerId);
    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "客户不存在");
    }

    const updated = await coreRepo.updateCustomerProfile(customer.id, {
      status: input.status
    });

    return {
      customer: this.serializeCustomer(updated),
      remark: input.remark?.trim() || null
    };
  }

  async removeCustomerForAdmin(customerId: string, remark?: string) {
    const customer = await coreRepo.findCustomerById(customerId);
    if (!customer) {
      throw new AppError(404, "CUSTOMER_NOT_FOUND", "客户不存在");
    }
    const updated = await coreRepo.updateCustomerProfile(customer.id, {
      status: STATUS_REJECTED,
      accessToken: null,
      tokenExpiresAt: null,
      wechatOpenid: null,
      kingdeeCustomerId: null
    });

    await this.sendWebhookBySettingKey(SETTINGS_KEY_REGISTRATION_WEBHOOK, {
      title: "客户已移除",
      lines: [`客户: ${updated.name}`, `客户ID: ${updated.id}`, `备注: ${remark?.trim() || "-"}`]
    });

    return this.serializeCustomer(updated);
  }

  async getAdminSettings() {
    const keys = [
      SETTINGS_KEY_ORDER_WEBHOOK,
      SETTINGS_KEY_LOGISTICS_WEBHOOK,
      SETTINGS_KEY_FINANCE_WEBHOOK,
      SETTINGS_KEY_QUOTE_WEBHOOK,
      SETTINGS_KEY_REGISTRATION_WEBHOOK,
      SETTINGS_KEY_PICKUP_ADDRESS,
      SETTINGS_KEY_EXCLUDED_WAREHOUSE_CODES,
      SETTINGS_KEY_PRICING_CONTEXT,
      SETTINGS_KEY_HOME_BANNERS,
      SETTINGS_KEY_BRAND_CENTER_ITEMS,
      SETTINGS_KEY_HOME_NOTICE,
      SETTINGS_KEY_HOME_LAYOUT
    ];
    const rows = await coreRepo.listSettings(keys);
    const data: Record<string, unknown> = {};
    for (const row of rows) {
      data[row.key] = safeParseJson(row.valueJson);
    }
    return data;
  }

  async updateAdminSettings(input: Record<string, unknown>) {
    const entries = Object.entries(input).filter(([key]) => key.trim());
    for (const [key, value] of entries) {
      if (key === SETTINGS_KEY_HOME_BANNERS) {
        const normalizedBanners = this.normalizeAdminHomeBannersForSave(value);
        await coreRepo.upsertSetting(key, JSON.stringify(normalizedBanners));
        continue;
      }
      if (key === SETTINGS_KEY_BRAND_CENTER_ITEMS) {
        const normalizedItems = this.normalizeAdminBrandCenterItemsForSave(value);
        await coreRepo.upsertSetting(key, JSON.stringify(normalizedItems));
        continue;
      }
      if (key === SETTINGS_KEY_HOME_NOTICE) {
        const normalizedNotice = this.normalizeAdminHomeNoticeForSave(value);
        await coreRepo.upsertSetting(key, JSON.stringify(normalizedNotice));
        continue;
      }
      if (key === SETTINGS_KEY_HOME_LAYOUT) {
        const normalizedLayout = this.normalizeAdminHomeLayoutForSave(value);
        await coreRepo.upsertSetting(key, JSON.stringify(normalizedLayout));
        continue;
      }
      await coreRepo.upsertSetting(key, JSON.stringify(value ?? null));
    }
    return this.getAdminSettings();
  }

  async testAdminWebhook(input: {
    key?: string;
    webhookUrl?: string;
    title?: string;
    lines?: string[];
  }) {
    const key = input.key?.trim() || null;
    const webhookUrl = input.webhookUrl?.trim() || null;
    if (!key && !webhookUrl) {
      throw new AppError(400, "WEBHOOK_TEST_PARAM_REQUIRED", "请提供 key 或 webhookUrl");
    }

    let targetUrl = webhookUrl;
    if (!targetUrl && key) {
      const row = await coreRepo.getSetting(key);
      const parsed = row ? safeParseJson(row.valueJson) : null;
      targetUrl = typeof parsed === "string" ? parsed.trim() : "";
    }

    if (!targetUrl) {
      throw new AppError(400, "WEBHOOK_URL_EMPTY", "webhook 地址为空，请先保存配置");
    }

    const title = input.title?.trim() || "运营后台测试消息";
    const lines = (input.lines || []).map((line) => line.trim()).filter(Boolean);
    const result = await sendFeishuTextWebhook(targetUrl, {
      title,
      lines: lines.length > 0 ? lines : [`时间: ${new Date().toISOString()}`]
    });

    if (!result.ok) {
      throw new AppError(502, "WEBHOOK_TEST_FAILED", result.reason || "webhook 发送失败");
    }

    return {
      ok: true,
      testedAt: new Date().toISOString(),
      key,
      webhookUrlMasked: maskSecret(targetUrl)
    };
  }

  async adminUploadImage(input: {
    dataUrl: string;
    filename?: string;
    folder?: string;
  }) {
    const parsed = this.parseAdminImageDataUrl(input.dataUrl);
    if (parsed.buffer.byteLength > ADMIN_IMAGE_UPLOAD_MAX_BYTES) {
      throw new AppError(
        400,
        "ADMIN_IMAGE_TOO_LARGE",
        `图片大小不能超过 ${Math.floor(ADMIN_IMAGE_UPLOAD_MAX_BYTES / 1024 / 1024)}MB`
      );
    }

    const folderName = this.normalizeAdminUploadFolder(input.folder);
    const daySegment = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = this.buildAdminUploadFileName(input.filename, parsed.extension);
    const absoluteBaseDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    const absoluteDir = path.join(absoluteBaseDir, "admin", folderName, daySegment);
    const absolutePath = path.join(absoluteDir, fileName);
    await fs.mkdir(absoluteDir, { recursive: true });
    await fs.writeFile(absolutePath, parsed.buffer);

    const relativePath = path.posix.join(
      "uploads",
      "admin",
      folderName,
      daySegment,
      fileName
    );
    const publicUrl = `${env.UPLOAD_PUBLIC_BASE_URL.replace(/\/$/, "")}/${relativePath}`;
    return {
      url: publicUrl,
      relativePath: `/${relativePath}`,
      fileName,
      contentType: parsed.contentType,
      size: parsed.buffer.byteLength
    };
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

  async adminListKingdeeMaterials(input: AdminKingdeeMaterialListInput) {
    const page = this.normalizePage(input.page);
    const pageSize = this.normalizePageSize(input.pageSize);
    const search = String(input.search || "").trim();

    const endpoint = this.resolveKingdeeMaterialListEndpoint();
    const query = this.buildListQuery(endpoint, {
      page: String(page),
      page_size: String(pageSize),
      enable: "-1",
      show_units: "true",
      ...(search ? { search } : {})
    });

    const payload = await kingdeeClient.request({
      method: "GET",
      path: endpoint.path,
      query
    });

    const rows = extractRows(payload).filter((item): item is Record<string, unknown> => isRecord(item));
    const items = rows
      .map((row) => this.serializeKingdeeMaterialRow(row))
      .filter((item) => item.materialId || item.materialNumber || item.materialName);

    return {
      page,
      pageSize,
      total: extractTotalCount(payload, page, pageSize, items.length),
      items,
      endpoint: this.endpointMeta(endpoint),
      query
    };
  }

  async adminOneClickListKingdeeProducts(input: { items: AdminKingdeeMaterialImportItemInput[] }) {
    const rows = Array.isArray(input.items) ? input.items : [];
    if (rows.length === 0) {
      throw new AppError(400, "KINGDEE_MATERIALS_REQUIRED", "请至少选择一个金蝶商品");
    }

    const result: {
      total: number;
      successCount: number;
      failedCount: number;
      createdProducts: number;
      updatedProducts: number;
      items: Array<{
        materialId: string | null;
        materialNumber: string | null;
        materialName: string;
        productId: string;
        productCode: string;
        skuId: string;
        skuCode: string;
      }>;
      failed: Array<{
        materialId: string | null;
        materialNumber: string | null;
        reason: string;
      }>;
    } = {
      total: rows.length,
      successCount: 0,
      failedCount: 0,
      createdProducts: 0,
      updatedProducts: 0,
      items: [],
      failed: []
    };

    for (const row of rows) {
      const materialId = typeof row.materialId === "string" ? row.materialId.trim() : "";
      const materialNumber = typeof row.materialNumber === "string" ? row.materialNumber.trim() : "";
      const materialName = typeof row.materialName === "string" ? row.materialName.trim() : "";
      const materialModel = typeof row.materialModel === "string" ? row.materialModel.trim() : "";
      const unitId = typeof row.unitId === "string" ? row.unitId.trim() : "";
      const coverImageUrl = typeof row.coverImageUrl === "string" ? row.coverImageUrl.trim() : "";

      if (!materialId && !materialNumber) {
        result.failed.push({
          materialId: null,
          materialNumber: materialNumber || null,
          reason: "缺少金蝶物料ID与编码"
        });
        continue;
      }

      const code = materialNumber || `KD-${materialId}`;
      const name = materialName || materialNumber || materialId;
      if (!name.trim()) {
        result.failed.push({
          materialId: materialId || null,
          materialNumber: materialNumber || null,
          reason: "缺少商品名称"
        });
        continue;
      }

      try {
        const existedByMaterial = materialId
          ? await coreRepo.findProductByKingdeeMaterialId(materialId)
          : null;
        const existedByCode =
          !existedByMaterial && code ? await coreRepo.findProductByCode(code) : null;
        const existedProduct = existedByMaterial ?? existedByCode;

        const product = await coreRepo.upsertProduct({
          id: existedProduct?.id,
          code: existedProduct?.code || code,
          name,
          description: materialModel ? `规格型号: ${materialModel}` : existedProduct?.description ?? null,
          coverImageUrl: coverImageUrl || existedProduct?.coverImageUrl || null,
          status: "ACTIVE",
          defaultUnitId: unitId || existedProduct?.defaultUnitId || null,
          kingdeeMaterialId: materialId || existedProduct?.kingdeeMaterialId || null
        });
        if (existedProduct) {
          result.updatedProducts += 1;
        } else {
          result.createdProducts += 1;
        }

        const existedSku = materialId ? await coreRepo.findSkuByKingdeeMaterialId(materialId) : null;
        const skuCode = existedSku?.skuCode || (materialId ? `KD-${materialId}` : `KD-${code}`);
        const specs: Record<string, unknown> = materialModel ? { 型号: materialModel } : {};
        const sku = await coreRepo.upsertProductSku({
          id: existedSku?.id,
          productId: product.id,
          skuCode,
          skuName: materialModel ? `${name}（${materialModel}）` : name,
          specsJson: Object.keys(specs).length > 0 ? JSON.stringify(specs) : null,
          price: existedSku ? Number(existedSku.price) : 0,
          stock: existedSku ? Number(existedSku.stock) : 0,
          status: "ACTIVE",
          unitId: unitId || existedSku?.unitId || product.defaultUnitId || null,
          kingdeeMaterialId: materialId || existedSku?.kingdeeMaterialId || null
        });

        result.items.push({
          materialId: materialId || null,
          materialNumber: materialNumber || null,
          materialName: name,
          productId: product.id,
          productCode: product.code,
          skuId: sku.id,
          skuCode: sku.skuCode
        });
      } catch (error) {
        result.failed.push({
          materialId: materialId || null,
          materialNumber: materialNumber || null,
          reason: error instanceof Error ? error.message : "上架失败"
        });
      }
    }

    result.successCount = result.items.length;
    result.failedCount = result.failed.length;
    if (result.successCount === 0) {
      throw new AppError(
        400,
        "KINGDEE_PRODUCTS_IMPORT_FAILED",
        result.failed[0]?.reason || "一键上架失败"
      );
    }

    return result;
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
    this.assertCustomerCapability(customer, "VIEW_PRODUCTS");
    const page = this.normalizePage(input.page);
    const pageSize = this.normalizePageSize(input.pageSize);
    const products = await coreRepo.listProducts("ACTIVE");
    const total = products.length;
    const sliced = products.slice((page - 1) * pageSize, page * pageSize);

    const items = await Promise.all(
      sliced.map(async (item) => this.serializeProductForMiniCustomer(item, customer, false))
    );
    return {
      total,
      page,
      pageSize,
      items
    };
  }

  async getMiniProductDetail(customer: MiniAuthCustomer, productId: string) {
    this.assertCustomerCapability(customer, "VIEW_PRODUCTS");
    const product = await coreRepo.findProductById(productId);
    if (!product || product.status !== "ACTIVE") {
      throw new AppError(404, "PRODUCT_NOT_FOUND", "商品不存在");
    }
    return this.serializeProductForMiniCustomer(product, customer, true);
  }

  async getMiniCart(customer: MiniAuthCustomer) {
    this.assertCustomerCapability(customer, "MANAGE_CART");
    await coreRepo.ensureCustomerCart(customer.id);
    const cart = await coreRepo.getCartByCustomer(customer.id);
    return this.serializeCartForMiniCustomer(cart, customer);
  }

  async addMiniCartItem(
    customer: MiniAuthCustomer,
    input: {
      skuId: string;
      qty: number;
    }
  ) {
    this.assertCustomerCapability(customer, "MANAGE_CART");
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
    const existing = await coreRepo.findCartItemByCustomerAndSku(customer.id, sku.id);
    const nextQty = Number(existing?.qty ?? 0) + input.qty;
    if (sku.stock < nextQty) {
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
    this.assertCustomerCapability(customer, "MANAGE_CART");
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
    this.assertCustomerCapability(customer, "MANAGE_CART");
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
    this.assertCustomerCapability(customer, "CREATE_ORDER");
    const key = idempotencyKey?.trim() || null;
    if (key) {
      const existing = await coreRepo.findSalesOrderByIdempotencyKey(customer.id, key);
      if (existing) {
        const detail = await coreRepo.findSalesOrderByIdAndCustomer(existing.id, customer.id);
        return this.serializeOrderDetail(detail);
      }
    }

    const hasExplicitItemsInput = Array.isArray(input.items);
    const normalizedLines = await this.resolveOrderLinesFromInput(customer, input.items, {
      acceptPriceChange: Boolean(input.acceptPriceChange)
    });
    if (normalizedLines.length === 0) {
      throw new AppError(400, "ORDER_ITEMS_EMPTY", "至少需要一个商品");
    }

    const deliveryInfo = await this.normalizeDeliveryInfo(input.delivery, customer);
    const deliveryRemark = this.composeDeliveryRemark(deliveryInfo);
    const customerRemark = input.remark?.trim() || "";
    const orderRemark = [customerRemark, deliveryRemark]
      .filter((item) => item.trim())
      .join("；")
      .slice(0, 480);

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
      remark: orderRemark || null,
      deliveryInfoJson: JSON.stringify(deliveryInfo),
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

    await Promise.allSettled([
      this.sendWebhookBySettingKey(SETTINGS_KEY_ORDER_WEBHOOK, {
        title: "新订单写回成功",
        lines: [
          `订单号: ${fresh.orderNo}`,
          `客户: ${customer.name}`,
          `订单ID: ${fresh.id}`,
          `金额: ${totalAmount.toFixed(2)}`,
          `履约: ${deliveryInfo.mode}`
        ]
      }),
      this.sendWebhookBySettingKey(SETTINGS_KEY_LOGISTICS_WEBHOOK, {
        title: "新物流履约通知",
        lines: [
          `订单号: ${fresh.orderNo}`,
          `履约方式: ${deliveryInfo.mode}`,
          `期望到货: ${deliveryInfo.expectedDate || "-"} ${deliveryInfo.timeSlot || ""}`.trim(),
          `卸货要求: ${deliveryInfo.unloadingRequirement || "-"}`,
          `备注: ${deliveryInfo.note || "-"}`
        ]
      })
    ]);

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
    this.assertCustomerCapability(customer, "VIEW_ORDERS");
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
    this.assertCustomerCapability(customer, "VIEW_ORDERS");
    const order = await coreRepo.findSalesOrderByIdAndCustomer(orderId, customer.id);
    return this.serializeOrderDetail(order);
  }

  async cancelMiniOrder(customer: MiniAuthCustomer, orderId: string, remark?: string) {
    this.assertCustomerCapability(customer, "VIEW_ORDERS");
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

  async getMiniProfile(customer: MiniAuthCustomer) {
    const pickupRow = await coreRepo.getSetting(SETTINGS_KEY_PICKUP_ADDRESS);
    const pickupAddress = pickupRow ? this.stringifySettingValue(pickupRow.valueJson) : "";
    const homeBannerRow = await coreRepo.getSetting(SETTINGS_KEY_HOME_BANNERS);
    const homeBanners = this.normalizeMiniHomeBanners(homeBannerRow?.valueJson);
    const brandCenterRow = await coreRepo.getSetting(SETTINGS_KEY_BRAND_CENTER_ITEMS);
    const brandCenterItems = this.normalizeMiniBrandCenterItems(brandCenterRow?.valueJson);
    const homeNoticeRow = await coreRepo.getSetting(SETTINGS_KEY_HOME_NOTICE);
    const homeNotice = this.normalizeMiniHomeNotice(homeNoticeRow?.valueJson);
    const homeLayoutRow = await coreRepo.getSetting(SETTINGS_KEY_HOME_LAYOUT);
    const homeLayout = this.normalizeMiniHomeLayout(homeLayoutRow?.valueJson);
    return {
      ...this.serializeMiniCustomerProfile(customer),
      capabilities: this.getCustomerCapabilities(customer),
      pickupAddress: pickupAddress || null,
      homeBanners,
      brandCenterItems,
      homeNotice,
      homeLayout
    };
  }

  async listMiniAddresses(customer: MiniAuthCustomer) {
    this.assertCustomerCapability(customer, "CREATE_ORDER");
    const list = await coreRepo.listCustomerAddresses(customer.id);
    return list.map((item) => ({
      id: item.id,
      receiverName: item.receiverName,
      receiverPhone: item.receiverPhone,
      province: item.province,
      city: item.city,
      district: item.district,
      detail: item.detail,
      isDefault: item.isDefault,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));
  }

  async upsertMiniAddress(
    customer: MiniAuthCustomer,
    input: {
      id?: string;
      receiverName: string;
      receiverPhone: string;
      province: string;
      city: string;
      district: string;
      detail: string;
      isDefault?: boolean;
    }
  ) {
    this.assertCustomerCapability(customer, "CREATE_ORDER");
    if (!input.receiverName.trim() || !input.receiverPhone.trim()) {
      throw new AppError(400, "ADDRESS_REQUIRED_FIELDS", "收货人和手机号不能为空");
    }
    const saved = await coreRepo.upsertCustomerAddress({
      id: input.id?.trim() || undefined,
      customerId: customer.id,
      receiverName: input.receiverName.trim(),
      receiverPhone: input.receiverPhone.trim(),
      province: input.province.trim(),
      city: input.city.trim(),
      district: input.district.trim(),
      detail: input.detail.trim(),
      isDefault: Boolean(input.isDefault)
    });
    return {
      id: saved.id,
      receiverName: saved.receiverName,
      receiverPhone: saved.receiverPhone,
      province: saved.province,
      city: saved.city,
      district: saved.district,
      detail: saved.detail,
      isDefault: saved.isDefault
    };
  }

  async removeMiniAddress(customer: MiniAuthCustomer, addressId: string) {
    this.assertCustomerCapability(customer, "CREATE_ORDER");
    await coreRepo.removeCustomerAddress(customer.id, addressId);
    return {
      success: true
    };
  }

  async createMiniQuoteRequest(
    customer: MiniAuthCustomer,
    input: {
      items: Array<{
        skuId: string;
        qty: number;
        specText?: string;
      }>;
      remark?: string;
    }
  ) {
    this.assertCustomerCapability(customer, "SUBMIT_QUOTE");
    const normalizedItems = input.items
      .map((item) => ({
        skuId: item.skuId.trim(),
        qty: item.qty,
        specText: item.specText?.trim() || null
      }))
      .filter((item) => item.skuId && Number.isInteger(item.qty) && item.qty > 0);
    if (normalizedItems.length === 0) {
      throw new AppError(400, "QUOTE_ITEMS_EMPTY", "报价商品不能为空");
    }

    const created = await coreRepo.createQuoteRequest({
      customerId: customer.id,
      itemsJson: JSON.stringify(normalizedItems),
      remark: input.remark?.trim() || null,
      status: STATUS_PENDING
    });

    await this.sendWebhookBySettingKey(SETTINGS_KEY_QUOTE_WEBHOOK, {
      title: "新报价申请",
      lines: [
        `客户: ${customer.name}`,
        `客户ID: ${customer.id}`,
        `商品数: ${normalizedItems.length}`,
        `备注: ${input.remark?.trim() || "-"}`
      ]
    });

    return {
      id: created.id,
      status: created.status,
      createdAt: created.createdAt.toISOString()
    };
  }

  async listMiniQuoteRequests(customer: MiniAuthCustomer) {
    this.assertCustomerCapability(customer, "SUBMIT_QUOTE");
    const list = await coreRepo.listQuoteRequestsByCustomer(customer.id);
    return list.map((item) => ({
      id: item.id,
      items: safeParseJson(item.itemsJson),
      remark: item.remark,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));
  }

  async listMiniInvoiceProfiles(customer: MiniAuthCustomer) {
    this.assertCustomerCapability(customer, "INVOICE");
    const list = await coreRepo.listInvoiceProfiles(customer.id);
    return list.map((item) => ({
      id: item.id,
      title: item.title,
      taxNo: item.taxNo,
      bankName: item.bankName,
      bankAccount: item.bankAccount,
      addressPhone: item.addressPhone,
      email: item.email,
      isDefault: item.isDefault,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));
  }

  async upsertMiniInvoiceProfile(
    customer: MiniAuthCustomer,
    input: {
      id?: string;
      title: string;
      taxNo: string;
      bankName?: string;
      bankAccount?: string;
      addressPhone?: string;
      email?: string;
      isDefault?: boolean;
    }
  ) {
    this.assertCustomerCapability(customer, "INVOICE");
    if (!input.title.trim() || !input.taxNo.trim()) {
      throw new AppError(400, "INVOICE_PROFILE_REQUIRED_FIELDS", "发票抬头与税号不能为空");
    }
    const saved = await coreRepo.upsertInvoiceProfile({
      id: input.id?.trim() || undefined,
      customerId: customer.id,
      title: input.title.trim(),
      taxNo: input.taxNo.trim(),
      bankName: input.bankName?.trim() || null,
      bankAccount: input.bankAccount?.trim() || null,
      addressPhone: input.addressPhone?.trim() || null,
      email: input.email?.trim() || null,
      isDefault: Boolean(input.isDefault)
    });
    return {
      id: saved.id,
      title: saved.title,
      taxNo: saved.taxNo,
      bankName: saved.bankName,
      bankAccount: saved.bankAccount,
      addressPhone: saved.addressPhone,
      email: saved.email,
      isDefault: saved.isDefault
    };
  }

  async removeMiniInvoiceProfile(customer: MiniAuthCustomer, profileId: string) {
    this.assertCustomerCapability(customer, "INVOICE");
    await coreRepo.removeInvoiceProfile(customer.id, profileId);
    return {
      success: true
    };
  }

  async listMiniInvoiceRequests(customer: MiniAuthCustomer) {
    this.assertCustomerCapability(customer, "INVOICE");
    const list = await coreRepo.listInvoiceRequestsByCustomer(customer.id);
    return list.map((item) => ({
      id: item.id,
      orderIds: safeParseJson(item.orderIdsJson),
      invoiceProfileId: item.invoiceProfileId,
      invoiceProfile: item.invoiceProfile
        ? {
            id: item.invoiceProfile.id,
            title: item.invoiceProfile.title,
            taxNo: item.invoiceProfile.taxNo
          }
        : null,
      remark: item.remark,
      status: item.status,
      kingdeeRefId: item.kingdeeRefId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));
  }

  async createMiniInvoiceRequest(
    customer: MiniAuthCustomer,
    input: {
      orderIds: string[];
      invoiceProfileId?: string;
      remark?: string;
    }
  ) {
    this.assertCustomerCapability(customer, "INVOICE");
    const orderIds = Array.from(new Set((input.orderIds || []).map((item) => item.trim()).filter(Boolean)));
    if (orderIds.length === 0) {
      throw new AppError(400, "INVOICE_ORDER_IDS_EMPTY", "请选择订单后再申请开票");
    }

    const ownedOrders = await coreRepo.listSalesOrdersByCustomerAndIds(customer.id, orderIds);
    if (ownedOrders.length !== orderIds.length) {
      throw new AppError(403, "INVOICE_ORDER_FORBIDDEN", "存在非当前客户订单，不能申请开票");
    }

    let profileId: string | null = null;
    if (input.invoiceProfileId?.trim()) {
      const profile = await coreRepo.findInvoiceProfileById(customer.id, input.invoiceProfileId.trim());
      if (!profile) {
        throw new AppError(404, "INVOICE_PROFILE_NOT_FOUND", "开票资料不存在");
      }
      profileId = profile.id;
    }

    const created = await coreRepo.createInvoiceRequest({
      customerId: customer.id,
      orderIdsJson: JSON.stringify(orderIds),
      invoiceProfileId: profileId,
      remark: input.remark?.trim() || null,
      status: STATUS_PENDING
    });

    await this.sendWebhookBySettingKey(SETTINGS_KEY_FINANCE_WEBHOOK, {
      title: "新开票申请",
      lines: [
        `客户: ${customer.name}`,
        `客户ID: ${customer.id}`,
        `订单数量: ${orderIds.length}`,
        `申请ID: ${created.id}`,
        `备注: ${input.remark?.trim() || "-"}`
      ]
    });

    await this.tryWritebackInvoiceRequest(created.id, customer, orderIds, profileId);

    const fresh = (await coreRepo.listInvoiceRequestsByCustomer(customer.id)).find((item) => item.id === created.id);
    if (!fresh) {
      return {
        id: created.id,
        status: created.status,
        createdAt: created.createdAt.toISOString()
      };
    }
    return {
      id: fresh.id,
      status: fresh.status,
      kingdeeRefId: fresh.kingdeeRefId,
      createdAt: fresh.createdAt.toISOString(),
      updatedAt: fresh.updatedAt.toISOString()
    };
  }

  async listMiniDeliveries(customer: MiniAuthCustomer, pageInput: PageInput) {
    this.assertCustomerCapability(customer, "VIEW_ORDERS");
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
    this.assertCustomerCapability(customer, "VIEW_ORDERS");
    return this.getDeliveryDetail(customer.id, deliveryId);
  }

  async signMiniDelivery(customer: MiniAuthCustomer, input: SignDeliveryInput) {
    this.assertCustomerCapability(customer, "VIEW_ORDERS");
    return this.signDelivery({
      ...input,
      customerId: customer.id
    });
  }

  async listMiniStatements(customer: MiniAuthCustomer, from?: string, to?: string) {
    this.assertCustomerCapability(customer, "STATEMENT");
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
    this.assertCustomerCapability(customer, "STATEMENT");
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
    this.assertCustomerCapability(customer, "STATEMENT");
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
    const registrationPayload = {
      companyName: input.registration?.companyName?.trim() || null,
      contactName: input.registration?.contactName?.trim() || null,
      contactPhone: input.registration?.contactPhone?.trim() || null,
      remark: input.registration?.remark?.trim() || null,
      customerName: input.customerName?.trim() || null,
      openid,
      submittedAt: new Date().toISOString()
    };

    if (!customer) {
      customer = await coreRepo.createCustomer({
        name:
          input.customerName?.trim() ||
          input.registration?.companyName?.trim() ||
          input.registration?.contactName?.trim() ||
          `客户-${openid.slice(-6)}`,
        phone: input.registration?.contactPhone?.trim() || null,
        status: STATUS_PENDING,
        companyName: input.registration?.companyName?.trim() || null,
        contactName: input.registration?.contactName?.trim() || null,
        contactPhone: input.registration?.contactPhone?.trim() || null,
        wechatOpenid: openid
      });
      await coreRepo.createCustomerRegistrationApplication({
        customerId: customer.id,
        payloadJson: JSON.stringify(registrationPayload),
        status: STATUS_PENDING
      });
      await this.sendWebhookBySettingKey(SETTINGS_KEY_REGISTRATION_WEBHOOK, {
        title: "新注册申请",
        lines: [
          `客户ID: ${customer.id}`,
          `名称: ${customer.name}`,
          `企业: ${customer.companyName || "-"}`,
          `联系人: ${customer.contactName || "-"}`,
          `电话: ${customer.contactPhone || customer.phone || "-"}`,
          `openid: ${openid}`
        ]
      });
    } else {
      const patch: {
        name?: string;
        phone?: string | null;
        companyName?: string | null;
        contactName?: string | null;
        contactPhone?: string | null;
      } = {};
      if (input.customerName?.trim() && customer.name !== input.customerName.trim()) {
        patch.name = input.customerName.trim();
      }
      if (input.registration?.contactPhone?.trim() && customer.phone !== input.registration.contactPhone.trim()) {
        patch.phone = input.registration.contactPhone.trim();
      }
      if (input.registration?.companyName?.trim() && customer.companyName !== input.registration.companyName.trim()) {
        patch.companyName = input.registration.companyName.trim();
      }
      if (input.registration?.contactName?.trim() && customer.contactName !== input.registration.contactName.trim()) {
        patch.contactName = input.registration.contactName.trim();
      }
      if (input.registration?.contactPhone?.trim() && customer.contactPhone !== input.registration.contactPhone.trim()) {
        patch.contactPhone = input.registration.contactPhone.trim();
      }

      if (Object.keys(patch).length > 0) {
        customer = await coreRepo.updateCustomerProfile(customer.id, patch);
      }

      if (customer.status !== STATUS_ACTIVE && input.registration) {
        await coreRepo.createCustomerRegistrationApplication({
          customerId: customer.id,
          payloadJson: JSON.stringify(registrationPayload),
          status: STATUS_PENDING
        });
        await this.sendWebhookBySettingKey(SETTINGS_KEY_REGISTRATION_WEBHOOK, {
          title: "注册申请更新",
          lines: [
            `客户ID: ${customer.id}`,
            `名称: ${customer.name}`,
            `企业: ${customer.companyName || "-"}`,
            `联系人: ${customer.contactName || "-"}`,
            `电话: ${customer.contactPhone || customer.phone || "-"}`,
            `openid: ${openid}`
          ]
        });
      }
    }

    const token = await this.issueCustomerAccessToken({
      customerId: customer.id,
      ttlDays: customer.status === STATUS_ACTIVE ? DEFAULT_CUSTOMER_TOKEN_TTL_DAYS : 30
    });
    const refreshedCustomer = await coreRepo.findCustomerById(customer.id);
    if (!refreshedCustomer) {
      throw new AppError(500, "CUSTOMER_NOT_FOUND", "登录后读取客户信息失败");
    }

    return {
      openid,
      accessToken: token.accessToken,
      tokenExpiresAt: token.tokenExpiresAt,
      customerProfile: {
        ...this.serializeCustomer(refreshedCustomer),
        wechatOpenid: refreshedCustomer.wechatOpenid,
        isKingdeeBound: Boolean(refreshedCustomer.kingdeeCustomerId?.trim())
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

  async syncInventoryStockSnapshot() {
    const scope = `${env.NODE_ENV}:sync:inventory-stock-snapshot`;
    const jobName = "sync:inventory-stock-snapshot";
    const skus = await coreRepo.listActiveSkusWithMaterialId();
    const materialIds = Array.from(
      new Set(
        skus
          .map((item) => item.kingdeeMaterialId?.trim() || "")
          .filter((item) => item.length > 0)
      )
    );
    const excludedWarehouseCodes = await this.getExcludedWarehouseCodes();

    let touchedMaterials = 0;
    let touchedSkus = 0;
    const warnings: string[] = [];

    for (const materialId of materialIds) {
      const rows = await this.fetchInventoryStockRowsByMaterial(materialId);
      const stockQty = rows.reduce((sum, row) => {
        const warehouseCode = pickStringField(row, [
          "warehouse_code",
          "warehouseCode",
          "warehouse_number",
          "warehouse_no"
        ]);
        const warehouseId = pickStringField(row, ["warehouse_id", "warehouseId"]);
        if (
          (warehouseCode && excludedWarehouseCodes.has(warehouseCode)) ||
          (warehouseId && excludedWarehouseCodes.has(warehouseId))
        ) {
          return sum;
        }
        return sum + Math.max(0, Math.floor(extractInventoryQty(row)));
      }, 0);

      const updateResult = await coreRepo.updateSkuStockByMaterialId(materialId, stockQty);
      touchedMaterials += 1;
      touchedSkus += updateResult.count;
    }

    await coreRepo.upsertSyncCheckpoint({
      scope,
      jobName,
      cursorJson: JSON.stringify({
        touchedMaterials,
        touchedSkus,
        excludedWarehouseCodes: [...excludedWarehouseCodes],
        updatedAt: new Date().toISOString()
      }),
      status: "SUCCESS",
      errorMessage: null
    });

    return {
      jobName,
      touchedMaterials,
      touchedSkus,
      excludedWarehouseCount: excludedWarehouseCodes.size,
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

    if (resolvedJobName === "sync:inventory-stock-snapshot") {
      const result = await this.syncInventoryStockSnapshot();
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

  async runAdminKingdeeDiagnostics() {
    const checkedAt = new Date();
    const items: Array<{
      key: string;
      title: string;
      status: "PASS" | "WARN" | "FAIL";
      message: string;
      detail?: Record<string, unknown>;
    }> = [];

    const push = (
      key: string,
      title: string,
      status: "PASS" | "WARN" | "FAIL",
      message: string,
      detail?: Record<string, unknown>
    ) => {
      items.push({
        key,
        title,
        status,
        message,
        ...(detail ? { detail } : {})
      });
    };

    try {
      const ping = await this.pingKingdee();
      if (ping.tokenOk && ping.apiOk) {
        push("connectivity", "金蝶连通性（ping）", "PASS", "连通正常，可访问金蝶接口", {
          endpoint: ping.endpoint
        });
      } else {
        push(
          "connectivity",
          "金蝶连通性（ping）",
          "FAIL",
          ping.error ? `连通失败：${ping.error}` : "连通失败，请检查网络与配置",
          {
            endpoint: ping.endpoint,
            tokenOk: ping.tokenOk,
            apiOk: ping.apiOk
          }
        );
      }
    } catch (error) {
      push("connectivity", "金蝶连通性（ping）", "FAIL", this.stringifyDiagnosticError(error));
    }

    try {
      await kingdeeTokenProvider.getValidToken();
      const tokenRow = await coreRepo.getTokenByEnv(env.NODE_ENV);
      if (!tokenRow) {
        push(
          "token-status",
          "token 是否有效/是否快过期",
          "WARN",
          "可获取 token，但未读取到本地过期时间，建议联系技术确认缓存状态"
        );
      } else {
        const remainMinutes = Math.floor((tokenRow.expiresAt.getTime() - Date.now()) / 60_000);
        if (remainMinutes <= 0) {
          push("token-status", "token 是否有效/是否快过期", "FAIL", "token 已过期，需要立即刷新", {
            expiresAt: tokenRow.expiresAt.toISOString()
          });
        } else if (remainMinutes <= 120) {
          push(
            "token-status",
            "token 是否有效/是否快过期",
            "WARN",
            `token 将在 ${remainMinutes} 分钟内过期，建议尽快刷新`,
            {
              expiresAt: tokenRow.expiresAt.toISOString()
            }
          );
        } else {
          push(
            "token-status",
            "token 是否有效/是否快过期",
            "PASS",
            `token 有效，剩余约 ${remainMinutes} 分钟`,
            {
              expiresAt: tokenRow.expiresAt.toISOString()
            }
          );
        }
      }
    } catch (error) {
      push("token-status", "token 是否有效/是否快过期", "FAIL", this.stringifyDiagnosticError(error));
    }

    try {
      const customerList = await this.getCustomerList({
        page: "1",
        page_size: "1"
      });
      const rows = extractRows(customerList.data);
      if (rows.length > 0) {
        push("customer-list", "能否读取客户列表（customer/list）", "PASS", "客户列表读取成功");
      } else {
        push(
          "customer-list",
          "能否读取客户列表（customer/list）",
          "WARN",
          "客户列表接口可访问，但当前未返回样本数据"
        );
      }
    } catch (error) {
      push("customer-list", "能否读取客户列表（customer/list）", "FAIL", this.stringifyDiagnosticError(error));
    }

    try {
      const outboundList = await this.getSalesOutboundList({
        page: "1",
        page_size: "1"
      });
      const rows = extractRows(outboundList.data);
      if (rows.length === 0) {
        push(
          "outbound",
          "能否读取出库/发货列表+明细",
          "WARN",
          "发货列表可访问，但暂无样本，未验证明细接口"
        );
      } else {
        const first = isRecord(rows[0]) ? rows[0] : null;
        const detailQuery = first ? buildDetailQueryByRecord(first) : null;
        if (!detailQuery) {
          push(
            "outbound",
            "能否读取出库/发货列表+明细",
            "WARN",
            "列表可读取，但样本缺少 id/number，无法验证明细接口"
          );
        } else {
          await this.getSalesOutboundDetail(detailQuery);
          push("outbound", "能否读取出库/发货列表+明细", "PASS", "出库列表与明细读取成功");
        }
      }
    } catch (error) {
      push("outbound", "能否读取出库/发货列表+明细", "FAIL", this.stringifyDiagnosticError(error));
    }

    try {
      const receiptList = await this.getReceiptList({
        page: "1",
        page_size: "1"
      });
      const rows = extractRows(receiptList.data);
      if (rows.length === 0) {
        push(
          "receipt",
          "能否读取收款列表+明细",
          "WARN",
          "收款列表可访问，但暂无样本，未验证明细接口"
        );
      } else {
        const first = isRecord(rows[0]) ? rows[0] : null;
        const detailQuery = first ? buildDetailQueryByRecord(first) : null;
        if (!detailQuery) {
          push(
            "receipt",
            "能否读取收款列表+明细",
            "WARN",
            "列表可读取，但样本缺少 id/number，无法验证明细接口"
          );
        } else {
          await this.getReceiptDetail(detailQuery);
          push("receipt", "能否读取收款列表+明细", "PASS", "收款列表与明细读取成功");
        }
      }
    } catch (error) {
      push("receipt", "能否读取收款列表+明细", "FAIL", this.stringifyDiagnosticError(error));
    }

    try {
      const checkpoints = await coreRepo.listSyncCheckpoints("sync:inventory-stock-snapshot");
      const latest = checkpoints[0];
      if (!latest) {
        push(
          "inventory-snapshot",
          "库存快照任务是否正常",
          "WARN",
          "尚未找到库存快照任务运行记录，可先在同步管理手动触发一次"
        );
      } else if (latest.status !== "SUCCESS") {
        push(
          "inventory-snapshot",
          "库存快照任务是否正常",
          "FAIL",
          `最近一次运行失败：${latest.errorMessage || latest.status}`,
          {
            lastRunAt: latest.lastRunAt.toISOString()
          }
        );
      } else {
        const ageMinutes = Math.floor((Date.now() - latest.lastRunAt.getTime()) / 60_000);
        if (ageMinutes > 45) {
          push(
            "inventory-snapshot",
            "库存快照任务是否正常",
            "WARN",
            `最近成功时间较久（${ageMinutes} 分钟前），建议检查定时任务`,
            {
              lastRunAt: latest.lastRunAt.toISOString()
            }
          );
        } else {
          push(
            "inventory-snapshot",
            "库存快照任务是否正常",
            "PASS",
            "库存快照任务运行正常",
            {
              lastRunAt: latest.lastRunAt.toISOString()
            }
          );
        }
      }
    } catch (error) {
      push(
        "inventory-snapshot",
        "库存快照任务是否正常",
        "FAIL",
        this.stringifyDiagnosticError(error)
      );
    }

    const summary = {
      pass: items.filter((item) => item.status === "PASS").length,
      warn: items.filter((item) => item.status === "WARN").length,
      fail: items.filter((item) => item.status === "FAIL").length,
      total: items.length
    };

    return {
      checkedAt: checkedAt.toISOString(),
      summary,
      items
    };
  }

  async retryOrderWritebackByOrderNo(orderNo: string) {
    const normalizedOrderNo = orderNo.trim();
    if (!normalizedOrderNo) {
      throw new AppError(400, "ORDER_NO_REQUIRED", "orderNo 不能为空");
    }

    const matched = await coreRepo.findSalesOrderByKingdeeOrderNumber(normalizedOrderNo);
    if (!matched) {
      throw new AppError(404, "ORDER_NOT_FOUND", "未找到该订单号对应的本地订单");
    }

    const result = await this.retryOrderWriteback(matched.id);
    return {
      inputOrderNo: normalizedOrderNo,
      matchedOrder: {
        id: matched.id,
        orderNo: matched.orderNo,
        kingdeeOrderNumber: matched.kingdeeOrderNumber,
        status: matched.status
      },
      result
    };
  }

  async runSyncDemo() {
    return this.syncDeliveries({});
  }

  private getEndpoint(key: CoreEndpointKey): EndpointItem {
    return endpointCatalog.getByKey(key);
  }

  private resolveKingdeeMaterialListEndpoint(): EndpointItem {
    const index = endpointCatalog.load(false);
    const direct = index.endpoints.find(
      (item) => item.method === "GET" && item.path === "/jdy/v2/bd/material"
    );
    if (direct) {
      return direct;
    }

    const fallback =
      endpointCatalog.findByContains("商品信息/商品列表") ?? endpointCatalog.findByContains("商品列表");
    if (fallback && fallback.method === "GET") {
      return fallback;
    }

    throw new AppError(
      500,
      "KINGDEE_MATERIAL_LIST_ENDPOINT_NOT_FOUND",
      "未找到金蝶商品列表接口定义"
    );
  }

  private serializeKingdeeMaterialRow(row: Record<string, unknown>) {
    const materialId = pickStringField(row, ["id", "material_id", "materialId", "fid"]);
    const materialNumber = pickStringField(row, [
      "number",
      "material_number",
      "materialNumber",
      "code"
    ]);
    const materialName = pickStringField(row, ["name", "material_name", "materialName"]);
    const materialModel = pickStringField(row, [
      "model",
      "material_model",
      "specification",
      "spec"
    ]);
    const unitId = pickStringField(row, [
      "default_unit_id",
      "unit_id",
      "base_unit_id",
      "stock_unit_id",
      "measure_unit_id"
    ]);
    const unitName = pickStringField(row, [
      "default_unit_name",
      "unit_name",
      "base_unit_name",
      "stock_unit_name"
    ]);
    const enabled = normalizeEnableValue(
      row.enable ?? row.is_enable ?? row.forbid_status ?? row.is_forbid ?? row.status
    );

    return {
      materialId: materialId || null,
      materialNumber: materialNumber || null,
      materialName: materialName || null,
      materialModel: materialModel || null,
      unitId: unitId || null,
      unitName: unitName || null,
      enabled,
      enabledText: enabled === true ? "可用" : enabled === false ? "禁用" : "未知",
      raw: row
    };
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

    const inventoryAliases = new Set([
      "sync:inventory-stock-snapshot",
      "sync:inventory_stock_snapshot",
      "inventory-stock-snapshot",
      "inventory_stock_snapshot",
      "inventory-stock",
      "inventory_stock",
      "inventory",
      "inventory_stock"
    ]);
    if (inventoryAliases.has(normalized)) {
      return "sync:inventory-stock-snapshot";
    }

    const allAliases = new Set(["sync:all", "all", "full", "both", "master_data_full"]);
    if (allAliases.has(normalized)) {
      return "sync:all";
    }

    throw new AppError(
      400,
      "SYNC_JOB_UNSUPPORTED",
      "不支持的 jobName。可选值: sync:deliveries, sync:receipts, sync:inventory-stock-snapshot, sync:all"
    );
  }

  private stringifyDiagnosticError(error: unknown): string {
    if (error instanceof AppError) {
      return `${error.message}（${error.code}）`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "未知错误";
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

  private async serializeProductForMiniCustomer(
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
    customer: MiniAuthCustomer,
    withSkus = false
  ) {
    const activeSkus = (product.skus ?? []).filter((item) => item.status === "ACTIVE");
    const miniSkus = await Promise.all(
      activeSkus.map(async (item) => {
        const priceResult = await this.resolveDisplayPrice(customer, item.id);
        return {
          id: item.id,
          skuCode: item.skuCode,
          skuName: item.skuName,
          specs: safeParseJson(item.specsJson),
          status: item.status,
          unitId: item.unitId,
          kingdeeMaterialId: item.kingdeeMaterialId,
          stockStatus: Number(item.stock) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
          inStock: Number(item.stock) > 0,
          needQuote: !priceResult.found,
          displayPrice: priceResult.found ? priceResult.unitPrice : null,
          currency: priceResult.currency
        };
      })
    );

    const pricedValues = miniSkus
      .filter((item) => !item.needQuote && typeof item.displayPrice === "number")
      .map((item) => Number(item.displayPrice));
    const minDisplayPrice = pricedValues.length > 0 ? Math.min(...pricedValues) : null;
    const hasInStock = miniSkus.some((item) => item.inStock);
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
      hasPrice: pricedValues.length > 0,
      hasInStock,
      stockStatus: hasInStock ? "IN_STOCK" : "OUT_OF_STOCK",
      minDisplayPrice,
      needQuote: pricedValues.length === 0,
      skus: withSkus ? miniSkus : undefined
    };
  }

  private async serializeCartForMiniCustomer(
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
      | null,
    customer: MiniAuthCustomer
  ) {
    const items: Array<{
      id: string;
      productId: string;
      skuId: string;
      productCode: string;
      productName: string;
      coverImageUrl: string | null;
      skuCode: string;
      skuName: string;
      specs: unknown;
      qty: number;
      skuStatus: string;
      stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
      inStock: boolean;
      needQuote: boolean;
      unitPrice: number | null;
      currency: string;
      lineAmount: number | null;
    }> = [];
    for (const item of cart?.items ?? []) {
      const priceResult = await this.resolveDisplayPrice(customer, item.sku.id);
      const qty = Number(item.qty);
      const unitPrice = priceResult.found ? Number(priceResult.unitPrice) : null;
      items.push({
        id: item.id,
        productId: item.product.id,
        skuId: item.sku.id,
        productCode: item.product.code,
        productName: item.product.name,
        coverImageUrl: item.product.coverImageUrl,
        skuCode: item.sku.skuCode,
        skuName: item.sku.skuName,
        specs: safeParseJson(item.sku.specsJson),
        qty,
        skuStatus: item.sku.status,
        stockStatus: Number(item.sku.stock) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
        inStock: Number(item.sku.stock) > 0,
        needQuote: !priceResult.found,
        unitPrice,
        currency: priceResult.currency,
        lineAmount: unitPrice === null ? null : Number((unitPrice * qty).toFixed(2))
      });
    }
    const pricedItems = items.filter((item) => typeof item.lineAmount === "number");
    const totalAmount = pricedItems.reduce((sum, item) => sum + Number(item.lineAmount), 0);
    const totalQty = items.reduce((sum, item) => sum + Number(item.qty), 0);
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
          deliveryInfoJson: string | null;
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
      deliveryInfo: safeParseJson(order.deliveryInfoJson),
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
    itemsInput?: MiniOrderLineInput[],
    options?: {
      acceptPriceChange?: boolean;
    }
  ) {
    const normalizedInput: MiniOrderLineInput[] = Array.isArray(itemsInput)
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

      const unitPrice = await this.resolveFinalUnitPriceForOrder(
        customer,
        {
          skuId: sku.id,
          skuCode: sku.skuCode,
          skuName: sku.skuName,
          unitId: sku.unitId,
          kingdeeMaterialId: sku.kingdeeMaterialId || sku.product.kingdeeMaterialId || null,
          fallbackPrice: Number(sku.price)
        },
        raw.qty,
        raw.expectedUnitPrice,
        Boolean(options?.acceptPriceChange)
      );
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

  private async resolveDisplayPrice(
    customer: MiniAuthCustomer,
    skuId: string
  ): Promise<PriceResolutionResult> {
    const cached = await coreRepo.findPriceCache(customer.id, skuId);
    if (cached) {
      return {
        found: true,
        unitPrice: Number(cached.unitPrice),
        currency: cached.currency || "CNY",
        source: "CACHE"
      };
    }

    return {
      found: false,
      unitPrice: null,
      currency: "CNY",
      source: "CACHE"
    };
  }

  private async resolveFinalUnitPriceForOrder(
    customer: MiniAuthCustomer,
    sku: {
      skuId: string;
      skuCode: string;
      skuName: string;
      unitId: string | null;
      kingdeeMaterialId: string | null;
      fallbackPrice: number;
    },
    qty: number,
    expectedUnitPrice: number | undefined,
    acceptPriceChange: boolean
  ): Promise<number> {
    const priceResult = await this.fetchKingdeeCustomerPrice(customer, {
      materialId: sku.kingdeeMaterialId,
      unitId: sku.unitId,
      qty,
      fallbackPrice: sku.fallbackPrice
    });
    if (!priceResult.found || priceResult.unitPrice === null) {
      throw new AppError(409, "NEED_QUOTE", `SKU ${sku.skuCode} 暂无客户价`);
    }

    const finalPrice = Number(priceResult.unitPrice);
    await coreRepo.upsertPriceCache({
      customerId: customer.id,
      skuId: sku.skuId,
      unitPrice: finalPrice,
      currency: priceResult.currency,
      source: priceResult.source
    });

    if (
      typeof expectedUnitPrice === "number" &&
      Number.isFinite(expectedUnitPrice) &&
      !acceptPriceChange &&
      !isSamePrice(expectedUnitPrice, finalPrice)
    ) {
      throw new AppError(409, "PRICE_CHANGED", "价格已变更，请确认后重试", {
        skuId: sku.skuId,
        skuCode: sku.skuCode,
        newUnitPrice: finalPrice
      });
    }

    return finalPrice;
  }

  private async fetchKingdeeCustomerPrice(
    customer: MiniAuthCustomer,
    input: {
      materialId: string | null;
      unitId: string | null;
      qty: number;
      fallbackPrice: number;
    }
  ): Promise<PriceResolutionResult> {
    if (!customer.kingdeeCustomerId?.trim()) {
      return {
        found: false,
        unitPrice: null,
        currency: "CNY",
        source: "KINGDEE"
      };
    }
    if (!input.materialId?.trim() || !input.unitId?.trim()) {
      return {
        found: false,
        unitPrice: null,
        currency: "CNY",
        source: "KINGDEE"
      };
    }

    const pricingContext = await this.getPricingContextSetting();
    if (!pricingContext) {
      throw new AppError(
        409,
        "PRICING_CONTEXT_MISSING",
        "缺少 pricingContext 配置，请联系管理员"
      );
    }

    const endpoint =
      endpointCatalog.findByContains("商品价格策略") ?? endpointCatalog.findByContains("价格策略");
    if (!endpoint) {
      return {
        found: false,
        unitPrice: null,
        currency: pricingContext.currency || "CNY",
        source: "KINGDEE"
      };
    }

    let payload: unknown = null;
    try {
      payload = await kingdeeClient.request({
        method: endpoint.method as "GET",
        path: endpoint.path,
        query: {
          bill_date: new Date().toISOString().slice(0, 10),
          bill_type_id: pricingContext.billTypeId,
          currency_id: pricingContext.currencyId,
          exchange_rate: pricingContext.exchangeRate,
          material_id: input.materialId,
          qty: String(input.qty),
          unit_id: input.unitId,
          customer_id: customer.kingdeeCustomerId
        }
      });
    } catch (error) {
      coreLogger.warn(
        {
          err: error,
          customerId: customer.id,
          materialId: input.materialId
        },
        "Fetch kingdee customer price failed"
      );
      return {
        found: false,
        unitPrice: null,
        currency: pricingContext.currency || "CNY",
        source: "KINGDEE"
      };
    }

    const unitPrice = pickPriceValue(payload);
    if (unitPrice === null) {
      return {
        found: false,
        unitPrice: null,
        currency: pricingContext.currency || "CNY",
        source: "KINGDEE"
      };
    }

    return {
      found: true,
      unitPrice,
      currency: pricingContext.currency || "CNY",
      source: "KINGDEE"
    };
  }

  private async getPricingContextSetting(): Promise<{
    billTypeId: string;
    currencyId: string;
    exchangeRate: string;
    currency?: string;
  } | null> {
    const row = await coreRepo.getSetting(SETTINGS_KEY_PRICING_CONTEXT);
    if (!row) {
      return null;
    }
    const parsed = safeParseJson(row.valueJson);
    if (!isRecord(parsed)) {
      return null;
    }
    const billTypeId =
      typeof parsed.billTypeId === "string" && parsed.billTypeId.trim() ? parsed.billTypeId.trim() : null;
    const currencyId =
      typeof parsed.currencyId === "string" && parsed.currencyId.trim() ? parsed.currencyId.trim() : null;
    const exchangeRateRaw =
      typeof parsed.exchangeRate === "string" && parsed.exchangeRate.trim()
        ? parsed.exchangeRate.trim()
        : typeof parsed.exchangeRate === "number"
          ? String(parsed.exchangeRate)
          : null;
    const currency =
      typeof parsed.currency === "string" && parsed.currency.trim() ? parsed.currency.trim() : "CNY";
    if (!billTypeId || !currencyId || !exchangeRateRaw) {
      return null;
    }
    return {
      billTypeId,
      currencyId,
      exchangeRate: exchangeRateRaw,
      currency
    };
  }

  private async getExcludedWarehouseCodes(): Promise<Set<string>> {
    const row = await coreRepo.getSetting(SETTINGS_KEY_EXCLUDED_WAREHOUSE_CODES);
    if (!row) {
      return new Set<string>();
    }
    const parsed = safeParseJson(row.valueJson);
    if (Array.isArray(parsed)) {
      return new Set(
        parsed
          .map((item) => String(item ?? "").trim())
          .filter((item) => item.length > 0)
      );
    }
    if (typeof parsed === "string") {
      return new Set(
        parsed
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      );
    }
    return new Set<string>();
  }

  private async fetchInventoryStockRowsByMaterial(materialId: string): Promise<Record<string, unknown>[]> {
    const endpoint =
      endpointCatalog.findByContains("商品仓库库存查询") ??
      endpointCatalog.findByContains("inventory_stock");
    if (!endpoint) {
      throw new AppError(500, "INVENTORY_ENDPOINT_NOT_FOUND", "未找到库存接口定义");
    }
    const payload = await kingdeeClient.request({
      method: "GET",
      path: endpoint.path,
      query: {
        material_id: materialId,
        is_show_zero_im_qty: true
      }
    });

    return extractRows(payload).filter((item): item is Record<string, unknown> => isRecord(item));
  }

  private async sendWebhookBySettingKey(
    settingKey: string,
    message: {
      title: string;
      lines: string[];
    }
  ) {
    const row = await coreRepo.getSetting(settingKey);
    if (!row) {
      return;
    }
    const parsed = safeParseJson(row.valueJson);
    const url = typeof parsed === "string" ? parsed.trim() : "";
    if (!url) {
      return;
    }
    await sendFeishuTextWebhook(url, {
      title: message.title,
      lines: message.lines
    });
  }

  private async normalizeDeliveryInfo(
    delivery: MiniCreateOrderInput["delivery"] | undefined,
    customer: MiniAuthCustomer
  ) {
    const mode = delivery?.mode === "DELIVERY" ? "DELIVERY" : "PICKUP";
    if (mode === "DELIVERY") {
      if (!delivery?.addressId?.trim()) {
        throw new AppError(400, "DELIVERY_ADDRESS_REQUIRED", "配送方式下必须选择收货地址");
      }
      const address = await coreRepo.findCustomerAddressById(customer.id, delivery.addressId.trim());
      if (!address) {
        throw new AppError(404, "ADDRESS_NOT_FOUND", "收货地址不存在");
      }
      if (!delivery.expectedDate?.trim()) {
        throw new AppError(400, "DELIVERY_EXPECTED_DATE_REQUIRED", "请填写期望到货日期");
      }
      if (!delivery.timeSlot?.trim()) {
        throw new AppError(400, "DELIVERY_TIME_SLOT_REQUIRED", "请选择期望到货时间段");
      }
      return {
        mode: "DELIVERY" as const,
        addressId: address.id,
        address: {
          receiverName: address.receiverName,
          receiverPhone: address.receiverPhone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail
        },
        expectedDate: delivery.expectedDate.trim(),
        timeSlot: delivery.timeSlot.trim(),
        unloadingRequirement: delivery.unloadingRequirement?.trim() || null,
        note: delivery.note?.trim() || null
      };
    }

    const pickupAddress = await coreRepo.getSetting(SETTINGS_KEY_PICKUP_ADDRESS);
    const pickupAddressText = pickupAddress ? this.stringifySettingValue(pickupAddress.valueJson) : "";
    return {
      mode: "PICKUP" as const,
      pickupAddress: pickupAddressText || "仓库自提地址未配置",
      expectedDate: null,
      timeSlot: null,
      unloadingRequirement: delivery?.unloadingRequirement?.trim() || null,
      note: delivery?.note?.trim() || null
    };
  }

  private composeDeliveryRemark(deliveryInfo: Record<string, unknown>): string {
    if (!isRecord(deliveryInfo)) {
      return "";
    }
    const mode = typeof deliveryInfo.mode === "string" ? deliveryInfo.mode : "DELIVERY";
    if (mode === "PICKUP") {
      return [
        "履约:PICKUP",
        `自提点:${typeof deliveryInfo.pickupAddress === "string" ? deliveryInfo.pickupAddress : "-"}`,
        `卸货:${typeof deliveryInfo.unloadingRequirement === "string" ? deliveryInfo.unloadingRequirement : "-"}`,
        `备注:${typeof deliveryInfo.note === "string" ? deliveryInfo.note : "-"}`
      ].join("；");
    }

    const address = isRecord(deliveryInfo.address) ? deliveryInfo.address : null;
    const addressText = address
      ? `${address.province ?? ""}${address.city ?? ""}${address.district ?? ""}${address.detail ?? ""}`
      : "-";
    return [
      "履约:DELIVERY",
      `到货:${typeof deliveryInfo.expectedDate === "string" ? deliveryInfo.expectedDate : "-"} ${
        typeof deliveryInfo.timeSlot === "string" ? deliveryInfo.timeSlot : ""
      }`.trim(),
      `地址:${addressText}`,
      `卸货:${typeof deliveryInfo.unloadingRequirement === "string" ? deliveryInfo.unloadingRequirement : "-"}`,
      `备注:${typeof deliveryInfo.note === "string" ? deliveryInfo.note : "-"}`
    ].join("；");
  }

  private parseAdminImageDataUrl(dataUrl: string): {
    buffer: Buffer;
    contentType: string;
    extension: string;
  } {
    const text = String(dataUrl || "").trim();
    const matched = text.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=\s]+)$/);
    if (!matched) {
      throw new AppError(400, "ADMIN_IMAGE_DATA_INVALID", "图片数据格式不正确，请重新选择图片");
    }
    const rawContentType = matched[1].toLowerCase();
    const contentType = rawContentType === "image/jpg" ? "image/jpeg" : rawContentType;
    const extension = ADMIN_IMAGE_MIME_TO_EXT[contentType];
    if (!extension) {
      throw new AppError(400, "ADMIN_IMAGE_TYPE_NOT_SUPPORTED", "仅支持 PNG/JPG/WEBP/GIF 图片");
    }
    const base64Data = matched[2].replace(/\s+/g, "");
    const buffer = Buffer.from(base64Data, "base64");
    if (!buffer.byteLength) {
      throw new AppError(400, "ADMIN_IMAGE_DATA_INVALID", "图片内容为空，请重新上传");
    }
    return {
      buffer,
      contentType,
      extension
    };
  }

  private normalizeAdminUploadFolder(folder?: string): string {
    const raw = String(folder || "products")
      .trim()
      .toLowerCase();
    const safe = raw
      .replace(/\\/g, "/")
      .replace(/[^a-z0-9/_-]+/g, "-")
      .replace(/\/{2,}/g, "/")
      .replace(/^\/+|\/+$/g, "");
    const parts = safe
      .split("/")
      .filter((item) => item && item !== "." && item !== "..")
      .slice(0, 3)
      .map((item) => item.slice(0, 32));
    return parts.length ? parts.join("/") : "products";
  }

  private buildAdminUploadFileName(filename: string | undefined, extension: string): string {
    const basename = String(filename || "")
      .trim()
      .split(/[\\/]/)
      .pop();
    const cleaned = String(basename || "")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 36);
    const prefix = cleaned || "image";
    return `${Date.now()}-${prefix}-${randomUUID().slice(0, 8)}.${extension}`;
  }

  private stringifySettingValue(valueJson: string): string {
    const parsed = safeParseJson(valueJson);
    if (typeof parsed === "string") {
      return parsed;
    }
    return JSON.stringify(parsed);
  }

  private normalizeMiniHomeNotice(valueJson?: string | null): MiniHomeNotice {
    const parsed = safeParseJson(valueJson ?? null);
    if (!isRecord(parsed)) {
      return this.getDefaultMiniHomeNotice();
    }

    const defaults = this.getDefaultMiniHomeNotice();
    const title =
      String(parsed.title ?? "")
        .trim()
        .slice(0, HOME_NOTICE_MAX_TITLE_LENGTH) || defaults.title;
    const content =
      String(parsed.content ?? "")
        .trim()
        .slice(0, HOME_NOTICE_MAX_CONTENT_LENGTH) || defaults.content;

    return {
      title,
      content
    };
  }

  private getDefaultMiniHomeNotice(): MiniHomeNotice {
    return {
      title: "店铺通知",
      content: "当日 17:30 前下单次日达，17:30 后下单顺延一天。"
    };
  }

  private normalizeMiniHomeLayout(valueJson?: string | null): MiniHomeLayoutSection[] {
    const parsed = safeParseJson(valueJson ?? null);
    if (!Array.isArray(parsed)) {
      return this.getDefaultMiniHomeLayout();
    }

    const keySet = new Set<HomeLayoutModuleKey>();
    const normalized: MiniHomeLayoutSection[] = [];
    for (const item of parsed) {
      const section = this.normalizeMiniHomeLayoutItem(item);
      if (!section || keySet.has(section.key)) {
        continue;
      }
      keySet.add(section.key);
      normalized.push(section);
    }

    for (const fallback of this.getDefaultMiniHomeLayout()) {
      if (!keySet.has(fallback.key)) {
        keySet.add(fallback.key);
        normalized.push(fallback);
      }
    }

    if (normalized.filter((item) => item.enabled).length === 0) {
      return this.getDefaultMiniHomeLayout();
    }

    return normalized;
  }

  private normalizeMiniHomeLayoutItem(item: unknown): MiniHomeLayoutSection | null {
    const recordItem = isRecord(item) ? item : null;
    const keyText = typeof item === "string" ? item : recordItem ? String(recordItem.key ?? "") : "";
    const key = keyText.trim() as HomeLayoutModuleKey;
    if (!HOME_LAYOUT_MODULE_KEY_SET.has(key)) {
      return null;
    }

    if (typeof item === "string") {
      return {
        key,
        enabled: true
      };
    }

    return {
      key,
      enabled: recordItem?.enabled !== false
    };
  }

  private getDefaultMiniHomeLayout(): MiniHomeLayoutSection[] {
    return HOME_LAYOUT_MODULE_KEYS.map((key) => ({
      key,
      enabled: true
    }));
  }

  private normalizeMiniBrandCenterItems(valueJson?: string | null): MiniBrandCenterItem[] {
    if (valueJson == null) {
      return this.getDefaultMiniBrandCenterItems();
    }
    const parsed = safeParseJson(valueJson);
    if (!Array.isArray(parsed)) {
      return this.getDefaultMiniBrandCenterItems();
    }
    return parsed
      .map((item, index) => this.normalizeMiniBrandCenterItem(item, index))
      .filter((item): item is MiniBrandCenterItem => Boolean(item))
      .filter((item) => item.enabled)
      .slice(0, BRAND_CENTER_MAX_COUNT);
  }

  private normalizeMiniBrandCenterItem(item: unknown, index: number): MiniBrandCenterItem | null {
    if (!isRecord(item)) {
      return null;
    }

    const idText = String(item.id ?? "").trim();
    const id = idText || `brand-${index + 1}`;
    const name = String(item.name ?? "").trim().slice(0, BRAND_CENTER_MAX_NAME_LENGTH);
    if (!name) {
      return null;
    }

    let logoUrl: string | null = null;
    const logoUrlText = String(item.logoUrl ?? "").trim();
    if (logoUrlText) {
      try {
        const parsed = new URL(logoUrlText);
        if (["http:", "https:"].includes(parsed.protocol)) {
          logoUrl = logoUrlText;
        }
      } catch (error) {
        logoUrl = null;
      }
    }

    return {
      id,
      enabled: item.enabled !== false,
      name,
      logoUrl
    };
  }

  private getDefaultMiniBrandCenterItems(): MiniBrandCenterItem[] {
    return [
      {
        id: "brand-1",
        enabled: true,
        name: "品牌A",
        logoUrl: null
      },
      {
        id: "brand-2",
        enabled: true,
        name: "品牌B",
        logoUrl: null
      },
      {
        id: "brand-3",
        enabled: true,
        name: "品牌C",
        logoUrl: null
      },
      {
        id: "brand-4",
        enabled: true,
        name: "品牌D",
        logoUrl: null
      }
    ];
  }

  private normalizeMiniHomeBanners(valueJson?: string | null): MiniHomeBanner[] {
    const parsed = safeParseJson(valueJson ?? null);
    const list = Array.isArray(parsed) ? parsed : [];
    const normalized = list
      .map((item, index) => this.normalizeMiniHomeBannerItem(item, index))
      .filter((item): item is MiniHomeBanner => Boolean(item))
      .filter((item) => item.enabled)
      .slice(0, HOME_BANNER_MAX_COUNT);

    if (normalized.length > 0) {
      return normalized;
    }

    return this.getDefaultMiniHomeBanners();
  }

  private normalizeMiniHomeBannerItem(item: unknown, index: number): MiniHomeBanner | null {
    if (!isRecord(item)) {
      return null;
    }

    const idText = String(item.id ?? "").trim();
    const id = idText || `banner-${index + 1}`;
    const title = String(item.title ?? "").trim();
    if (!title) {
      return null;
    }
    const tag = String(item.tag ?? "").trim() || "精选";
    const subTitle = String(item.subTitle ?? "").trim() || "点击查看详情";
    const cta = String(item.cta ?? "").trim() || "立即查看";
    const themeRaw = String(item.theme ?? "common").trim();
    const actionRaw = String(item.action ?? "commonProducts").trim();
    const theme = HOME_BANNER_THEME_SET.has(themeRaw) ? themeRaw : "common";
    const action = HOME_BANNER_ACTION_SET.has(actionRaw) ? actionRaw : "commonProducts";
    const imageUrlText = String(item.imageUrl ?? "").trim();

    return {
      id,
      enabled: item.enabled !== false,
      tag,
      title,
      subTitle,
      cta,
      theme,
      action,
      imageUrl: imageUrlText || null
    };
  }

  private getDefaultMiniHomeBanners(): MiniHomeBanner[] {
    return [
      {
        id: "banner-common",
        enabled: true,
        tag: "常购",
        title: "高频商品一键补货",
        subTitle: "按历史采购快速回填，缩短下单时间",
        cta: "进入常购专区",
        theme: "common",
        action: "commonProducts",
        imageUrl: null
      },
      {
        id: "banner-quote",
        enabled: true,
        tag: "报价",
        title: "无价商品快速申请报价",
        subTitle: "购物车集中询价，避免漏提报价需求",
        cta: "前往报价入口",
        theme: "quote",
        action: "quote",
        imageUrl: null
      },
      {
        id: "banner-statement",
        enabled: true,
        tag: "对账",
        title: "账期与开票集中处理",
        subTitle: "对账确认与开票申请统一到业务中心",
        cta: "查看对账中心",
        theme: "statement",
        action: "statements",
        imageUrl: null
      }
    ];
  }

  private normalizeAdminHomeNoticeForSave(input: unknown): MiniHomeNotice {
    if (!isRecord(input)) {
      throw new AppError(400, "SETTINGS_HOME_NOTICE_INVALID", "HOME_NOTICE 配置不合法");
    }

    const title = String(input.title ?? "").trim();
    const content = String(input.content ?? "").trim();

    if (!title) {
      throw new AppError(400, "SETTINGS_HOME_NOTICE_TITLE_REQUIRED", "店铺通知标题不能为空");
    }
    if (!content) {
      throw new AppError(400, "SETTINGS_HOME_NOTICE_CONTENT_REQUIRED", "店铺通知内容不能为空");
    }
    if (title.length > HOME_NOTICE_MAX_TITLE_LENGTH) {
      throw new AppError(
        400,
        "SETTINGS_HOME_NOTICE_TITLE_TOO_LONG",
        `店铺通知标题最多 ${HOME_NOTICE_MAX_TITLE_LENGTH} 字`
      );
    }
    if (content.length > HOME_NOTICE_MAX_CONTENT_LENGTH) {
      throw new AppError(
        400,
        "SETTINGS_HOME_NOTICE_CONTENT_TOO_LONG",
        `店铺通知内容最多 ${HOME_NOTICE_MAX_CONTENT_LENGTH} 字`
      );
    }

    return {
      title,
      content
    };
  }

  private normalizeAdminHomeLayoutForSave(input: unknown): MiniHomeLayoutSection[] {
    if (!Array.isArray(input)) {
      throw new AppError(400, "SETTINGS_HOME_LAYOUT_INVALID", "HOME_LAYOUT 必须是数组");
    }

    const keySet = new Set<HomeLayoutModuleKey>();
    const normalized = input.map((item, index) =>
      this.normalizeAdminHomeLayoutItem(item, index, keySet)
    );

    for (const fallback of this.getDefaultMiniHomeLayout()) {
      if (!keySet.has(fallback.key)) {
        keySet.add(fallback.key);
        normalized.push(fallback);
      }
    }

    const enabledCount = normalized.filter((item) => item.enabled).length;
    if (enabledCount === 0) {
      throw new AppError(400, "SETTINGS_HOME_LAYOUT_DISABLED", "首页布局至少需要启用 1 个模块");
    }

    return normalized;
  }

  private normalizeAdminHomeLayoutItem(
    item: unknown,
    index: number,
    keySet: Set<HomeLayoutModuleKey>
  ): MiniHomeLayoutSection {
    if (!isRecord(item)) {
      throw new AppError(400, "SETTINGS_HOME_LAYOUT_ITEM_INVALID", `第 ${index + 1} 个布局模块配置不合法`);
    }

    const keyText = String(item.key ?? "").trim() as HomeLayoutModuleKey;
    if (!HOME_LAYOUT_MODULE_KEY_SET.has(keyText)) {
      throw new AppError(400, "SETTINGS_HOME_LAYOUT_KEY_INVALID", `第 ${index + 1} 个布局模块 key 不合法`);
    }
    if (keySet.has(keyText)) {
      throw new AppError(400, "SETTINGS_HOME_LAYOUT_KEY_DUPLICATED", `第 ${index + 1} 个布局模块重复`);
    }
    keySet.add(keyText);

    return {
      key: keyText,
      enabled: item.enabled !== false
    };
  }

  private normalizeAdminHomeBannersForSave(input: unknown): MiniHomeBanner[] {
    if (!Array.isArray(input)) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_INVALID", "HOME_BANNERS 必须是数组");
    }
    if (input.length === 0) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_EMPTY", "请至少配置 1 条首页轮播");
    }
    if (input.length > HOME_BANNER_MAX_COUNT) {
      throw new AppError(
        400,
        "SETTINGS_HOME_BANNERS_TOO_MANY",
        `首页轮播最多支持 ${HOME_BANNER_MAX_COUNT} 条`
      );
    }

    const idSet = new Set<string>();
    const list = input.map((item, index) => this.normalizeAdminHomeBannerItem(item, index, idSet));
    const enabledCount = list.filter((item) => item.enabled).length;
    if (enabledCount === 0) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_DISABLED", "至少启用 1 条首页轮播");
    }
    return list;
  }

  private normalizeAdminBrandCenterItemsForSave(input: unknown): MiniBrandCenterItem[] {
    if (!Array.isArray(input)) {
      throw new AppError(400, "SETTINGS_BRAND_CENTER_ITEMS_INVALID", "BRAND_CENTER_ITEMS 必须是数组");
    }
    if (input.length > BRAND_CENTER_MAX_COUNT) {
      throw new AppError(
        400,
        "SETTINGS_BRAND_CENTER_ITEMS_TOO_MANY",
        `品牌中心最多支持 ${BRAND_CENTER_MAX_COUNT} 个品牌`
      );
    }

    const idSet = new Set<string>();
    return input.map((item, index) => this.normalizeAdminBrandCenterItem(item, index, idSet));
  }

  private normalizeAdminBrandCenterItem(
    item: unknown,
    index: number,
    idSet: Set<string>
  ): MiniBrandCenterItem {
    if (!isRecord(item)) {
      throw new AppError(400, "SETTINGS_BRAND_CENTER_ITEM_INVALID", `第 ${index + 1} 个品牌配置不合法`);
    }

    const id = String(item.id ?? "").trim() || `brand-${index + 1}`;
    if (idSet.has(id)) {
      throw new AppError(400, "SETTINGS_BRAND_CENTER_ID_DUPLICATED", `第 ${index + 1} 个品牌 ID 重复`);
    }
    idSet.add(id);

    const name = String(item.name ?? "").trim();
    if (!name) {
      throw new AppError(400, "SETTINGS_BRAND_CENTER_NAME_REQUIRED", `第 ${index + 1} 个品牌名称不能为空`);
    }
    if (name.length > BRAND_CENTER_MAX_NAME_LENGTH) {
      throw new AppError(
        400,
        "SETTINGS_BRAND_CENTER_NAME_TOO_LONG",
        `第 ${index + 1} 个品牌名称最多 ${BRAND_CENTER_MAX_NAME_LENGTH} 字`
      );
    }

    const logoUrlText = String(item.logoUrl ?? "").trim();
    if (logoUrlText) {
      let parsed: URL;
      try {
        parsed = new URL(logoUrlText);
      } catch (error) {
        throw new AppError(400, "SETTINGS_BRAND_CENTER_LOGO_URL_INVALID", `第 ${index + 1} 个品牌图标地址无效`);
      }
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new AppError(
          400,
          "SETTINGS_BRAND_CENTER_LOGO_URL_PROTOCOL_INVALID",
          `第 ${index + 1} 个品牌图标地址仅支持 http/https`
        );
      }
    }

    return {
      id,
      enabled: item.enabled !== false,
      name,
      logoUrl: logoUrlText || null
    };
  }

  private normalizeAdminHomeBannerItem(
    item: unknown,
    index: number,
    idSet: Set<string>
  ): MiniHomeBanner {
    if (!isRecord(item)) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_ITEM_INVALID", `第 ${index + 1} 条轮播配置不合法`);
    }

    const id = String(item.id ?? "").trim() || `banner-${index + 1}`;
    if (idSet.has(id)) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_ID_DUPLICATED", `第 ${index + 1} 条轮播 ID 重复`);
    }
    idSet.add(id);

    const title = String(item.title ?? "").trim();
    const tag = String(item.tag ?? "精选").trim() || "精选";
    const subTitle = String(item.subTitle ?? "点击查看详情").trim() || "点击查看详情";
    const cta = String(item.cta ?? "立即查看").trim() || "立即查看";
    const themeRaw = String(item.theme ?? "common").trim();
    const actionRaw = String(item.action ?? "commonProducts").trim();
    const imageUrlText = String(item.imageUrl ?? "").trim();

    if (!title) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_TITLE_REQUIRED", `第 ${index + 1} 条轮播主标题不能为空`);
    }
    if (title.length > HOME_BANNER_MAX_TITLE_LENGTH) {
      throw new AppError(
        400,
        "SETTINGS_HOME_BANNERS_TITLE_TOO_LONG",
        `第 ${index + 1} 条轮播主标题最多 ${HOME_BANNER_MAX_TITLE_LENGTH} 字`
      );
    }
    if (tag.length > HOME_BANNER_MAX_TAG_LENGTH) {
      throw new AppError(
        400,
        "SETTINGS_HOME_BANNERS_TAG_TOO_LONG",
        `第 ${index + 1} 条轮播标签最多 ${HOME_BANNER_MAX_TAG_LENGTH} 字`
      );
    }
    if (subTitle.length > HOME_BANNER_MAX_SUB_TITLE_LENGTH) {
      throw new AppError(
        400,
        "SETTINGS_HOME_BANNERS_SUBTITLE_TOO_LONG",
        `第 ${index + 1} 条轮播副标题最多 ${HOME_BANNER_MAX_SUB_TITLE_LENGTH} 字`
      );
    }
    if (cta.length > HOME_BANNER_MAX_CTA_LENGTH) {
      throw new AppError(
        400,
        "SETTINGS_HOME_BANNERS_CTA_TOO_LONG",
        `第 ${index + 1} 条轮播按钮文案最多 ${HOME_BANNER_MAX_CTA_LENGTH} 字`
      );
    }

    if (!HOME_BANNER_THEME_SET.has(themeRaw)) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_THEME_INVALID", `第 ${index + 1} 条轮播主题不合法`);
    }
    if (!HOME_BANNER_ACTION_SET.has(actionRaw)) {
      throw new AppError(400, "SETTINGS_HOME_BANNERS_ACTION_INVALID", `第 ${index + 1} 条轮播跳转动作不合法`);
    }

    if (imageUrlText) {
      let parsed: URL;
      try {
        parsed = new URL(imageUrlText);
      } catch (error) {
        throw new AppError(400, "SETTINGS_HOME_BANNERS_IMAGE_URL_INVALID", `第 ${index + 1} 条图片地址无效`);
      }
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new AppError(
          400,
          "SETTINGS_HOME_BANNERS_IMAGE_URL_PROTOCOL_INVALID",
          `第 ${index + 1} 条图片地址仅支持 http/https`
        );
      }
    }

    return {
      id,
      enabled: item.enabled !== false,
      tag,
      title,
      subTitle,
      cta,
      theme: themeRaw,
      action: actionRaw,
      imageUrl: imageUrlText || null
    };
  }

  private serializeRegistrationApplication(
    item: {
      id: string;
      customerId: string;
      payloadJson: string;
      status: string;
      createdAt: Date;
      reviewedAt: Date | null;
      reviewRemark: string | null;
      customer?: {
        id: string;
        name: string;
      };
    },
    withCustomer = false
  ) {
    return {
      id: item.id,
      customerId: item.customerId,
      payload: safeParseJson(item.payloadJson),
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      reviewedAt: item.reviewedAt ? item.reviewedAt.toISOString() : null,
      reviewRemark: item.reviewRemark,
      customer:
        withCustomer && item.customer
          ? {
              id: item.customer.id,
              name: item.customer.name
            }
          : undefined
    };
  }

  private serializeMiniCustomerProfile(customer: MiniAuthCustomer) {
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      status: customer.status,
      companyName: customer.companyName,
      contactName: customer.contactName,
      contactPhone: customer.contactPhone,
      kingdeeCustomerId: customer.kingdeeCustomerId,
      isKingdeeBound: Boolean(customer.kingdeeCustomerId?.trim())
    };
  }

  private getCustomerCapabilities(customer: MiniAuthCustomer) {
    const restricted = customer.status === STATUS_PENDING || customer.status === STATUS_REJECTED;
    return {
      canViewProducts: true,
      canSubmitQuote: true,
      canManageCart: !restricted,
      canCreateOrder: !restricted,
      canViewStatements: !restricted,
      canUseInvoiceCenter: !restricted
    };
  }

  private assertCustomerCapability(
    customer: MiniAuthCustomer,
    capability:
      | "VIEW_PRODUCTS"
      | "SUBMIT_QUOTE"
      | "VIEW_PROFILE"
      | "MANAGE_CART"
      | "CREATE_ORDER"
      | "VIEW_ORDERS"
      | "STATEMENT"
      | "INVOICE"
  ) {
    if (
      (customer.status === STATUS_PENDING || customer.status === STATUS_REJECTED) &&
      !["VIEW_PRODUCTS", "SUBMIT_QUOTE", "VIEW_PROFILE"].includes(capability)
    ) {
      throw new AppError(403, "MINI_FORBIDDEN_BY_STATUS", "当前账号状态不支持该操作");
    }
    if (capability === "CREATE_ORDER" && !customer.kingdeeCustomerId?.trim()) {
      throw new AppError(409, "CUSTOMER_KINGDEE_UNBOUND", "当前账号未绑定金蝶客户，请联系管理员");
    }
  }

  private async tryWritebackInvoiceRequest(
    invoiceRequestId: string,
    customer: MiniAuthCustomer,
    orderIds: string[],
    invoiceProfileId: string | null
  ) {
    const endpoint =
      endpointCatalog.findByContains("手工开票保存") ??
      endpointCatalog.findByContains("开票") ??
      endpointCatalog.findByContains("发票") ??
      endpointCatalog.findByContains("申请");
    if (!endpoint || endpoint.method !== "POST") {
      return;
    }

    const profile = invoiceProfileId ? await coreRepo.findInvoiceProfileById(customer.id, invoiceProfileId) : null;
    const body = {
      customer_id: customer.kingdeeCustomerId,
      source: "miniapp-invoice-request",
      request_id: invoiceRequestId,
      order_ids: orderIds,
      title: profile?.title || null,
      tax_no: profile?.taxNo || null,
      bank_name: profile?.bankName || null,
      bank_account: profile?.bankAccount || null,
      address_phone: profile?.addressPhone || null,
      email: profile?.email || null
    };
    try {
      const payload = await kingdeeClient.request({
        method: "POST",
        path: endpoint.path,
        body
      });
      const refId = pickWritebackId(payload) ?? pickWritebackNumber(payload) ?? null;
      if (refId) {
        await coreRepo.updateInvoiceRequest({
          id: invoiceRequestId,
          status: "SUBMITTED",
          kingdeeRefId: refId
        });
      }
    } catch (error) {
      coreLogger.warn({ err: error, invoiceRequestId }, "Invoice request writeback failed, keep pending");
    }
  }

  async createOrderAndWritebackKingdee(order: {
    id: string;
    orderNo: string;
    customerId: string;
    remark?: string | null;
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
      remark: order.remark?.trim() || "来自小程序商城下单"
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
      responsePayload = await kingdeeClient.request({
        method: endpoint.method as "POST",
        path: endpoint.path,
        body: requestBody
      });

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
      status: customer.status,
      companyName: customer.companyName,
      contactName: customer.contactName,
      contactPhone: customer.contactPhone,
      wechatOpenid: customer.wechatOpenid,
      kingdeeCustomerId: customer.kingdeeCustomerId,
      accessToken: customer.accessToken ?? token,
      tokenExpiresAt: customer.tokenExpiresAt
    };
  }

  private serializeCustomer(customer: {
    id: string;
    name: string;
    phone: string | null;
    status?: string;
    companyName?: string | null;
    contactName?: string | null;
    contactPhone?: string | null;
    wechatOpenid?: string | null;
    kingdeeCustomerId: string | null;
    tokenExpiresAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      status: customer.status ?? STATUS_ACTIVE,
      companyName: customer.companyName ?? null,
      contactName: customer.contactName ?? null,
      contactPhone: customer.contactPhone ?? null,
      wechatOpenid: customer.wechatOpenid ?? null,
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

function extractTotalCount(payload: unknown, page: number, pageSize: number, currentRows: number): number {
  if (isRecord(payload) && isRecord(payload.data)) {
    const data = payload.data;
    const candidates = [data.count, data.total, data.total_count, data.totalCount, data.row_count];
    for (const candidate of candidates) {
      const value = Number(candidate);
      if (Number.isFinite(value) && value >= 0) {
        return Math.floor(value);
      }
    }
  }

  if (currentRows < pageSize) {
    return Math.max(0, (page - 1) * pageSize + currentRows);
  }
  return page * pageSize + 1;
}

function normalizeEnableValue(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
    if (value === -1) {
      return null;
    }
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "enable", "enabled", "active", "normal", "正常", "可用", "启用"].includes(normalized)) {
      return true;
    }
    if (
      ["0", "false", "disable", "disabled", "inactive", "forbid", "禁用", "停用", "已停用"].includes(
        normalized
      )
    ) {
      return false;
    }
    if (["-1", "all", "全部"].includes(normalized)) {
      return null;
    }
  }
  return null;
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

function extractInventoryQty(payload: unknown): number {
  if (!isRecord(payload)) {
    return extractAmount(payload);
  }
  const qtyKeys = ["qty", "stock_qty", "im_qty", "available_qty", "quantity", "current_qty"];
  for (const key of qtyKeys) {
    const value = extractAmount(payload[key]);
    if (value !== 0) {
      return value;
    }
  }
  return extractAmount(payload);
}

function pickPriceValue(payload: unknown): number | null {
  const keys = ["price", "unit_price", "material_price", "sale_price", "tax_price", "final_price"];
  const picked = findNumberByKeys(payload, keys);
  if (picked === null || !Number.isFinite(picked)) {
    return null;
  }
  return Number(picked);
}

function findNumberByKeys(payload: unknown, keys: string[]): number | null {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return payload;
  }
  if (typeof payload === "string") {
    const num = Number(payload);
    return Number.isFinite(num) ? num : null;
  }
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const value = findNumberByKeys(item, keys);
      if (value !== null) {
        return value;
      }
    }
    return null;
  }
  if (!isRecord(payload)) {
    return null;
  }

  for (const key of keys) {
    const value = findNumberByKeys(payload[key], keys);
    if (value !== null) {
      return value;
    }
  }

  if (isRecord(payload.data)) {
    const value = findNumberByKeys(payload.data, keys);
    if (value !== null) {
      return value;
    }
  }

  if (Array.isArray(payload.data)) {
    const value = findNumberByKeys(payload.data, keys);
    if (value !== null) {
      return value;
    }
  }

  return null;
}

function isSamePrice(a: number, b: number): boolean {
  return Math.abs(Number(a) - Number(b)) < 0.0001;
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

export const coreService = new CoreService();
