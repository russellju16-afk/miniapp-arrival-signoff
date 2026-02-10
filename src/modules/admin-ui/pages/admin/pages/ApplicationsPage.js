import { antd, html, useEffect, useMemo, useState } from "../utils/runtime.js";
import {
  bindCustomer,
  listApplications,
  reviewApplication
} from "../services/adminApi.js";
import { ApplicationsTable } from "../components/ApplicationsTable.js";
import { PageGuard } from "../components/PageGuard.js";

const {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Modal,
  Row,
  Statistic,
  Tabs,
  message
} = antd;

const TAB_ITEMS = [
  { key: "PENDING", label: "待审核" },
  { key: "APPROVED", label: "已通过" },
  { key: "REJECTED", label: "已拒绝" }
];

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

function todayStart() {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  return value.getTime();
}

function applicationStatusText(status) {
  if (status === "PENDING") return "待审核";
  if (status === "APPROVED") return "已通过";
  if (status === "REJECTED") return "已拒绝";
  return status || "-";
}

export function ApplicationsPage(props) {
  const { loggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [keyword, setKeyword] = useState("");
  const [detailItem, setDetailItem] = useState(null);
  const [approveModal, setApproveModal] = useState({
    open: false,
    item: null,
    kingdeeCustomerId: "",
    remark: "",
    loading: false
  });
  const [rejectModal, setRejectModal] = useState({
    open: false,
    item: null,
    remark: "",
    loading: false
  });

  const refresh = async () => {
    if (!loggedIn) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const list = await listApplications();
      setAllItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || "加载注册审核列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setAllItems([]);
      setError("");
      return;
    }
    refresh();
  }, [loggedIn]);

  const stats = useMemo(() => {
    const pendingCount = allItems.filter((item) => item.status === "PENDING").length;
    const todayCount = allItems.filter((item) => {
      if (!item.createdAt) {
        return false;
      }
      return new Date(item.createdAt).getTime() >= todayStart();
    }).length;
    return {
      pendingCount,
      todayCount
    };
  }, [allItems]);

  const tabCounts = useMemo(() => {
    const seed = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0
    };
    for (const item of allItems) {
      if (seed[item.status] !== undefined) {
        seed[item.status] += 1;
      }
    }
    return seed;
  }, [allItems]);

  const tabItems = useMemo(
    () =>
      TAB_ITEMS.map((item) => ({
        key: item.key,
        label: html`
          <span>
            ${item.label}
            <${Badge}
              count=${tabCounts[item.key] || 0}
              style=${{
                marginInlineStart: 8,
                backgroundColor:
                  item.key === "APPROVED"
                    ? "#16A34A"
                    : item.key === "REJECTED"
                      ? "#DC2626"
                      : "#D97706"
              }}
            />
          </span>
        `
      })),
    [tabCounts]
  );

  const filteredItems = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return allItems
      .filter((item) => item.status === activeTab)
      .filter((item) => {
        if (!text) {
          return true;
        }
        const payload = item.payload || {};
        const haystack = [
          payload.companyName,
          payload.contactPhone,
          payload.contactName,
          item.customer?.name
        ]
          .map((entry) => String(entry || "").toLowerCase())
          .join(" ");
        return haystack.includes(text);
      })
      .map((item) => {
        const payload = item.payload || {};
        return {
          ...item,
          companyName: payload.companyName || item.customer?.name || "-",
          contactName: payload.contactName || "-",
          contactPhone: payload.contactPhone || "-"
        };
      });
  }, [allItems, activeTab, keyword]);

  const onApprove = async () => {
    const app = approveModal.item;
    if (!app) return;
    const kingdeeCustomerId = approveModal.kingdeeCustomerId.trim();
    if (!kingdeeCustomerId) {
      message.warning("请输入金蝶客户编号");
      return;
    }
    try {
      setApproveModal((prev) => ({ ...prev, loading: true }));
      await reviewApplication(app.id, {
        action: "APPROVE",
        remark: approveModal.remark.trim() || undefined
      });
      await bindCustomer(app.customerId, kingdeeCustomerId);
      message.success("审核通过并绑定成功");
      setApproveModal({
        open: false,
        item: null,
        kingdeeCustomerId: "",
        remark: "",
        loading: false
      });
      await refresh();
    } catch (err) {
      message.error(err?.message || "通过操作失败");
      setApproveModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const onReject = async () => {
    const app = rejectModal.item;
    if (!app) return;
    const remark = rejectModal.remark.trim();
    if (!remark) {
      message.warning("请填写拒绝原因");
      return;
    }
    try {
      setRejectModal((prev) => ({ ...prev, loading: true }));
      await reviewApplication(app.id, {
        action: "REJECT",
        remark
      });
      message.success("已拒绝该申请");
      setRejectModal({
        open: false,
        item: null,
        remark: "",
        loading: false
      });
      await refresh();
    } catch (err) {
      message.error(err?.message || "拒绝操作失败");
      setRejectModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const emptyNode = html`
    <div className="table-empty-with-cta">
      <${Empty}
        description=${activeTab === "PENDING"
          ? "当前没有待审核申请，可引导客户在小程序提交注册信息"
          : "该筛选条件下暂无记录，请切换状态或清空搜索"}
      />
      <${Button} onClick=${() => setKeyword("")}>清空搜索条件<//>
    </div>
  `;

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">入驻审核</div>
        <div className="page-subtitle">审核客户提交资料，并绑定到金蝶客户档案</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            <div className="stats-row">
              <${Row} gutter=${12}>
                <${Col} xs=${24} sm=${12}>
                  <${Card}><${Statistic} title="待审核数量" value=${stats.pendingCount} /><//>
                <//>
                <${Col} xs=${24} sm=${12}>
                  <${Card}><${Statistic} title="今日新增申请" value=${stats.todayCount} /><//>
                <//>
              <//>
            </div>

            <${Card}>
              <div className="page-toolbar">
                <div className="toolbar-left">
                  <${Tabs}
                    activeKey=${activeTab}
                    items=${tabItems}
                    onChange=${(value) => setActiveTab(value)}
                  />
                </div>
                <div className="toolbar-right">
                  <${Input.Search}
                    allowClear=${true}
                    placeholder="搜索企业名/手机号"
                    value=${keyword}
                    onChange=${(event) => setKeyword(event.target.value)}
                    onSearch=${(value) => setKeyword(value)}
                    style=${{ width: 260 }}
                  />
                  <${Button} onClick=${refresh}>刷新<//>
                </div>
              </div>

              ${error ? html`<${Alert} type="error" showIcon message="加载失败" description=${error} style=${{ marginBottom: 12 }} />` : null}

              <${ApplicationsTable}
                loading=${loading}
                items=${filteredItems}
                emptyNode=${emptyNode}
                onViewDetail=${(row) => setDetailItem(row)}
                onApprove=${(row) =>
                  setApproveModal({
                    open: true,
                    item: row,
                    kingdeeCustomerId: "",
                    remark: "",
                    loading: false
                  })}
                onReject=${(row) =>
                  setRejectModal({
                    open: true,
                    item: row,
                    remark: "",
                    loading: false
                  })}
              />
            <//>

            <${Drawer}
              title="申请详情"
              width=${520}
              open=${Boolean(detailItem)}
              onClose=${() => setDetailItem(null)}
              destroyOnClose=${true}
            >
              ${detailItem
                ? html`
                    <${Descriptions} column=${1} size="small" bordered=${true}>
                      <${Descriptions.Item} label="申请编号">${detailItem.id}<//>
                      <${Descriptions.Item} label="客户编号">${detailItem.customerId}<//>
                      <${Descriptions.Item} label="状态">${applicationStatusText(detailItem.status)}<//>
                      <${Descriptions.Item} label="企业名">${detailItem.companyName}<//>
                      <${Descriptions.Item} label="联系人">${detailItem.contactName}<//>
                      <${Descriptions.Item} label="手机号">${detailItem.contactPhone}<//>
                      <${Descriptions.Item} label="创建时间">${dateTimeText(detailItem.createdAt)}<//>
                      <${Descriptions.Item} label="审核时间">${dateTimeText(detailItem.reviewedAt)}<//>
                      <${Descriptions.Item} label="审核备注">${detailItem.reviewRemark || "-"}<//>
                    <//>
                    <${Card} title="客户提交原文（技术信息）" size="small" style=${{ marginTop: 12 }}>
                      <pre>${JSON.stringify(detailItem.payload || {}, null, 2)}</pre>
                    <//>
                  `
                : null}
            <//>

            <${Modal}
              title="审核通过并绑定金蝶客户档案"
              open=${approveModal.open}
              confirmLoading=${approveModal.loading}
              onOk=${onApprove}
              onCancel=${() =>
                setApproveModal({
                  open: false,
                  item: null,
                  kingdeeCustomerId: "",
                  remark: "",
                  loading: false
                })}
            >
              <${Input}
                placeholder="请输入金蝶客户编号"
                value=${approveModal.kingdeeCustomerId}
                onChange=${(event) =>
                  setApproveModal((prev) => ({ ...prev, kingdeeCustomerId: event.target.value }))}
              />
              <${Input.TextArea}
                style=${{ marginTop: 10 }}
                placeholder="审核备注（可选）"
                value=${approveModal.remark}
                onChange=${(event) =>
                  setApproveModal((prev) => ({ ...prev, remark: event.target.value }))}
              />
            <//>

            <${Modal}
              title="拒绝申请"
              open=${rejectModal.open}
              confirmLoading=${rejectModal.loading}
              okButtonProps=${{ danger: true }}
              okText="确认拒绝"
              onOk=${onReject}
              onCancel=${() =>
                setRejectModal({
                  open: false,
                  item: null,
                  remark: "",
                  loading: false
                })}
            >
              <${Input.TextArea}
                placeholder="请输入拒绝原因（必填）"
                value=${rejectModal.remark}
                onChange=${(event) =>
                  setRejectModal((prev) => ({ ...prev, remark: event.target.value }))}
              />
            <//>
          `}
    </div>
  `;
}
