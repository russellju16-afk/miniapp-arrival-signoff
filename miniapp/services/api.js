const { request } = require('../utils/request');
const config = require('../config');

function withMiniPrefix(path) {
  const prefix = config.USE_LEGACY_MINI_PATH ? config.MINI_API_PREFIX_LEGACY : config.MINI_API_PREFIX;
  return `${prefix}${path}`;
}

function loginWechat(payload) {
  return request({
    url: '/api/wechat/login',
    method: 'POST',
    needAuth: false,
    data: payload,
    showLoading: true,
    loadingText: '微信登录中...'
  });
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

function getMiniProfile() {
  return request({
    url: withMiniPrefix('/profile'),
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

function getAddresses() {
  return request({
    url: withMiniPrefix('/addresses'),
    method: 'GET'
  });
}

function upsertAddress(payload) {
  return request({
    url: withMiniPrefix('/addresses/upsert'),
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '保存地址中...'
  });
}

function removeAddress(id) {
  return request({
    url: withMiniPrefix(`/addresses/${id}`),
    method: 'DELETE'
  });
}

function createQuoteRequest(payload) {
  return request({
    url: withMiniPrefix('/quote-requests'),
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '提交报价申请中...'
  });
}

function getQuoteRequests() {
  return request({
    url: withMiniPrefix('/quote-requests'),
    method: 'GET'
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

function getInvoiceProfiles() {
  return request({
    url: withMiniPrefix('/invoice/profiles'),
    method: 'GET'
  });
}

function upsertInvoiceProfile(payload) {
  return request({
    url: withMiniPrefix('/invoice/profiles/upsert'),
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '保存开票资料中...'
  });
}

function removeInvoiceProfile(id) {
  return request({
    url: withMiniPrefix(`/invoice/profiles/${id}`),
    method: 'DELETE'
  });
}

function getInvoiceRequests() {
  return request({
    url: withMiniPrefix('/invoice/requests'),
    method: 'GET'
  });
}

function createInvoiceRequest(payload) {
  return request({
    url: withMiniPrefix('/invoice/requests'),
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '提交开票申请中...'
  });
}

function getDeliveries() {
  return request({
    url: withMiniPrefix('/deliveries'),
    method: 'GET'
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
  loginWechat,
  miniLogin,
  getMiniProfile,
  getProducts,
  getProductDetail,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  getAddresses,
  upsertAddress,
  removeAddress,
  createQuoteRequest,
  getQuoteRequests,
  createOrder,
  getOrders,
  getOrderDetail,
  cancelOrder,
  getInvoiceProfiles,
  upsertInvoiceProfile,
  removeInvoiceProfile,
  getInvoiceRequests,
  createInvoiceRequest,
  getDeliveries,
  getDeliveryDetail,
  signDelivery,
  getStatements,
  getStatementDetail,
  confirmStatement
};
