const auth = require('../../utils/auth');
const mall = require('../../utils/mall');

const EMPTY_FORM = {
  receiver: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  tag: '家',
  isDefault: false
};

Page({
  data: {
    selectMode: false,
    list: [],
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

  loadList() {
    const list = mall.ensureAddressSeed();
    this.setData({ list });
  },

  openCreate() {
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
    const id = e.currentTarget.dataset.id;
    const target = this.data.list.find((item) => item.id === id);
    if (!target) {
      return;
    }

    this.setData({
      showForm: true,
      editingId: target.id,
      form: {
        receiver: target.receiver || '',
        phone: target.phone || '',
        province: target.province || '',
        city: target.city || '',
        district: target.district || '',
        detail: target.detail || '',
        tag: target.tag || '',
        isDefault: Boolean(target.isDefault)
      }
    });
  },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    if (!field) {
      return;
    }

    this.setData({
      [`form.${field}`]: String(e.detail.value || '')
    });
  },

  onDefaultSwitch(e) {
    this.setData({
      'form.isDefault': Boolean(e.detail.value)
    });
  },

  chooseWechatAddress() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          'form.receiver': res.userName || '',
          'form.phone': res.telNumber || '',
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

  submitForm() {
    const form = this.data.form || {};
    const receiver = String(form.receiver || '').trim();
    const phone = String(form.phone || '').trim();
    const province = String(form.province || '').trim();
    const city = String(form.city || '').trim();
    const district = String(form.district || '').trim();
    const detail = String(form.detail || '').trim();

    if (!receiver) {
      wx.showToast({ title: '请填写收货人', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请填写正确手机号', icon: 'none' });
      return;
    }
    if (!province || !city || !district || !detail) {
      wx.showToast({ title: '请填写完整地址', icon: 'none' });
      return;
    }

    mall.upsertAddress({
      id: this.data.editingId || undefined,
      receiver,
      phone,
      province,
      city,
      district,
      detail,
      tag: String(form.tag || '').trim() || '常用',
      isDefault: Boolean(form.isDefault)
    });

    this.setData({
      showForm: false,
      editingId: '',
      form: { ...EMPTY_FORM }
    });

    this.loadList();
    wx.showToast({ title: '地址已保存', icon: 'success' });
  },

  cancelForm() {
    this.setData({
      showForm: false,
      editingId: '',
      form: { ...EMPTY_FORM }
    });
  },

  removeAddress(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }

    wx.showModal({
      title: '删除地址',
      content: '确认删除这个地址吗？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        mall.removeAddress(id);
        this.loadList();
      }
    });
  },

  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }

    mall.setDefaultAddress(id);
    this.loadList();
    wx.showToast({ title: '已设为默认地址', icon: 'none' });
  },

  selectAddress(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }

    if (!this.data.selectMode) {
      return;
    }

    mall.setDefaultAddress(id);
    wx.showToast({ title: '已选中地址', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack({ delta: 1 });
    }, 250);
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
