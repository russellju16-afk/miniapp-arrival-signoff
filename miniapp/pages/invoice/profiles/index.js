const api = require('../../../services/api');
const auth = require('../../../utils/auth');

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
    this.loadList();
  },

  async loadList() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getInvoiceProfiles();
      this.setData({
        list: Array.isArray(res.data) ? res.data : []
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载开票资料失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  goCreate() {
    this.runNavAction(() => {
      wx.navigateTo({ url: '/pages/invoice/profile-edit/index' });
    });
  },

  goEdit(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    this.runNavAction(() => {
      wx.navigateTo({ url: `/pages/invoice/profile-edit/index?id=${id}` });
    });
  },

  async setDefault(e) {
    if (this.data.actionLoading || this.data.loading) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    const target = this.data.list.find((item) => item.id === id);
    if (!target) {
      return;
    }

    try {
      this.setData({ actionLoading: true });
      await api.upsertInvoiceProfile({
        id: target.id,
        title: target.title,
        taxNo: target.taxNo,
        bankName: target.bankName || undefined,
        bankAccount: target.bankAccount || undefined,
        addressPhone: target.addressPhone || undefined,
        email: target.email || undefined,
        isDefault: true
      });
      await this.loadList();
      wx.showToast({ title: '已设为默认', icon: 'none' });
    } catch (err) {
      wx.showToast({ title: err.message || '设置失败', icon: 'none' });
    } finally {
      this.setData({ actionLoading: false });
    }
  },

  removeProfile(e) {
    if (this.data.actionLoading || this.data.loading) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }

    wx.showModal({
      title: '删除开票资料',
      content: '确认删除该模板吗？',
      success: async (res) => {
        if (!res.confirm) {
          return;
        }
        try {
          this.setData({ actionLoading: true });
          await api.removeInvoiceProfile(id);
          await this.loadList();
          wx.showToast({ title: '删除成功', icon: 'none' });
        } catch (err) {
          wx.showToast({ title: err.message || '删除失败', icon: 'none' });
        } finally {
          this.setData({ actionLoading: false });
        }
      }
    });
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.loadList();
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

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/invoice/profiles/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
