const api = require('../../services/api');
const auth = require('../../utils/auth');
const config = require('../../config');
const ACTION_ROUTE_MAP = {
  quote: { url: '/pages/cart/index', isTab: true },
  statements: { url: '/pages/statements/list/index', isTab: false },
  invoiceRequest: { url: '/pages/invoice/request/index', isTab: false },
  address: { url: '/pages/address/index', isTab: false },
  invoiceProfiles: { url: '/pages/invoice/profiles/index', isTab: false },
  feedback: { url: '/pages/feedback/index', isTab: false }
};

Page({
  data: {
    profile: null,
    capabilities: null,
    version: config.APP_VERSION || 'M4',
    loading: false,
    actionLoading: false,
    logoutSubmitting: false,
    errorMessage: ''
  },

  onShow() {
    if (!auth.getToken()) {
      wx.reLaunch({ url: '/pages/login/index' });
      return;
    }
    this.loadProfile();
  },

  async loadProfile() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getMiniProfile();
      const profile = res.data || null;
      auth.setSession({
        customerProfile: profile,
        customer: profile
      });
      this.setData({
        profile,
        capabilities: profile ? profile.capabilities : null
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载失败';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.loadProfile();
  },

  runAction(handler) {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    try {
      handler();
    } finally {
      setTimeout(() => {
        this.setData({ actionLoading: false });
      }, 320);
    }
  },

  handleMenuTap(event) {
    const { action } = event.currentTarget.dataset || {};
    if (!action) {
      return;
    }
    if (action === 'logout') {
      this.logout();
      return;
    }
    const actionConfig = ACTION_ROUTE_MAP[action];
    if (!actionConfig || !actionConfig.url) {
      wx.showToast({ title: '功能暂未开放', icon: 'none' });
      return;
    }
    this.navigateByAction(actionConfig.url, !!actionConfig.isTab);
  },

  navigateByAction(targetUrl, isTab) {
    this.runAction(() => {
      const method = isTab ? 'switchTab' : 'navigateTo';
      wx[method]({
        url: targetUrl,
        fail: () => {
          wx.showToast({ title: '页面打开失败', icon: 'none' });
        }
      });
    });
  },

  logout() {
    if (this.data.logoutSubmitting || this.data.actionLoading) {
      return;
    }
    wx.showModal({
      title: '退出登录',
      content: '确认退出当前账号？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        this.setData({ logoutSubmitting: true });
        auth.clearSession();
        wx.reLaunch({ url: '/pages/login/index' });
      }
    });
  }
});
