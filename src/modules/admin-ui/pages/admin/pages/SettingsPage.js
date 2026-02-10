import { antd, html, useEffect, useMemo, useState } from "../utils/runtime.js";
import {
  getSettings,
  saveSettings,
  testWebhook,
  uploadAdminImage
} from "../services/adminApi.js";
import { PageGuard } from "../components/PageGuard.js";
import { SettingsForm } from "../components/SettingsForm.js";

const { Alert, Card, Empty, Skeleton, message } = antd;

const WEBHOOK_LABELS = {
  ORDER_WEBHOOK: "订单通知",
  LOGISTICS_WEBHOOK: "物流通知",
  FINANCE_WEBHOOK: "财务通知",
  QUOTE_WEBHOOK: "报价通知",
  REGISTRATION_WEBHOOK: "入驻审核通知"
};

const HOME_BANNER_MAX_COUNT = 8;
const HOME_BANNER_IMAGE_MAX_SIZE_BYTES = 3 * 1024 * 1024;
const HOME_BANNER_ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif"
]);
const HOME_BANNER_THEMES = new Set(["common", "quote", "statement", "primary"]);
const HOME_BANNER_ACTIONS = new Set([
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

const HOME_LAYOUT_MODULE_OPTIONS = [
  { key: "banners", label: "首页轮播" },
  { key: "categories", label: "快捷分类" },
  { key: "brandCenter", label: "品牌中心" },
  { key: "notice", label: "店铺通知" },
  { key: "featured", label: "精选榜单" },
  { key: "hot", label: "热销商品" }
];

const HOME_LAYOUT_KEY_SET = new Set(HOME_LAYOUT_MODULE_OPTIONS.map((item) => item.key));

const DEFAULT_HOME_BANNERS = [
  {
    id: "banner-common",
    enabled: true,
    tag: "常购",
    title: "高频商品一键补货",
    subTitle: "按历史采购快速回填，缩短下单时间",
    cta: "进入常购专区",
    theme: "common",
    action: "commonProducts",
    imageUrl: ""
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
    imageUrl: ""
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
    imageUrl: ""
  }
];

const DEFAULT_HOME_NOTICE = {
  title: "店铺通知",
  content: "当日 17:30 前下单次日达，17:30 后下单顺延一天。"
};

const DEFAULT_BRAND_CENTER_ITEMS = [
  {
    id: "brand-1",
    enabled: true,
    name: "品牌A",
    logoUrl: ""
  },
  {
    id: "brand-2",
    enabled: true,
    name: "品牌B",
    logoUrl: ""
  },
  {
    id: "brand-3",
    enabled: true,
    name: "品牌C",
    logoUrl: ""
  },
  {
    id: "brand-4",
    enabled: true,
    name: "品牌D",
    logoUrl: ""
  }
];

function createBannerId() {
  return `banner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createBrandId() {
  return `brand-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneDefaultHomeBanners() {
  return DEFAULT_HOME_BANNERS.map((item, index) => ({
    ...item,
    id: item.id || `banner-default-${index + 1}`
  }));
}

function cloneDefaultBrandCenterItems() {
  return DEFAULT_BRAND_CENTER_ITEMS.map((item, index) => ({
    ...item,
    id: item.id || `brand-default-${index + 1}`
  }));
}

function cloneDefaultHomeNotice() {
  return {
    title: DEFAULT_HOME_NOTICE.title,
    content: DEFAULT_HOME_NOTICE.content
  };
}

function cloneDefaultHomeLayout() {
  return HOME_LAYOUT_MODULE_OPTIONS.map((item) => ({
    key: item.key,
    enabled: true
  }));
}

function normalizeHomeBanners(raw) {
  const source = Array.isArray(raw) ? raw : [];
  const normalized = source
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const title = String(item.title || "").trim();
      if (!title) {
        return null;
      }
      const themeText = String(item.theme || "common").trim();
      const actionText = String(item.action || "commonProducts").trim();
      return {
        id: String(item.id || "").trim() || `banner-${index + 1}`,
        enabled: item.enabled !== false,
        tag: String(item.tag || "精选").trim() || "精选",
        title: title.slice(0, HOME_BANNER_MAX_TITLE_LENGTH),
        subTitle: (String(item.subTitle || "点击查看详情").trim() || "点击查看详情").slice(
          0,
          HOME_BANNER_MAX_SUB_TITLE_LENGTH
        ),
        cta: (String(item.cta || "立即查看").trim() || "立即查看").slice(0, HOME_BANNER_MAX_CTA_LENGTH),
        theme: HOME_BANNER_THEMES.has(themeText) ? themeText : "common",
        action: HOME_BANNER_ACTIONS.has(actionText) ? actionText : "commonProducts",
        imageUrl: String(item.imageUrl || "").trim()
      };
    })
    .filter(Boolean)
    .slice(0, HOME_BANNER_MAX_COUNT);

  if (normalized.length > 0) {
    return normalized;
  }
  return cloneDefaultHomeBanners();
}

function validateHomeBanners(list) {
  const source = Array.isArray(list) ? list : [];
  if (source.length === 0) {
    return "请至少配置 1 条轮播";
  }
  if (source.length > HOME_BANNER_MAX_COUNT) {
    return `最多支持 ${HOME_BANNER_MAX_COUNT} 条轮播`;
  }
  const enabledList = source.filter((item) => item && item.enabled !== false);
  if (enabledList.length === 0) {
    return "首页轮播至少需要启用 1 条";
  }
  const idSet = new Set();
  for (let index = 0; index < source.length; index += 1) {
    const item = source[index] || {};
    const lineNo = index + 1;
    const id = String(item.id || "").trim();
    const title = String(item.title || "").trim();
    const tag = String(item.tag || "").trim();
    const cta = String(item.cta || "").trim();
    const subTitle = String(item.subTitle || "").trim();
    const theme = String(item.theme || "").trim();
    const action = String(item.action || "").trim();
    const imageUrl = String(item.imageUrl || "").trim();

    if (!id) {
      return `第 ${lineNo} 条轮播缺少唯一标识`;
    }
    if (idSet.has(id)) {
      return `第 ${lineNo} 条轮播标识重复：${id}`;
    }
    idSet.add(id);

    if (!title) {
      return `第 ${lineNo} 条轮播缺少主标题`;
    }
    if (title.length > HOME_BANNER_MAX_TITLE_LENGTH) {
      return `第 ${lineNo} 条主标题超过 ${HOME_BANNER_MAX_TITLE_LENGTH} 字`;
    }
    if (!tag) {
      return `第 ${lineNo} 条轮播缺少标签`;
    }
    if (tag.length > HOME_BANNER_MAX_TAG_LENGTH) {
      return `第 ${lineNo} 条标签超过 ${HOME_BANNER_MAX_TAG_LENGTH} 字`;
    }
    if (cta.length > HOME_BANNER_MAX_CTA_LENGTH) {
      return `第 ${lineNo} 条 CTA 超过 ${HOME_BANNER_MAX_CTA_LENGTH} 字`;
    }
    if (subTitle.length > HOME_BANNER_MAX_SUB_TITLE_LENGTH) {
      return `第 ${lineNo} 条副标题超过 ${HOME_BANNER_MAX_SUB_TITLE_LENGTH} 字`;
    }
    if (!HOME_BANNER_THEMES.has(theme)) {
      return `第 ${lineNo} 条主题不合法`;
    }
    if (!HOME_BANNER_ACTIONS.has(action)) {
      return `第 ${lineNo} 条跳转动作不合法`;
    }
    if (imageUrl) {
      try {
        const parsed = new URL(imageUrl);
        if (!/^https?:$/i.test(parsed.protocol)) {
          return `第 ${lineNo} 条图片地址仅支持 http/https`;
        }
      } catch (error) {
        return `第 ${lineNo} 条图片地址格式不正确`;
      }
    }
  }
  return "";
}

function normalizeBrandCenterItems(raw) {
  const source = Array.isArray(raw) ? raw : [];
  const normalized = source
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const name = String(item.name || "")
        .trim()
        .slice(0, BRAND_CENTER_MAX_NAME_LENGTH);
      if (!name) {
        return null;
      }
      const logoUrl = String(item.logoUrl || "").trim();
      return {
        id: String(item.id || "").trim() || `brand-${index + 1}`,
        enabled: item.enabled !== false,
        name,
        logoUrl
      };
    })
    .filter(Boolean)
    .slice(0, BRAND_CENTER_MAX_COUNT);

  if (Array.isArray(raw)) {
    return normalized;
  }
  return cloneDefaultBrandCenterItems();
}

