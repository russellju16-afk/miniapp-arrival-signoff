const { request } = require('../utils/request');

function miniLogin(token) {
  return request({
    url: '/mini/login',
    method: 'POST',
    needAuth: false,
    data: { token },
    showLoading: true,
    loadingText: '登录中...'
  });
}

function getDeliveries() {
  return request({
    url: '/mini/deliveries',
    method: 'GET'
  });
}

function getDeliveryDetail(id) {
  return request({
    url: `/mini/deliveries/${id}`,
    method: 'GET'
  });
}

function signDelivery(id, payload) {
  return request({
    url: `/mini/deliveries/${id}/sign`,
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '提交签收中...'
  });
}

function getStatements(params) {
  return request({
    url: '/mini/statements',
    method: 'GET',
    data: params
  });
}

function getStatementDetail(id) {
  return request({
    url: `/mini/statements/${id}`,
    method: 'GET'
  });
}

function confirmStatement(id, payload) {
  return request({
    url: `/mini/statements/${id}/confirm`,
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '提交确认中...'
  });
}

module.exports = {
  miniLogin,
  getDeliveries,
  getDeliveryDetail,
  signDelivery,
  getStatements,
  getStatementDetail,
  confirmStatement
};
