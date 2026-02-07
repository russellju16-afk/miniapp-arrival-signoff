const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatDate, formatDateTime, formatAmount } = require('../../../utils/format');

Page({
  data: {
    id: '',
    loading: false,
    confirming: false,
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
      wx.showToast({ title: '参数缺失', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true });
      const res = await api.getStatementDetail(id);
      const detail = res.data || null;
      const lines = Array.isArray(detail && detail.lines) ? detail.lines : [];

      this.setData({
        detail: detail
          ? {
              ...detail,
              period_text: `${formatDate(detail.period_start)} ~ ${formatDate(detail.period_end)}`,
              total_amount_text: formatAmount(detail.total_amount),
              confirmed_at_text: detail.confirmed_at ? formatDateTime(detail.confirmed_at) : ''
            }
          : null,
        lines: lines.map((line) => ({
          ...line,
          doc_date_text: formatDate(line.doc_date),
          amount_text: formatAmount(line.amount)
        }))
      });
    } catch (err) {
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  async confirm() {
    if (this.data.confirming) {
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
              period_text: `${formatDate(detail.period_start)} ~ ${formatDate(detail.period_end)}`,
              total_amount_text: formatAmount(detail.total_amount),
              confirmed_at_text: detail.confirmed_at ? formatDateTime(detail.confirmed_at) : ''
            }
          : null,
        lines: lines.map((line) => ({
          ...line,
          doc_date_text: formatDate(line.doc_date),
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
  }
});
