import { antd, html, useState } from "../utils/runtime.js";
import { WebhookGroup } from "./WebhookGroup.js";

const {
  Alert,
  Button,
  Card,
  Input,
  Select,
  Space,
  Switch,
  Tag
} = antd;

const HOME_BANNER_THEME_OPTIONS = [
  { value: "common", label: "常购蓝" },
  { value: "quote", label: "报价蓝" },
  { value: "statement", label: "对账蓝" },
  { value: "primary", label: "主蓝" }
];

const HOME_BANNER_ACTION_OPTIONS = [
  { value: "commonProducts", label: "跳转常购" },
  { value: "products", label: "跳转商品页" },
  { value: "quote", label: "跳转报价入口" },
  { value: "statements", label: "跳转对账中心" },
  { value: "invoiceRequest", label: "跳转开票申请" }
];
const HOME_BANNER_MAX_TITLE_LENGTH = 22;
const HOME_BANNER_MAX_SUB_TITLE_LENGTH = 36;
const HOME_BANNER_MAX_CTA_LENGTH = 10;
const HOME_BANNER_MAX_TAG_LENGTH = 6;
const BRAND_CENTER_MAX_COUNT = 80;
const BRAND_CENTER_MAX_NAME_LENGTH = 16;
const HOME_NOTICE_MAX_TITLE_LENGTH = 12;
const HOME_NOTICE_MAX_CONTENT_LENGTH = 120;

