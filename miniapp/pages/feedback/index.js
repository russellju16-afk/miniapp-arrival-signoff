const config = require('../../config');

const FEEDBACK_TYPES = [
  { label: '产品功能问题反馈', value: 'PRODUCT' },
  { label: '建议及意见反馈', value: 'SUGGESTION' },
  { label: '投诉客服其他问题', value: 'COMPLAINT' }
];

Page({
  data: {
    types: FEEDBACK_TYPES,
    typeIndex: 0,
    description: '',
    contactPhone: '',
    images: [],
    submitting: false
  },

  onTypeChange(e) {
    this.setData({ typeIndex: Number(e.currentTarget.dataset.index || 0) });
  },

  onDescriptionInput(e) {
    this.setData({ description: String(e.detail.value || '') });
  },

  onContactPhoneInput(e) {
    this.setData({ contactPhone: String(e.detail.value || '') });
  },

  chooseImages() {
    const remain = 3 - (this.data.images || []).length;
    if (remain <= 0) {
      return;
    }
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const urls = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [];
        this.setData({ images: (this.data.images || []).concat(urls).slice(0, 3) });
      }
    });
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.url;
    if (!current) {
      return;
    }
    wx.previewImage({
      current,
      urls: this.data.images || []
    });
  },

  contactService() {
    const phone = String(config.CUSTOMER_SERVICE_PHONE || '').trim();
    if (!phone) {
      wx.showToast({ title: '暂未配置客服电话', icon: 'none' });
      return;
    }
    wx.makePhoneCall({ phoneNumber: phone });
  },

  submitFeedback() {
    if (this.data.submitting) {
      return;
    }
    const description = String(this.data.description || '').trim();
    const contactPhone = String(this.data.contactPhone || '').trim();

    if (description.length < 5) {
      wx.showToast({ title: '请填写至少 5 个字的问题描述', icon: 'none' });
      return;
    }
    if (contactPhone && !/^1\d{10}$/.test(contactPhone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    setTimeout(() => {
      this.setData({
        submitting: false,
        description: '',
        contactPhone: '',
        images: [],
        typeIndex: 0
      });
      wx.showToast({ title: '提交成功，我们会尽快处理', icon: 'none' });
    }, 360);
  }
});
