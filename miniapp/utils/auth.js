const SESSION_KEY = 'mini_session';

function getSession() {
  return wx.getStorageSync(SESSION_KEY) || null;
}

function setSession(session) {
  const previous = getSession() || {};
  wx.setStorageSync(SESSION_KEY, {
    ...previous,
    ...(session || {})
  });
}

function clearSession() {
  wx.removeStorageSync(SESSION_KEY);
}

function getToken() {
  const session = getSession();
  if (!session) {
    return '';
  }
  return session.accessToken || session.token || '';
}

function getCustomerId() {
  const session = getSession();
  if (!session) {
    return '';
  }
  return session.customerId || (session.customer && session.customer.id) || '';
}

function isLoggedIn() {
  return Boolean(getToken());
}

module.exports = {
  SESSION_KEY,
  getSession,
  setSession,
  clearSession,
  getToken,
  getCustomerId,
  isLoggedIn
};
