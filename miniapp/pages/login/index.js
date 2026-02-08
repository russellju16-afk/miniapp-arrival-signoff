const api = require('../../services/api');
const auth = require('../../utils/auth');

Page({
  data: {
    token: '',
    loading: false,
    redirect: '/pages/products/list/index',
    tokenError: '',
    clipboardToken: '',
    showClipboardTip: false
  },

  onLoad(options) {
    const redirect = options.redirect ? decodeURIComponent(options.redirect) : '/pages/products/list/index';
    const tokenFromQuery = this.extractTokenFromOptions(options);

    this.setData({
      redirect,
      token: tokenFromQuery || ''
    });

    if (tokenFromQuery) {
      this.onSubmit();
      return;
    }

    const session = auth.getSession();
    if (session && session.token) {
      wx.reLaunch({ url: redirect });
      return;
    }

    this.detectClipboardToken();
  },

  onTokenInput(e) {
    const token = String(e.detail.value || '').trim();
    this.setData({
      token,
      tokenError: token ? '' : this.data.tokenError
    });
  },

  onTokenConfirm() {
    this.onSubmit();
  },

  onClearToken() {
    this.setData({
      token: '',
      tokenError: ''
    });
  },

  onUseClipboardToken() {
    const token = this.data.clipboardToken;
    if (!token) {
      return;
    }

    this.setData({
      token,
      tokenError: '',
      showClipboardTip: false
    });
  },

  async onSubmit() {
    const token = this.data.token.trim();
    const tokenError = this.validateToken(token);
    if (tokenError) {
      this.setData({ tokenError });
      wx.showToast({ title: tokenError, icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true, tokenError: '' });
      const res = await api.miniLogin(token);
      const customer = res.data || {};

      auth.setSession({
        token,
        customerId: customer.id,
        customer
      });

      wx.showToast({ title: '登录成功', icon: 'success' });
      wx.reLaunch({ url: this.data.redirect || '/pages/products/list/index' });
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
        this.setData({ token, tokenError: '' });
        this.onSubmit();
      },
      fail: () => {
        wx.showToast({ title: '扫码取消或失败', icon: 'none' });
      }
    });
  },

  detectClipboardToken() {
    wx.getClipboardData({
      success: (res) => {
        const token = this.extractTokenFromString((res && res.data) || '');
        if (!token || token === this.data.token) {
          return;
        }

        const err = this.validateToken(token);
        if (err) {
          return;
        }

        this.setData({
          clipboardToken: token,
          showClipboardTip: true
        });
      }
    });
  },

  validateToken(token) {
    if (!token) {
      return '请输入 token';
    }
    if (token.length < 6) {
      return 'token 长度不合法';
    }
    return '';
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
