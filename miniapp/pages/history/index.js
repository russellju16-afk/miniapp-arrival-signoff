const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatDateTime } = require('../../utils/format');

Page({
  data: {
    list: []
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.refreshHistory();
  },

  refreshHistory() {
    const list = mall.getHistory(200).map((item) => ({
      ...item,
      viewedAtText: formatDateTime(item.viewedAt)
    }));
    this.setData({ list });
  },

  removeItem(e) {
    const productId = e.currentTarget.dataset.id;
    if (!productId) {
      return;
    }
    mall.removeHistoryItem(productId);
    this.refreshHistory();
  },

  clearAll() {
    wx.showModal({
      title: '清空足迹',
      content: '确认清空全部浏览足迹吗？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        mall.clearHistory();
        this.refreshHistory();
      }
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    wx.navigateTo({ url: `/pages/products/detail/index?id=${id}` });
  },

  goProducts() {
    wx.navigateTo({ url: '/pages/products/list/index' });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/history/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
