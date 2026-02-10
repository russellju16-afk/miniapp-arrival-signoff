const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatAmount, formatDateTime } = require('../../../utils/format');

Page({
  data: {
    id: '',
    loading: false,
    canceling: false,
    reordering: false,
    actionLoading: false,
    errorMessage: '',
    cancelRemark: '',
    order: null
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
    if (!this.data.id) {
      const errorMessage = '订单参数缺失，无法加载详情';
      this.setData({ errorMessage });
      wx.showToast({ title: '订单参数缺失', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getOrderDetail(this.data.id);
      this.setData({ order: this.normalizeOrder(res.data || null) });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载订单失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeOrder(order) {
    if (!order || typeof order !== 'object') {
      return null;
    }

    const lines = Array.isArray(order.lines)
      ? order.lines.map((line) => ({
          ...line,
          unitPriceText: formatAmount(line.unitPrice),
          lineAmountText: formatAmount(line.lineAmount)
        }))
      : [];

    const deliveryInfo = order.deliveryInfo && typeof order.deliveryInfo === 'object' ? order.deliveryInfo : null;

    return {
      ...order,
      lines,
      totalAmountText: formatAmount(order.totalAmount),
      createdAtText: formatDateTime(order.createdAt),
      updatedAtText: formatDateTime(order.updatedAt),
      canCancel: order.status === 'CREATED' || order.status === 'WRITEBACK_FAILED',
      statusText: this.formatStatus(order.status),
      deliveryInfo,
      deliverySummary: this.buildDeliverySummary(deliveryInfo)
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

  buildDeliverySummary(deliveryInfo) {
    if (!deliveryInfo) {
      return [];
    }

    if (deliveryInfo.mode === 'PICKUP') {
      return [
        `履约方式：自提`,
        `自提点：${deliveryInfo.pickupAddress || '-'}`,
        `卸货要求：${deliveryInfo.unloadingRequirement || '-'}`,
        `备注：${deliveryInfo.note || '-'}`
      ];
    }

    const address = deliveryInfo.address || {};
    return [
      `履约方式：配送`,
      `地址：${address.province || ''}${address.city || ''}${address.district || ''}${address.detail || '-'}`,
      `期望到货：${deliveryInfo.expectedDate || '-'} ${deliveryInfo.timeSlot || ''}`.trim(),
      `卸货要求：${deliveryInfo.unloadingRequirement || '-'}`,
      `备注：${deliveryInfo.note || '-'}`
    ];
  },

  onCancelRemarkInput(e) {
    this.setData({ cancelRemark: String(e.detail.value || '') });
  },

  async cancelOrder() {
    const order = this.data.order;
    if (!order || !order.id || this.data.canceling) {
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
          const response = await api.cancelOrder(order.id, {
            remark: String(this.data.cancelRemark || '').trim() || '客户取消'
          });
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
      wx.showToast({ title: '无可复购商品', icon: 'none' });
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
      wx.switchTab({ url: '/pages/cart/index' });
    } catch (err) {
      wx.showToast({ title: err.message || '复购失败', icon: 'none' });
    } finally {
      this.setData({ reordering: false });
    }
  },

  goInvoiceApply() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.navigateTo({ url: `/pages/invoice/request/index?orderIds=${encodeURIComponent(this.data.id)}` });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.fetchDetail();
  },

  goOrders() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.switchTab({ url: '/pages/orders/list/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
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
