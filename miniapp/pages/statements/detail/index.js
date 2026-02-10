const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatDate, formatDateTime, formatAmount } = require('../../../utils/format');

Page({
  data: {
    id: '',
    loading: false,
    confirming: false,
    actionLoading: false,
    errorMessage: '',
    remark: '',
    detail: null,
    lines: []
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
    const id = this.data.id;
    if (!id) {
      this.setData({ errorMessage: '参数缺失，无法加载对账单' });
      wx.showToast({ title: '参数缺失', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getStatementDetail(id);
      const detail = res.data || null;
      const lines = Array.isArray(detail && detail.lines) ? detail.lines : [];

      this.setData({
        detail: detail
          ? {
              ...detail,
              period_text: `${formatDate(detail.periodStart || detail.period_start)} ~ ${formatDate(
                detail.periodEnd || detail.period_end
              )}`,
              total_amount_text: formatAmount(detail.totalAmount || detail.total_amount),
              confirmed_at_text: detail.confirmedAt
                ? formatDateTime(detail.confirmedAt)
                : detail.confirmed_at
                  ? formatDateTime(detail.confirmed_at)
                  : ''
            }
          : null,
        lines: lines.map((line) => ({
          ...line,
          doc_date_text: formatDate(line.docDate || line.doc_date),
          amount_text: formatAmount(line.amount)
        }))
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  async confirm() {
    if (this.data.confirming || this.data.loading) {
      return;
    }

    try {
      this.setData({ confirming: true });
      const res = await api.confirmStatement(this.data.id, {
        confirmedAt: new Date().toISOString(),
        remark: this.data.remark.trim()
      });

      const detail = res.data || null;
      const lines = Array.isArray(detail && detail.lines) ? detail.lines : [];
      this.setData({
        detail: detail
          ? {
              ...detail,
              period_text: `${formatDate(detail.periodStart || detail.period_start)} ~ ${formatDate(
                detail.periodEnd || detail.period_end
              )}`,
              total_amount_text: formatAmount(detail.totalAmount || detail.total_amount),
              confirmed_at_text: detail.confirmedAt
                ? formatDateTime(detail.confirmedAt)
                : detail.confirmed_at
                  ? formatDateTime(detail.confirmed_at)
                  : ''
            }
          : null,
        lines: lines.map((line) => ({
          ...line,
          doc_date_text: formatDate(line.docDate || line.doc_date),
          amount_text: formatAmount(line.amount)
        }))
      });

      wx.showToast({ title: '确认成功', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '确认失败', icon: 'none' });
    } finally {
      this.setData({ confirming: false });
    }
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent(`/pages/statements/detail/index?id=${this.data.id}`);
      wx.reLaunch({
        url: `/pages/login/index?redirect=${redirect}`
      });
      return false;
    }
    return true;
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.fetchDetail();
  },

  goStatements() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.navigateTo({ url: '/pages/statements/list/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  }
});
