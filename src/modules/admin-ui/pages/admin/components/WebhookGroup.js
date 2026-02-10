import { antd, html } from "../utils/runtime.js";
import { getWebhookKeys } from "../services/adminApi.js";

const { Button, Input, Space, Tag } = antd;

const WEBHOOK_LABELS = {
  ORDER_WEBHOOK: "订单通知",
  LOGISTICS_WEBHOOK: "物流通知",
  FINANCE_WEBHOOK: "财务通知",
  QUOTE_WEBHOOK: "报价通知",
  REGISTRATION_WEBHOOK: "入驻审核通知"
};

function statusTag(testResult) {
  if (!testResult) {
    return html`<${Tag}>未测试<//>`;
  }
  if (testResult.status === "success") {
    return html`<${Tag} color="success">测试成功<//>`;
  }
  if (testResult.status === "error") {
    return html`<${Tag} color="error">测试失败<//>`;
  }
  return html`<${Tag}>未测试<//>`;
}

export function WebhookGroup(props) {
  const {
    values,
    testingMap,
    testHistory,
    onChange,
    onTest
  } = props;
  const keys = getWebhookKeys();

  return html`
    <div className="settings-group">
      ${keys.map((key) => {
        const result = testHistory[key];
        return html`
          <div key=${key} style=${{ marginBottom: 10 }}>
            <div className="admin-muted" style=${{ marginBottom: 4 }}>
              ${WEBHOOK_LABELS[key] || key}
            </div>
            <div className="setting-item-row">
              <${Input}
                value=${values[key] || ""}
                onChange=${(event) => onChange(key, event.target.value)}
                placeholder="请输入飞书群机器人通知地址"
              />
              <${Button}
                loading=${Boolean(testingMap[key])}
                onClick=${() => onTest(key)}
              >
                测试发送
              <//>
            </div>
            <${Space} size="small" style=${{ marginTop: 4 }}>
              ${statusTag(result)}
              <span className="admin-muted">
                ${result?.time ? `最近测试: ${result.time}` : "最近测试: -"}
              </span>
              ${result?.message ? html`<span className="admin-muted">${result.message}</span>` : null}
            <//>
          </div>
        `;
      })}
    </div>
  `;
}