function splitWarehouseCodes(text) {
  return String(text || "")
    .split(/[\n,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function WarehouseTagsInput(props) {
  const { value, onChange } = props;
  const [draft, setDraft] = useState("");

  const appendCodes = (text) => {
    const next = splitWarehouseCodes(text);
    if (next.length === 0) {
      return;
    }
    const merged = Array.from(new Set([...(value || []), ...next]));
    onChange(merged);
  };

  const removeCode = (code) => {
    onChange((value || []).filter((item) => item !== code));
  };

  return html`
    <div className="warehouse-tags-input">
      <div className="tags">
        ${(value || []).length === 0
          ? html`<span className="admin-muted">暂无排除仓库编码</span>`
          : value.map(
              (item) => html`
                <${Tag}
                  key=${item}
                  closable=${true}
                  onClose=${(event) => {
                    event.preventDefault();
                    removeCode(item);
                  }}
                >
                  ${item}
                <//>
              `
            )}
      </div>
      <${Input}
        placeholder="输入仓库编号后回车，或粘贴逗号/换行分隔内容"
        value=${draft}
        onChange=${(event) => setDraft(event.target.value)}
        onPressEnter=${() => {
          appendCodes(draft);
          setDraft("");
        }}
        onBlur=${() => {
          appendCodes(draft);
          setDraft("");
        }}
        onPaste=${(event) => {
          const text = event.clipboardData?.getData("text") || "";
          if (!text) {
            return;
          }
          if (/[\n,]/.test(text)) {
            event.preventDefault();
            appendCodes(text);
          }
        }}
      />
    </div>
  `;
}

function HomeBannersEditor(props) {
  const {
    value,
    onChange,
    onUploadHomeBannerImage,
    bannerUploadingMap,
    onCreateBannerId
  } = props;
  const list = Array.isArray(value) ? value : [];

  const updateItem = (index, patch) => {
    const next = [...list];
    if (!next[index]) {
      return;
    }
    next[index] = {
      ...next[index],
      ...patch
    };
    onChange(next);
  };

  const moveItem = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= list.length) {
      return;
    }
    const next = [...list];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    onChange(next);
  };

  const removeItem = (index) => {
    if (list.length <= 1) {
      return;
    }
    const next = list.filter((_, itemIndex) => itemIndex !== index);
    onChange(next);
  };

  const duplicateItem = (index) => {
    if (!list[index] || list.length >= 8) {
      return;
    }
    const source = list[index];
    const next = [...list];
    next.splice(index + 1, 0, {
      ...source,
      id: typeof onCreateBannerId === "function" ? onCreateBannerId() : `banner-${Date.now()}`
    });
    onChange(next.slice(0, 8));
  };

  const addItem = () => {
    const next = [...list];
    next.push({
      id: typeof onCreateBannerId === "function" ? onCreateBannerId() : `banner-${Date.now()}`,
      enabled: true,
      tag: "精选",
      title: "",
      subTitle: "",
      cta: "立即查看",
      theme: "primary",
      action: "products",
      imageUrl: ""
    });
    onChange(next);
  };

  return html`
    <div className="home-banners-editor">
      <div className="home-banners-toolbar">
        <span className="admin-muted">
          支持最多 8 条，建议启用 3-5 条；图片建议 750×320（或同比例）以保持小程序展示一致
        </span>
        <${Button} type="dashed" onClick=${addItem} disabled=${list.length >= 8}>新增轮播项<//>
      </div>

      ${list.length === 0
        ? html`<div className="admin-muted">暂无轮播项</div>`
        : list.map(
            (item, index) => html`
              <${Card}
                key=${item.id || index}
                size="small"
                className="home-banner-item"
                title=${`轮播 ${index + 1}`}
                extra=${html`
                  <${Space} size=${6}>
                    <${Button}
                      size="small"
                      onClick=${() => moveItem(index, -1)}
                      disabled=${index === 0}
                    >
                      上移
                    <//>
                    <${Button}
                      size="small"
                      onClick=${() => moveItem(index, 1)}
                      disabled=${index === list.length - 1}
                    >
                      下移
                    <//>
                    <${Button}
                      size="small"
                      danger=${true}
                      onClick=${() => removeItem(index)}
                      disabled=${list.length <= 1}
                    >
                      删除
                    <//>
                    <${Button}
                      size="small"
                      onClick=${() => duplicateItem(index)}
                      disabled=${list.length >= 8}
                    >
                      复制
                    <//>
                  <//>
                `}
              >
                <${Space} direction="vertical" style=${{ width: "100%" }} size=${8}>
                  <div className="home-banner-row">
                    <span className="admin-muted">启用</span>
                    <${Switch}
                      checked=${item.enabled !== false}
                      onChange=${(checked) => updateItem(index, { enabled: checked })}
                    />
                  </div>
                  <${Input}
                    value=${item.tag || ""}
                    placeholder="标签（如：常购）"
                    maxLength=${HOME_BANNER_MAX_TAG_LENGTH}
                    onChange=${(event) =>
                      updateItem(index, { tag: String(event.target.value || "").slice(0, HOME_BANNER_MAX_TAG_LENGTH) })}
                  />
                  <span className="admin-muted">
                    标签为必填，最多 ${HOME_BANNER_MAX_TAG_LENGTH} 字
                  </span>
                  <${Input}
                    value=${item.title || ""}
                    placeholder="主标题（必填）"
                    maxLength=${HOME_BANNER_MAX_TITLE_LENGTH}
                    onChange=${(event) =>
                      updateItem(index, { title: String(event.target.value || "").slice(0, HOME_BANNER_MAX_TITLE_LENGTH) })}
                  />
                  <span className="admin-muted">
                    主标题必填，最多 ${HOME_BANNER_MAX_TITLE_LENGTH} 字（当前 ${(item.title || "").length}）
                  </span>
                  <${Input}
                    value=${item.subTitle || ""}
                    placeholder="副标题"
                    maxLength=${HOME_BANNER_MAX_SUB_TITLE_LENGTH}
                    onChange=${(event) =>
                      updateItem(index, {
                        subTitle: String(event.target.value || "").slice(0, HOME_BANNER_MAX_SUB_TITLE_LENGTH)
                      })}
                  />
                  <span className="admin-muted">
                    副标题最多 ${HOME_BANNER_MAX_SUB_TITLE_LENGTH} 字（当前 ${(item.subTitle || "").length}）
                  </span>
                  <${Input}
                    value=${item.cta || ""}
                    placeholder="按钮文案（如：立即查看）"
                    maxLength=${HOME_BANNER_MAX_CTA_LENGTH}
                    onChange=${(event) =>
                      updateItem(index, { cta: String(event.target.value || "").slice(0, HOME_BANNER_MAX_CTA_LENGTH) })}
                  />
                  <span className="admin-muted">
                    CTA 最多 ${HOME_BANNER_MAX_CTA_LENGTH} 字（当前 ${(item.cta || "").length}）
                  </span>
                  <${Select}
                    value=${item.theme || "common"}
                    options=${HOME_BANNER_THEME_OPTIONS}
                    onChange=${(nextValue) => updateItem(index, { theme: nextValue })}
                  />
                  <${Select}
                    value=${item.action || "commonProducts"}
                    options=${HOME_BANNER_ACTION_OPTIONS}
                    onChange=${(nextValue) => updateItem(index, { action: nextValue })}
                  />
                  <${Input}
                    value=${item.imageUrl || ""}
                    placeholder="图片地址（可选）"
                    onChange=${(event) => updateItem(index, { imageUrl: event.target.value })}
                  />
                  <span className="admin-muted">可粘贴图片 URL 或直接上传</span>
                  <div className="home-banner-row">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                      onChange=${async (event) => {
                        const file = event?.target?.files?.[0];
                        if (event?.target) {
                          event.target.value = "";
                        }
                        if (typeof onUploadHomeBannerImage === "function") {
                          await onUploadHomeBannerImage(index, file);
                        }
                      }}
                    />
                    ${bannerUploadingMap?.[index] ? html`<span className="admin-muted">上传中...</span>` : null}
                  </div>
                  ${item.imageUrl
                    ? html`
                        <div className="home-banner-preview">
                          <img src=${item.imageUrl} alt="轮播预览" />
                        </div>
                      `
                    : null}
                <//>
              <//>
            `
          )}
    </div>
  `;
}

function BrandCenterEditor(props) {
  const {
    value,
    onChange,
    onUploadBrandCenterImage,
    brandUploadingMap,
    onCreateBrandId
  } = props;
  const list = Array.isArray(value) ? value : [];

  const updateItem = (index, patch) => {
    const next = [...list];
    if (!next[index]) {
      return;
    }
    next[index] = {
      ...next[index],
      ...patch
    };
    onChange(next);
  };

  const moveItem = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= list.length) {
      return;
    }
    const next = [...list];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    onChange(next);
  };

  const removeItem = (index) => {
    const next = list.filter((_, itemIndex) => itemIndex !== index);
    onChange(next);
  };

  const duplicateItem = (index) => {
    if (!list[index] || list.length >= BRAND_CENTER_MAX_COUNT) {
      return;
    }
    const source = list[index];
    const next = [...list];
    next.splice(index + 1, 0, {
      ...source,
      id: typeof onCreateBrandId === "function" ? onCreateBrandId() : `brand-${Date.now()}`
    });
    onChange(next.slice(0, BRAND_CENTER_MAX_COUNT));
  };

  const addItem = () => {
    const next = [...list];
    next.push({
      id: typeof onCreateBrandId === "function" ? onCreateBrandId() : `brand-${Date.now()}`,
      enabled: true,
      name: "",
      logoUrl: ""
    });
    onChange(next);
  };

  return html`
    <div className="brand-center-editor">
      <div className="home-banners-toolbar">
        <span className="admin-muted">
          小程序首页按每行 4 个品牌展示，品牌总数将自动换行；最多支持 ${BRAND_CENTER_MAX_COUNT} 个品牌
        </span>
        <${Button} type="dashed" onClick=${addItem} disabled=${list.length >= BRAND_CENTER_MAX_COUNT}>
          新增品牌
        <//>
      </div>

      ${list.length === 0
        ? html`<div className="admin-muted">暂无品牌，新增后会显示在小程序首页品牌中心</div>`
        : list.map(
            (item, index) => html`
              <${Card}
                key=${item.id || index}
                size="small"
                className="brand-center-item"
                title=${`品牌 ${index + 1}`}
                extra=${html`
                  <${Space} size=${6}>
                    <${Button}
                      size="small"
                      onClick=${() => moveItem(index, -1)}
                      disabled=${index === 0}
                    >
                      上移
                    <//>
                    <${Button}
                      size="small"
                      onClick=${() => moveItem(index, 1)}
                      disabled=${index === list.length - 1}
                    >
                      下移
                    <//>
                    <${Button}
                      size="small"
                      danger=${true}
                      onClick=${() => removeItem(index)}
                    >
                      删除
                    <//>
                    <${Button}
                      size="small"
                      onClick=${() => duplicateItem(index)}
                      disabled=${list.length >= BRAND_CENTER_MAX_COUNT}
                    >
                      复制
                    <//>
                  <//>
                `}
              >
                <${Space} direction="vertical" style=${{ width: "100%" }} size=${8}>
                  <div className="home-banner-row">
                    <span className="admin-muted">启用</span>
                    <${Switch}
                      checked=${item.enabled !== false}
                      onChange=${(checked) => updateItem(index, { enabled: checked })}
                    />
                  </div>
                  <${Input}
                    value=${item.name || ""}
                    placeholder="品牌名称（必填）"
                    maxLength=${BRAND_CENTER_MAX_NAME_LENGTH}
                    onChange=${(event) =>
                      updateItem(index, {
                        name: String(event.target.value || "").slice(0, BRAND_CENTER_MAX_NAME_LENGTH)
                      })}
                  />
                  <span className="admin-muted">
                    品牌名称最多 ${BRAND_CENTER_MAX_NAME_LENGTH} 字（当前 ${(item.name || "").length}）
                  </span>
                  <${Input}
                    value=${item.logoUrl || ""}
                    placeholder="品牌图标地址（可选）"
                    onChange=${(event) => updateItem(index, { logoUrl: event.target.value })}
                  />
                  <span className="admin-muted">可粘贴图标 URL 或直接上传</span>
                  <div className="home-banner-row">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                      onChange=${async (event) => {
                        const file = event?.target?.files?.[0];
                        if (event?.target) {
                          event.target.value = "";
                        }
                        if (typeof onUploadBrandCenterImage === "function") {
                          await onUploadBrandCenterImage(index, file);
                        }
                      }}
                    />
                    ${brandUploadingMap?.[index] ? html`<span className="admin-muted">上传中...</span>` : null}
                  </div>
                  <div className="brand-logo-preview">
                    ${item.logoUrl
                      ? html`<img src=${item.logoUrl} alt="品牌图标预览" />`
                      : html`<span>${(item.name || "品").slice(0, 1)}</span>`}
                  </div>
                <//>
              <//>
            `
          )}
    </div>
  `;
}