function validateBrandCenterItems(list) {
  const source = Array.isArray(list) ? list : [];
  if (source.length > BRAND_CENTER_MAX_COUNT) {
    return `品牌中心最多支持 ${BRAND_CENTER_MAX_COUNT} 个品牌`;
  }

  const idSet = new Set();
  for (let index = 0; index < source.length; index += 1) {
    const lineNo = index + 1;
    const item = source[index] || {};
    const id = String(item.id || "").trim();
    const name = String(item.name || "").trim();
    const logoUrl = String(item.logoUrl || "").trim();

    if (!id) {
      return `第 ${lineNo} 个品牌缺少唯一标识`;
    }
    if (idSet.has(id)) {
      return `第 ${lineNo} 个品牌标识重复：${id}`;
    }
    idSet.add(id);

    if (!name) {
      return `第 ${lineNo} 个品牌名称不能为空`;
    }
    if (name.length > BRAND_CENTER_MAX_NAME_LENGTH) {
      return `第 ${lineNo} 个品牌名称超过 ${BRAND_CENTER_MAX_NAME_LENGTH} 字`;
    }
    if (logoUrl) {
      try {
        const parsed = new URL(logoUrl);
        if (!/^https?:$/i.test(parsed.protocol)) {
          return `第 ${lineNo} 个品牌图标地址仅支持 http/https`;
        }
      } catch (error) {
        return `第 ${lineNo} 个品牌图标地址格式不正确`;
      }
    }
  }

  return "";
}

