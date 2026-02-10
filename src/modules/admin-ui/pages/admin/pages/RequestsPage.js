import { antd, html } from "../utils/runtime.js";
import { PageGuard } from "../components/PageGuard.js";

const { Card, Empty, Space, Table, Tag } = antd;

export function RequestsPage(props) {
  const { loggedIn } = props;

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">报价与开票处理</div>
        <div className="page-subtitle">统一处理报价申请和开票申请（当前为预留结构）</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            <${Card} title="报价 / 开票请求队列">
              <${Table}
                rowKey="id"
                dataSource=${[]}
                columns=${[
                  { title: "记录编号", dataIndex: "id" },
                  { title: "事项类型", dataIndex: "type" },
                  { title: "客户", dataIndex: "customerName" },
                  {
                    title: "状态",
                    dataIndex: "status",
                    render: (value) => value ? html`<${Tag}>${value}<//>` : "-"
                  },
                  { title: "创建时间", dataIndex: "createdAt" }
                ]}
                pagination=${false}
                locale=${{
                  emptyText: html`<${Empty} description="请求处理模块已预留，可后续接报价/开票列表接口" />`
                }}
              />
            <//>
          `}
    </div>
  `;
}
