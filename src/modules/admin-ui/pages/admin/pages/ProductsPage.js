import { antd, html, useEffect, useMemo, useRef, useState } from "../utils/runtime.js";
import {
  copyText,
  listAdminKingdeeMaterials,
  listAdminProducts,
  oneClickListKingdeeProducts,
  uploadAdminImage,
  upsertAdminProduct,
  upsertAdminProductSku
} from "../services/adminApi.js";
import { PageGuard } from "../components/PageGuard.js";

const {
  Alert,
  Button,
  Card,
  Descriptions,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  message
} = antd;

const PRODUCT_STATUS_OPTIONS = [
  { label: "全部状态", value: "" },
  { label: "上架中", value: "ACTIVE" },
  { label: "已下架", value: "INACTIVE" },
  { label: "已禁用", value: "DISABLED" }
];

const COVER_IMAGE_MAX_SIZE_BYTES = 3 * 1024 * 1024;
const COVER_IMAGE_ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif"
]);
const KINGDEE_PICKER_DEFAULT_PAGE_SIZE = 10;

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

function normalizeJsonText(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    return {};
  }
  return JSON.parse(text);
}

function productStatusColor(status) {
  if (status === "ACTIVE") return "success";
  if (status === "INACTIVE") return "warning";
  if (status === "DISABLED") return "error";
  return "default";
}

function productStatusText(status) {
  if (status === "ACTIVE") return "上架中";
  if (status === "INACTIVE") return "已下架";
  if (status === "DISABLED") return "已禁用";
  return status || "-";
}

function kingdeeEnabledColor(enabled) {
  if (enabled === true) return "success";
  if (enabled === false) return "error";
  return "default";
}

function kingdeeEnabledText(enabled, enabledText) {
  if (typeof enabledText === "string" && enabledText.trim()) {
    return enabledText.trim();
  }
  if (enabled === true) return "可用";
  if (enabled === false) return "禁用";
  return "未知";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("读取图片失败，请重试"));
    reader.readAsDataURL(file);
  });
}