function normalizeHomeNotice(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const title =
    String(source.title || "")
      .trim()
      .slice(0, HOME_NOTICE_MAX_TITLE_LENGTH) || DEFAULT_HOME_NOTICE.title;
  const content =
    String(source.content || "")
      .trim()
      .slice(0, HOME_NOTICE_MAX_CONTENT_LENGTH) || DEFAULT_HOME_NOTICE.content;
  return {
    title,
    content
  };
}

function validateHomeNotice(value) {
  const title = String(value?.title || "").trim();
  const content = String(value?.content || "").trim();
  if (!title) {
    return "店铺通知标题不能为空";
  }
  if (!content) {
    return "店铺通知内容不能为空";
  }
  if (title.length > HOME_NOTICE_MAX_TITLE_LENGTH) {
    return `店铺通知标题最多 ${HOME_NOTICE_MAX_TITLE_LENGTH} 字`;
  }
  if (content.length > HOME_NOTICE_MAX_CONTENT_LENGTH) {
    return `店铺通知内容最多 ${HOME_NOTICE_MAX_CONTENT_LENGTH} 字`;
  }
  return "";
}

function normalizeHomeLayout(raw) {
  const source = Array.isArray(raw) ? raw : [];
  const keySet = new Set();
  const normalized = [];
  source.forEach((item) => {
    if (!item || typeof item !== "object") {
      return;
    }
    const key = String(item.key || "").trim();
    if (!HOME_LAYOUT_KEY_SET.has(key) || keySet.has(key)) {
      return;
    }
    keySet.add(key);
    normalized.push({
      key,
      enabled: item.enabled !== false
    });
  });
  cloneDefaultHomeLayout().forEach((fallback) => {
    if (!keySet.has(fallback.key)) {
      keySet.add(fallback.key);
      normalized.push(fallback);
    }
  });
  return normalized;
}