function HomeNoticeEditor(props) {
  const { value, onChange } = props;
  const title = String(value?.title || "");
  const content = String(value?.content || "");
  return html`
    <${Space} direction="vertical" style=${{ width: "100%" }} size=${8}>
      <${Input}
        value=${title}
        placeholder="通知标题（如：店铺通知）"
        maxLength=${HOME_NOTICE_MAX_TITLE_LENGTH}
        onChange=${(event) => onChange("title", String(event.target.value || "").slice(0, HOME_NOTICE_MAX_TITLE_LENGTH))}
      />
      <span className="admin-muted">
        标题必填，最多 ${HOME_NOTICE_MAX_TITLE_LENGTH} 字（当前 ${title.length}）
      </span>
      <${Input.TextArea}
        rows=${3}
        value=${content}
        placeholder="通知内容（展示在小程序首页）"
        maxLength=${HOME_NOTICE_MAX_CONTENT_LENGTH}
        onChange=${(event) => onChange("content", String(event.target.value || "").slice(0, HOME_NOTICE_MAX_CONTENT_LENGTH))}
      />
      <span className="admin-muted">
        内容必填，最多 ${HOME_NOTICE_MAX_CONTENT_LENGTH} 字（当前 ${content.length}）
      </span>
      <div className="settings-preview">
        <strong>${title || "店铺通知"}</strong>
        <br />
        ${content || "当日 17:30 前下单次日达，17:30 后下单顺延一天。"}
      </div>
    <//>
  `;
}

