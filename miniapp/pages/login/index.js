const api = require('../../services/api');
const auth = require('../../utils/auth');

Page({
  data: {
    token: '',
    loading: false,
    redirect: '/pages/deliveries/list/index'
  },

  onLoad(options) {
    const redirect = options.redirect ? decodeURIComponent(options.redirect) : '/pages/deliveries/list/index';
    const tokenFromQuery = this.extractTokenFromOptions(options);

    this.setData({
      redirect,
      token: tokenFromQuery || this.data.token
    });

    if (tokenFromQuery) {
      this.onSubmit();
      return;
    }

    const session = auth.getSession();
    if (session && session.token) {
      wx.reLaunch({ url: redirect });
    }
  },

  onTokenInput(e) {
    this.setData({ token: e.detail.value.trim() });
  },

  async onSubmit() {
    const token = this.data.token.trim();
    if (!token) {
      wx.showToast({ title: '请输入 token', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true });
      const res = await api.miniLogin(token);
      const customer = res.data || {};

      auth.setSession({
        token,
        customerId: customer.id,
        customer
      });

      wx.showToast({ title: '登录成功', icon: 'success' });
      wx.reLaunch({ url: this.data.redirect || '/pages/deliveries/list/index' });
    } catch (err) {
      wx.showToast({ title: err.message || '登录失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onScanToken() {
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        const token = this.extractTokenFromString(res.result || '');
        if (!token) {
          wx.showToast({ title: '未识别到 token', icon: 'none' });
          return;
        }
        this.setData({ token });
        this.onSubmit();
      },
      fail: () => {
        wx.showToast({ title: '扫码取消或失败', icon: 'none' });
      }
    });
  },

  extractTokenFromOptions(options) {
    if (options.token) {
      return String(options.token).trim();
    }

    if (options.scene) {
      try {
        const scene = decodeURIComponent(options.scene);
        return this.extractTokenFromString(scene);
      } catch (err) {
        return '';
      }
    }

    return '';
  },

  extractTokenFromString(raw) {
    const text = String(raw || '').trim();
    if (!text) {
      return '';
    }

    if (text.includes('token=')) {
      const tokenMatch = text.match(/[?&]token=([^&#]+)/i);
      if (tokenMatch && tokenMatch[1]) {
        try {
          return decodeURIComponent(tokenMatch[1]);
        } catch (err) {
          return tokenMatch[1];
        }
      }
    }

    if (text.includes('token:')) {
      return text.split('token:')[1].trim();
    }

    return text;
  }
});
