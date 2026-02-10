import { antd, html } from "../utils/runtime.js";

const { Button, Empty, Space, Table, Tag } = antd;

function dateTimeText(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
}

export function CustomersTable(props) {
  const {
    loading,
    items,
    onBind,
    onToggleStatus,
    onCopyCustomerId
  } = props;

  const columns = [
    {
      title: "企业名",
      key: "companyName",
      render: (_, row) => row.companyName || row.name || "-"
    },
    {
      title: "联系人",
      key: "contactName",
      render: (_, row) => row.contactName || "-"
    },
    {
      title: "电话",
      key: "contactPhone",
      render: (_, row) => row.contactPhone || row.phone || "-"
    },
    {
      title: "金蝶客户编号",
      key: "kingdeeCustomerId",
      render: (_, row) => row.kingdeeCustomerId || "-"
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const color = value === "ACTIVE" ? "success" : value === "PENDING" ? "warning" : "error";
        return html`<${Tag} color=${color}>${value}<//>`;
      }
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => dateTimeText(value)
    },
    {
      title: "操作",
      key: "actions",
      render: (_, row) => html`
        <${Space} wrap=${true}>
          <${Button} size="small" type="primary" onClick=${() => onBind(row)}>
            ${row.kingdeeCustomerId ? "修改绑定" : "绑定"}
          <//>
          <${Button}
            size="small"
            danger=${row.status === "ACTIVE"}
            onClick=${() => onToggleStatus(row)}
          >
            ${row.status === "ACTIVE" ? "禁用" : "启用"}
          <//>
          <${Button} size="small" onClick=${() => onCopyCustomerId(row)}>
            复制客户编号
          <//>
        <//>
      `
    }
  ];

  return html`
    <${Table}
      rowKey="id"
      loading=${loading}
      columns=${columns}
      dataSource=${items}
      pagination=${{ pageSize: 10, showSizeChanger: false }}
      locale=${{
        emptyText: html`<${Empty} description="暂无客户数据" />`
      }}
    />
  `;
}
