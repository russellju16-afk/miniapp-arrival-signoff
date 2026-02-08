const auth = require('../../../utils/auth');
const config = require('../../../config');
const mall = require('../../../utils/mall');

Page({
  data: {
    customer: null,
    token: '',
    tokenMasked: '-',
    version: config.APP_VERSION || 'M4',
    privacyPolicyUrl: config.PRIVACY_POLICY_URL || '',
    userAgreementUrl: config.USER_AGREEMENT_URL || '',
    customerServicePhone: config.CUSTOMER_SERVICE_PHONE || '',
    favoritesCount: 0,
    historyCount: 0,
    couponCount: 0,
    addressCount: 0
  },

  onShow() {
    const session = auth.getSession();
    if (!session || !session.token) {
      wx.reLaunch({ url: '/pages/login/index' });
      return;
    }

    const coupons = mall.getCoupons();
    const now = Date.now();
    const couponCount = coupons.filter((item) => {
      if (item.status !== 'AVAILABLE') {
        return false;
      }
      const expireTs = new Date(item.expireAt).getTime();
      return !Number.isFinite(expireTs) || expireTs > now;
    }).length;

    this.setData({
      token: session.token,
      tokenMasked: this.maskToken(session.token),
      customer: session.customer || null,
      favoritesCount: mall.getFavorites().length,
      historyCount: mall.getHistory(500).length,
      couponCount,
      addressCount: mall.getAddresses().length
    });
  },

  goProducts() {
    wx.navigateTo({ url: '/pages/products/list/index' });
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/index' });
  },

  goOrders() {
    wx.navigateTo({ url: '/pages/orders/list/index' });
  },

  goDeliveries() {
    wx.navigateTo({ url: '/pages/deliveries/list/index' });
  },

  goStatements() {
    wx.navigateTo({ url: '/pages/statements/list/index' });
  },

  goFavorites() {
    wx.navigateTo({ url: '/pages/favorites/index' });
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/index' });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/index' });
  },

  goCoupons() {
    wx.navigateTo({ url: '/pages/coupons/index' });
  },

  openPrivacyPolicy() {
    this.openLinkOrCopy(this.data.privacyPolicyUrl, '隐私政策');
  },

  openUserAgreement() {
    this.openLinkOrCopy(this.data.userAgreementUrl, '用户协议');
  },

  callCustomerService() {
    const phone = String(this.data.customerServicePhone || '').trim();
    if (!phone) {
      wx.showToast({ title: '未配置客服联系方式', icon: 'none' });
      return;
    }

    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        wx.setClipboardData({
          data: phone,
          success: () => wx.showToast({ title: '已复制客服电话', icon: 'success' })
        });
      }
    });
  },

  copyTokenTail() {
    wx.setClipboardData({
      data: this.data.tokenMasked,
      success: () => wx.showToast({ title: '已复制脱敏 token', icon: 'success' })
    });
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确认清除当前会话并返回登录页？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        auth.clearSession();
        wx.reLaunch({ url: '/pages/login/index' });
      }
    });
  },

  openLinkOrCopy(url, name) {
    const value = String(url || '').trim();
    if (!value) {
      wx.showToast({ title: `${name}链接未配置`, icon: 'none' });
      return;
    }

    wx.setClipboardData({
      data: value,
      success: () => {
        wx.showModal({
          title: name,
          content: `已复制 ${name} 链接，可粘贴到浏览器查看。`,
          showCancel: false
        });
      }
    });
  },

  maskToken(token) {
    if (!token) {
      return '-';
    }
    if (token.length <= 12) {
      return `${token.slice(0, 2)}****${token.slice(-2)}`;
    }
    return `${token.slice(0, 4)}****${token.slice(-4)}`;
  }
});
