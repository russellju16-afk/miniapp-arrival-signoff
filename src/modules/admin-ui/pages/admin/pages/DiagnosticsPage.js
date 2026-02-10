import { antd, html, useMemo, useState } from "../utils/runtime.js";
import {
  copyText,
  retryAdminOrderWritebackByOrderNo,
  runAdminKingdeeDiagnostics
} from "../services/adminApi.js";
import { PageGuard } from "../components/PageGuard.js";

const {
  Alert,
  Button,
  Card,
  Collapse,
  Empty,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message
} = antd;

const CHECK_ITEM_TITLES = {
  connectivity: "金蝶连接是否正常",
  "token-status": "登录凭证是否可用",
  "customer-list": "是否能读取客户列表",
  outbound: "是否能读取发货/出库数据",
  receipt: "是否能读取收款数据",
  "inventory-snapshot": "库存快照任务是否正常",
  "webhook-completeness": "通知地址配置是否完整"
};

function formatDateTime(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
}

function statusTag(status) {
  if (status === "PASS") {
    return html`<${Tag} color="success">正常<//>`;
  }
  if (status === "WARN") {
    return html`<${Tag} color="warning">需关注<//>`;
  }
  return html`<${Tag} color="error">失败<//>`;
}

function statusText(status) {
  if (status === "PASS") return "正常";
  if (status === "WARN") return "需关注";
  return "失败";
}

function itemTitle(item) {
  if (!item || typeof item !== "object") {
    return "-";
  }
  return CHECK_ITEM_TITLES[item.key] || item.title || "-";
}

