const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatDateTime } = require('../../utils/format');

Page({
  data: {
    loading: false,
    errorMessage: '',
    actionLoading: false,
    list: []
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.refreshHistory();
  },

  refreshHistory() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const list = mall.getHistory(200).map((item) => ({
        ...item,
        viewedAtText: formatDateTime(item.viewedAt)
      }));
      this.setData({ list });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载浏览足迹失败';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  removeItem(e) {
    if (this.data.loading || this.data.actionLoading) {
      return;
    }
    const productId = e.currentTarget.dataset.id;
    if (!productId) {
      return;
    }
    mall.removeHistoryItem(productId);
    this.refreshHistory();
  },

  clearAll() {
    if (this.data.loading || this.data.actionLoading) {
      return;
    }
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
    if (this.data.actionLoading) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.navigateTo({ url: `/pages/products/detail/index?id=${id}` });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  goProducts() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.navigateTo({ url: '/pages/products/list/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.refreshHistory();
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
