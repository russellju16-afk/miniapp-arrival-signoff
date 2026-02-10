import { antd, html, useEffect, useMemo, useState } from "../utils/runtime.js";
import { listAdminSyncStatus, runAdminSyncJob } from "../services/adminApi.js";
import { PageGuard } from "../components/PageGuard.js";

const {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message
} = antd;

const JOB_OPTIONS = [
  {
    label: "同步发货/出库数据",
    value: "sync:deliveries"
  },
  {
    label: "同步收款数据",
    value: "sync:receipts"
  },
  {
    label: "同步库存快照（库存每15分钟更新一次）",
    value: "sync:inventory-stock-snapshot"
  },
  {
    label: "一键同步全部",
    value: "sync:all"
  }
];

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

function jobNameToLabel(jobName) {
  if (jobName === "sync:deliveries") {
    return "同步发货/出库数据";
  }
  if (jobName === "sync:receipts") {
    return "同步收款数据";
  }
  if (jobName === "sync:inventory-stock-snapshot") {
    return "同步库存快照";
  }
  if (jobName === "sync:all") {
    return "一键同步全部";
  }
  return jobName ? `系统任务(${jobName})` : "-";
}

function statusMeta(status) {
  if (status === "SUCCESS") {
    return { color: "success", text: "成功" };
  }
  if (status === "FAILED") {
    return { color: "error", text: "失败" };
  }
  return { color: "processing", text: status || "进行中" };
}

function parseDatetimeToMs(value) {
  const text = String(value || "").trim();
  if (!text) {
    return undefined;
  }
  const timestamp = new Date(text).getTime();
  if (!Number.isFinite(timestamp)) {
    return Number.NaN;
  }
  return timestamp;
}

function summarizeCursor(cursor, jobName) {
  if (!cursor || typeof cursor !== "object") {
    return {
      inserted: 0,
      skipped: 0,
      warnings: "-"
    };
  }
  const insertedRaw =
    cursor.inserted ?? cursor.touchedSkus ?? cursor.synced ?? cursor.totalRows ?? cursor.count ?? 0;
  const skippedRaw = cursor.skipped ?? 0;
  const warningsRaw = cursor.warnings;
  const warnings = Array.isArray(warningsRaw)
    ? warningsRaw.join("；") || "-"
    : warningsRaw
      ? String(warningsRaw)
      : "-";
  const inserted = Number.isFinite(Number(insertedRaw)) ? Number(insertedRaw) : 0;
  const skipped = Number.isFinite(Number(skippedRaw)) ? Number(skippedRaw) : 0;
  if (jobName === "sync:inventory-stock-snapshot" && inserted === 0) {
    const touchedMaterials = Number(cursor.touchedMaterials || 0);
    return {
      inserted: touchedMaterials,
      skipped,
      warnings
    };
  }
  return {
    inserted,
    skipped,
    warnings
  };
}

