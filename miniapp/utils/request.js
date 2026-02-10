const config = require('../config');
const auth = require('./auth');

function request(options) {
  const {
    url,
    method = 'GET',
    data,
    headers: customHeaders = {},
    needAuth = true,
    showLoading = false,
    loadingText = '加载中...'
  } = options;

  if (showLoading) {
    wx.showLoading({ title: loadingText, mask: true });
  }

  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
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
          reject(buildHttpError(statusCode, body, body.message || '登录状态失效'));
          return;
        }

        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
          return;
        }

        reject(buildHttpError(statusCode, body));
      },
      fail: (err) => {
        reject(buildHttpError(0, {}, err.errMsg || '网络请求失败'));
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
  const currentPath = current ? `/${current.route}` : '/pages/products/list/index';
  const redirect = encodeURIComponent(currentPath);
  wx.reLaunch({
    url: `/pages/login/index?redirect=${redirect}`
  });
}

function buildHttpError(statusCode, body, fallbackMessage) {
  const safeBody = toObject(body);
  const bodyMessage = pickBodyMessage(safeBody);
  const statusMessage =
    statusCode === 530
      ? '请求失败(530)：接口地址不可用，请检查 miniapp/config.js 的 API_BASE_URL（临时隧道可能已失效）'
      : `请求失败(${statusCode})`;

  const err = new Error(
    fallbackMessage ||
      bodyMessage ||
      statusMessage
  );
  err.statusCode = statusCode;
  err.code = safeBody.code || safeBody.errcode || '';
  err.requestId = safeBody.requestId || '';
  err.details = safeBody.details || null;
  err.raw = body;
  return err;
}

function pickBodyMessage(body) {
  const candidates = [body.message, body.msg, body.error];
  for (let i = 0; i < candidates.length; i += 1) {
    const message = candidates[i];
    if (typeof message === 'string' && message.trim()) {
      return message.trim();
    }
  }
  return '';
}

function toObject(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value;
  }
  return {};
}

module.exports = {
  request
};
