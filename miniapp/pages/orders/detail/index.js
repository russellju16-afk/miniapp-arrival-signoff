const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const mall = require('../../../utils/mall');
const { formatAmount, formatDateTime } = require('../../../utils/format');

Page({
  data: {
    id: '',
    loading: false,
    canceling: false,
    reordering: false,
    order: null,
    orderMeta: null,
    cancelRemark: ''
  },

  onLoad(options) {
    this.setData({ id: options.id || '' });
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchDetail();
    this.loadOrderMeta();
  },

  loadOrderMeta() {
    if (!this.data.id) {
      return;
    }
    const raw = mall.getOrderMeta(this.data.id);
    const orderMeta = raw
      ? {
          ...raw,
          discountAmountText: formatAmount(raw.discountAmount || 0),
          payAmountText: formatAmount(raw.payAmount || 0)
        }
      : null;
    this.setData({ orderMeta });
  },

  async fetchDetail() {
    if (!this.data.id) {
      wx.showToast({ title: '订单参数缺失', icon: 'none' });
      return;
    }
    try {
      this.setData({ loading: true });
      const res = await api.getOrderDetail(this.data.id);
      this.setData({ order: this.normalizeOrder(res.data || null) });
    } catch (err) {
      wx.showToast({ title: err.message || '加载订单失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onCancelRemarkInput(e) {
    this.setData({ cancelRemark: String(e.detail.value || '') });
  },

  async cancelOrder() {
    const order = this.data.order;
    if (!order || !order.id) {
      return;
    }
    if (this.data.canceling) {
      return;
    }

    wx.showModal({
      title: '取消订单',
      content: '确认取消该订单吗？',
      success: async (res) => {
        if (!res.confirm) {
          return;
        }
        try {
          this.setData({ canceling: true });
          const payload = { remark: this.data.cancelRemark.trim() || '客户主动取消' };
          const response = await api.cancelOrder(order.id, payload);
          this.setData({ order: this.normalizeOrder(response.data || this.data.order) });
          wx.showToast({ title: '已取消', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: err.message || '取消失败', icon: 'none' });
        } finally {
          this.setData({ canceling: false });
        }
      }
    });
  },

  async reorder() {
    const order = this.data.order;
    if (!order || !Array.isArray(order.lines) || order.lines.length === 0) {
      wx.showToast({ title: '订单中无可复购商品', icon: 'none' });
      return;
    }

    if (this.data.reordering) {
      return;
    }

    try {
      this.setData({ reordering: true });
      for (const line of order.lines) {
        await api.addCartItem({
          skuId: line.skuId,
          qty: line.qty
        });
      }
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      wx.navigateTo({ url: '/pages/cart/index' });
    } catch (err) {
      wx.showToast({ title: err.message || '复购失败，请检查商品状态', icon: 'none' });
    } finally {
      this.setData({ reordering: false });
    }
  },

  goDeliveries() {
    const order = this.data.order;
    const deliveries = order && Array.isArray(order.deliveries) ? order.deliveries : [];
    if (deliveries.length > 0 && deliveries[0].id) {
      wx.navigateTo({ url: `/pages/deliveries/detail/index?id=${deliveries[0].id}` });
      return;
    }
    wx.navigateTo({ url: '/pages/deliveries/list/index' });
  },

  goStatements() {
    wx.navigateTo({ url: '/pages/statements/list/index' });
  },

  normalizeOrder(order) {
    if (!order || typeof order !== 'object') {
      return null;
    }

    const lines = Array.isArray(order.lines)
      ? order.lines.map((line) => ({
          ...line,
          lineAmountText: formatAmount(line.lineAmount),
          unitPriceText: formatAmount(line.unitPrice)
        }))
      : [];

    const deliveries = Array.isArray(order.deliveries)
      ? order.deliveries.map((item) => ({
          ...item,
          signedAtText: formatDateTime(item.signedAt)
        }))
      : [];

    return {
      ...order,
      totalAmountText: formatAmount(order.totalAmount),
      createdAtText: formatDateTime(order.createdAt),
      canCancel: order.status === 'CREATED' || order.status === 'WRITEBACK_FAILED',
      lines,
      deliveries
    };
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent(`/pages/orders/detail/index?id=${this.data.id || ''}`);
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