function HomeLayoutEditor(props) {
  const { value, onChange, moduleOptions } = props;
  const list = Array.isArray(value) ? value : [];
  const optionsByKey = new Map((moduleOptions || []).map((item) => [item.key, item.label]));
  const [dragIndex, setDragIndex] = useState(-1);

  const moveItem = (from, to) => {
    if (from < 0 || to < 0 || from >= list.length || to >= list.length || from === to) {
      return;
    }
    const next = [...list];
    const [current] = next.splice(from, 1);
    next.splice(to, 0, current);
    onChange(next);
  };

  const updateEnabled = (index, enabled) => {
    const next = [...list];
    if (!next[index]) {
      return;
    }
    next[index] = {
      ...next[index],
      enabled
    };
    onChange(next);
  };

  return html`
    <div className="home-layout-editor">
      <div className="home-banners-toolbar">
        <span className="admin-muted">拖拽行可调整首页模块顺序，也可关闭某些模块展示</span>
      </div>
      ${list.map(
        (item, index) => html`
          <div
            key=${item.key || index}
            className="home-layout-item ${dragIndex === index ? "dragging" : ""}"
            draggable=${true}
            onDragStart=${() => setDragIndex(index)}
            onDragOver=${(event) => event.preventDefault()}
            onDrop=${(event) => {
              event.preventDefault();
              if (dragIndex >= 0) {
                moveItem(dragIndex, index);
              }
              setDragIndex(-1);
            }}
            onDragEnd=${() => setDragIndex(-1)}
          >
            <div className="drag-handle">::</div>
            <div className="home-layout-title">
              ${optionsByKey.get(item.key) || String(item.key || "").trim() || "未命名模块"}
            </div>
            <${Switch}
              checked=${item.enabled !== false}
              onChange=${(checked) => updateEnabled(index, checked)}
            />
          </div>
        `
      )}
    </div>
  `;
}

