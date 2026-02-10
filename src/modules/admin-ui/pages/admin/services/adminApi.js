const ADMIN_TOKEN_STORAGE_KEY = "miniapp_admin_token";
const API_BASE_URL = "/api";

const WEBHOOK_KEYS = [
  "ORDER_WEBHOOK",
  "LOGISTICS_WEBHOOK",
  "FINANCE_WEBHOOK",
  "QUOTE_WEBHOOK",
  "REGISTRATION_WEBHOOK"
];

const apiHooks = {
  onUnauthorized: null
};

function toApiError(message, extra = {}) {
  const error = new Error(message || "请求失败");
  Object.assign(error, extra);
  return error;
}

function toastError(content) {
  const text = String(content || "请求失败");
  if (window?.antd?.message?.error) {
    window.antd.message.error(text);
  }
}

function formatErrorWithRequestId(message, requestId) {
  const text = String(message || "请求失败");
  if (!requestId) {
    return text;
  }
  return `${text} (请求编号: ${requestId})`;
}

function buildApiUrl(path, query) {
  const normalizedPath = String(path || "").startsWith("/") ? String(path || "") : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`, window.location.origin);
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }
  return `${url.pathname}${url.search}`;
}

async function request(path, options = {}) {
  const token = options.token ?? getAdminToken();
  if (!token) {
    const error = toApiError("请先输入后台登录口令", {
      code: "ADMIN_TOKEN_REQUIRED",
      statusCode: 401
    });
    if (!options.silentError) {
      toastError(error.message);
    }
    throw error;
  }

  let response;
  try {
    response = await fetch(buildApiUrl(path, options.query), {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers && typeof options.headers === "object" ? options.headers : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch (error) {
    const apiError = toApiError(error?.message || "网络异常", {
      networkError: true,
      originalError: error
    });
    if (!options.silentError) {
      toastError(apiError.message);
    }
    throw apiError;
  }

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || payload.ok === false) {
    const apiError = toApiError(payload.message || `请求失败(${response.status})`, {
      statusCode: response.status,
      code: payload.code || "",
      requestId: payload.requestId || "",
      details: payload.details ?? null
    });

    if (response.status === 401) {
      clearAdminToken();
      if (!options.silentUnauthorized) {
        toastError("登录口令无效或已过期，请重新登录");
      }
      if (typeof apiHooks.onUnauthorized === "function") {
        apiHooks.onUnauthorized(apiError);
      }
    } else if (!options.silentError) {
      toastError(formatErrorWithRequestId(apiError.message, apiError.requestId));
    }

    throw apiError;
  }

  return payload;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mapAppFromRemote(item) {
  return {
    id: item.id,
    customerId: item.customerId,
    status: item.status,
    createdAt: item.createdAt,
    reviewedAt: item.reviewedAt,
    reviewRemark: item.reviewRemark,
    payload: item.payload || {},
    customer: item.customer || null
  };
}

function mapCustomerFromRemote(item) {
  return {
    id: item.id,
    name: item.name,
    phone: item.phone,
    status: item.status,
    companyName: item.companyName,
    contactName: item.contactName,
    contactPhone: item.contactPhone,
    kingdeeCustomerId: item.kingdeeCustomerId,
    wechatOpenid: item.wechatOpenid,
    accessTokenMasked: item.accessTokenMasked || "",
    tokenExpiresAt: item.tokenExpiresAt || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

function mapProductFromRemote(item) {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    description: item.description || "",
    coverImageUrl: item.coverImageUrl || "",
    status: item.status,
    defaultUnitId: item.defaultUnitId || "",
    kingdeeMaterialId: item.kingdeeMaterialId || "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    skus: Array.isArray(item.skus)
      ? item.skus.map((sku) => ({
          id: sku.id,
          productId: sku.productId,
          skuCode: sku.skuCode,
          skuName: sku.skuName,
          specs: sku.specs || {},
          price: sku.price,
          stock: sku.stock,
          status: sku.status,
          unitId: sku.unitId || "",
          kingdeeMaterialId: sku.kingdeeMaterialId || "",
          createdAt: sku.createdAt,
          updatedAt: sku.updatedAt
        }))
      : []
  };
}

function mapOrderSummaryFromRemote(item) {
  return {
    id: item.id,
    orderNo: item.orderNo,
    status: item.status,
    settlementMode: item.settlementMode,
    currency: item.currency,
    totalAmount: item.totalAmount,
    kingdeeOrderNumber: item.kingdeeOrderNumber,
    writebackError: item.writebackError,
    createdAt: item.createdAt,
    canceledAt: item.canceledAt,
    lineCount: item.lineCount,
    deliveryCount: item.deliveryCount,
    customer: item.customer || null,
    latestWriteback: item.latestWriteback || null
  };
}

function mapOrderDetailFromRemote(item) {
  return {
    ...mapOrderSummaryFromRemote(item),
    remark: item.remark || "",
    deliveryInfo: item.deliveryInfo || null,
    idempotencyKey: item.idempotencyKey || null,
    kingdeeOrderId: item.kingdeeOrderId || null,
    updatedAt: item.updatedAt,
    lines: Array.isArray(item.lines) ? item.lines : [],
    deliveries: Array.isArray(item.deliveries) ? item.deliveries : [],
    writebackLogs: Array.isArray(item.writebackLogs) ? item.writebackLogs : []
  };
}

function normalizeSettings(data) {
  const result = {
    ORDER_WEBHOOK: "",
    LOGISTICS_WEBHOOK: "",
    FINANCE_WEBHOOK: "",
    QUOTE_WEBHOOK: "",
    REGISTRATION_WEBHOOK: "",
    PICKUP_ADDRESS: "",
    EXCLUDED_WAREHOUSE_CODES: [],
    HOME_BANNERS: [],
    HOME_NOTICE: {
      title: "店铺通知",
      content: "当日 17:30 前下单次日达，17:30 后下单顺延一天。"
    },
    HOME_LAYOUT: [
      { key: "banners", enabled: true },
      { key: "categories", enabled: true },
      { key: "brandCenter", enabled: true },
      { key: "notice", enabled: true },
      { key: "featured", enabled: true },
      { key: "hot", enabled: true }
    ],
    PRICING_CONTEXT: {
      billTypeId: "",
      currencyId: "",
      exchangeRate: "1",
      currency: "CNY"
    },
    ...(data || {})
  };

  if (!Array.isArray(result.EXCLUDED_WAREHOUSE_CODES)) {
    if (typeof result.EXCLUDED_WAREHOUSE_CODES === "string") {
      result.EXCLUDED_WAREHOUSE_CODES = result.EXCLUDED_WAREHOUSE_CODES
        .split(/[\n,]/g)
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      result.EXCLUDED_WAREHOUSE_CODES = [];
    }
  }

  if (!result.PRICING_CONTEXT || typeof result.PRICING_CONTEXT !== "object") {
    result.PRICING_CONTEXT = {
      billTypeId: "",
      currencyId: "",
      exchangeRate: "1",
      currency: "CNY"
    };
  }

  if (!Array.isArray(result.HOME_BANNERS)) {
    result.HOME_BANNERS = [];
  }
  if (typeof result.BRAND_CENTER_ITEMS !== "undefined" && !Array.isArray(result.BRAND_CENTER_ITEMS)) {
    result.BRAND_CENTER_ITEMS = [];
  }
  if (!result.HOME_NOTICE || typeof result.HOME_NOTICE !== "object") {
    result.HOME_NOTICE = {
      title: "店铺通知",
      content: "当日 17:30 前下单次日达，17:30 后下单顺延一天。"
    };
  }
  if (!Array.isArray(result.HOME_LAYOUT)) {
    result.HOME_LAYOUT = [
      { key: "banners", enabled: true },
      { key: "categories", enabled: true },
      { key: "brandCenter", enabled: true },
      { key: "notice", enabled: true },
      { key: "featured", enabled: true },
      { key: "hot", enabled: true }
    ];
  }

  return result;
}

export function setAdminApiHooks(nextHooks = {}) {
  apiHooks.onUnauthorized =
    typeof nextHooks.onUnauthorized === "function" ? nextHooks.onUnauthorized : null;
}

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
}

export function setAdminToken(token) {
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function maskSecret(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    return "";
  }
  if (text.length <= 8) {
    return `${text[0]}***${text[text.length - 1] || ""}`;
  }
  return `${text.slice(0, 4)}***${text.slice(-4)}`;
}

export async function verifyAdminToken(token) {
  await request("/admin/settings", {
    token,
    silentError: true,
    silentUnauthorized: true
  });
  return {
    ok: true,
    mode: "remote"
  };
}

export async function listApplications() {
  const payload = await request("/admin/registration-applications");
  return (payload.data || []).map(mapAppFromRemote);
}

export async function reviewApplication(applicationId, payload) {
  const res = await request(`/admin/registration-applications/${encodeURIComponent(applicationId)}/review`, {
    method: "POST",
    body: payload
  });
  return res.data;
}

export async function listCustomers() {
  const payload = await request("/admin/customers");
  return (payload.data || []).map(mapCustomerFromRemote);
}

export async function bindCustomer(customerId, kingdeeCustomerId) {
  const payload = await request(`/admin/customers/${encodeURIComponent(customerId)}/bind`, {
    method: "POST",
    body: { kingdeeCustomerId }
  });
  return mapCustomerFromRemote(payload.data || {});
}

export async function updateCustomerStatus(customerId, status, remark) {
  const payload = await request(`/admin/customers/${encodeURIComponent(customerId)}/status`, {
    method: "POST",
    body: {
      status,
      remark: remark || undefined
    }
  });
  return payload.data;
}

export async function issueCustomerToken(payload) {
  const res = await request("/admin/customers/token/issue", {
    method: "POST",
    body: payload
  });
  return res.data;
}

export async function listAdminOrders(query = {}) {
  const payload = await request("/admin/orders", { query });
  const data = payload.data || { items: [], total: 0, page: 1, pageSize: 20 };
  return {
    ...data,
    items: Array.isArray(data.items) ? data.items.map(mapOrderSummaryFromRemote) : []
  };
}

export async function getAdminOrderDetail(orderId) {
  const payload = await request(`/admin/orders/${encodeURIComponent(orderId)}`);
  return mapOrderDetailFromRemote(payload.data || {});
}

export async function retryAdminOrderWriteback(orderId) {
  const payload = await request(`/admin/orders/${encodeURIComponent(orderId)}/retry-writeback`, {
    method: "POST"
  });
  return payload.data;
}

export async function cancelAdminOrder(orderId, remark) {
  const payload = await request(`/admin/orders/${encodeURIComponent(orderId)}/cancel`, {
    method: "POST",
    body: {
      remark: remark || undefined
    }
  });
  return mapOrderDetailFromRemote(payload.data || {});
}

export async function listAdminProducts(status = "") {
  const payload = await request("/admin/products", {
    query: {
      status: status || undefined
    }
  });
  return (payload.data || []).map(mapProductFromRemote);
}

export async function listAdminKingdeeMaterials(query = {}) {
  const payload = await request("/admin/products/kingdee/list", {
    query: {
      page: query.page || undefined,
      pageSize: query.pageSize || undefined,
      search: query.search || undefined
    }
  });
  return payload.data || { items: [], total: 0, page: 1, pageSize: 10 };
}

export async function oneClickListKingdeeProducts(payload) {
  const response = await request("/admin/products/kingdee/one-click-listing", {
    method: "POST",
    body: payload
  });
  return response.data || {};
}

export async function upsertAdminProduct(payload) {
  const response = await request("/admin/products/upsert", {
    method: "POST",
    body: payload
  });
  return mapProductFromRemote(response.data || {});
}

export async function uploadAdminImage(payload) {
  const response = await request("/admin/uploads/image", {
    method: "POST",
    body: {
      dataUrl: payload.dataUrl,
      filename: payload.filename,
      folder: payload.folder
    }
  });
  return response.data || {};
}

export async function upsertAdminProductSku(productId, payload) {
  const response = await request(`/admin/products/${encodeURIComponent(productId)}/sku/upsert`, {
    method: "POST",
    body: payload
  });
  return response.data;
}

export async function runAdminSyncJob(payload) {
  const response = await request("/admin/sync/run", {
    method: "POST",
    body: payload
  });
  return response.data;
}

export async function listAdminSyncStatus(jobName = "") {
  const payload = await request("/admin/sync/status", {
    query: {
      jobName: jobName || undefined
    }
  });
  return {
    items: payload.data || [],
    warnings: payload.warnings || []
  };
}

export async function getSettings() {
  const payload = await request("/admin/settings");
  return normalizeSettings(payload.data);
}

export async function saveSettings(payload) {
  try {
    const response = await request("/admin/settings", {
      method: "POST",
      body: payload
    });
    return normalizeSettings(response.data);
  } catch (error) {
    if (error?.statusCode !== 404 && error?.statusCode !== 405) {
      throw error;
    }
    const response = await request("/admin/settings", {
      method: "PUT",
      body: payload
    });
    return normalizeSettings(response.data);
  }
}

export async function testWebhook(payload) {
  try {
    const response = await request("/admin/settings/test-webhook", {
      method: "POST",
      query: {
        type: payload.type || undefined
      },
      body: {
        key: payload.key,
        webhookUrl: payload.webhookUrl,
        title: payload.title,
        lines: payload.lines
      }
    });
    return response.data;
  } catch (error) {
    if (error?.statusCode !== 404 && error?.statusCode !== 405) {
      throw error;
    }
    const response = await request("/admin/settings/webhook/test", {
      method: "POST",
      body: {
        key: payload.key,
        webhookUrl: payload.webhookUrl,
        title: payload.title,
        lines: payload.lines
      }
    });
    return response.data;
  }
}

export async function runAdminKingdeeDiagnostics() {
  const payload = await request("/admin/diagnostics/kingdee");
  return (
    payload.data || {
      checkedAt: new Date().toISOString(),
      summary: { pass: 0, warn: 0, fail: 0, total: 0 },
      items: []
    }
  );
}

export async function retryAdminOrderWritebackByOrderNo(orderNo) {
  const payload = await request("/admin/diagnostics/orders/retry-writeback", {
    method: "POST",
    body: {
      orderNo
    }
  });
  return payload.data;
}

export function getWebhookKeys() {
  return clone(WEBHOOK_KEYS);
}

export async function copyText(text) {
  const value = String(text || "");
  if (!value) {
    throw new Error("复制内容为空");
  }
  await navigator.clipboard.writeText(value);
}
