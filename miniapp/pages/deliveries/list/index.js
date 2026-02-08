const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatDate } = require('../../../utils/format');

Page({
  data: {
    loading: false,
    list: []
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchList();
  },

  onPullDownRefresh() {
    this.fetchList().finally(() => wx.stopPullDownRefresh());
  },

  async fetchList() {
    try {
      this.setData({ loading: true });
      const res = await api.getDeliveries();
      const payload = res.data || {};
      const rawList = Array.isArray(payload.items) ? payload.items : Array.isArray(payload) ? payload : [];
      const list = rawList.map((item) => ({
        ...item,
        ship_date_text: formatDate(item.shipDate || item.ship_date || item.createdAt)
      }));
      this.setData({ list });
    } catch (err) {
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  refreshData() {
    this.fetchList();
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) {
      return;
    }
    wx.navigateTo({
      url: `/pages/deliveries/detail/index?id=${id}`
    });
  },

  goStatements() {
    wx.navigateTo({
      url: '/pages/statements/list/index'
    });
  },

  goProducts() {
    wx.navigateTo({
      url: '/pages/products/list/index'
    });
  },

  goOrders() {
    wx.navigateTo({
      url: '/pages/orders/list/index'
    });
  },

  goMine() {
    wx.navigateTo({
      url: '/pages/mine/index'
    });
  },

  logout() {
    auth.clearSession();
    wx.reLaunch({
      url: '/pages/login/index'
    });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/deliveries/list/index');
      wx.reLaunch({
        url: `/pages/login/index?redirect=${redirect}`
      });
      return false;
    }
    return true;
  }
});