export function ProductsPage(props) {
  const { loggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [actioningProductId, setActioningProductId] = useState("");
  const [productModal, setProductModal] = useState({
    open: false,
    submitting: false,
    editing: null
  });
  const [productForm] = Form.useForm();
  const coverFileInputRef = useRef(null);
  const [coverUpload, setCoverUpload] = useState({
    previewUrl: "",
    uploading: false,
    error: ""
  });

  const [drawer, setDrawer] = useState({
    open: false,
    loading: false,
    error: "",
    product: null
  });

  const [skuModal, setSkuModal] = useState({
    open: false,
    submitting: false,
    editing: null
  });
  const [skuForm] = Form.useForm();
  const [kingdeeModal, setKingdeeModal] = useState({
    open: false,
    loading: false,
    submitting: false,
    error: "",
    page: 1,
    pageSize: KINGDEE_PICKER_DEFAULT_PAGE_SIZE,
    total: 0,
    keyword: "",
    items: [],
    selectedMap: {}
  });

  const loadProducts = async (status = statusFilter) => {
    if (!loggedIn) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const list = await listAdminProducts(status || "");
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || "加载商品列表失败");
    } finally {
      setLoading(false);
    }
  };

  const loadProductDetail = async (productId) => {
    setDrawer((prev) => ({ ...prev, open: true, loading: true, error: "", product: null }));
    try {
      const all = await listAdminProducts("");
      const product = (all || []).find((item) => item.id === productId) || null;
      if (!product) {
        throw new Error("商品不存在或已删除");
      }
      setDrawer({ open: true, loading: false, error: "", product });
    } catch (err) {
      setDrawer({
        open: true,
        loading: false,
        error: err?.message || "加载商品详情失败",
        product: null
      });
    }
  };

  const loadKingdeeMaterials = async (options = {}) => {
    if (!loggedIn) {
      return;
    }
    const nextPage = Number(options.page || kingdeeModal.page || 1);
    const nextPageSize = Number(options.pageSize || kingdeeModal.pageSize || KINGDEE_PICKER_DEFAULT_PAGE_SIZE);
    const nextKeyword =
      typeof options.keyword === "string" ? options.keyword : String(kingdeeModal.keyword || "");
    setKingdeeModal((prev) => ({
      ...prev,
      loading: true,
      error: "",
      page: nextPage,
      pageSize: nextPageSize,
      keyword: nextKeyword
    }));

    try {
      const payload = await listAdminKingdeeMaterials({
        page: nextPage,
        pageSize: nextPageSize,
        search: nextKeyword.trim()
      });
      setKingdeeModal((prev) => ({
        ...prev,
        loading: false,
        error: "",
        page: Number(payload?.page || nextPage),
        pageSize: Number(payload?.pageSize || nextPageSize),
        total: Number(payload?.total || 0),
        items: Array.isArray(payload?.items) ? payload.items : []
      }));
    } catch (err) {
      setKingdeeModal((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "加载金蝶商品列表失败"
      }));
    }
  };

  const openKingdeeModal = () => {
    setKingdeeModal((prev) => ({
      ...prev,
      open: true,
      error: "",
      page: 1,
      pageSize: KINGDEE_PICKER_DEFAULT_PAGE_SIZE,
      keyword: "",
      items: [],
      total: 0,
      selectedMap: {}
    }));
    loadKingdeeMaterials({
      page: 1,
      pageSize: KINGDEE_PICKER_DEFAULT_PAGE_SIZE,
      keyword: ""
    });
  };

  const closeKingdeeModal = () => {
    setKingdeeModal((prev) => ({
      ...prev,
      open: false,
      submitting: false
    }));
  };

  const setKingdeeRowSelected = (row, selected) => {
    const key = String(row?.materialId || row?.materialNumber || "").trim();
    if (!key) {
      return;
    }
    setKingdeeModal((prev) => {
      const nextMap = { ...prev.selectedMap };
      if (selected) {
        nextMap[key] = row;
      } else {
        delete nextMap[key];
      }
      return {
        ...prev,
        selectedMap: nextMap
      };
    });
  };

  const submitKingdeeOneClickListing = async () => {
    const selectedItems = Object.values(kingdeeModal.selectedMap || {});
    if (!selectedItems.length) {
      message.warning("请先选择要上架的金蝶商品");
      return;
    }

    setKingdeeModal((prev) => ({
      ...prev,
      submitting: true
    }));
    try {
      const result = await oneClickListKingdeeProducts({
        items: selectedItems.map((item) => ({
          materialId: item.materialId || undefined,
          materialNumber: item.materialNumber || undefined,
          materialName: item.materialName || undefined,
          materialModel: item.materialModel || undefined,
          unitId: item.unitId || undefined,
          coverImageUrl: item.coverImageUrl || undefined
        }))
      });
      const successCount = Number(result?.successCount || 0);
      const failedCount = Number(result?.failedCount || 0);
      const createdProducts = Number(result?.createdProducts || 0);
      const updatedProducts = Number(result?.updatedProducts || 0);
      if (failedCount > 0) {
        message.warning(
          `已上架 ${successCount} 个（新增 ${createdProducts} / 更新 ${updatedProducts}），失败 ${failedCount} 个`
        );
      } else {
        message.success(`一键上架完成：共 ${successCount} 个（新增 ${createdProducts} / 更新 ${updatedProducts}）`);
      }
      setKingdeeModal((prev) => ({
        ...prev,
        open: false,
        submitting: false,
        selectedMap: {}
      }));
      await loadProducts(statusFilter);
    } catch {
      setKingdeeModal((prev) => ({
        ...prev,
        submitting: false
      }));
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setItems([]);
      setError("");
      return;
    }
    loadProducts("");
  }, [loggedIn]);

  const filteredItems = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) {
      return items;
    }
    return items.filter((item) => {
      const source = [item.code, item.name, item.kingdeeMaterialId]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");
      return source.includes(text);
    });
  }, [items, keyword]);

  const kingdeeSelectedRowKeys = useMemo(
    () => Object.keys(kingdeeModal.selectedMap || {}),
    [kingdeeModal.selectedMap]
  );

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

  const renderEllipsis = (value, maxWidth = 220) => {
    const text = String(value || "").trim();
    if (!text) {
      return "-";
    }
    return html`
      <${Tooltip} title=${text}>
        <span className="cell-ellipsis" style=${{ maxWidth: `${maxWidth}px` }}>${text}</span>
      <//>
    `;
  };

  const resetCoverUploadState = (previewUrl = "") => {
    setCoverUpload({
      previewUrl: String(previewUrl || "").trim(),
      uploading: false,
      error: ""
    });
  };

  const updateCoverUrl = (url) => {
    const next = String(url || "");
    productForm.setFieldValue("coverImageUrl", next);
    setCoverUpload((prev) => ({
      ...prev,
      previewUrl: next.trim(),
      error: ""
    }));
  };

  const uploadCoverFile = async (file) => {
    if (!file) {
      return;
    }
    if (!COVER_IMAGE_ALLOWED_TYPES.has(String(file.type || "").toLowerCase())) {
      message.error("仅支持 PNG/JPG/WEBP/GIF 图片");
      return;
    }
    if (Number(file.size || 0) > COVER_IMAGE_MAX_SIZE_BYTES) {
      message.error("图片不能超过 3MB");
      return;
    }

    setCoverUpload((prev) => ({ ...prev, uploading: true, error: "" }));
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploaded = await uploadAdminImage({
        dataUrl,
        filename: file.name,
        folder: "products"
      });
      const nextUrl = String(uploaded?.url || "").trim();
      if (!nextUrl) {
        throw new Error("上传成功但未返回图片地址");
      }
      productForm.setFieldValue("coverImageUrl", nextUrl);
      setCoverUpload({
        previewUrl: nextUrl,
        uploading: false,
        error: ""
      });
      message.success("图片上传成功，已自动填入封面地址");
    } catch (err) {
      const errorText = err?.message || "图片上传失败";
      setCoverUpload((prev) => ({ ...prev, uploading: false, error: errorText }));
      message.error(errorText);
    }
  };

  const onCoverFileChange = async (event) => {
    const file = event?.target?.files?.[0];
    if (event?.target) {
      event.target.value = "";
    }
    await uploadCoverFile(file);
  };

  const onCoverPaste = async (event) => {
    const list = Array.from(event?.clipboardData?.files || []);
    const imageFile = list.find((item) => String(item.type || "").startsWith("image/"));
    if (!imageFile) {
      return;
    }
    event.preventDefault();
    await uploadCoverFile(imageFile);
  };

  const openCreateProduct = () => {
    productForm.setFieldsValue({
      id: "",
      code: "",
      name: "",
      description: "",
      coverImageUrl: "",
      status: "ACTIVE",
      defaultUnitId: "",
      kingdeeMaterialId: ""
    });
    resetCoverUploadState("");
    setProductModal({ open: true, submitting: false, editing: null });
  };

  const openEditProduct = (product) => {
    productForm.setFieldsValue({
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description || "",
      coverImageUrl: product.coverImageUrl || "",
      status: product.status || "ACTIVE",
      defaultUnitId: product.defaultUnitId || "",
      kingdeeMaterialId: product.kingdeeMaterialId || ""
    });
    resetCoverUploadState(product.coverImageUrl || "");
    setProductModal({ open: true, submitting: false, editing: product });
  };

  const closeProductModal = () => {
    setProductModal({ open: false, submitting: false, editing: null });
    productForm.resetFields();
    resetCoverUploadState("");
  };

  const submitProduct = async () => {
    const values = await productForm.validateFields();
    setProductModal((prev) => ({ ...prev, submitting: true }));
    try {
      const saved = await upsertAdminProduct({
        id: values.id || undefined,
        code: String(values.code || "").trim(),
        name: String(values.name || "").trim(),
        description: String(values.description || "").trim() || undefined,
        coverImageUrl: String(values.coverImageUrl || "").trim() || undefined,
        status: values.status || "ACTIVE",
        defaultUnitId: String(values.defaultUnitId || "").trim() || undefined,
        kingdeeMaterialId: String(values.kingdeeMaterialId || "").trim() || undefined
      });
      message.success("商品保存成功");
      closeProductModal();
      await loadProducts(statusFilter);
      if (drawer.open && drawer.product?.id === saved.id) {
        await loadProductDetail(saved.id);
      }
    } catch {
      setProductModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const updateProductStatus = async (row, nextStatus) => {
    Modal.confirm({
      title: `确认将商品 ${row.code} 状态改为 ${nextStatus}？`,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        setActioningProductId(row.id);
        try {
          await upsertAdminProduct({
            id: row.id,
            code: row.code,
            name: row.name,
            description: row.description || undefined,
            coverImageUrl: row.coverImageUrl || undefined,
            status: nextStatus,
            defaultUnitId: row.defaultUnitId || undefined,
            kingdeeMaterialId: row.kingdeeMaterialId || undefined
          });
          message.success("状态更新成功");
          await loadProducts(statusFilter);
          if (drawer.open && drawer.product?.id === row.id) {
            await loadProductDetail(row.id);
          }
        } finally {
          setActioningProductId("");
        }
      }
    });
  };

  const openCreateSku = () => {
    if (!drawer.product) {
      return;
    }
    skuForm.setFieldsValue({
      id: "",
      skuCode: "",
      skuName: "",
      specsText: "{}",
      price: 0,
      stock: 0,
      status: "ACTIVE",
      unitId: drawer.product.defaultUnitId || "",
      kingdeeMaterialId: ""
    });
    setSkuModal({ open: true, submitting: false, editing: null });
  };

  const openEditSku = (sku) => {
    skuForm.setFieldsValue({
      id: sku.id,
      skuCode: sku.skuCode,
      skuName: sku.skuName,
      specsText: JSON.stringify(sku.specs || {}, null, 2),
      price: Number(sku.price || 0),
      stock: Number(sku.stock || 0),
      status: sku.status || "ACTIVE",
      unitId: sku.unitId || "",
      kingdeeMaterialId: sku.kingdeeMaterialId || ""
    });
    setSkuModal({ open: true, submitting: false, editing: sku });
  };

  const closeSkuModal = () => {
    setSkuModal({ open: false, submitting: false, editing: null });
    skuForm.resetFields();
  };

  const submitSku = async () => {
    if (!drawer.product) {
      message.error("请先选择商品");
      return;
    }
    const values = await skuForm.validateFields();
    let specs;
    try {
      specs = normalizeJsonText(values.specsText);
    } catch {
      message.error("规格内容格式不正确，请按示例填写");
      return;
    }

    setSkuModal((prev) => ({ ...prev, submitting: true }));
    try {
      await upsertAdminProductSku(drawer.product.id, {
        id: values.id || undefined,
        skuCode: String(values.skuCode || "").trim(),
        skuName: String(values.skuName || "").trim(),
        specs,
        price: Number(values.price || 0),
        stock: Number(values.stock || 0),
        status: values.status || "ACTIVE",
        unitId: String(values.unitId || "").trim() || undefined,
        kingdeeMaterialId: String(values.kingdeeMaterialId || "").trim() || undefined
      });
      message.success("规格保存成功");
      closeSkuModal();
      await loadProducts(statusFilter);
      await loadProductDetail(drawer.product.id);
    } catch {
      setSkuModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const productColumns = [
    {
      title: "封面",
      key: "cover",
      width: 90,
      render: (_, row) =>
        row.coverImageUrl
          ? html`<img className="table-cover-thumb" src=${row.coverImageUrl} alt="封面" />`
          : "-"
    },
    {
      title: "编码",
      dataIndex: "code",
      key: "code",
      width: 210,
      ellipsis: { showTitle: false },
      render: (value) => renderCopyable(value, 150)
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 240,
      ellipsis: { showTitle: false },
      render: (value) => renderEllipsis(value, 210)
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value) => html`<${Tag} color=${productStatusColor(value)}>${productStatusText(value)}<//>`
    },
    {
      title: "默认单位",
      dataIndex: "defaultUnitId",
      key: "defaultUnitId",
      width: 120,
      render: (value) => value || "-"
    },
    {
      title: "金蝶物料编号",
      dataIndex: "kingdeeMaterialId",
      key: "kingdeeMaterialId",
      width: 220,
      ellipsis: { showTitle: false },
      render: (value) => renderCopyable(value, 160)
    },
    {
      title: "规格数",
      key: "skuCount",
      width: 120,
      render: (_, row) =>
        html`<${Button} type="link" size="small" onClick=${() => loadProductDetail(row.id)}>
          ${row.skus?.length || 0}
        <//>`
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (value) => formatDateTime(value)
    },
    {
      title: "操作",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, row) => {
        const menu = {
          items: [
            { key: "edit", label: "编辑商品" },
            { key: "sku", label: "规格管理" },
            { type: "divider" },
            { key: "activate", label: "上架", disabled: row.status === "ACTIVE" },
            { key: "deactivate", label: "下架", disabled: row.status === "INACTIVE" },
            { key: "disable", label: "禁用", disabled: row.status === "DISABLED" }
          ],
          onClick: ({ key }) => {
            if (key === "edit") {
              openEditProduct(row);
              return;
            }
            if (key === "sku") {
              loadProductDetail(row.id);
              return;
            }
            if (key === "activate") {
              updateProductStatus(row, "ACTIVE");
              return;
            }
            if (key === "deactivate") {
              updateProductStatus(row, "INACTIVE");
              return;
            }
            if (key === "disable") {
              updateProductStatus(row, "DISABLED");
            }
          }
        };
        return html`
          <${Dropdown} menu=${menu} trigger=${["click"]}>
            <${Button} size="small" loading=${actioningProductId === row.id}>操作<//>
          <//>
        `;
      }
    }
  ];

  const kingdeeColumns = [
    {
      title: "金蝶物料ID",
      dataIndex: "materialId",
      key: "materialId",
      width: 220,
      ellipsis: { showTitle: false },
      render: (value) => renderCopyable(value, 170)
    },
    {
      title: "商品编码",
      dataIndex: "materialNumber",
      key: "materialNumber",
      width: 160,
      ellipsis: { showTitle: false },
      render: (value) => renderCopyable(value, 120)
    },
    {
      title: "商品名称",
      dataIndex: "materialName",
      key: "materialName",
      width: 240,
      ellipsis: { showTitle: false },
      render: (value) => renderEllipsis(value, 220)
    },
    {
      title: "规格型号",
      dataIndex: "materialModel",
      key: "materialModel",
      width: 170,
      ellipsis: { showTitle: false },
      render: (value) => renderEllipsis(value, 150)
    },
    {
      title: "默认单位",
      key: "unit",
      width: 150,
      render: (_, row) => row.unitName || row.unitId || "-"
    },
    {
      title: "可用状态",
      key: "enabled",
      width: 120,
      render: (_, row) =>
        html`<${Tag} color=${kingdeeEnabledColor(row.enabled)}>
          ${kingdeeEnabledText(row.enabled, row.enabledText)}
        <//>`
    }
  ];

  const skuColumns = [
    { title: "规格编码", dataIndex: "skuCode", key: "skuCode", width: 180, ellipsis: true },
    { title: "规格名称", dataIndex: "skuName", key: "skuName", width: 180, ellipsis: true },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      width: 110,
      render: (value) => Number(value || 0).toFixed(2)
    },
    { title: "库存", dataIndex: "stock", key: "stock", width: 90 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value) => html`<${Tag} color=${productStatusColor(value)}>${productStatusText(value)}<//>`
    },
    { title: "单位", dataIndex: "unitId", key: "unitId", width: 90, render: (value) => value || "-" },
    {
      title: "金蝶物料编号",
      dataIndex: "kingdeeMaterialId",
      key: "kingdeeMaterialId",
      width: 180,
      render: (value) => value || "-"
    },
    {
      title: "操作",
      key: "actions",
      width: 130,
      fixed: "right",
      render: (_, row) => html`
        <${Space}>
          <${Button} size="small" onClick=${() => openEditSku(row)}>编辑<//>
          <${Button}
            size="small"
            onClick=${() =>
              copyText(row.id)
                .then(() => message.success("规格编号已复制"))
                .catch(() => message.error("复制失败"))}
          >
            复制编号
          <//>
        <//>
      `
    }
  ];

  const emptyNode = html`
    <div className="table-empty-with-cta">
      <${Empty} description="暂无商品数据，可新增商品或后续接入导入模板流程" />
      <${Space}>
        <${Button} onClick=${openCreateProduct}>新增商品<//>
        <${Button} disabled=${true}>导入模板（占位）<//>
      <//>
    </div>
  `;

  const kingdeeEmptyNode = html`
    <div className="table-empty-with-cta">
      <${Empty} description="未找到可上架的金蝶商品，请调整搜索关键词或稍后刷新" />
      <${Button}
        onClick=${() =>
          loadKingdeeMaterials({
            page: 1,
            pageSize: kingdeeModal.pageSize,
            keyword: kingdeeModal.keyword
          })}
      >
        重新加载
      <//>
    </div>
  `;

  return html`
    <div>
      <div className="page-header">
        <div className="page-title">商品管理</div>
        <div className="page-subtitle">维护商品上架信息与规格映射（含金蝶物料编号）</div>
      </div>

      <${PageGuard} loggedIn=${loggedIn} />

      ${!loggedIn
        ? null
        : html`
            <${Card}>
              <div className="page-toolbar">
                <div className="toolbar-left">
                  <${Select}
                    value=${statusFilter}
                    style=${{ width: 170 }}
                    options=${PRODUCT_STATUS_OPTIONS}
                    onChange=${(value) => {
                      const next = value || "";
                      setStatusFilter(next);
                      loadProducts(next);
                    }}
                  />
                  <${Input.Search}
                    allowClear=${true}
                    value=${keyword}
                    style=${{ width: 280 }}
                    placeholder="搜索商品编码/名称/金蝶物料编号"
                    onChange=${(event) => setKeyword(event.target.value)}
                    onSearch=${(value) => setKeyword(value)}
                  />
                </div>
                <div className="toolbar-right">
                  <${Button} onClick=${() => loadProducts(statusFilter)}>刷新<//>
                  <${Button} onClick=${openKingdeeModal}>从金蝶一键上架<//>
                  <${Button} type="primary" onClick=${openCreateProduct}>新增商品<//>
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
                columns=${productColumns}
                dataSource=${filteredItems}
                scroll=${{ x: 1500 }}
                pagination=${{ pageSize: 20, showSizeChanger: true }}
                locale=${{
                  emptyText: emptyNode
                }}
              />
            <//>

            <${Modal}
              title="从金蝶商品列表选择并一键上架"
              open=${kingdeeModal.open}
              onCancel=${closeKingdeeModal}
              onOk=${submitKingdeeOneClickListing}
              okText=${`一键上架（${kingdeeSelectedRowKeys.length}）`}
              okButtonProps=${{ disabled: kingdeeSelectedRowKeys.length === 0 }}
              confirmLoading=${kingdeeModal.submitting}
              width=${1180}
            >
              <${Alert}
                type="info"
                showIcon=${true}
                style=${{ marginBottom: 12 }}
                message="先勾选金蝶商品，再点击“一键上架”即可自动同步到本地商品与SKU。重复上架会自动更新，不会重复新增。"
              />
              <div className="page-toolbar" style=${{ marginBottom: 8 }}>
                <div className="toolbar-left">
                  <${Input.Search}
                    allowClear=${true}
                    value=${kingdeeModal.keyword}
                    style=${{ width: 280 }}
                    placeholder="搜索金蝶商品编码/名称/规格"
                    onChange=${(event) =>
                      setKingdeeModal((prev) => ({
                        ...prev,
                        keyword: event.target.value
                      }))}
                    onSearch=${(value) =>
                      loadKingdeeMaterials({
                        page: 1,
                        pageSize: kingdeeModal.pageSize,
                        keyword: value
                      })}
                  />
                </div>
                <div className="toolbar-right">
                  <${Button}
                    onClick=${() =>
                      loadKingdeeMaterials({
                        page: kingdeeModal.page,
                        pageSize: kingdeeModal.pageSize,
                        keyword: kingdeeModal.keyword
                      })}
                  >
                    刷新
                  <//>
                </div>
              </div>

              ${kingdeeModal.error
                ? html`<${Alert}
                    type="error"
                    showIcon=${true}
                    message="加载金蝶商品失败"
                    description=${kingdeeModal.error}
                    style=${{ marginBottom: 12 }}
                  />`
                : null}

              <${Table}
                rowKey=${(row) => String(row.materialId || row.materialNumber || "")}
                loading=${kingdeeModal.loading}
                columns=${kingdeeColumns}
                dataSource=${kingdeeModal.items}
                scroll=${{ x: 980, y: 420 }}
                rowSelection=${{
                  selectedRowKeys: kingdeeSelectedRowKeys,
                  preserveSelectedRowKeys: true,
                  onSelect: (record, selected) => setKingdeeRowSelected(record, selected),
                  onSelectAll: (selected, selectedRows, changeRows) => {
                    setKingdeeModal((prev) => {
                      const nextMap = { ...prev.selectedMap };
                      for (const row of changeRows || []) {
                        const key = String(row?.materialId || row?.materialNumber || "").trim();
                        if (!key) {
                          continue;
                        }
                        if (selected) {
                          nextMap[key] = row;
                        } else {
                          delete nextMap[key];
                        }
                      }
                      return {
                        ...prev,
                        selectedMap: nextMap
                      };
                    });
                  }
                }}
                pagination=${{
                  current: kingdeeModal.page,
                  pageSize: kingdeeModal.pageSize,
                  total: kingdeeModal.total,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条`,
                  onChange: (page, pageSize) =>
                    loadKingdeeMaterials({
                      page,
                      pageSize,
                      keyword: kingdeeModal.keyword
                    })
                }}
                locale=${{
                  emptyText: kingdeeEmptyNode
                }}
              />
            <//>

            <${Modal}
              title=${productModal.editing ? "编辑商品" : "新增商品"}
              open=${productModal.open}
              onCancel=${closeProductModal}
              onOk=${submitProduct}
              confirmLoading=${productModal.submitting}
              width=${720}
              destroyOnClose=${true}
            >
              <${Form} form=${productForm} layout="vertical">
                <${Form.Item} name="id" hidden=${true}><${Input} /><//>
                <${Form.Item}
                  label="商品编码"
                  name="code"
                  rules=${[{ required: true, message: "请输入商品编码" }]}
                >
                  <${Input} placeholder="如 P-1001" />
                <//>
                <${Form.Item}
                  label="商品名称"
                  name="name"
                  rules=${[{ required: true, message: "请输入商品名称" }]}
                >
                  <${Input} />
                <//>
                <${Form.Item} label="描述" name="description"><${Input.TextArea} rows=${3} /><//>
                <${Form.Item} label="封面图地址" name="coverImageUrl">
                  <${Input}
                    placeholder="可粘贴图片链接，或点击下方按钮上传"
                    onChange=${(event) => {
                      setCoverUpload((prev) => ({
                        ...prev,
                        previewUrl: String(event.target.value || "").trim(),
                        error: ""
                      }));
                    }}
                    onPaste=${onCoverPaste}
                  />
                <//>
                <div className="image-upload-panel" onPaste=${onCoverPaste}>
                  <div className="image-upload-tip">
                    支持 PNG/JPG/WEBP/GIF，大小不超过 3MB。可直接粘贴截图后自动上传。
                  </div>
                  <div className="image-upload-actions">
                    <input
                      ref=${coverFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      style=${{ display: "none" }}
                      onChange=${onCoverFileChange}
                    />
                    <${Button}
                      loading=${coverUpload.uploading}
                      onClick=${() => coverFileInputRef.current && coverFileInputRef.current.click()}
                    >
                      上传本地图片
                    <//>
                    <${Button}
                      disabled=${!coverUpload.previewUrl}
                      onClick=${() => {
                        updateCoverUrl("");
                      }}
                    >
                      清空图片
                    <//>
                    <${Button}
                      disabled=${!coverUpload.previewUrl}
                      onClick=${() => window.open(coverUpload.previewUrl, "_blank", "noopener,noreferrer")}
                    >
                      新窗口预览
                    <//>
                  </div>
                  ${coverUpload.error
                    ? html`
                        <${Alert}
                          type="error"
                          showIcon=${true}
                          message="上传失败"
                          description=${coverUpload.error}
                          style=${{ marginTop: 8 }}
                        />
                      `
                    : null}
                  <div className="image-preview-box">
                    ${coverUpload.previewUrl
                      ? html`
                          <img
                            src=${coverUpload.previewUrl}
                            alt="封面预览"
                            onError=${() =>
                              setCoverUpload((prev) => ({
                                ...prev,
                                error: prev.error || "图片无法加载，请检查地址或重新上传"
                              }))}
                          />
                        `
                      : html`<span className="admin-muted">暂无封面预览</span>`}
                  </div>
                </div>
                <${Form.Item}
                  label="状态"
                  name="status"
                  rules=${[{ required: true, message: "请选择状态" }]}
                >
                  <${Select}
                    options=${[
                      { label: "上架中", value: "ACTIVE" },
                      { label: "已下架", value: "INACTIVE" },
                      { label: "已禁用", value: "DISABLED" }
                    ]}
                  />
                <//>
                <${Form.Item} label="默认单位" name="defaultUnitId">
                  <${Input} placeholder="如 Pcs" />
                <//>
                <${Form.Item} label="金蝶物料编号" name="kingdeeMaterialId"><${Input} /><//>
              <//>
            <//>

            <${Drawer}
              width=${980}
              title="商品详情 / 规格管理"
              open=${drawer.open}
              onClose=${() => setDrawer({ open: false, loading: false, error: "", product: null })}
              destroyOnClose=${true}
            >
              ${drawer.loading
                ? html`<${Card} loading=${true}><//>`
                : drawer.error
                  ? html`<${Alert}
                      type="error"
                      showIcon=${true}
                      message="加载商品详情失败"
                      description=${drawer.error}
                    />`
                  : !drawer.product
                    ? html`<${Empty} description="暂无商品详情" />`
                    : html`
                        <${Descriptions} column=${2} bordered=${true} size="small">
                          <${Descriptions.Item} label="商品编码">${drawer.product.code}<//>
                          <${Descriptions.Item} label="商品名称">${drawer.product.name}<//>
                          <${Descriptions.Item} label="状态">
                            <${Tag} color=${productStatusColor(drawer.product.status)}>
                              ${productStatusText(drawer.product.status)}
                            <//>
                          <//>
                          <${Descriptions.Item} label="默认单位">
                            ${drawer.product.defaultUnitId || "-"}
                          <//>
                          <${Descriptions.Item} label="金蝶物料编号">
                            ${drawer.product.kingdeeMaterialId || "-"}
                          <//>
                          <${Descriptions.Item} label="更新时间">
                            ${formatDateTime(drawer.product.updatedAt)}
                          <//>
                          <${Descriptions.Item} label="封面图" span=${2}>
                            ${drawer.product.coverImageUrl
                              ? html`<img className="drawer-cover-preview" src=${drawer.product.coverImageUrl} alt="封面图" />`
                              : "-"}
                          <//>
                          <${Descriptions.Item} label="描述" span=${2}>
                            ${drawer.product.description || "-"}
                          <//>
                        <//>

                        <${Card}
                          title="规格列表"
                          style=${{ marginTop: 12 }}
                          extra=${html`
                            <${Button} type="primary" size="small" onClick=${openCreateSku}>
                              新增规格
                            <//>
                          `}
                        >
                          <${Table}
                            rowKey="id"
                            dataSource=${drawer.product.skus || []}
                            columns=${skuColumns}
                            size="small"
                            scroll=${{ x: 1200 }}
                            pagination=${{ pageSize: 8, showSizeChanger: false }}
                            locale=${{
                              emptyText: html`<${Empty} description="暂无规格" />`
                            }}
                          />
                        <//>
                      `}
            <//>

            <${Modal}
              title=${skuModal.editing ? "编辑规格" : "新增规格"}
              open=${skuModal.open}
              onCancel=${closeSkuModal}
              onOk=${submitSku}
              confirmLoading=${skuModal.submitting}
              width=${760}
              destroyOnClose=${true}
            >
              <${Form} form=${skuForm} layout="vertical">
                <${Form.Item} name="id" hidden=${true}><${Input} /><//>
                <${Form.Item}
                  label="规格编码"
                  name="skuCode"
                  rules=${[{ required: true, message: "请输入规格编码" }]}
                >
                  <${Input} />
                <//>
                <${Form.Item}
                  label="规格名称"
                  name="skuName"
                  rules=${[{ required: true, message: "请输入规格名称" }]}
                >
                  <${Input} />
                <//>
                <${Form.Item} label="规格内容（结构化文本）" name="specsText">
                  <${Input.TextArea} rows=${5} placeholder='例如 {"颜色":"蓝色","尺码":"L"}' />
                <//>
                <${Form.Item}
                  label="价格"
                  name="price"
                  rules=${[{ required: true, message: "请输入价格" }]}
                >
                  <${Input} type="number" min=${0} step="0.01" />
                <//>
                <${Form.Item}
                  label="库存"
                  name="stock"
                  rules=${[{ required: true, message: "请输入库存" }]}
                >
                  <${Input} type="number" min=${0} step="1" />
                <//>
                <${Form.Item}
                  label="状态"
                  name="status"
                  rules=${[{ required: true, message: "请选择状态" }]}
                >
                  <${Select}
                    options=${[
                      { label: "上架中", value: "ACTIVE" },
                      { label: "已下架", value: "INACTIVE" },
                      { label: "已禁用", value: "DISABLED" }
                    ]}
                  />
                <//>
                <${Form.Item} label="单位" name="unitId"><${Input} /><//>
                <${Form.Item} label="金蝶物料编号" name="kingdeeMaterialId"><${Input} /><//>
              <//>
            <//>
          `}
    </div>
  `;
}
