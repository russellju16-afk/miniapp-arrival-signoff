const api = require('../../services/api');
const auth = require('../../utils/auth');

const EMPTY_FORM = {
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
};

Page({
  data: {
    selectMode: false,
    list: [],
    loading: false,
    errorMessage: '',
    actionLoading: false,
    submitting: false,
    showForm: false,
    editingId: '',
    form: { ...EMPTY_FORM }
  },

  onLoad(options) {
    this.setData({
      selectMode: options.select === '1'
    });
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
      const res = await api.getAddresses();
      const list = Array.isArray(res.data) ? res.data : [];
      this.setData({ list });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载地址失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  openCreate() {
    if (this.data.actionLoading || this.data.submitting) {
      return;
    }
    this.setData({
      showForm: true,
      editingId: '',
      form: {
        ...EMPTY_FORM,
        isDefault: this.data.list.length === 0
      }
    });
  },

  openEdit(e) {
    if (this.data.actionLoading || this.data.submitting) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    const target = this.data.list.find((item) => item.id === id);
    if (!target) {
      return;
    }

    this.setData({
      showForm: true,
      editingId: target.id,
      form: {
        receiverName: target.receiverName || '',
        receiverPhone: target.receiverPhone || '',
        province: target.province || '',
        city: target.city || '',
        district: target.district || '',
        detail: target.detail || '',
        isDefault: Boolean(target.isDefault)
      }
    });
  },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    if (!field) {
      return;
    }
    this.setData({ [`form.${field}`]: String(e.detail.value || '') });
  },

  onDefaultSwitch(e) {
    this.setData({ 'form.isDefault': Boolean(e.detail.value) });
  },

  chooseWechatAddress() {
    if (this.data.actionLoading || this.data.submitting) {
      return;
    }
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          'form.receiverName': res.userName || '',
          'form.receiverPhone': res.telNumber || '',
          'form.province': res.provinceName || '',
          'form.city': res.cityName || '',
          'form.district': res.countyName || '',
          'form.detail': res.detailInfo || ''
        });
      },
      fail: () => {
        wx.showToast({ title: '读取微信地址失败', icon: 'none' });
      }
    });
  },

  async submitForm() {
    if (this.data.submitting) {
      return;
    }
    const form = this.data.form || {};
    const receiverName = String(form.receiverName || '').trim();
    const receiverPhone = String(form.receiverPhone || '').trim();
    const province = String(form.province || '').trim();
    const city = String(form.city || '').trim();
    const district = String(form.district || '').trim();
    const detail = String(form.detail || '').trim();

    if (!receiverName || !receiverPhone || !province || !city || !district || !detail) {
      wx.showToast({ title: '请填写完整地址信息', icon: 'none' });
      return;
    }

    try {
      this.setData({ submitting: true });
      await api.upsertAddress({
        id: this.data.editingId || undefined,
        receiverName,
        receiverPhone,
        province,
        city,
        district,
        detail,
        isDefault: Boolean(form.isDefault)
      });
      this.setData({
        showForm: false,
        editingId: '',
        form: { ...EMPTY_FORM }
      });
      await this.loadList();
      wx.showToast({ title: '地址已保存', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '保存失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  cancelForm() {
    if (this.data.submitting) {
      return;
    }
    this.setData({
      showForm: false,
      editingId: '',
      form: { ...EMPTY_FORM }
    });
  },

  removeAddress(e) {
    if (this.data.actionLoading || this.data.submitting) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }

    wx.showModal({
      title: '删除地址',
      content: '确认删除这个地址吗？',
      success: async (res) => {
        if (!res.confirm) {
          return;
        }
        try {
          this.setData({ actionLoading: true });
          await api.removeAddress(id);
          await this.loadList();
        } catch (err) {
          wx.showToast({ title: err.message || '删除失败', icon: 'none' });
        } finally {
          this.setData({ actionLoading: false });
        }
      }
    });
  },

  async setDefault(e) {
    if (this.data.actionLoading || this.data.submitting) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    const target = this.data.list.find((item) => item.id === id);
    if (!target) {
      return;
    }

    try {
      this.setData({ actionLoading: true });
      await api.upsertAddress({
        id: target.id,
        receiverName: target.receiverName,
        receiverPhone: target.receiverPhone,
        province: target.province,
        city: target.city,
        district: target.district,
        detail: target.detail,
        isDefault: true
      });
      await this.loadList();
      wx.showToast({ title: '已设为默认地址', icon: 'none' });
    } catch (err) {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' });
    } finally {
      this.setData({ actionLoading: false });
    }
  },

  async selectAddress(e) {
    if (this.data.actionLoading || this.data.submitting) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!this.data.selectMode || !id) {
      return;
    }

    await this.setDefault(e);
    setTimeout(() => {
      wx.navigateBack({ delta: 1 });
    }, 240);
  },

  refreshList() {
    if (this.data.loading) {
      return;
    }
    this.loadList();
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/address/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