function validateHomeLayout(list) {
  const source = Array.isArray(list) ? list : [];
  if (source.length === 0) {
    return "首页模块布局不能为空";
  }
  const keySet = new Set();
  let enabledCount = 0;
  for (let index = 0; index < source.length; index += 1) {
    const item = source[index];
    if (!item || typeof item !== "object") {
      return `第 ${index + 1} 个布局模块配置不合法`;
    }
    const key = String(item.key || "").trim();
    if (!HOME_LAYOUT_KEY_SET.has(key)) {
      return `第 ${index + 1} 个布局模块 key 不合法`;
    }
    if (keySet.has(key)) {
      return `第 ${index + 1} 个布局模块重复`;
    }
    keySet.add(key);
    if (item.enabled !== false) {
      enabledCount += 1;
    }
  }
  if (enabledCount === 0) {
    return "首页布局至少启用 1 个模块";
  }
  return "";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("读取图片失败，请重试"));
    reader.readAsDataURL(file);
  });
}

function createEmptyDraft() {
  return {
    webhooks: {
      ORDER_WEBHOOK: "",
      LOGISTICS_WEBHOOK: "",
      FINANCE_WEBHOOK: "",
      QUOTE_WEBHOOK: "",
      REGISTRATION_WEBHOOK: ""
    },
    excludedWarehouseCodes: [],
    pickupAddress: "",
    homeBanners: cloneDefaultHomeBanners(),
    brandCenterItems: cloneDefaultBrandCenterItems(),
    homeNotice: cloneDefaultHomeNotice(),
    homeLayout: cloneDefaultHomeLayout(),
    pricingContext: {
      billTypeId: "",
      currencyId: "",
      exchangeRate: "",
      currency: "CNY"
    }
  };
}

function mapSettingsToDraft(settings) {
  const base = createEmptyDraft();
  const merged = settings || {};
  return {
    webhooks: {
      ...base.webhooks,
      ORDER_WEBHOOK: String(merged.ORDER_WEBHOOK || ""),
      LOGISTICS_WEBHOOK: String(merged.LOGISTICS_WEBHOOK || ""),
      FINANCE_WEBHOOK: String(merged.FINANCE_WEBHOOK || ""),
      QUOTE_WEBHOOK: String(merged.QUOTE_WEBHOOK || ""),
      REGISTRATION_WEBHOOK: String(merged.REGISTRATION_WEBHOOK || "")
    },
    excludedWarehouseCodes: Array.isArray(merged.EXCLUDED_WAREHOUSE_CODES)
      ? merged.EXCLUDED_WAREHOUSE_CODES.map((item) => String(item || "").trim()).filter(Boolean)
      : [],
    pickupAddress: String(merged.PICKUP_ADDRESS || ""),
    homeBanners: normalizeHomeBanners(merged.HOME_BANNERS),
    brandCenterItems: normalizeBrandCenterItems(merged.BRAND_CENTER_ITEMS),
    homeNotice: normalizeHomeNotice(merged.HOME_NOTICE),
    homeLayout: normalizeHomeLayout(merged.HOME_LAYOUT),
    pricingContext: {
      billTypeId: String(merged.PRICING_CONTEXT?.billTypeId || ""),
      currencyId: String(merged.PRICING_CONTEXT?.currencyId || ""),
      exchangeRate: String(merged.PRICING_CONTEXT?.exchangeRate || ""),
      currency: String(merged.PRICING_CONTEXT?.currency || "CNY")
    }
  };
}

