const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatAmount, formatDate } = require('../../utils/format');

const TAB_OPTIONS = [
  { label: '全部', value: 'ALL' },
  { label: '可用', value: 'AVAILABLE' },
  { label: '已使用', value: 'USED' },
  { label: '已过期', value: 'EXPIRED' }
];

Page({
  data: {
    tabs: TAB_OPTIONS,
    tabIndex: 0,
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
    const now = Date.now();
    const list = mall.getCoupons().map((item) => {
      const expireTs = new Date(item.expireAt).getTime();
      const expired = Number.isFinite(expireTs) && expireTs < now;
      const status = item.status === 'USED' ? 'USED' : expired ? 'EXPIRED' : 'AVAILABLE';

      return {
        ...item,
        status,
        expireText: formatDate(item.expireAt),
        valueText: item.type === 'CASH' ? `¥${formatAmount(item.value)}` : `${Number(item.value || 1) * 10} 折`,
        minAmountText: formatAmount(item.minAmount || 0)
      };
    });

    this.setData({ list }, () => this.applyFilter());
  },

  onTabChange(e) {
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
    wx.navigateTo({ url: '/pages/products/list/index' });
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
