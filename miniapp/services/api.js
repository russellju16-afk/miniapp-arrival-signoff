const { request } = require('../utils/request');
const config = require('../config');

function withMiniPrefix(path) {
  const prefix = config.USE_LEGACY_MINI_PATH ? config.MINI_API_PREFIX_LEGACY : config.MINI_API_PREFIX;
  return `${prefix}${path}`;
}

function miniLogin(token) {
  return request({
    url: withMiniPrefix('/login'),
    method: 'POST',
    needAuth: false,
    data: { token },
    showLoading: true,
    loadingText: '登录中...'
  });
}

function getDeliveries() {
  return request({
    url: withMiniPrefix('/deliveries'),
    method: 'GET'
  });
}

function getProducts(params = {}) {
  return request({
    url: withMiniPrefix('/products'),
    method: 'GET',
    data: params
  });
}

function getProductDetail(id) {
  return request({
    url: withMiniPrefix(`/products/${id}`),
    method: 'GET'
  });
}

function getCart() {
  return request({
    url: withMiniPrefix('/cart'),
    method: 'GET'
  });
}

function addCartItem(payload) {
  return request({
    url: withMiniPrefix('/cart/items'),
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '加入购物车中...'
  });
}

function updateCartItem(id, payload) {
  return request({
    url: withMiniPrefix(`/cart/items/${id}`),
    method: 'PATCH',
    data: payload
  });
}

function removeCartItem(id) {
  return request({
    url: withMiniPrefix(`/cart/items/${id}`),
    method: 'DELETE'
  });
}

function createOrder(payload, idempotencyKey) {
  const headers = {};
  if (idempotencyKey) {
    headers['x-idempotency-key'] = idempotencyKey;
  }

  return request({
    url: withMiniPrefix('/orders'),
    method: 'POST',
    data: payload,
    headers,
    showLoading: true,
    loadingText: '提交订单中...'
  });
}

function getOrders(params = {}) {
  return request({
    url: withMiniPrefix('/orders'),
    method: 'GET',
    data: params
  });
}

function getOrderDetail(id) {
  return request({
    url: withMiniPrefix(`/orders/${id}`),
    method: 'GET'
  });
}

function cancelOrder(id, payload = {}) {
  return request({
    url: withMiniPrefix(`/orders/${id}/cancel`),
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '取消中...'
  });
}

function getDeliveryDetail(id) {
  return request({
    url: withMiniPrefix(`/deliveries/${id}`),
    method: 'GET'
  });
}

function signDelivery(id, payload) {
  const normalizedPayload = {
    signerName: payload.signerName,
    signedAt: payload.signedAt,
    signatureBase64: payload.signatureBase64,
    photosBase64: payload.photosBase64,
    remark: payload.remark
  };

  return request({
    url: withMiniPrefix(`/deliveries/${id}/sign`),
    method: 'POST',
    data: normalizedPayload,
    showLoading: true,
    loadingText: '提交签收中...'
  });
}

function getStatements(params) {
  return request({
    url: withMiniPrefix('/statements'),
    method: 'GET',
    data: params
  });
}

function getStatementDetail(id) {
  return request({
    url: withMiniPrefix(`/statements/${id}`),
    method: 'GET'
  });
}

function confirmStatement(id, payload) {
  return request({
    url: withMiniPrefix(`/statements/${id}/confirm`),
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '提交确认中...'
  });
}

module.exports = {
  miniLogin,
  getProducts,
  getProductDetail,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  createOrder,
  getOrders,
  getOrderDetail,
  cancelOrder,
  getDeliveries,
  getDeliveryDetail,
  signDelivery,
  getStatements,
  getStatementDetail,
  confirmStatement
};
