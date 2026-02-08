const FAVORITES_KEY = 'mini_mall_favorites';
const HISTORY_KEY = 'mini_mall_history';
const ADDRESSES_KEY = 'mini_mall_addresses';
const COUPONS_KEY = 'mini_mall_coupons';
const ORDER_META_KEY = 'mini_mall_order_meta';
const SEARCH_HISTORY_KEY = 'mini_mall_search_history';
const BUY_NOW_KEY = 'mini_mall_buy_now';

function safeGetStorage(key, fallback) {
  try {
    const value = wx.getStorageSync(key);
    return value || fallback;
  } catch (err) {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (err) {
    // ignore local storage failures in mini program runtime
  }
}

function nowIso() {
  return new Date().toISOString();
}

function uniqueStringList(list) {
  return Array.from(new Set((Array.isArray(list) ? list : []).map((item) => String(item || '').trim()).filter(Boolean)));
}

function getFavorites() {
  return uniqueStringList(safeGetStorage(FAVORITES_KEY, []));
}

function isFavorite(productId) {
  return getFavorites().includes(String(productId || '').trim());
}

function toggleFavorite(productId) {
  const id = String(productId || '').trim();
  if (!id) {
    return {
      favorited: false,
      favorites: getFavorites()
    };
  }

  const current = getFavorites();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : current.concat(id);
  safeSetStorage(FAVORITES_KEY, next);

  return {
    favorited: !exists,
    favorites: next
  };
}

function setFavorite(productId, favorited) {
  const id = String(productId || '').trim();
  if (!id) {
    return getFavorites();
  }

  const current = getFavorites();
  const has = current.includes(id);
  let next = current;

  if (favorited && !has) {
    next = current.concat(id);
  }

  if (!favorited && has) {
    next = current.filter((item) => item !== id);
  }

  safeSetStorage(FAVORITES_KEY, next);
  return next;
}

function getHistory(limit = 100) {
  const list = safeGetStorage(HISTORY_KEY, []);
  if (!Array.isArray(list)) {
    return [];
  }
  return list.slice(0, Math.max(1, limit));
}

function addHistoryItem(item) {
  const productId = String(item && item.productId ? item.productId : '').trim();
  if (!productId) {
    return getHistory();
  }

  const current = getHistory(200).filter((entry) => entry && entry.productId !== productId);
  const nextItem = {
    productId,
    name: String(item.name || ''),
    code: String(item.code || ''),
    coverImageUrl: item.coverImageUrl || '',
    minPriceText: item.minPriceText || '',
    viewedAt: nowIso()
  };

  const next = [nextItem, ...current].slice(0, 200);
  safeSetStorage(HISTORY_KEY, next);
  return next;
}

function removeHistoryItem(productId) {
  const id = String(productId || '').trim();
  const next = getHistory(200).filter((entry) => entry && entry.productId !== id);
  safeSetStorage(HISTORY_KEY, next);
  return next;
}

function clearHistory() {
  safeSetStorage(HISTORY_KEY, []);
}

function getRecentSearches(limit = 20) {
  const list = safeGetStorage(SEARCH_HISTORY_KEY, []);
  if (!Array.isArray(list)) {
    return [];
  }
  return list.slice(0, Math.max(1, limit));
}

function addRecentSearch(keyword) {
  const word = String(keyword || '').trim();
  if (!word) {
    return getRecentSearches();
  }
  const current = getRecentSearches(50).filter((item) => item !== word);
  const next = [word, ...current].slice(0, 50);
  safeSetStorage(SEARCH_HISTORY_KEY, next);
  return next;
}

function clearRecentSearches() {
  safeSetStorage(SEARCH_HISTORY_KEY, []);
}

function normalizeAddress(address) {
  const normalized = {
    id: address.id || `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    receiver: String(address.receiver || '').trim(),
    phone: String(address.phone || '').trim(),
    province: String(address.province || '').trim(),
    city: String(address.city || '').trim(),
    district: String(address.district || '').trim(),
    detail: String(address.detail || '').trim(),
    tag: String(address.tag || '').trim(),
    isDefault: Boolean(address.isDefault),
    updatedAt: nowIso()
  };

  return normalized;
}

function getAddresses() {
  const list = safeGetStorage(ADDRESSES_KEY, []);
  if (!Array.isArray(list)) {
    return [];
  }
  const normalized = list.map((item) => normalizeAddress(item));
  const hasDefault = normalized.some((item) => item.isDefault);
  if (!hasDefault && normalized.length > 0) {
    normalized[0].isDefault = true;
  }

  return normalized.sort((a, b) => {
    if (a.isDefault && !b.isDefault) {
      return -1;
    }
    if (!a.isDefault && b.isDefault) {
      return 1;
    }
    return String(b.updatedAt).localeCompare(String(a.updatedAt));
  });
}

function ensureAddressSeed() {
  const list = getAddresses();
  if (list.length > 0) {
    return list;
  }

  const seed = [
    {
      id: `addr-seed-${Date.now()}`,
      receiver: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园科苑路 15 号',
      tag: '公司',
      isDefault: true,
      updatedAt: nowIso()
    }
  ];

  safeSetStorage(ADDRESSES_KEY, seed);
  return seed;
}

function upsertAddress(address) {
  const nextAddress = normalizeAddress(address || {});
  const list = getAddresses();
  const exists = list.find((item) => item.id === nextAddress.id);
  const next = exists
    ? list.map((item) => (item.id === nextAddress.id ? { ...item, ...nextAddress, updatedAt: nowIso() } : item))
    : [nextAddress, ...list];

  if (nextAddress.isDefault || next.every((item) => !item.isDefault)) {
    for (const item of next) {
      item.isDefault = item.id === nextAddress.id;
    }
  }

  safeSetStorage(ADDRESSES_KEY, next);
  return getAddresses();
}

function removeAddress(addressId) {
  const id = String(addressId || '').trim();
  const list = getAddresses();
  const next = list.filter((item) => item.id !== id);

  if (next.length > 0 && next.every((item) => !item.isDefault)) {
    next[0].isDefault = true;
  }

  safeSetStorage(ADDRESSES_KEY, next);
  return getAddresses();
}

function setDefaultAddress(addressId) {
  const id = String(addressId || '').trim();
  const list = getAddresses().map((item) => ({
    ...item,
    isDefault: item.id === id,
    updatedAt: item.id === id ? nowIso() : item.updatedAt
  }));
  safeSetStorage(ADDRESSES_KEY, list);
  return getAddresses();
}

function getDefaultAddress() {
  const list = ensureAddressSeed();
  return list.find((item) => item.isDefault) || list[0] || null;
}

function ensureCouponSeed() {
  const list = safeGetStorage(COUPONS_KEY, []);
  if (Array.isArray(list) && list.length > 0) {
    return list;
  }

  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);

  const seed = [
    {
      id: 'coupon-new-10',
      name: '新人立减 10 元',
      type: 'CASH',
      value: 10,
      minAmount: 99,
      status: 'AVAILABLE',
      expireAt: nextMonth.toISOString(),
      description: '满 99 元可用'
    },
    {
      id: 'coupon-vip-95',
      name: '会员 95 折',
      type: 'DISCOUNT',
      value: 0.95,
      minAmount: 199,
      status: 'AVAILABLE',
      expireAt: nextMonth.toISOString(),
      description: '满 199 元享 95 折'
    }
  ];

  safeSetStorage(COUPONS_KEY, seed);
  return seed;
}

function getCoupons() {
  const list = ensureCouponSeed();
  if (!Array.isArray(list)) {
    return [];
  }
  return list.slice().sort((a, b) => String(a.expireAt).localeCompare(String(b.expireAt)));
}

function saveCoupons(coupons) {
  safeSetStorage(COUPONS_KEY, Array.isArray(coupons) ? coupons : []);
}

function getCouponDiscount(coupon, totalAmount) {
  const amount = Number(totalAmount || 0);
  if (!coupon || amount <= 0) {
    return 0;
  }

  if (coupon.status !== 'AVAILABLE') {
    return 0;
  }

  const minAmount = Number(coupon.minAmount || 0);
  if (amount < minAmount) {
    return 0;
  }

  if (coupon.type === 'CASH') {
    return Number(Math.min(amount, Number(coupon.value || 0)).toFixed(2));
  }

  if (coupon.type === 'DISCOUNT') {
    const rate = Number(coupon.value || 1);
    if (rate <= 0 || rate >= 1) {
      return 0;
    }
    return Number((amount * (1 - rate)).toFixed(2));
  }

  return 0;
}

function markCouponUsed(couponId, orderId) {
  const id = String(couponId || '').trim();
  if (!id) {
    return getCoupons();
  }

  const next = getCoupons().map((coupon) => {
    if (coupon.id !== id) {
      return coupon;
    }
    return {
      ...coupon,
      status: 'USED',
      usedAt: nowIso(),
      orderId: orderId || null
    };
  });

  saveCoupons(next);
  return next;
}

function setBuyNowPayload(payload) {
  safeSetStorage(BUY_NOW_KEY, payload || null);
}

function getBuyNowPayload() {
  return safeGetStorage(BUY_NOW_KEY, null);
}

function clearBuyNowPayload() {
  safeSetStorage(BUY_NOW_KEY, null);
}

function getOrderMetaMap() {
  const map = safeGetStorage(ORDER_META_KEY, {});
  if (!map || typeof map !== 'object') {
    return {};
  }
  return map;
}

function saveOrderMeta(orderId, meta) {
  const id = String(orderId || '').trim();
  if (!id) {
    return;
  }

  const map = getOrderMetaMap();
  map[id] = {
    ...(meta || {}),
    savedAt: nowIso()
  };
  safeSetStorage(ORDER_META_KEY, map);
}

function getOrderMeta(orderId) {
  const id = String(orderId || '').trim();
  if (!id) {
    return null;
  }

  const map = getOrderMetaMap();
  return map[id] || null;
}

function deleteOrderMeta(orderId) {
  const id = String(orderId || '').trim();
  if (!id) {
    return;
  }
  const map = getOrderMetaMap();
  delete map[id];
  safeSetStorage(ORDER_META_KEY, map);
}

module.exports = {
  getFavorites,
  isFavorite,
  toggleFavorite,
  setFavorite,
  getHistory,
  addHistoryItem,
  removeHistoryItem,
  clearHistory,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  getAddresses,
  ensureAddressSeed,
  upsertAddress,
  removeAddress,
  setDefaultAddress,
  getDefaultAddress,
  getCoupons,
  getCouponDiscount,
  markCouponUsed,
  setBuyNowPayload,
  getBuyNowPayload,
  clearBuyNowPayload,
  saveOrderMeta,
  getOrderMeta,
  deleteOrderMeta
};
