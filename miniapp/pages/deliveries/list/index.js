const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatDate } = require('../../../utils/format');

Page({
  data: {
    loading: false,
    refreshing: false,
    actionLoading: false,
    errorMessage: '',
    list: [],
    profile: null,
    capabilityTip: '',
    pendingCount: 0,
    todayCount: 0,
    notice: '签收完成后会自动进入对账流程。如出现到货差异，请在签收备注里注明。'
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchList();
  },

  onPullDownRefresh() {
    this.refreshData().finally(() => wx.stopPullDownRefresh());
  },

  async fetchList() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const [deliveriesRes, profileRes] = await Promise.allSettled([api.getDeliveries(), api.getMiniProfile()]);
      if (deliveriesRes.status !== 'fulfilled') {
        throw deliveriesRes.reason || new Error('加载失败');
      }

      const payload = deliveriesRes.value.data || {};
      const rawList = Array.isArray(payload.items) ? payload.items : Array.isArray(payload) ? payload : [];
      const list = rawList.map((item) => ({
        ...item,
        ship_date_text: formatDate(item.shipDate || item.ship_date || item.createdAt),
        isSigned: item.status === 'SIGNED',
        statusText: this.formatStatus(item.status)
      }));

      const today = formatDate(new Date());
      const profile = profileRes.status === 'fulfilled' ? profileRes.value.data || null : this.data.profile;

      this.setData({
        list,
        profile,
        pendingCount: list.filter((item) => !item.isSigned).length,
        todayCount: list.filter((item) => item.ship_date_text === today).length,
        capabilityTip: this.buildCapabilityTip(profile)
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async refreshData() {
    if (this.data.loading || this.data.refreshing) {
      return;
    }
    this.setData({ refreshing: true });
    try {
      await this.fetchList();
    } finally {
      this.setData({ refreshing: false });
    }
  },

  formatStatus(status) {
    const map = {
      CREATED: '待签收',
      SIGNED: '已签收'
    };
    return map[status] || status || '-';
  },

  buildCapabilityTip(profile) {
    if (!profile || !profile.capabilities) {
      return '';
    }
    if (profile.status !== 'ACTIVE') {
      return '账号审核中：支持浏览与签收，部分业务能力可能受限。';
    }
    return '账号已激活：支持订货、对账与开票申请。';
  },

  runNavAction(handler) {
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

  goDetail(e) {
    if (this.data.actionLoading) {
      return;
    }
    const { id } = e.currentTarget.dataset;
    if (!id) {
      return;
    }
    this.runNavAction(() => {
      wx.navigateTo({
        url: `/pages/deliveries/detail/index?id=${id}`
      });
    });
  },

  goStatements() {
    this.runNavAction(() => {
      wx.navigateTo({
        url: '/pages/statements/list/index'
      });
    });
  },

  goProducts() {
    this.runNavAction(() => {
      wx.switchTab({
        url: '/pages/products/list/index'
      });
    });
  },

  goOrders() {
    this.runNavAction(() => {
      wx.switchTab({
        url: '/pages/orders/list/index'
      });
    });
  },

  goMine() {
    this.runNavAction(() => {
      wx.switchTab({
        url: '/pages/mine/index'
      });
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
