const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatDate, formatAmount } = require('../../../utils/format');

function getTodayDateText() {
  return formatDate(new Date());
}

function getMonthStartText() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

Page({
  data: {
    from: getMonthStartText(),
    to: getTodayDateText(),
    loading: false,
    errorMessage: '',
    actionLoading: false,
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

  onFromChange(e) {
    this.setData({ from: e.detail.value });
  },

  onToChange(e) {
    this.setData({ to: e.detail.value });
  },

  search() {
    if (this.data.loading) {
      return;
    }
    this.fetchList();
  },

  async fetchList() {
    const { from, to } = this.data;
    if (from > to) {
      wx.showToast({ title: '开始日期不能晚于结束日期', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getStatements({ from, to });
      const payload = res.data || {};
      const rawList = Array.isArray(payload.items) ? payload.items : Array.isArray(payload) ? payload : [];
      const list = rawList.map((item) => ({
        ...item,
        period_text: `${formatDate(item.periodStart || item.period_start)} ~ ${formatDate(
          item.periodEnd || item.period_end
        )}`,
        total_amount_text: formatAmount(item.totalAmount || item.total_amount)
      }));
      this.setData({ list });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
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
    this.setData({ actionLoading: true });
    wx.navigateTo({
      url: `/pages/statements/detail/index?id=${id}`
    });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  goDeliveries() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.navigateTo({
      url: '/pages/deliveries/list/index'
    });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.fetchList();
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/statements/list/index');
      wx.reLaunch({
        url: `/pages/login/index?redirect=${redirect}`
      });
      return false;
    }
    return true;
  }
});
