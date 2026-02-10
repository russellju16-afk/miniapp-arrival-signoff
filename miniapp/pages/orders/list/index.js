const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatAmount, formatDateTime } = require('../../../utils/format');

const STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已创建', value: 'CREATED' },
  { label: '已确认', value: 'CONFIRMED' },
  { label: '写回失败', value: 'WRITEBACK_FAILED' },
  { label: '已取消', value: 'CANCELED' }
];

Page({
  data: {
    loading: false,
    searching: false,
    actionLoading: false,
    invoiceLoading: false,
    errorMessage: '',
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false,
    list: [],
    selectedMap: {},
    selectedCount: 0,
    selectableCount: 0,
    invoiceTip: '请先勾选订单后再申请开票',
    invoiceButtonDisabled: true,
    statusOptions: STATUS_OPTIONS,
    statusValue: '',
    keyword: ''
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchList(1);
  },

  onPullDownRefresh() {
    this.refreshList().finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) {
      return;
    }
    this.fetchList(this.data.page + 1, true);
  },

  async fetchList(page = 1, append = false) {
    const status = this.data.statusValue;
    const orderNo = this.data.keyword.trim();

    try {
      this.setData({
        loading: true,
        searching: page === 1 && this.data.searching,
        errorMessage: page === 1 ? '' : this.data.errorMessage
      });
      const res = await api.getOrders({
        page,
        pageSize: this.data.pageSize,
        status: status || undefined,
        orderNo: orderNo || undefined
      });

      const payload = res.data || {};
      const items = this.normalizeOrders(payload.items);

      const total = Number(payload.total || 0);
      const nextList = append ? this.data.list.concat(items) : items;
      const nextSelectedMap = this.buildSelectedMap(nextList, this.data.selectedMap);

      this.setData({
        page,
        total,
        hasMore: page * this.data.pageSize < total,
        list: nextList,
        selectedMap: nextSelectedMap,
        ...this.buildInvoiceContext(nextList, nextSelectedMap, this.data.invoiceLoading)
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载订单失败';
      if (page === 1) {
        this.setData({
          errorMessage,
          list: [],
          selectedMap: {},
          ...this.buildInvoiceContext([], {}, this.data.invoiceLoading)
        });
      }
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeOrders(rawItems) {
    if (!Array.isArray(rawItems)) {
      return [];
    }
    return rawItems.map((item) => {
      const statusChipClass =
        item.status === 'CONFIRMED'
          ? 'status-chip-ok'
          : item.status === 'WRITEBACK_FAILED'
            ? 'status-chip-fail'
            : '';
      return {
        ...item,
        totalAmountText: formatAmount(item.totalAmount),
        createdAtText: formatDateTime(item.createdAt),
        statusText: this.formatStatus(item.status),
        statusChipClass,
        invoiceSelectable: this.isInvoiceSelectable(item)
      };
    });
  },

  isInvoiceSelectable(item) {
    return item && item.status !== 'CANCELED';
  },

  buildSelectedMap(list, currentMap) {
    const map = {};
    (Array.isArray(list) ? list : []).forEach((item) => {
      if (item.invoiceSelectable && currentMap && currentMap[item.id]) {
        map[item.id] = true;
      }
    });
    return map;
  },

  buildInvoiceContext(list, selectedMap, invoiceLoading) {
    const safeList = Array.isArray(list) ? list : [];
    const safeMap = selectedMap || {};
    const selectableCount = safeList.filter((item) => item.invoiceSelectable).length;
    const selectedCount = safeList.filter((item) => item.invoiceSelectable && safeMap[item.id]).length;
    let invoiceTip = '请先勾选订单后再申请开票';
    if (selectableCount === 0) {
      invoiceTip = '当前筛选结果没有可开票订单';
    } else if (selectedCount > 0) {
      invoiceTip = `已选择 ${selectedCount} 单，可直接发起开票申请`;
    }
    return {
      selectableCount,
      selectedCount,
      invoiceTip,
      invoiceButtonDisabled: Boolean(invoiceLoading || selectableCount === 0 || selectedCount === 0)
    };
  },

  formatStatus(status) {
    const map = {
      CREATED: '待写回',
      CONFIRMED: '已写回',
      WRITEBACK_FAILED: '写回失败',
      CANCELED: '已取消'
    };
    return map[status] || status || '-';
  },

  onTapStatus(e) {
    const value = String(e.currentTarget.dataset.value || '');
    if (value === this.data.statusValue || this.data.loading) {
      return;
    }
    this.setData({ statusValue: value }, () => this.fetchList(1));
  },

  onKeywordInput(e) {
    this.setData({ keyword: String(e.detail.value || '') });
  },

  async onSearch() {
    if (this.data.loading || this.data.searching) {
      return;
    }
    this.setData({ searching: true });
    try {
      await this.fetchList(1);
    } finally {
      this.setData({ searching: false });
    }
  },

  async onClearKeyword() {
    if ((!this.data.keyword && !this.data.statusValue) || this.data.loading) {
      return;
    }
    this.setData({ keyword: '' }, () => this.fetchList(1));
  },

  onResetFilters() {
    if (this.data.loading) {
      return;
    }
    this.setData({ keyword: '', statusValue: '' }, () => this.fetchList(1));
  },

  onToggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    const order = (this.data.list || []).find((item) => item.id === id);
    if (!order || !order.invoiceSelectable) {
      wx.showToast({ title: '该订单当前不可开票', icon: 'none' });
      return;
    }
    const nextSelectedMap = {
      ...this.data.selectedMap,
      [id]: !this.data.selectedMap[id]
    };
    if (!nextSelectedMap[id]) {
      delete nextSelectedMap[id];
    }
    this.setData({
      selectedMap: nextSelectedMap,
      ...this.buildInvoiceContext(this.data.list, nextSelectedMap, this.data.invoiceLoading)
    });
  },

  getSelectedOrderIds() {
    return (this.data.list || [])
      .filter((item) => item.invoiceSelectable && this.data.selectedMap[item.id])
      .map((item) => item.id);
  },

  runNavAction(handler) {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    try {
      handler();
    } finally {
      setTimeout(() => this.setData({ actionLoading: false }), 320);
    }
  },

  async refreshList() {
    if (this.data.loading) {
      return;
    }
    await this.fetchList(1);
  },

  goDetail(e) {
    if (this.data.actionLoading) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    this.runNavAction(() => {
      wx.navigateTo({ url: `/pages/orders/detail/index?id=${id}` });
    });
  },

  goInvoiceRequest() {
    if (this.data.invoiceLoading) {
      return;
    }
    if (this.data.selectableCount === 0) {
      wx.showToast({ title: '当前筛选下暂无可开票订单', icon: 'none' });
      return;
    }

    const ids = this.getSelectedOrderIds();
    if (ids.length === 0) {
      wx.showToast({ title: '请先勾选订单', icon: 'none' });
      return;
    }

    this.setData({
      invoiceLoading: true,
      ...this.buildInvoiceContext(this.data.list, this.data.selectedMap, true)
    });
    const orderIds = encodeURIComponent(ids.join(','));
    wx.navigateTo({ url: `/pages/invoice/request/index?orderIds=${orderIds}` });
    setTimeout(() => {
      this.setData({
        invoiceLoading: false,
        ...this.buildInvoiceContext(this.data.list, this.data.selectedMap, false)
      });
    }, 320);
  },

  goCreateOrder() {
    this.runNavAction(() => {
      wx.switchTab({ url: '/pages/cart/index' });
    });
  },

  goProducts() {
    this.runNavAction(() => {
      wx.switchTab({ url: '/pages/products/list/index' });
    });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/orders/list/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
