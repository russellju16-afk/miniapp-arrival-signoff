const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const mall = require('../../../utils/mall');
const { formatAmount } = require('../../../utils/format');

const SORT_OPTIONS = [
  { label: '综合排序', value: 'default' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' }
];

Page({
  data: {
    loading: false,
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false,
    rawList: [],
    list: [],
    keyword: '',
    searchKeyword: '',
    stockOnly: false,
    sortOptions: SORT_OPTIONS,
    sortIndex: 0,
    cartQty: 0,
    favoritesCount: 0,
    recentSearches: []
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }

    this.fetchList(1).finally(() => {
      this.refreshMallSummary();
    });
  },

  onPullDownRefresh() {
    Promise.all([this.fetchList(1), this.refreshMallSummary()]).finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) {
      return;
    }
    this.fetchList(this.data.page + 1, true);
  },

  async fetchList(page = 1, append = false) {
    try {
      this.setData({ loading: true });
      const res = await api.getProducts({ page, pageSize: this.data.pageSize });
      const payload = res.data || {};
      const items = Array.isArray(payload.items) ? payload.items : [];

      const list = items.map((item) => {
        const skus = Array.isArray(item.skus) ? item.skus : [];
        const prices = skus
          .map((sku) => Number(sku.price))
          .filter((price) => Number.isFinite(price));
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const totalStock = skus.reduce((sum, sku) => sum + Number(sku.stock || 0), 0);

        return {
          ...item,
          minPrice,
          minPriceText: formatAmount(minPrice),
          totalStock,
          isFavorite: mall.isFavorite(item.id)
        };
      });

      const rawList = append ? this.data.rawList.concat(list) : list;
      const total = Number(payload.total || 0);
      const hasMore = page * this.data.pageSize < total;

      this.setData(
        {
          page,
          total,
          hasMore,
          rawList
        },
        () => {
          this.applyFilters();
        }
      );
    } catch (err) {
      wx.showToast({ title: err.message || '加载商品失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async refreshMallSummary() {
    try {
      const [cartRes] = await Promise.all([api.getCart()]);
      const cart = cartRes.data || {};
      const recentSearches = mall.getRecentSearches(8);

      this.setData({
        cartQty: Number(cart.totalQty || 0),
        favoritesCount: mall.getFavorites().length,
        recentSearches
      });
    } catch (err) {
      this.setData({
        favoritesCount: mall.getFavorites().length,
        recentSearches: mall.getRecentSearches(8)
      });
    }
  },

  onKeywordInput(e) {
    this.setData({ keyword: String(e.detail.value || '') });
  },

  onSearch() {
    const keyword = String(this.data.keyword || '').trim();
    if (keyword) {
      mall.addRecentSearch(keyword);
    }

    this.setData(
      {
        searchKeyword: keyword,
        recentSearches: mall.getRecentSearches(8)
      },
      () => {
        this.applyFilters();
      }
    );
  },

  onUseRecentSearch(e) {
    const keyword = String(e.currentTarget.dataset.keyword || '').trim();
    if (!keyword) {
      return;
    }

    this.setData(
      {
        keyword,
        searchKeyword: keyword
      },
      () => {
        this.applyFilters();
      }
    );
  },

  onClearSearch() {
    this.setData(
      {
        keyword: '',
        searchKeyword: ''
      },
      () => {
        this.applyFilters();
      }
    );
  },

  onClearRecentSearch() {
    mall.clearRecentSearches();
    this.setData({ recentSearches: [] });
  },

  onSortChange(e) {
    const sortIndex = Number(e.detail.value || 0);
    this.setData({ sortIndex }, () => this.applyFilters());
  },

  onToggleStockOnly(e) {
    this.setData({ stockOnly: Boolean(e.detail.value) }, () => this.applyFilters());
  },

  applyFilters() {
    const search = this.data.searchKeyword.trim().toLowerCase();
    const stockOnly = this.data.stockOnly;
    const sort = this.data.sortOptions[this.data.sortIndex].value;

    let list = this.data.rawList.slice();

    if (search) {
      list = list.filter((item) => {
        const name = String(item.name || '').toLowerCase();
        const code = String(item.code || '').toLowerCase();
        const desc = String(item.description || '').toLowerCase();
        return name.includes(search) || code.includes(search) || desc.includes(search);
      });
    }

    if (stockOnly) {
      list = list.filter((item) => Number(item.totalStock || 0) > 0);
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => Number(a.minPrice || 0) - Number(b.minPrice || 0));
    }

    if (sort === 'price_desc') {
      list.sort((a, b) => Number(b.minPrice || 0) - Number(a.minPrice || 0));
    }

    this.setData({ list });
  },

  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }

    const result = mall.toggleFavorite(id);
    const favorites = result.favorites || [];
    const rawList = this.data.rawList.map((item) => ({
      ...item,
      isFavorite: favorites.includes(item.id)
    }));

    this.setData(
      {
        rawList,
        favoritesCount: favorites.length
      },
      () => {
        this.applyFilters();
      }
    );

    wx.showToast({
      title: result.favorited ? '已加入收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) {
      return;
    }
    wx.navigateTo({ url: `/pages/products/detail/index?id=${id}` });
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/index' });
  },

  goOrders() {
    wx.navigateTo({ url: '/pages/orders/list/index' });
  },

  goMine() {
    wx.navigateTo({ url: '/pages/mine/index' });
  },

  goFavorites() {
    wx.navigateTo({ url: '/pages/favorites/index' });
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/index' });
  },

  goCoupons() {
    wx.navigateTo({ url: '/pages/coupons/index' });
  },

  goDeliveries() {
    wx.navigateTo({ url: '/pages/deliveries/list/index' });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/products/list/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