function mapDraftToPayload(draft) {
  return {
    ORDER_WEBHOOK: draft.webhooks.ORDER_WEBHOOK.trim(),
    LOGISTICS_WEBHOOK: draft.webhooks.LOGISTICS_WEBHOOK.trim(),
    FINANCE_WEBHOOK: draft.webhooks.FINANCE_WEBHOOK.trim(),
    QUOTE_WEBHOOK: draft.webhooks.QUOTE_WEBHOOK.trim(),
    REGISTRATION_WEBHOOK: draft.webhooks.REGISTRATION_WEBHOOK.trim(),
    EXCLUDED_WAREHOUSE_CODES: draft.excludedWarehouseCodes,
    PICKUP_ADDRESS: draft.pickupAddress.trim(),
    HOME_BANNERS: normalizeHomeBanners(draft.homeBanners).map((item) => ({
      id: item.id,
      enabled: item.enabled !== false,
      tag: String(item.tag || "").trim(),
      title: String(item.title || "").trim(),
      subTitle: String(item.subTitle || "").trim(),
      cta: String(item.cta || "").trim(),
      theme: String(item.theme || "").trim(),
      action: String(item.action || "").trim(),
      imageUrl: String(item.imageUrl || "").trim()
    })),
    BRAND_CENTER_ITEMS: normalizeBrandCenterItems(draft.brandCenterItems).map((item) => ({
      id: item.id,
      enabled: item.enabled !== false,
      name: String(item.name || "").trim(),
      logoUrl: String(item.logoUrl || "").trim()
    })),
    HOME_NOTICE: {
      title: String(draft.homeNotice?.title || "").trim(),
      content: String(draft.homeNotice?.content || "").trim()
    },
    HOME_LAYOUT: normalizeHomeLayout(draft.homeLayout).map((item) => ({
      key: item.key,
      enabled: item.enabled !== false
    })),
    PRICING_CONTEXT: {
      billTypeId: draft.pricingContext.billTypeId.trim(),
      currencyId: draft.pricingContext.currencyId.trim(),
      exchangeRate: draft.pricingContext.exchangeRate.trim(),
      currency: draft.pricingContext.currency || "CNY"
    }
  };
}

function nowText() {
  return new Date().toLocaleTimeString();
}

