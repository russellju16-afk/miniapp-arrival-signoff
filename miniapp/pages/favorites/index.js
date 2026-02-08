const api = require('../../services/api');
const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatAmount } = require('../../utils/format');

Page({
  data: {
    loading: false,
    list: []
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchFavorites();
  },

  onPullDownRefresh() {
    this.fetchFavorites().finally(() => wx.stopPullDownRefresh());
  },

  async fetchFavorites() {
    const favoriteIds = mall.getFavorites();
    if (favoriteIds.length === 0) {
      this.setData({ list: [] });
      return;
    }

    try {
      this.setData({ loading: true });
      const res = await api.getProducts({ page: 1, pageSize: 300 });
      const payload = res.data || {};
      const items = Array.isArray(payload.items) ? payload.items : [];
      const map = new Map(
        items.map((item) => [
          item.id,
          {
            ...item,
            minPriceText: this.getMinPriceText(item.skus || [])
          }
        ])
      );

      const list = favoriteIds
        .map((id) => map.get(id))
        .filter(Boolean);

      this.setData({ list });
    } catch (err) {
      wx.showToast({ title: err.message || '加载收藏失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  getMinPriceText(skus) {
    const prices = (Array.isArray(skus) ? skus : [])
      .map((item) => Number(item.price))
      .filter((num) => Number.isFinite(num));
    if (prices.length === 0) {
      return '0.00';
    }
    return formatAmount(Math.min(...prices));
  },

  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    mall.setFavorite(id, false);
    this.fetchFavorites();
    wx.showToast({ title: '已取消收藏', icon: 'none' });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    wx.navigateTo({ url: `/pages/products/detail/index?id=${id}` });
  },

  goProducts() {
    wx.navigateTo({ url: '/pages/products/list/index' });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/favorites/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
