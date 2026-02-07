const SESSION_KEY = 'mini_session';

function getSession() {
  return wx.getStorageSync(SESSION_KEY) || null;
}

function setSession(session) {
  wx.setStorageSync(SESSION_KEY, session);
}

function clearSession() {
  wx.removeStorageSync(SESSION_KEY);
}

function getToken() {
  const session = getSession();
  return session && session.token ? session.token : '';
}

function getCustomerId() {
  const session = getSession();
  return session && session.customerId ? session.customerId : '';
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