export function SettingsPage(props) {
  const { loggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [initialDraft, setInitialDraft] = useState(createEmptyDraft());
  const [draft, setDraft] = useState(createEmptyDraft());
  const [testHistory, setTestHistory] = useState({});
  const [testingMap, setTestingMap] = useState({});
  const [bannerUploadingMap, setBannerUploadingMap] = useState({});
  const [brandUploadingMap, setBrandUploadingMap] = useState({});
  const [lastSavedAt, setLastSavedAt] = useState("");

  const refresh = async () => {
    if (!loggedIn) {
      return;
    }
    setLoading(true);
    setError("");
    setErrorDetail("");
    try {
      const settings = await getSettings();
      const normalized = mapSettingsToDraft(settings);
      setInitialDraft(normalized);
      setDraft(normalized);
    } catch (err) {
      setError(err?.message || "加载系统设置失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setInitialDraft(createEmptyDraft());
      setDraft(createEmptyDraft());
      setError("");
      setErrorDetail("");
      return;
    }
    refresh();
  }, [loggedIn]);

  const dirty = useMemo(
    () => JSON.stringify(initialDraft) !== JSON.stringify(draft),
    [initialDraft, draft]
  );

  const onSave = async () => {
    const exchangeRate = Number(draft.pricingContext.exchangeRate);
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      message.error("汇率必须是大于 0 的数字");
      return;
    }
    const homeBannerValidation = validateHomeBanners(draft.homeBanners || []);
    if (homeBannerValidation) {
      message.error(homeBannerValidation);
      return;
    }
    const brandCenterValidation = validateBrandCenterItems(draft.brandCenterItems || []);
    if (brandCenterValidation) {
      message.error(brandCenterValidation);
      return;
    }
    const homeNoticeValidation = validateHomeNotice(draft.homeNotice);
    if (homeNoticeValidation) {
      message.error(homeNoticeValidation);
      return;
    }
    const homeLayoutValidation = validateHomeLayout(draft.homeLayout);
    if (homeLayoutValidation) {
      message.error(homeLayoutValidation);
      return;
    }

    setSaving(true);
    setError("");
    setErrorDetail("");
    try {
      const payload = mapDraftToPayload(draft);
      const saved = await saveSettings(payload);
      const normalized = mapSettingsToDraft(saved);
      setInitialDraft(normalized);
      setDraft(normalized);
      setLastSavedAt(nowText());
      message.success("系统设置已保存");
    } catch (err) {
      setError(err?.message || "保存失败");
      const detailParts = [];
      if (err?.requestId) {
        detailParts.push(`请求编号: ${err.requestId}`);
      }
      if (err?.code) {
        detailParts.push(`错误编码: ${err.code}`);
      }
      if (err?.details) {
        detailParts.push(JSON.stringify(err.details, null, 2));
      }
      setErrorDetail(detailParts.join("\n"));
      message.error("系统设置保存失败");
    } finally {
      setSaving(false);
    }
  };

  const onTestWebhook = async (key) => {
    const webhookUrl = draft.webhooks[key] || "";
    try {
      setTestingMap((prev) => ({ ...prev, [key]: true }));
      const result = await testWebhook({
        key,
        webhookUrl,
        title: "运营后台通知测试",
        lines: [`模块: ${WEBHOOK_LABELS[key] || key}`, `时间: ${new Date().toISOString()}`]
      });
      const time = new Date(result.testedAt || new Date().toISOString()).toLocaleString();
      setTestHistory((prev) => ({
        ...prev,
        [key]: {
          status: "success",
          time,
          message: `已发送至 ${result.webhookUrlMasked || "目标地址"}`
        }
      }));
      message.success(`${WEBHOOK_LABELS[key] || key} 测试发送成功`);
    } catch (err) {
      setTestHistory((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          time: new Date().toLocaleString(),
          message: err?.message || "发送失败"
        }
      }));
      message.error(`${WEBHOOK_LABELS[key] || key} 测试发送失败`);
    } finally {
      setTestingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  const setWebhookValue = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      webhooks: {
        ...prev.webhooks,
        [key]: value
      }
    }));
  };

  const setPricingValue = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      pricingContext: {
        ...prev.pricingContext,
        [field]: value
      }
    }));
  };

  const setHomeBanners = (nextBanners) => {
    setDraft((prev) => ({
      ...prev,
      homeBanners: Array.isArray(nextBanners)
        ? nextBanners.slice(0, HOME_BANNER_MAX_COUNT)
        : prev.homeBanners
    }));
  };

  const setBrandCenterItems = (nextItems) => {
    setDraft((prev) => ({
      ...prev,
      brandCenterItems: Array.isArray(nextItems)
        ? nextItems.slice(0, BRAND_CENTER_MAX_COUNT)
        : prev.brandCenterItems
    }));
  };

  const setHomeNoticeField = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      homeNotice: {
        ...prev.homeNotice,
        [field]: value
      }
    }));
  };

  const setHomeLayout = (nextLayout) => {
    setDraft((prev) => ({
      ...prev,
      homeLayout: normalizeHomeLayout(nextLayout)
    }));
  };

  const onUploadHomeBannerImage = async (index, file) => {
    if (!file) {
      return;
    }
    const type = String(file.type || "").toLowerCase();
    if (!HOME_BANNER_ALLOWED_TYPES.has(type)) {
      message.error("仅支持 PNG/JPG/WEBP/GIF 图片");
      return;
    }
    if (Number(file.size || 0) > HOME_BANNER_IMAGE_MAX_SIZE_BYTES) {
      message.error("图片不能超过 3MB");
      return;
    }

    setBannerUploadingMap((prev) => ({ ...prev, [index]: true }));
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploaded = await uploadAdminImage({
        dataUrl,
        filename: file.name,
        folder: "home-banners"
      });
      const imageUrl = String(uploaded?.url || "").trim();
      if (!imageUrl) {
        throw new Error("上传成功但未返回图片地址");
      }
      setDraft((prev) => {
        const next = Array.isArray(prev.homeBanners) ? [...prev.homeBanners] : [];
        if (!next[index]) {
          return prev;
        }
        next[index] = {
          ...next[index],
          imageUrl
        };
        return {
          ...prev,
          homeBanners: next
        };
      });
      message.success("轮播图上传成功");
    } catch (err) {
      message.error(err?.message || "轮播图上传失败");
    } finally {
      setBannerUploadingMap((prev) => ({ ...prev, [index]: false }));
    }
  };

  const onUploadBrandCenterImage = async (index, file) => {
    if (!file) {
      return;
    }
    const type = String(file.type || "").toLowerCase();
    if (!HOME_BANNER_ALLOWED_TYPES.has(type)) {
      message.error("仅支持 PNG/JPG/WEBP/GIF 图片");
      return;
    }
    if (Number(file.size || 0) > HOME_BANNER_IMAGE_MAX_SIZE_BYTES) {
      message.error("图片不能超过 3MB");
      return;
    }

    setBrandUploadingMap((prev) => ({ ...prev, [index]: true }));
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploaded = await uploadAdminImage({
        dataUrl,
        filename: file.name,
        folder: "brand-center"
      });
      const logoUrl = String(uploaded?.url || "").trim();
      if (!logoUrl) {
        throw new Error("上传成功但未返回图片地址");
      }
      setDraft((prev) => {
        const next = Array.isArray(prev.brandCenterItems) ? [...prev.brandCenterItems] : [];
        if (!next[index]) {
          return prev;
        }
        next[index] = {
          ...next[index],
          logoUrl
        };
        return {
          ...prev,
          brandCenterItems: next
        };
      });
      message.success("品牌图标上传成功");
    } catch (err) {
      message.error(err?.message || "品牌图标上传失败");
    } finally {
      setBrandUploadingMap((prev) => ({ ...prev, [index]: false }));
    }
  };

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">通知与基础设置</div>
        <div className="page-subtitle">配置群通知地址、仓库排除、自提地址、价格参数、首页轮播、店铺通知与首页模块布局</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : loading
          ? html`<${Card}><${Skeleton} active=${true} paragraph=${{ rows: 8 }} /><//>`
          : error && !draft
            ? html`<${Alert} type="error" showIcon message="加载失败" description=${error} />`
            : html`
                <${SettingsForm}
                  loading=${loading}
                  saving=${saving}
                  dirty=${dirty}
                  lastSavedAt=${lastSavedAt}
                  error=${error}
                  errorDetail=${errorDetail}
                  draft=${draft}
                  testHistory=${testHistory}
                  testingMap=${testingMap}
                  onWebhookChange=${setWebhookValue}
                  onTestWebhook=${onTestWebhook}
                  onExcludedCodesChange=${(codes) =>
                    setDraft((prev) => ({ ...prev, excludedWarehouseCodes: codes }))}
                  onPickupAddressChange=${(value) =>
                    setDraft((prev) => ({ ...prev, pickupAddress: value }))}
                  onHomeBannersChange=${setHomeBanners}
                  onUploadHomeBannerImage=${onUploadHomeBannerImage}
                  bannerUploadingMap=${bannerUploadingMap}
                  onCreateBannerId=${createBannerId}
                  onBrandCenterItemsChange=${setBrandCenterItems}
                  onUploadBrandCenterImage=${onUploadBrandCenterImage}
                  brandUploadingMap=${brandUploadingMap}
                  onCreateBrandId=${createBrandId}
                  onHomeNoticeChange=${setHomeNoticeField}
                  onHomeLayoutChange=${setHomeLayout}
                  homeLayoutOptions=${HOME_LAYOUT_MODULE_OPTIONS}
                  onPricingContextChange=${setPricingValue}
                  onSave=${onSave}
                  onReset=${() => setDraft(initialDraft)}
                  onRefresh=${refresh}
                />
              `}
    </div>
  `;
}