function buildReportText(report) {
  const lines = [
    "金蝶连接自检报告",
    `检查时间: ${formatDateTime(report?.checkedAt)}`,
    `汇总: 正常 ${report?.summary?.pass || 0} / 需关注 ${report?.summary?.warn || 0} / 失败 ${report?.summary?.fail || 0}`,
    ""
  ];
  const items = Array.isArray(report?.items) ? report.items : [];
  for (const item of items) {
    lines.push(`[${statusText(item.status)}] ${itemTitle(item)}`);
    lines.push(`说明: ${item.message}`);
    if (item.detail) {
      lines.push(`详情: ${JSON.stringify(item.detail)}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function DiagnosticsPage(props) {
  const { loggedIn } = props;
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [retryOrderNo, setRetryOrderNo] = useState("");
  const [retryLoading, setRetryLoading] = useState(false);
  const [retryResult, setRetryResult] = useState(null);

  const columns = useMemo(
    () => [
      {
        title: "检查项",
        key: "title",
        width: 280,
        render: (_, row) => itemTitle(row)
      },
      {
        title: "结果",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (value) => statusTag(value)
      },
      {
        title: "说明",
        dataIndex: "message",
        key: "message"
      }
    ],
    []
  );

  const runCheck = async () => {
    if (!loggedIn) {
      return;
    }
    setChecking(true);
    setError("");
    try {
      const next = await runAdminKingdeeDiagnostics();
      setReport(next);
      message.success("自检完成");
    } catch (err) {
      setError(err?.message || "自检失败");
      message.error("自检失败，请稍后重试");
    } finally {
      setChecking(false);
    }
  };

  const exportJson = async () => {
    if (!report) {
      message.warning("请先执行自检");
      return;
    }
    try {
      await copyText(JSON.stringify(report, null, 2));
      message.success("报告数据已复制");
    } catch {
      message.error("复制失败");
    }
  };

  const downloadText = () => {
    if (!report) {
      message.warning("请先执行自检");
      return;
    }
    const content = buildReportText(report);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `kingdee-diagnostics-${Date.now()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const retryWriteback = async () => {
    const orderNo = String(retryOrderNo || "").trim();
    if (!orderNo) {
      message.warning("请先输入订单号");
      return;
    }
    Modal.confirm({
      title: "确认执行订单推送测试？",
      content: "此操作可能在金蝶生成/更新单据，请谨慎。",
      okText: "确认执行",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        setRetryLoading(true);
        try {
          const data = await retryAdminOrderWritebackByOrderNo(orderNo);
          setRetryResult(data);
          message.success("推送测试已执行");
        } catch (err) {
          message.error(err?.message || "推送测试失败");
        } finally {
          setRetryLoading(false);
        }
      }
    });
  };

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">金蝶连接检查</div>
        <div className="page-subtitle">一键生成运营体检报告，定位“能不能同步、哪里失败、下一步怎么处理”</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            <${Alert}
              type="info"
              showIcon
              style=${{ marginBottom: 12 }}
              message="怎么用（运营同事版）"
              description=${html`
                <div>1. 点击【开始自检】即可检查连接、token、客户/发货/收款读取能力。</div>
                <div>2. 如有 FAIL，先看“说明”；若无法定位，导出报告给技术支持。</div>
                <div>3. 危险操作默认折叠，仅在技术同学指导下执行。</div>
              `}
            />

            <${Card}
              title="运营体检报告"
              extra=${html`
                <${Space}>
                  <${Button} onClick=${exportJson} disabled=${!report}>复制报告数据<//>
                  <${Button} onClick=${downloadText} disabled=${!report}>下载文本<//>
                  <${Button} type="primary" loading=${checking} onClick=${runCheck}>开始自检<//>
                <//>
              `}
              style=${{ marginBottom: 12 }}
            >
              ${error
                ? html`<${Alert}
                    type="error"
                    showIcon
                    message="自检失败"
                    description=${html`
                      <div>${error}</div>
                      <div className="admin-muted" style=${{ marginTop: 6 }}>
                        下一步建议：检查后台登录口令、金蝶配置和网络，重试后仍失败请导出报告给技术支持。
                      </div>
                    `}
                    style=${{ marginBottom: 12 }}
                  />`
                : null}

              ${!report
                ? html`
                    <div className="table-empty-with-cta">
                      <${Empty} description="尚未执行自检，请点击“开始自检”生成报告" />
                      <${Button} type="primary" onClick=${runCheck} loading=${checking}>开始自检<//>
                    </div>
                  `
                : html`
                    <div style=${{ marginBottom: 12 }}>
                      <${Space} wrap>
                        <${Tag} color="success">正常 ${report.summary?.pass || 0}<//>
                        <${Tag} color="warning">需关注 ${report.summary?.warn || 0}<//>
                        <${Tag} color="error">失败 ${report.summary?.fail || 0}<//>
                        <span className="admin-muted">检查时间：${formatDateTime(report.checkedAt)}</span>
                      <//>
                    </div>
                    <${Table}
                      rowKey="key"
                      pagination=${false}
                      columns=${columns}
                      dataSource=${report.items || []}
                      locale=${{
                        emptyText: html`<${Empty} description="暂无自检结果" />`
                      }}
                    />
                  `}
            <//>

            <${Collapse}
              items=${[
                {
                  key: "danger",
                  label: "危险操作区（默认折叠）",
                  children: html`
                    <${Alert}
                      type="warning"
                      showIcon
                      message="订单推送测试"
                      description="此操作可能在金蝶生成/更新单据，请谨慎。建议先在测试单据上验证。"
                      style=${{ marginBottom: 12 }}
                    />
                    <div className="page-toolbar">
                      <div className="toolbar-left">
                        <${Input}
                          placeholder="输入订单号（本地订单号或金蝶订单号）"
                          value=${retryOrderNo}
                          style=${{ width: 320 }}
                          onChange=${(event) => setRetryOrderNo(event.target.value)}
                        />
                      </div>
                      <div className="toolbar-right">
                        <${Button}
                          danger=${true}
                          loading=${retryLoading}
                          onClick=${retryWriteback}
                        >
                          执行推送测试
                        <//>
                      </div>
                    </div>
                    ${retryResult
                      ? html`
                          <${Card} size="small" style=${{ marginTop: 10 }}>
                            <div><b>匹配订单：</b>${retryResult.matchedOrder?.orderNo || "-"}</div>
                            <div><b>结果：</b>${retryResult.result?.afterStatus || "-"}</div>
                            <div><b>请求编号：</b>${retryResult.result?.writeback?.requestId || "-"}</div>
                            <div><b>追踪编号：</b>${retryResult.result?.writeback?.traceId || "-"}</div>
                            <div><b>说明：</b>${retryResult.result?.writeback?.summary || "-"}</div>
                          <//>
                        `
                      : null}
                  `
                }
              ]}
            />
          `}
    </div>
  `;
}
