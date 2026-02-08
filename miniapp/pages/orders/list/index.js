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
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false,
    list: [],
    statusOptions: STATUS_OPTIONS,
    statusIndex: 0,
    keyword: ''
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchList(1);
  },

  onPullDownRefresh() {
    this.fetchList(1).finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) {
      return;
    }
    this.fetchList(this.data.page + 1, true);
  },

  async fetchList(page = 1, append = false) {
    const status = this.data.statusOptions[this.data.statusIndex].value;
    const orderNo = this.data.keyword.trim();

    try {
      this.setData({ loading: true });
      const res = await api.getOrders({
        page,
        pageSize: this.data.pageSize,
        status: status || undefined,
        orderNo: orderNo || undefined
      });

      const data = res.data || {};
      const items = Array.isArray(data.items)
        ? data.items.map((item) => ({
            ...item,
            totalAmountText: formatAmount(item.totalAmount),
            createdAtText: formatDateTime(item.createdAt)
          }))
        : [];

      const total = Number(data.total || 0);
      this.setData({
        page,
        total,
        hasMore: page * this.data.pageSize < total,
        list: append ? this.data.list.concat(items) : items
      });
    } catch (err) {
      wx.showToast({ title: err.message || '加载订单失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onStatusChange(e) {
    const idx = Number(e.detail.value || 0);
    this.setData({ statusIndex: idx }, () => this.fetchList(1));
  },

  onKeywordInput(e) {
    this.setData({ keyword: String(e.detail.value || '') });
  },

  onSearch() {
    this.fetchList(1);
  },

  onClearKeyword() {
    this.setData({ keyword: '' }, () => this.fetchList(1));
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    wx.navigateTo({ url: `/pages/orders/detail/index?id=${id}` });
  },

  goProducts() {
    wx.navigateTo({ url: '/pages/products/list/index' });
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/index' });
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