export function SettingsForm(props) {
  const {
    loading,
    saving,
    dirty,
    lastSavedAt,
    error,
    errorDetail,
    draft,
    testHistory,
    testingMap,
    bannerUploadingMap,
    brandUploadingMap,
    onWebhookChange,
    onTestWebhook,
    onExcludedCodesChange,
    onPickupAddressChange,
    onHomeBannersChange,
    onUploadHomeBannerImage,
    onCreateBannerId,
    onBrandCenterItemsChange,
    onUploadBrandCenterImage,
    onCreateBrandId,
    onHomeNoticeChange,
    onHomeLayoutChange,
    homeLayoutOptions,
    onPricingContextChange,
    onSave,
    onReset,
    onRefresh
  } = props;

  return html`
    <div>
      <div className="page-toolbar">
        <div className="toolbar-left">
          <span className="admin-muted">这些配置会直接影响下单、报价和通知，请确认后再保存</span>
        </div>
        <div className="toolbar-right">
          <${Button} onClick=${onRefresh} disabled=${loading || saving}>刷新<//>
          <${Button} onClick=${onReset} disabled=${loading || saving || !dirty}>重置<//>
          <${Button} type="primary" loading=${saving} onClick=${onSave} disabled=${loading}>保存<//>
        </div>
      </div>

      ${lastSavedAt
        ? html`<${Alert} type="success" showIcon message=${`已保存于 ${lastSavedAt}`} style=${{ marginBottom: 12 }} />`
        : null}
      ${error
        ? html`
            <${Alert}
              type="error"
              showIcon=${true}
              message="保存失败"
              description=${html`
                <div>
                  <div>${error}</div>
                  ${errorDetail ? html`<pre style=${{ marginTop: 8 }}>${errorDetail}</pre>` : null}
                </div>
              `}
              style=${{ marginBottom: 12 }}
            />
          `
        : null}

      <${Card} title="A. 群通知地址" className="settings-group">
        <${WebhookGroup}
          values=${draft.webhooks}
          testingMap=${testingMap}
          testHistory=${testHistory}
          onChange=${onWebhookChange}
          onTest=${onTestWebhook}
        />
      <//>

      <${Card} title="B. 不参与库存计算的仓库" className="settings-group">
        <${WarehouseTagsInput}
          value=${draft.excludedWarehouseCodes}
          onChange=${onExcludedCodesChange}
        />
      <//>

      <${Card} title="C. 自提点地址" className="settings-group">
        <${Input.TextArea}
          rows=${4}
          placeholder="请输入唯一自提点地址"
          value=${draft.pickupAddress}
          onChange=${(event) => onPickupAddressChange(event.target.value)}
        />
        <div className="settings-preview">${draft.pickupAddress || "未配置自提地址"}</div>
      <//>

      <${Card} title="D. 价格计算参数" className="settings-group">
        <${Space} direction="vertical" style=${{ width: "100%" }}>
          <${Input}
            value=${draft.pricingContext.billTypeId}
            placeholder="单据类型编号"
            onChange=${(event) => onPricingContextChange("billTypeId", event.target.value)}
          />
          <${Input}
            value=${draft.pricingContext.currencyId}
            placeholder="币种编号"
            onChange=${(event) => onPricingContextChange("currencyId", event.target.value)}
          />
          <${Input}
            value=${draft.pricingContext.exchangeRate}
            placeholder="汇率（需大于 0）"
            onChange=${(event) => onPricingContextChange("exchangeRate", event.target.value)}
          />
          <${Select}
            value=${draft.pricingContext.currency || "CNY"}
            options=${[
              { value: "CNY", label: "人民币（CNY）" },
              { value: "USD", label: "美元（USD）" },
              { value: "EUR", label: "欧元（EUR）" }
            ]}
            onChange=${(value) => onPricingContextChange("currency", value)}
          />
        <//>
      <//>

      <${Card} title="E. 首页轮播配置" className="settings-group">
        <${HomeBannersEditor}
          value=${draft.homeBanners}
          onChange=${onHomeBannersChange}
          onUploadHomeBannerImage=${onUploadHomeBannerImage}
          bannerUploadingMap=${bannerUploadingMap}
          onCreateBannerId=${onCreateBannerId}
        />
      <//>

      <${Card} title="F. 首页品牌中心配置" className="settings-group">
        <${BrandCenterEditor}
          value=${draft.brandCenterItems}
          onChange=${onBrandCenterItemsChange}
          onUploadBrandCenterImage=${onUploadBrandCenterImage}
          brandUploadingMap=${brandUploadingMap}
          onCreateBrandId=${onCreateBrandId}
        />
      <//>

      <${Card} title="G. 店铺通知配置" className="settings-group">
        <${HomeNoticeEditor}
          value=${draft.homeNotice}
          onChange=${onHomeNoticeChange}
        />
      <//>

      <${Card} title="H. 首页模块布局" className="settings-group">
        <${HomeLayoutEditor}
          value=${draft.homeLayout}
          onChange=${onHomeLayoutChange}
          moduleOptions=${homeLayoutOptions}
        />
      <//>
    </div>
  `;
}
