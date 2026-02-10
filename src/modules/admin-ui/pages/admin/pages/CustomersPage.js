import { antd, html, useEffect, useMemo, useState } from "../utils/runtime.js";
import {
  copyText,
  issueCustomerToken,
  listCustomers
} from "../services/adminApi.js";
import { PageGuard } from "../components/PageGuard.js";

const {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message
} = antd;

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

function statusColor(status) {
  if (status === "ACTIVE") return "success";
  if (status === "PENDING") return "warning";
  if (status === "REJECTED") return "error";
  return "default";
}

function statusText(status) {
  if (status === "ACTIVE") return "可用";
  if (status === "PENDING") return "待审核";
  if (status === "REJECTED") return "已拒绝";
  return status || "-";
}

export function CustomersPage(props) {
  const { loggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tokenModal, setTokenModal] = useState({
    open: false,
    submitting: false,
    customer: null,
    issueResult: null
  });
  const [tokenForm] = Form.useForm();

  const refresh = async () => {
    if (!loggedIn) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const list = await listCustomers();
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || "加载客户列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setItems([]);
      setError("");
      return;
    }
    refresh();
  }, [loggedIn]);

  const filteredItems = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      if (!text) {
        return true;
      }
      const haystack = [
        item.id,
        item.name,
        item.phone,
        item.companyName,
        item.contactName,
        item.contactPhone,
        item.kingdeeCustomerId,
        item.wechatOpenid
      ]
        .map((entry) => String(entry || "").toLowerCase())
        .join(" ");
      return haystack.includes(text);
    });
  }, [items, keyword, statusFilter]);

  const openIssueTokenModal = (customer) => {
    tokenForm.setFieldsValue({
      customerId: customer?.id || "",
      kingdeeCustomerId: customer?.kingdeeCustomerId || "",
      name: customer?.name || "",
      phone: customer?.phone || "",
      ttlDays: 30
    });
    setTokenModal({
      open: true,
      submitting: false,
      customer,
      issueResult: null
    });
  };

  const closeTokenModal = () => {
    setTokenModal({
      open: false,
      submitting: false,
      customer: null,
      issueResult: null
    });
    tokenForm.resetFields();
  };

  const submitIssueToken = async () => {
    const values = await tokenForm.validateFields();
    const customerId = String(values.customerId || "").trim();
    const kingdeeCustomerId = String(values.kingdeeCustomerId || "").trim();
    if (!customerId && !kingdeeCustomerId) {
      message.warning("“客户编号”和“金蝶客户编号”至少填写一个");
      return;
    }

    setTokenModal((prev) => ({ ...prev, submitting: true }));
    try {
      const result = await issueCustomerToken({
        customerId: customerId || undefined,
        kingdeeCustomerId: kingdeeCustomerId || undefined,
        name: String(values.name || "").trim() || undefined,
        phone: String(values.phone || "").trim() || undefined,
        ttlDays: Number(values.ttlDays || 30)
      });
      setTokenModal((prev) => ({ ...prev, submitting: false, issueResult: result }));
      await refresh();
      message.success("客户登录凭证生成成功");
    } catch {
      setTokenModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const columns = [
    {
      title: "客户",
      key: "name",
      width: 240,
      render: (_, row) => html`
        <${Space} direction="vertical" size=${0}>
          <span>${row.name || "-"}</span>
          <span className="admin-muted">${row.id}</span>
        <//>
      `
    },
    {
      title: "联系电话",
      key: "phone",
      width: 130,
      render: (_, row) => row.phone || row.contactPhone || "-"
    },
    {
      title: "金蝶客户编号",
      dataIndex: "kingdeeCustomerId",
      key: "kingdeeCustomerId",
      width: 180,
      render: (value) => value || "-"
    },
    {
      title: "微信身份标识",
      dataIndex: "wechatOpenid",
      key: "wechatOpenid",
      width: 220,
      render: (value) => value || "-"
    },
    {
      title: "登录凭证(掩码)",
      dataIndex: "accessTokenMasked",
      key: "accessTokenMasked",
      width: 170,
      render: (value) => value || "-"
    },
    {
      title: "凭证到期时间",
      dataIndex: "tokenExpiresAt",
      key: "tokenExpiresAt",
      width: 180,
      render: (value) => formatDateTime(value)
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value) => html`<${Tag} color=${statusColor(value)}>${statusText(value)}<//>`
    },
    {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 230,
      render: (_, row) => html`
        <${Space}>
          <${Button} size="small" type="primary" onClick=${() => openIssueTokenModal(row)}>
            生成/刷新登录凭证
          <//>
          <${Button}
            size="small"
            onClick=${() =>
              copyText(row.id)
                .then(() => message.success("客户编号已复制"))
                .catch(() => message.error("复制失败"))}
          >
            复制客户编号
          <//>
        <//>
      `
    }
  ];

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">客户管理</div>
        <div className="page-subtitle">查看客户绑定信息，并生成小程序登录凭证</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            <${Card}>
              <div className="page-toolbar">
                <div className="toolbar-left">
                  <${Input.Search}
                    allowClear=${true}
                    placeholder="搜索客户/手机号/金蝶客户编号/微信身份标识"
                    value=${keyword}
                    onChange=${(event) => setKeyword(event.target.value)}
                    onSearch=${(value) => setKeyword(value)}
                    style=${{ width: 320 }}
                  />
                  <${Select}
                    allowClear=${true}
                    placeholder="状态筛选"
                    value=${statusFilter || undefined}
                    onChange=${(value) => setStatusFilter(value || "")}
                    style=${{ width: 170 }}
                    options=${[
                      { label: "可用", value: "ACTIVE" },
                      { label: "待审核", value: "PENDING" },
                      { label: "已拒绝", value: "REJECTED" }
                    ]}
                  />
                </div>
                <div className="toolbar-right">
                  <${Button} onClick=${refresh}>刷新<//>
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
                dataSource=${filteredItems}
                scroll=${{ x: 1500 }}
                pagination=${{ pageSize: 20, showSizeChanger: true }}
                locale=${{
                  emptyText: html`<${Empty} description="暂无客户数据" />`
                }}
              />
            <//>

            <${Modal}
              title="生成/刷新客户登录凭证"
              open=${tokenModal.open}
              onCancel=${closeTokenModal}
              onOk=${submitIssueToken}
              confirmLoading=${tokenModal.submitting}
              okText="确认生成"
              width=${620}
              destroyOnClose=${true}
            >
              <${Form} layout="vertical" form=${tokenForm}>
                <${Form.Item} label="客户编号" name="customerId">
                  <${Input} placeholder="可选，优先用这个编号定位客户" />
                <//>
                <${Form.Item} label="金蝶客户编号" name="kingdeeCustomerId">
                  <${Input} placeholder="可选，可与“客户编号”二选一" />
                <//>
                <${Form.Item} label="客户名称" name="name">
                  <${Input} placeholder="可选" />
                <//>
                <${Form.Item} label="手机号" name="phone">
                  <${Input} placeholder="可选" />
                <//>
                <${Form.Item}
                  label="有效期(天)"
                  name="ttlDays"
                  rules=${[
                    { required: true, message: "请输入有效天数" },
                    {
                      validator: (_, value) => {
                        const num = Number(value);
                        if (!Number.isInteger(num) || num <= 0) {
                          return Promise.reject(new Error("有效天数必须是大于 0 的整数"));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <${Input} type="number" min=${1} />
                <//>
              <//>

              ${tokenModal.issueResult
                ? html`
                    <${Alert}
                      type="success"
                      showIcon=${true}
                      style=${{ marginTop: 12 }}
                      message="生成成功"
                      description=${html`
                        <${Space} direction="vertical" style=${{ width: "100%" }}>
                          <div>到期时间：${formatDateTime(tokenModal.issueResult.tokenExpiresAt)}</div>
                          <${Input}
                            readOnly=${true}
                            value=${tokenModal.issueResult.accessToken || ""}
                          />
                          <${Space}>
                            <${Button}
                              size="small"
                              onClick=${() =>
                                copyText(tokenModal.issueResult.accessToken || "")
                                  .then(() => message.success("登录凭证已复制"))
                                  .catch(() => message.error("复制失败"))}
                            >
                              复制登录凭证
                            <//>
                            <span className="admin-muted">
                              客户: ${tokenModal.issueResult.customer?.name || "-"}
                            </span>
                          <//>
                        <//>
                      `}
                    />
                  `
                : null}
            <//>
          `}
    </div>
  `;
}
