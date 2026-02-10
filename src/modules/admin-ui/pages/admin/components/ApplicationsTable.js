import { antd, html } from "../utils/runtime.js";
import { copyText } from "../services/adminApi.js";

const { Button, Dropdown, Empty, Space, Table, Tag, Tooltip, message } = antd;

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

function applicationStatusText(status) {
  if (status === "PENDING") return "待审核";
  if (status === "APPROVED") return "已通过";
  if (status === "REJECTED") return "已拒绝";
  return status || "-";
}

export function ApplicationsTable(props) {
  const {
    loading,
    items,
    emptyNode,
    onViewDetail,
    onApprove,
    onReject
  } = props;

  const renderCopyable = (value, maxWidth = 180) => {
    const text = String(value || "").trim();
    if (!text) {
      return "-";
    }
    return html`
      <span className="cell-copy-wrap">
        <${Tooltip} title=${text}>
          <span className="cell-ellipsis" style=${{ maxWidth: `${maxWidth}px` }}>${text}</span>
        <//>
        <${Tooltip} title="复制">
          <${Button}
            type="text"
            size="small"
            className="copy-icon-btn"
            onClick=${() =>
              copyText(text)
                .then(() => message.success("已复制"))
                .catch(() => message.error("复制失败"))}
          >
            ⧉
          <//>
        <//>
      </span>
    `;
  };

  const columns = [
    {
      title: "企业名",
      dataIndex: "companyName",
      key: "companyName",
      ellipsis: { showTitle: false },
      render: (value) => renderCopyable(value, 220)
    },
    {
      title: "联系人",
      dataIndex: "contactName",
      key: "contactName",
      ellipsis: { showTitle: false },
      render: (value) => renderCopyable(value, 140)
    },
    {
      title: "手机号",
      dataIndex: "contactPhone",
      key: "contactPhone",
      width: 180,
      render: (value) => renderCopyable(value, 140)
    },
    {
      title: "提交时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => dateTimeText(value)
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const color = value === "APPROVED" ? "success" : value === "REJECTED" ? "error" : "warning";
        return html`<${Tag} color=${color}>${applicationStatusText(value)}<//>`;
      }
    },
    {
      title: "操作",
      key: "actions",
      width: 130,
      render: (_, row) => {
        const disabled = row.status !== "PENDING";
        const menu = {
          items: [
            { key: "detail", label: "查看详情" },
            { key: "approve", label: "通过并绑定", disabled },
            { key: "reject", label: "拒绝", disabled }
          ],
          onClick: ({ key }) => {
            if (key === "detail") {
              onViewDetail(row);
              return;
            }
            if (key === "approve") {
              onApprove(row);
              return;
            }
            if (key === "reject") {
              onReject(row);
            }
          }
        };
        return html`
          <${Dropdown} menu=${menu} trigger=${["click"]}>
            <${Button} size="small">
              操作
            <//>
          <//>
        `;
      }
    }
  ];

  return html`
    <${Table}
      rowKey="id"
      loading=${loading}
      dataSource=${items}
      columns=${columns}
      locale=${{
        emptyText: emptyNode || html`<${Empty} description="暂无数据" />`
      }}
      pagination=${{ pageSize: 10, showSizeChanger: false }}
    />
  `;
}
