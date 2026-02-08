const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatDate, formatDateTime } = require('../../../utils/format');

Page({
  data: {
    id: '',
    loading: false,
    detail: null,
    items: []
  },

  onLoad(options) {
    this.setData({ id: options.id || '' });
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchDetail();
  },

  async fetchDetail() {
    const id = this.data.id;
    if (!id) {
      wx.showToast({ title: '参数缺失', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true });
      const res = await api.getDeliveryDetail(id);
      const detail = res.data || null;

      const detailsPayload = detail && (detail.details || detail.items || detail.entry || []);
      const items = this.normalizeItems(detailsPayload);
      if (detail && detail.receipt && detail.receipt.signed_at) {
        detail.receipt.signed_at_text = formatDateTime(detail.receipt.signed_at);
      }

      this.setData({
        detail: detail
          ? {
              ...detail,
              ship_date_text: formatDate(detail.shipDate || detail.ship_date || detail.createdAt)
            }
          : null,
        items
      });
    } catch (err) {
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeItems(raw) {
    if (!raw) {
      return [];
    }
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.material_entity)) {
        return raw.material_entity;
      }
      if (Array.isArray(raw.entry)) {
        return raw.entry;
      }
    }
    if (typeof raw === 'object') {
      return [raw];
    }
    return [];
  },

  goSign() {
    wx.navigateTo({
      url: `/pages/deliveries/sign/index?id=${this.data.id}`
    });
  },

  goOrderDetail() {
    const detail = this.data.detail || {};
    const orderId = detail.orderId || detail.salesOrderId || detail.sales_order_id;
    if (!orderId) {
      wx.showToast({ title: '未关联订单', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/orders/detail/index?id=${orderId}`
    });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent(`/pages/deliveries/detail/index?id=${this.data.id}`);
      wx.reLaunch({
        url: `/pages/login/index?redirect=${redirect}`
      });
      return false;
    }
    return true;
  }
});
