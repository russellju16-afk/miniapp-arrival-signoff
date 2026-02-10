import { antd, html, useEffect, useMemo, useState } from "../utils/runtime.js";
import {
  getSettings,
  listAdminOrders,
  listAdminSyncStatus,
  listApplications,
  listCustomers
} from "../services/adminApi.js";
import { PageGuard } from "../components/PageGuard.js";

const {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag
} = antd;

const WEBHOOK_KEYS = [
  "ORDER_WEBHOOK",
  "LOGISTICS_WEBHOOK",
  "FINANCE_WEBHOOK",
  "QUOTE_WEBHOOK",
  "REGISTRATION_WEBHOOK"
];

const WEBHOOK_LABELS = {
  ORDER_WEBHOOK: "订单通知",
  LOGISTICS_WEBHOOK: "物流通知",
  FINANCE_WEBHOOK: "财务通知",
  QUOTE_WEBHOOK: "报价通知",
  REGISTRATION_WEBHOOK: "入驻审核通知"
};

function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

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

function syncStatusText(status) {
  if (status === "SUCCESS") {
    return "成功";
  }
  if (status === "FAILED") {
    return "失败";
  }
  return status || "进行中";
}

function gotoNav(key) {
  window.location.hash = `#/${key}`;
}

export function DashboardPage(props) {
  const { loggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [failedOrderCount, setFailedOrderCount] = useState(0);
  const [syncItems, setSyncItems] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (!loggedIn) {
      setApplications([]);
      setCustomers([]);
      setFailedOrderCount(0);
      setSyncItems([]);
      setSettings({});
      setError("");
      return;
    }

    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [appList, customerList, failedOrders, syncStatus, nextSettings] =
          await Promise.all([
            listApplications(),
            listCustomers(),
            listAdminOrders({ page: 1, pageSize: 20, status: "WRITEBACK_FAILED" }),
            listAdminSyncStatus(""),
            getSettings()
          ]);
        if (!alive) return;
        setApplications(Array.isArray(appList) ? appList : []);
        setCustomers(Array.isArray(customerList) ? customerList : []);
        setFailedOrderCount(Number(failedOrders?.total || 0));
        setSyncItems(Array.isArray(syncStatus?.items) ? syncStatus.items : []);
        setSettings(nextSettings || {});
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "加载仪表盘失败");
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [loggedIn]);

  const metrics = useMemo(() => {
    const pendingCount = applications.filter((item) => item.status === "PENDING").length;
    const approvedTodayCount = applications.filter((item) => {
      if (item.status !== "APPROVED" || !item.reviewedAt) {
        return false;
      }
      return new Date(item.reviewedAt).getTime() >= startOfToday();
    }).length;
    const activeCustomers = customers.filter((item) => item.status === "ACTIVE").length;
    return {
      pendingCount,
      approvedTodayCount,
      totalCustomers: customers.length,
      activeCustomers
    };
  }, [applications, customers]);

  const health = useMemo(() => {
    const latestSync = [...syncItems].sort((a, b) => {
      const aTime = new Date(a?.lastRunAt || 0).getTime();
      const bTime = new Date(b?.lastRunAt || 0).getTime();
      return bTime - aTime;
    })[0];
    const missingWebhookKeys = WEBHOOK_KEYS.filter((key) => !String(settings?.[key] || "").trim());
    const webhookCompletedCount = WEBHOOK_KEYS.length - missingWebhookKeys.length;
    return {
      latestSync,
      missingWebhookKeys,
      webhookCompletedCount
    };
  }, [settings, syncItems]);

  const todos = useMemo(
    () => [
      {
        key: "applications",
        title: "待审核申请",
        count: metrics.pendingCount,
        description: "优先审核并绑定金蝶客户，减少下单阻塞",
        cta: "前往审核"
      },
      {
        key: "orders",
        title: "推送失败订单",
        count: failedOrderCount,
        description: "请检查失败原因并执行重新推送",
        cta: "去处理"
      },
      {
        key: "requests",
        title: "待处理报价",
        count: 0,
        description: "报价处理页面已预留，可接入真实数据后使用",
        cta: "去处理"
      },
      {
        key: "requests",
        title: "待开票申请",
        count: 0,
        description: "开票处理页面已预留，可接入真实数据后使用",
        cta: "去处理"
      }
    ],
    [failedOrderCount, metrics.pendingCount]
  );

  const totalPendingTodo = todos.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">运营总览</div>
        <div className="page-subtitle">查看待办事项、系统健康和核心业务数据</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            ${error
              ? html`<${Alert}
                  type="error"
                  showIcon
                  message="加载失败"
                  description=${error}
                  style=${{ marginBottom: 12 }}
                />`
              : null}

            <div className="stats-row">
              <${Row} gutter=${12}>
                <${Col} xs=${24} sm=${12} lg=${6}>
                  <${Card}><${Statistic} title="待审核申请" value=${metrics.pendingCount} /><//>
                <//>
                <${Col} xs=${24} sm=${12} lg=${6}>
                  <${Card}><${Statistic} title="今日审核通过" value=${metrics.approvedTodayCount} /><//>
                <//>
                <${Col} xs=${24} sm=${12} lg=${6}>
                  <${Card}><${Statistic} title="客户总数" value=${metrics.totalCustomers} /><//>
                <//>
                <${Col} xs=${24} sm=${12} lg=${6}>
                  <${Card}><${Statistic} title="可下单客户" value=${metrics.activeCustomers} /><//>
                <//>
              <//>
            </div>

            <${Row} gutter=${12} style=${{ marginBottom: 12 }}>
              <${Col} xs=${24} xl=${16}>
                <${Card}
                  title="待办卡片"
                  extra=${html`
                    <${Button} size="small" onClick=${() => gotoNav("applications")}>处理注册审核<//>
                  `}
                >
                  ${loading
                    ? html`<${Skeleton} active=${true} paragraph=${{ rows: 6 }} />`
                    : totalPendingTodo === 0
                      ? html`
                          <div className="table-empty-with-cta">
                            <${Empty}
                              description="当前没有待处理事项，可前往订单和设置页做日常巡检"
                            />
                            <${Space}>
                              <${Button} onClick=${() => gotoNav("orders")}>去订单跟进<//>
                              <${Button} onClick=${() => gotoNav("settings")}>去基础设置<//>
                            <//>
                          </div>
                        `
                      : html`
                          <${Row} gutter=${12}>
                            ${todos.map(
                              (item) => html`
                                <${Col} xs=${24} sm=${12} style=${{ marginBottom: 10 }} key=${item.title}>
                                  <${Card} size="small" bordered=${true}>
                                    <div className="todo-card-title">${item.title}</div>
                                    <div style=${{ marginTop: 4 }}>
                                      <${Tag} color=${item.count > 0 ? "warning" : "success"}>
                                        ${item.count > 0 ? `${item.count} 项待处理` : "已清空"}
                                      <//>
                                    </div>
                                    <div className="todo-card-meta">${item.description}</div>
                                    <div style=${{ marginTop: 8 }}>
                                      <${Button} size="small" onClick=${() => gotoNav(item.key)}>
                                        ${item.cta}
                                      <//>
                                    </div>
                                  <//>
                                <//>
                              `
                            )}
                          <//>
                        `}
                <//>
              <//>

              <${Col} xs=${24} xl=${8}>
                <${Card} title="系统健康">
                  ${loading
                    ? html`<${Skeleton} active=${true} paragraph=${{ rows: 5 }} />`
                    : html`
                        <${Space} direction="vertical" size=${12} style=${{ width: "100%" }}>
                          <div>
                            <div className="admin-muted">最近一次同步</div>
                            <div>
                              ${health.latestSync
                                ? html`
                                    <${Tag}
                                      color=${health.latestSync.status === "SUCCESS" ? "success" : "error"}
                                    >
                                      ${syncStatusText(health.latestSync.status)}
                                    <//>
                                    <span className="admin-muted">
                                      ${formatDateTime(health.latestSync.lastRunAt)}
                                    </span>
                                  `
                                : html`<span className="admin-muted">暂无同步记录</span>`}
                            </div>
                          </div>

                          <div>
                            <div className="admin-muted">通知地址配置完整度</div>
                            <div>
                              <${Badge}
                                status=${health.missingWebhookKeys.length > 0 ? "error" : "success"}
                                text=${`${health.webhookCompletedCount}/${WEBHOOK_KEYS.length} 已配置`}
                              />
                            </div>
                            ${health.missingWebhookKeys.length > 0
                              ? html`
                                  <div className="admin-muted" style=${{ marginTop: 4 }}>
                                    缺失: ${health.missingWebhookKeys
                                      .map((key) => WEBHOOK_LABELS[key] || key)
                                      .join("、")}
                                  </div>
                                `
                              : null}
                          </div>

                          <${Space}>
                            <${Button} size="small" onClick=${() => gotoNav("sync")}>去数据同步<//>
                            <${Button} size="small" onClick=${() => gotoNav("settings")}>去基础设置<//>
                          <//>
                        <//>
                      `}
                <//>
              <//>
            <//>
          `}
    </div>
  `;
}
