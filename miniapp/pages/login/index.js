const api = require('../../services/api');
const auth = require('../../utils/auth');

let profilePollingTimer = null;

Page({
  data: {
    redirect: '/pages/home/index',
    step: 'AUTH',
    loading: false,
    actionLoading: false,
    submitting: false,
    checking: false,
    errorMessage: '',
    loginCode: '',
    mockOpenid: '',
    profile: null,
    form: {
      companyName: '',
      contactName: '',
      contactPhone: '',
      remark: ''
    }
  },

  onLoad(options) {
    const redirect = options.redirect ? decodeURIComponent(options.redirect) : '/pages/home/index';
    this.setData({ redirect });

    const session = auth.getSession();
    if (session && auth.getToken()) {
      this.setData({
        step: this.isProfileActive(session.customerProfile || session.customer) ? 'AUTH' : 'PENDING',
        profile: session.customerProfile || session.customer || null
      });
      this.refreshProfileAndRoute();
    }
  },

  onUnload() {
    this.clearProfilePolling();
  },

  onHide() {
    this.clearProfilePolling();
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

  onMockOpenidInput(e) {
    this.setData({
      mockOpenid: String(e.detail.value || '').trim()
    });
  },

  async authorizeWechat() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const code = await this.getWxLoginCode();
      this.setData({
        loginCode: code,
        step: 'FORM'
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '微信授权失败';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async submitRegistration() {
    if (this.data.submitting) {
      return;
    }

    const form = this.data.form || {};
    const contactPhone = String(form.contactPhone || '').trim();
    if (!String(form.companyName || '').trim()) {
      wx.showToast({ title: '请输入公司名称', icon: 'none' });
      return;
    }
    if (!String(form.contactName || '').trim()) {
      wx.showToast({ title: '请输入联系人', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(contactPhone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }

    try {
      this.setData({ submitting: true, errorMessage: '' });
      const payload = {
        registration: {
          companyName: String(form.companyName || '').trim(),
          contactName: String(form.contactName || '').trim(),
          contactPhone,
          remark: String(form.remark || '').trim() || undefined
        },
        customerName: String(form.companyName || '').trim()
      };

      if (this.data.loginCode) {
        payload.code = this.data.loginCode;
      }
      if (this.data.mockOpenid) {
        payload.mockOpenid = this.data.mockOpenid;
      }

      const res = await api.loginWechat(payload);
      const data = res.data || {};
      this.saveSession(data);

      if (this.isProfileActive(data.customerProfile)) {
        wx.showToast({ title: '登录成功', icon: 'success' });
        wx.reLaunch({ url: this.data.redirect || '/pages/home/index' });
        return;
      }

      this.setData({
        step: 'PENDING',
        profile: data.customerProfile || null
      });
      this.startProfilePolling();
      wx.showToast({ title: '已提交，等待审核', icon: 'none' });
    } catch (err) {
      const errorMessage = (err && err.message) || '提交失败';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  async refreshProfileAndRoute() {
    try {
      this.setData({ checking: true, errorMessage: '' });
      const res = await api.getMiniProfile();
      const profile = res.data || null;
      const session = auth.getSession() || {};
      auth.setSession({
        ...session,
        customerProfile: profile,
        customer: profile
      });

      if (this.isProfileActive(profile)) {
        wx.reLaunch({ url: this.data.redirect || '/pages/home/index' });
        return;
      }

      this.setData({
        step: 'PENDING',
        profile
      });
      this.startProfilePolling();
    } catch (err) {
      const errorMessage = (err && err.message) || '状态刷新失败，请重新登录';
      this.setData({ errorMessage });
      auth.clearSession();
      this.setData({ step: 'AUTH', profile: null });
    } finally {
      this.setData({ checking: false });
    }
  },

  onTapRecheck() {
    this.refreshProfileAndRoute();
  },

  onBackToAuth() {
    this.clearProfilePolling();
    auth.clearSession();
    this.setData({
      step: 'AUTH',
      profile: null,
      loginCode: '',
      errorMessage: ''
    });
  },

  startProfilePolling() {
    this.clearProfilePolling();
    profilePollingTimer = setInterval(() => {
      this.refreshProfileAndRoute();
    }, 10000);
  },

  clearProfilePolling() {
    if (profilePollingTimer) {
      clearInterval(profilePollingTimer);
      profilePollingTimer = null;
    }
  },

  saveSession(loginData) {
    const accessToken = loginData.accessToken || '';
    const customerProfile = loginData.customerProfile || null;
    auth.setSession({
      accessToken,
      token: accessToken,
      tokenExpiresAt: loginData.tokenExpiresAt || null,
      customerId: customerProfile ? customerProfile.id : '',
      customerProfile,
      customer: customerProfile
    });
  },

  isProfileActive(profile) {
    return profile && profile.status === 'ACTIVE';
  },

  getWxLoginCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res && res.code) {
            resolve(res.code);
            return;
          }
          reject(new Error('未拿到微信授权 code'));
        },
        fail: (err) => {
          reject(new Error((err && err.errMsg) || '微信授权失败'));
        }
      });
    });
  }
});
