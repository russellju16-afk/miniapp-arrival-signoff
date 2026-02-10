import { antd, html, useEffect, useMemo, useState } from "../utils/runtime.js";
import {
  cancelAdminOrder,
  copyText,
  getAdminOrderDetail,
  listAdminOrders,
  retryAdminOrderWriteback
} from "../services/adminApi.js";
import { PageGuard } from "../components/PageGuard.js";

const {
  Alert,
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  message
} = antd;

const ORDER_STATUS_OPTIONS = [
  { label: "全部状态", value: "" },
  { label: "待写回", value: "CREATED" },
  { label: "推送失败", value: "WRITEBACK_FAILED" },
  { label: "已确认", value: "CONFIRMED" },
  { label: "已取消", value: "CANCELED" }
];

function statusColor(status) {
  if (status === "CONFIRMED") return "success";
  if (status === "WRITEBACK_FAILED") return "error";
  if (status === "CREATED") return "processing";
  if (status === "CANCELED") return "error";
  return "warning";
}

function statusText(status) {
  if (status === "CONFIRMED") return "已确认";
  if (status === "WRITEBACK_FAILED") return "推送失败";
  if (status === "CREATED") return "待写回";
  if (status === "CANCELED") return "已取消";
  return status || "-";
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

function formatAmount(value, currency = "CNY") {
  const number = Number(value || 0);
  return `${currency} ${number.toFixed(2)}`;
}

function WritebackLogTimeline(props) {
  const { logs } = props;

  if (!Array.isArray(logs) || logs.length === 0) {
    return html`<${Empty} description="暂无推送记录" />`;
  }

  return html`
    <${Timeline}
      items=${logs.map((log) => ({
        color: log.success ? "green" : "red",
        children: html`
          <div style=${{ marginBottom: 6 }}>
            <${Space} size="small" wrap=${true}>
              <${Tag} color=${log.success ? "success" : "error"}>${log.success ? "成功" : "失败"}<//>
              <span>${formatDateTime(log.createdAt)}</span>
              <span>${log.summary || log.errorMessage || "-"}</span>
            <//>
          </div>
          <div style=${{ marginBottom: 4 }}>
            <${Space} size="small" wrap=${true}>
              <span className="admin-muted">请求编号: ${log.requestId || "-"}</span>
              ${log.requestId
                ? html`<${Button} size="small" type="link" onClick=${() => copyText(log.requestId).then(() => message.success("请求编号已复制"))}>复制<//>`
                : null}
              <span className="admin-muted">追踪编号: ${log.traceId || "-"}</span>
              ${log.traceId
                ? html`<${Button} size="small" type="link" onClick=${() => copyText(log.traceId).then(() => message.success("追踪编号已复制"))}>复制<//>`
                : null}
            <//>
          </div>
          ${log.errorCode || log.errorMessage
            ? html`<div className="admin-muted">${log.errorCode || "-"} ${log.errorMessage || ""}</div>`
            : null}
        `
      }))}
    />
  `;
}

export function OrdersPage(props) {
  const { loggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20
  });
  const [filters, setFilters] = useState({
    status: "",
    orderNo: "",
    customerId: ""
  });
  const [drawer, setDrawer] = useState({
    open: false,
    orderId: "",
    loading: false,
    error: "",
    data: null
  });
  const [actioningOrderId, setActioningOrderId] = useState("");
  const [cancelModal, setCancelModal] = useState({
    open: false,
    orderId: "",
    orderNo: "",
    submitting: false
  });
  const [cancelForm] = Form.useForm();

  const query = useMemo(
    () => ({
      page: data.page,
      pageSize: data.pageSize,
      status: filters.status,
      orderNo: filters.orderNo,
      customerId: filters.customerId
    }),
    [data.page, data.pageSize, filters]
  );

  const loadList = async (next = {}) => {
    if (!loggedIn) {
      return;
    }
    const nextQuery = {
      ...query,
      ...next
    };
    setLoading(true);
    setError("");
    try {
      const result = await listAdminOrders(nextQuery);
      setData({
        items: Array.isArray(result.items) ? result.items : [],
        total: Number(result.total || 0),
        page: Number(result.page || nextQuery.page || 1),
        pageSize: Number(result.pageSize || nextQuery.pageSize || 20)
      });
    } catch (err) {
      setError(err?.message || "加载订单列表失败");
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (orderId) => {
    setDrawer((prev) => ({ ...prev, open: true, orderId, loading: true, error: "", data: null }));
    try {
      const detail = await getAdminOrderDetail(orderId);
      setDrawer((prev) => ({ ...prev, loading: false, data: detail, error: "" }));
    } catch (err) {
      setDrawer((prev) => ({ ...prev, loading: false, error: err?.message || "加载订单详情失败" }));
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setData({ items: [], total: 0, page: 1, pageSize: 20 });
      setError("");
      return;
    }
    loadList({ page: 1 });
  }, [loggedIn]);

  const openRetryConfirm = (row) => {
    Modal.confirm({
      title: `确认重新推送订单 ${row.orderNo} 吗？`,
      content: "系统会再次把该订单推送到金蝶。",
      okText: "确认重试",
      cancelText: "取消",
      onOk: async () => {
        setActioningOrderId(row.id);
        try {
          await retryAdminOrderWriteback(row.id);
          message.success("已发起重新推送");
          await loadList();
          if (drawer.open && drawer.orderId === row.id) {
            await loadDetail(row.id);
          }
        } finally {
          setActioningOrderId("");
        }
      }
    });
  };

  const openCancelModal = (row) => {
    cancelForm.setFieldsValue({ remark: "" });
    setCancelModal({
      open: true,
      orderId: row.id,
      orderNo: row.orderNo,
      submitting: false
    });
  };

  const submitCancel = async () => {
    const values = await cancelForm.validateFields();
    setCancelModal((prev) => ({ ...prev, submitting: true }));
    try {
      await cancelAdminOrder(cancelModal.orderId, values.remark || "");
      message.success("订单已取消");
      setCancelModal({ open: false, orderId: "", orderNo: "", submitting: false });
      await loadList();
      if (drawer.open && drawer.orderId === cancelModal.orderId) {
        await loadDetail(cancelModal.orderId);
      }
    } finally {
      setCancelModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNo",
      key: "orderNo",
      width: 180,
      render: (value, row) => html`
        <${Space} size="small" direction="vertical">
          <span>${value}</span>
          <span className="admin-muted">编号: ${row.id}</span>
        <//>
      `
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value) => html`<${Tag} color=${statusColor(value)}>${statusText(value)}<//>`
    },
    {
      title: "客户",
      key: "customer",
      width: 220,
      render: (_, row) => html`
        <${Space} direction="vertical" size=${0}>
          <span>${row.customer?.name || "-"}</span>
          <span className="admin-muted">${row.customer?.id || "-"}</span>
        <//>
      `
    },
    {
      title: "金额",
      key: "totalAmount",
      width: 130,
      render: (_, row) => formatAmount(row.totalAmount, row.currency)
    },
    {
      title: "最近推送情况",
      key: "latestWriteback",
      render: (_, row) => {
        const latest = row.latestWriteback;
        if (!latest) {
          return html`<span className="admin-muted">-</span>`;
        }
        return html`
          <${Space} direction="vertical" size=${0}>
            <${Space} size="small" wrap=${true}>
              <${Tag} color=${latest.success ? "success" : "error"}>${latest.success ? "成功" : "失败"}<//>
              <span>${latest.summary || latest.errorMessage || "-"}</span>
            <//>
            <span className="admin-muted">${formatDateTime(latest.createdAt)}</span>
          <//>
        `;
      }
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value) => formatDateTime(value)
    },
    {
      title: "操作",
      key: "actions",
      width: 250,
      fixed: "right",
      render: (_, row) => {
        const retryDisabled = !["WRITEBACK_FAILED", "CREATED"].includes(row.status);
        const cancelDisabled = !["WRITEBACK_FAILED", "CREATED"].includes(row.status);
        return html`
          <${Space}>
            <${Button} size="small" onClick=${() => loadDetail(row.id)}>详情<//>
            <${Button}
              size="small"
              type="primary"
              disabled=${retryDisabled}
              loading=${actioningOrderId === row.id}
              onClick=${() => openRetryConfirm(row)}
            >
              重新推送
            <//>
            <${Button}
              size="small"
              danger=${true}
              disabled=${cancelDisabled}
              onClick=${() => openCancelModal(row)}
            >
              取消订单
            <//>
          <//>
        `;
      }
    }
  ];

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">订单跟进</div>
        <div className="page-subtitle">支持筛选、查看详情、重新推送、取消订单</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            <${Card}>
              <div className="page-toolbar">
                <div className="toolbar-left">
                  <${Select}
                    value=${filters.status}
                    style=${{ width: 170 }}
                    options=${ORDER_STATUS_OPTIONS}
                    onChange=${(value) => setFilters((prev) => ({ ...prev, status: value || "" }))}
                  />
                  <${Input}
                    allowClear=${true}
                    placeholder="订单号"
                    value=${filters.orderNo}
                    style=${{ width: 190 }}
                    onChange=${(event) =>
                      setFilters((prev) => ({ ...prev, orderNo: event.target.value }))}
                  />
                  <${Input}
                    allowClear=${true}
                    placeholder="客户编号"
                    value=${filters.customerId}
                    style=${{ width: 210 }}
                    onChange=${(event) =>
                      setFilters((prev) => ({ ...prev, customerId: event.target.value }))}
                  />
                  <${Button} type="primary" onClick=${() => loadList({ page: 1 })}>查询<//>
                </div>
                <div className="toolbar-right">
                  <${Button} onClick=${() => loadList()}>刷新<//>
                </div>
              </div>

              ${error
                ? html`<${Alert}
                    type="error"
                    showIcon=${true}
                    message="加载失败"
                    description=${error}
                    style=${{ marginBottom: 12 }}
                  />`
                : null}

              <${Table}
                rowKey="id"
                loading=${loading}
                columns=${columns}
                dataSource=${data.items}
                scroll=${{ x: 1400 }}
                locale=${{
                  emptyText: html`<${Empty} description="暂无订单数据" />`
                }}
                pagination=${{
                  current: data.page,
                  pageSize: data.pageSize,
                  total: data.total,
                  showSizeChanger: true,
                  onChange: (page, pageSize) => loadList({ page, pageSize })
                }}
              />
            <//>

            <${Drawer}
              width=${960}
              title="订单详情"
              open=${drawer.open}
              onClose=${() => setDrawer({ open: false, orderId: "", loading: false, error: "", data: null })}
              destroyOnClose=${true}
            >
              ${drawer.loading
                ? html`<${Card} loading=${true}><//>`
                : drawer.error
                  ? html`<${Alert} type="error" showIcon=${true} message="加载订单详情失败" description=${drawer.error} />`
                  : !drawer.data
                    ? html`<${Empty} description="暂无详情" />`
                    : html`
                        <${Descriptions} bordered=${true} column=${2} size="small">
                          <${Descriptions.Item} label="订单号">${drawer.data.orderNo}<//>
                          <${Descriptions.Item} label="状态">
                            <${Tag} color=${statusColor(drawer.data.status)}>${statusText(drawer.data.status)}<//>
                          <//>
                          <${Descriptions.Item} label="客户">${drawer.data.customer?.name || "-"}<//>
                          <${Descriptions.Item} label="客户编号">${drawer.data.customer?.id || "-"}<//>
                          <${Descriptions.Item} label="金蝶客户编号">${drawer.data.customer?.kingdeeCustomerId || "-"}<//>
                          <${Descriptions.Item} label="金额">${formatAmount(drawer.data.totalAmount, drawer.data.currency)}<//>
                          <${Descriptions.Item} label="创建时间">${formatDateTime(drawer.data.createdAt)}<//>
                          <${Descriptions.Item} label="更新时间">${formatDateTime(drawer.data.updatedAt)}<//>
                          <${Descriptions.Item} label="备注" span=${2}>${drawer.data.remark || "-"}<//>
                        <//>

                        <${Card} title="行项目" style=${{ marginTop: 12 }}>
                          <${Table}
                            rowKey="id"
                            size="small"
                            pagination=${false}
                            dataSource=${drawer.data.lines || []}
                            columns=${[
                              { title: "商品", dataIndex: "productName", key: "productName" },
                              { title: "规格名称", dataIndex: "skuName", key: "skuName" },
                              { title: "规格编码", dataIndex: "skuCode", key: "skuCode" },
                              { title: "数量", dataIndex: "qty", key: "qty", width: 90 },
                              {
                                title: "单价",
                                key: "unitPrice",
                                width: 120,
                                render: (_, row) => formatAmount(row.unitPrice, drawer.data.currency)
                              },
                              {
                                title: "小计",
                                key: "lineAmount",
                                width: 120,
                                render: (_, row) => formatAmount(row.lineAmount, drawer.data.currency)
                              }
                            ]}
                            locale=${{
                              emptyText: html`<${Empty} description="暂无商品明细" />`
                            }}
                          />
                        <//>

                        <${Card} title="推送日志" style=${{ marginTop: 12 }}>
                          <${WritebackLogTimeline} logs=${drawer.data.writebackLogs || []} />
                        <//>
                      `}
            <//>

            <${Modal}
              title=${`取消订单 ${cancelModal.orderNo}`}
              open=${cancelModal.open}
              onCancel=${() => setCancelModal({ open: false, orderId: "", orderNo: "", submitting: false })}
              onOk=${submitCancel}
              confirmLoading=${cancelModal.submitting}
              okButtonProps=${{ danger: true }}
              okText="确认取消"
              destroyOnClose=${true}
            >
              <${Form} form=${cancelForm} layout="vertical">
                <${Form.Item}
                  label="取消备注"
                  name="remark"
                  rules=${[{ required: true, message: "请输入取消备注" }]}
                >
                  <${Input.TextArea}
                    rows=${4}
                    maxLength=${300}
                    placeholder="请输入取消原因，便于审计"
                  />
                <//>
              <//>
            <//>
          `}
    </div>
  `;
}
