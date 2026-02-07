const config = require('../config');
const auth = require('./auth');

function request(options) {
  const {
    url,
    method = 'GET',
    data,
    needAuth = true,
    showLoading = false,
    loadingText = '加载中...'
  } = options;

  if (showLoading) {
    wx.showLoading({ title: loadingText, mask: true });
  }

  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (needAuth) {
      const token = auth.getToken();
      if (!token) {
        redirectToLogin();
        if (showLoading) {
          wx.hideLoading();
        }
        reject(new Error('未登录'));
        return;
      }
      headers.Authorization = `Bearer ${token}`;
    }

    wx.request({
      url: `${config.API_BASE_URL}${url}`,
      method,
      data,
      timeout: config.REQUEST_TIMEOUT,
      header: headers,
      success: (res) => {
        const { statusCode } = res;
        const body = res.data || {};

        if (statusCode === 401) {
          auth.clearSession();
          redirectToLogin();
          reject(new Error(body.message || '登录状态失效'));
          return;
        }

        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
          return;
        }

        reject(new Error(body.message || `请求失败(${statusCode})`));
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络请求失败'));
      },
      complete: () => {
        if (showLoading) {
          wx.hideLoading();
        }
      }
    });
  });
}

function redirectToLogin() {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1];
  const currentPath = current ? `/${current.route}` : '/pages/deliveries/list/index';
  const redirect = encodeURIComponent(currentPath);
  wx.reLaunch({
    url: `/pages/login/index?redirect=${redirect}`
  });
}

module.exports = {
  request
};
