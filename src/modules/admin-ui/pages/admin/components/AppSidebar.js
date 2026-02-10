import { antd, html } from "../utils/runtime.js";

const { Menu } = antd;

export const ADMIN_NAV_ITEMS = [
  { key: "dashboard", label: "运营总览" },
  { key: "applications", label: "入驻审核" },
  { key: "customers", label: "客户管理" },
  { key: "products", label: "商品管理" },
  { key: "orders", label: "订单跟进" },
  { key: "sync", label: "数据同步" },
  { key: "diagnostics", label: "金蝶连接检查" },
  { key: "requests", label: "报价与开票处理" },
  { key: "settings", label: "通知与基础设置" }
];

export function AppSidebar(props) {
  const { activeKey, onChange } = props;

  return html`
    <div>
      <div className="admin-logo">企业订货运营后台</div>
      <${Menu}
        mode="inline"
        selectedKeys=${[activeKey]}
        items=${ADMIN_NAV_ITEMS}
        onClick=${(event) => onChange(event.key)}
      />
    </div>
  `;
}