export function SyncPage(props) {
  const { loggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [running, setRunning] = useState(false);
  const [latestRun, setLatestRun] = useState(null);
  const [jobFilter, setJobFilter] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [formData, setFormData] = useState({
    jobName: "sync:deliveries",
    tenantId: "",
    fromAt: "",
    toAt: ""
  });

  const loadStatus = async (jobName = jobFilter) => {
    if (!loggedIn) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await listAdminSyncStatus(jobName || "");
      setItems(Array.isArray(result.items) ? result.items : []);
      setWarnings(Array.isArray(result.warnings) ? result.warnings : []);
    } catch (err) {
      setError(err?.message || "加载同步状态失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setItems([]);
      setWarnings([]);
      setError("");
      return;
    }
    loadStatus("");
  }, [loggedIn]);

  const onRun = async () => {
    const fromTime = parseDatetimeToMs(formData.fromAt);
    const toTime = parseDatetimeToMs(formData.toAt);
    if (Number.isNaN(fromTime) || Number.isNaN(toTime)) {
      message.error("时间格式无效，请重新选择日期时间");
      return;
    }
    if (typeof fromTime === "number" && typeof toTime === "number" && fromTime > toTime) {
      message.error("开始时间不能晚于结束时间");
      return;
    }

    const payload = {
      jobName: formData.jobName,
      ...(advancedOpen && formData.tenantId.trim() ? { tenantId: formData.tenantId.trim() } : {}),
      ...(typeof fromTime === "number" ? { fromTime } : {}),
      ...(typeof toTime === "number" ? { toTime } : {})
    };

    Modal.confirm({
      title: "确认开始同步？",
      content: html`
        <div>
          <div>同步任务：${jobNameToLabel(formData.jobName)}</div>
          <div className="admin-muted">
            ${typeof fromTime === "number" || typeof toTime === "number"
              ? "已指定时间范围，将执行补数据同步。"
              : "未指定时间范围，将按增量同步最新数据（推荐）。"}
          </div>
        </div>
      `,
      okText: "确认开始",
      cancelText: "取消",
      onOk: async () => {
        setRunning(true);
        try {
          const result = await runAdminSyncJob(payload);
          setLatestRun(result);
          message.success("同步任务已触发");
          await loadStatus(jobFilter);
        } catch (err) {
          message.error(err?.message || "触发同步失败");
        } finally {
          setRunning(false);
        }
      }
    });
  };

  const columns = useMemo(
    () => [
      { title: "任务范围", dataIndex: "scope", key: "scope", width: 220 },
      {
        title: "同步任务",
        dataIndex: "jobName",
        key: "jobName",
        width: 200,
        render: (value) => jobNameToLabel(value)
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (value) => {
          const meta = statusMeta(value);
          return html`<${Tag} color=${meta.color}>${meta.text}<//>`;
        }
      },
      {
        title: "统计",
        key: "summary",
        width: 220,
        render: (_, row) => {
          const summary = summarizeCursor(row.cursor, row.jobName);
          return `新增 ${summary.inserted} 条 / 跳过 ${summary.skipped} 条`;
        }
      },
      {
        title: "警告（不影响使用但建议关注）",
        key: "warnings",
        render: (_, row) => {
          const summary = summarizeCursor(row.cursor, row.jobName);
          return summary.warnings === "-" ? "无" : summary.warnings;
        }
      },
      {
        title: "失败原因",
        dataIndex: "errorMessage",
        key: "errorMessage",
        render: (value) => value || "-"
      },
      {
        title: "上次运行时间",
        dataIndex: "lastRunAt",
        key: "lastRunAt",
        width: 190,
        render: (value) => formatDateTime(value)
      }
    ],
    []
  );

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">数据同步</div>
        <div className="page-subtitle">面向运营同事：点选任务即可同步，失败时直接看“失败原因”</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            <${Alert}
              type="info"
              showIcon
              style=${{ marginBottom: 12 }}
              message="怎么用（3步）"
              description=${html`
                <div>1. 日常只需要点【同步发货】和【同步收款】；库存是自动的（每15分钟）。</div>
                <div>2. 如需补历史数据，可选择时间范围再同步；不填时间 = 增量同步（推荐）。</div>
                <div>3. 若失败，请先看“失败原因”，必要时截图给技术支持。</div>
              `}
            />

            <${Card} title="手动触发同步" style=${{ marginBottom: 12 }}>
              <div className="page-toolbar">
                <div className="toolbar-left">
                  <${Select}
                    value=${formData.jobName}
                    style=${{ width: 320 }}
                    options=${JOB_OPTIONS}
                    onChange=${(value) => setFormData((prev) => ({ ...prev, jobName: value }))}
                  />
                  <${Input}
                    type="datetime-local"
                    value=${formData.fromAt}
                    style=${{ width: 210 }}
                    onChange=${(event) =>
                      setFormData((prev) => ({ ...prev, fromAt: event.target.value }))}
                  />
                  <span className="admin-muted">到</span>
                  <${Input}
                    type="datetime-local"
                    value=${formData.toAt}
                    style=${{ width: 210 }}
                    onChange=${(event) =>
                      setFormData((prev) => ({ ...prev, toAt: event.target.value }))}
                  />
                </div>
                <div className="toolbar-right">
                  <${Button} type="primary" loading=${running} onClick=${onRun}>开始同步<//>
                </div>
              </div>

              <div className="admin-muted" style=${{ marginBottom: 8 }}>
                不填时间 = 系统自动按增量同步最新数据（推荐日常不填）
              </div>

              <${Button}
                type="link"
                size="small"
                onClick=${() => setAdvancedOpen((prev) => !prev)}
              >
                ${advancedOpen ? "收起高级参数" : "显示高级参数（一般不需要填）"}
              <//>
              ${advancedOpen
                ? html`
                    <div style=${{ marginTop: 8, maxWidth: 420 }}>
                      <${Input}
                        placeholder="租户编号（高级参数，一般不需要填）"
                        value=${formData.tenantId}
                        onChange=${(event) =>
                          setFormData((prev) => ({ ...prev, tenantId: event.target.value }))}
                      />
                    </div>
                  `
                : null}

              ${latestRun
                ? html`
                    <div className="settings-preview" style=${{ marginTop: 12 }}>
                      最近手动触发：${jobNameToLabel(latestRun.jobName)} |
                      开始时间：${formatDateTime(latestRun.startedAt)} |
                      完成时间：${formatDateTime(latestRun.finishedAt)}
                    </div>
                  `
                : null}
            <//>

            <${Card}>
              <div className="page-toolbar">
                <div className="toolbar-left">
                  <${Select}
                    value=${jobFilter}
                    style=${{ width: 260 }}
                    options=${[{ label: "查看全部任务", value: "" }, ...JOB_OPTIONS]}
                    onChange=${(value) => {
                      const next = value || "";
                      setJobFilter(next);
                      loadStatus(next);
                    }}
                  />
                </div>
                <div className="toolbar-right">
                  <${Button} onClick=${() => loadStatus(jobFilter)}>刷新状态<//>
                </div>
              </div>

              ${warnings.length > 0
                ? html`
                    <${Alert}
                      type="warning"
                      showIcon=${true}
                      message="提示"
                      description=${warnings.join("；")}
                      style=${{ marginBottom: 12 }}
                    />
                  `
                : null}

              ${error
                ? html`
                    <${Alert}
                      type="error"
                      showIcon
                      message="读取同步状态失败"
                      description=${html`
                        <div>${error}</div>
                        <div className="admin-muted" style=${{ marginTop: 4 }}>
                          建议先点击“刷新状态”，仍失败请截图给技术支持。
                        </div>
                      `}
                      style=${{ marginBottom: 12 }}
                    />
                  `
                : null}

              <${Table}
                rowKey=${(row) => `${row.scope}-${row.updatedAt}`}
                loading=${loading}
                dataSource=${items}
                columns=${columns}
                scroll=${{ x: 1400 }}
                pagination=${{ pageSize: 20, showSizeChanger: true }}
                locale=${{
                  emptyText: html`
                    <div className="table-empty-with-cta">
                      <${Empty} description="暂无同步记录，建议先执行一次“开始同步”" />
                      <${Button} type="primary" onClick=${onRun} loading=${running}>开始同步<//>
                    </div>
                  `
                }}
              />
            <//>
          `}
    </div>
  `;
}
