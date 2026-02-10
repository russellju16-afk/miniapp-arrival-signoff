const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatAmount, formatDate } = require('../../utils/format');

const TAB_OPTIONS = [
  { label: '领券中心', value: 'ALL' },
  { label: '已领取', value: 'AVAILABLE' },
  { label: '已使用', value: 'USED' },
  { label: '已失效', value: 'EXPIRED' }
];

Page({
  data: {
    tabs: TAB_OPTIONS,
    tabIndex: 0,
    loading: false,
    errorMessage: '',
    actionLoading: false,
    list: [],
    displayList: []
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.loadCoupons();
  },

  loadCoupons() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const now = Date.now();
      const list = mall.getCoupons().map((item) => {
        const expireTs = new Date(item.expireAt).getTime();
        const expired = Number.isFinite(expireTs) && expireTs < now;
        const status = item.status === 'USED' ? 'USED' : expired ? 'EXPIRED' : 'AVAILABLE';

        return {
          ...item,
          status,
          expireText: formatDate(item.expireAt),
          valueText:
            item.type === 'CASH' ? `¥${formatAmount(item.value)}` : `${Number(item.value || 1) * 10} 折`,
          minAmountText: formatAmount(item.minAmount || 0)
        };
      });

      this.setData({ list }, () => this.applyFilter());
    } catch (err) {
      const errorMessage = (err && err.message) || '加载优惠券失败';
      this.setData({ errorMessage, list: [], displayList: [] });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onTabChange(e) {
    if (this.data.loading || this.data.actionLoading) {
      return;
    }
    const idx = Number(e.currentTarget.dataset.index || 0);
    this.setData({ tabIndex: idx }, () => this.applyFilter());
  },

  applyFilter() {
    const tab = this.data.tabs[this.data.tabIndex] || this.data.tabs[0];
    const status = tab.value;
    const displayList = this.data.list.filter((item) => status === 'ALL' || item.status === status);
    this.setData({ displayList });
  },

  goProducts() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.switchTab({ url: '/pages/products/list/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.loadCoupons();
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/coupons/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
