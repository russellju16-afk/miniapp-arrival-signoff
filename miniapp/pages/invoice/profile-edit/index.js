const api = require('../../../services/api');
const auth = require('../../../utils/auth');

function parseAddressPhone(raw) {
  const text = String(raw || '').trim();
  if (!text) {
    return { mobile: '', detailAddress: '' };
  }
  const matched = text.match(/(1\d{10})$/);
  if (!matched) {
    return {
      mobile: '',
      detailAddress: text
    };
  }
  const mobile = matched[1];
  const detailAddress = text.slice(0, text.length - mobile.length).trim();
  return {
    mobile,
    detailAddress
  };
}

Page({
  data: {
    loading: false,
    submitting: false,
    actionLoading: false,
    errorMessage: '',
    editingId: '',
    form: {
      invoiceType: 'COMPANY',
      title: '',
      mobile: '',
      taxNo: '',
      bankName: '',
      bankAccount: '',
      detailAddress: '',
      email: '',
      isDefault: false
    }
  },

  onLoad(options) {
    const id = options && options.id ? String(options.id).trim() : '';
    if (id) {
      this.setData({ editingId: id });
    }
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    if (this.data.editingId) {
      this.loadDetail(this.data.editingId);
    }
  },

  async loadDetail(id) {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getInvoiceProfiles();
      const list = Array.isArray(res.data) ? res.data : [];
      const target = list.find((item) => item.id === id);
      if (!target) {
        throw new Error('未找到发票模板');
      }
      const parsed = parseAddressPhone(target.addressPhone);
      this.setData({
        form: {
          invoiceType: String(target.taxNo || '').trim().length > 18 ? 'COMPANY' : 'PERSONAL',
          title: target.title || '',
          mobile: parsed.mobile,
          taxNo: target.taxNo || '',
          bankName: target.bankName || '',
          bankAccount: target.bankAccount || '',
          detailAddress: parsed.detailAddress,
          email: target.email || '',
          isDefault: Boolean(target.isDefault)
        }
      });
    } catch (err) {
      const errorMessage = err.message || '加载模板失败';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onTypeChange(e) {
    const type = String(e.currentTarget.dataset.type || 'COMPANY');
    this.setData({ 'form.invoiceType': type });
  },

  onFieldInput(e) {
    const field = e.currentTarget.dataset.field;
    if (!field) {
      return;
    }
    this.setData({ [`form.${field}`]: String(e.detail.value || '') });
  },

  onDefaultSwitch(e) {
    this.setData({ 'form.isDefault': Boolean(e.detail.value) });
  },

  async onSubmit() {
    if (this.data.submitting || this.data.loading) {
      return;
    }

    const form = this.data.form || {};
    const title = String(form.title || '').trim();
    const mobile = String(form.mobile || '').trim();
    const taxNo = String(form.taxNo || '').trim();
    const detailAddress = String(form.detailAddress || '').trim();

    if (!title) {
      wx.showToast({ title: '请输入发票抬头', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(mobile)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }
    if (!taxNo) {
      wx.showToast({ title: '请输入税号', icon: 'none' });
      return;
    }

    const addressPhone = `${detailAddress} ${mobile}`.trim();

    try {
      this.setData({ submitting: true });
      await api.upsertInvoiceProfile({
        id: this.data.editingId || undefined,
        title,
        taxNo,
        bankName: String(form.bankName || '').trim() || undefined,
        bankAccount: String(form.bankAccount || '').trim() || undefined,
        addressPhone: addressPhone || undefined,
        email: String(form.email || '').trim() || undefined,
        isDefault: Boolean(form.isDefault)
      });
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack({ delta: 1 });
      }, 300);
    } catch (err) {
      wx.showToast({ title: err.message || '保存失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/invoice/profile-edit/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
