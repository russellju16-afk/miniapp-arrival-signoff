const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const mall = require('../../../utils/mall');
const { formatAmount } = require('../../../utils/format');

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: '全部' },
  { value: 'COMMON', label: '常购' },
  { value: 'NEED_QUOTE', label: '需报价' },
  { value: 'OUT_OF_STOCK', label: '缺货' }
];

const SIDE_CATEGORIES = [
  { value: 'ALL', label: '全部' },
  { value: 'RICE_FLOUR', label: '米面粮油' },
  { value: 'OIL', label: '食用油' },
  { value: 'SEASONING', label: '调味干货' },
  { value: 'KITCHEN', label: '厨房用品' },
  { value: 'OTHER', label: '其他' }
];

const SIDE_CATEGORY_KEYWORDS = {
  RICE_FLOUR: ['米', '面', '粉', '杂粮', '大米', '小麦', '面粉'],
  OIL: ['油', '菜籽', '大豆', '花生', '食用油', '调和油', '菜籽油'],
  SEASONING: ['调味', '盐', '醋', '酱', '料酒', '香料', '鸡精', '辣椒', '胡椒'],
  KITCHEN: ['厨', '餐具', '锅', '盆', '保鲜', '清洁', '一次性', '厨房', '用品']
};

Page({
  data: {
    loading: false,
    actionLoading: false,
    errorMessage: '',
    page: 1,
    pageSize: 30,
    total: 0,
    rawList: [],
    list: [],
    keyword: '',
    hasActiveFilters: false,
    category: 'ALL',
    categoryOptions: CATEGORY_OPTIONS,
    sideCategory: 'ALL',
    sideCategories: SIDE_CATEGORIES.map((item) => Object.assign({}, item, { count: 0 })),
    activeSideLabel: '全部',
    sideCountMap: {},
    profile: null,
    cartCount: 0,
    cartBadgeText: ''
  },

  onLoad() {
    this.consumePresetFilters();
  },

  onShow() {
    this.consumePresetFilters();
    if (!this.ensureLogin()) {
      return;
    }
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().finally(() => wx.stopPullDownRefresh());
  },

  consumePresetFilters() {
    const presetTab = String(wx.getStorageSync('products_list_tab') || '').trim().toUpperCase();
    const presetKeyword = String(wx.getStorageSync('products_list_preset_keyword') || '').trim();
    const patch = {};

    if (presetTab && CATEGORY_OPTIONS.some((item) => item.value === presetTab)) {
      patch.category = presetTab;
      wx.removeStorageSync('products_list_tab');
    }
    if (typeof presetKeyword === 'string') {
      patch.keyword = presetKeyword;
      const guessedSideCategory = this.guessSideCategoryByKeyword(presetKeyword);
      if (guessedSideCategory !== 'ALL') {
        patch.sideCategory = guessedSideCategory;
      }
      wx.removeStorageSync('products_list_preset_keyword');
    }

    if (Object.keys(patch).length > 0) {
      this.setData(patch);
    }
  },

  async loadData() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const [profileRes, productsRes, cartRes] = await Promise.allSettled([
        api.getMiniProfile(),
        api.getProducts({ page: 1, pageSize: this.data.pageSize }),
        api.getCart()
      ]);

      if (productsRes.status !== 'fulfilled') {
        throw productsRes.reason || new Error('加载商品失败');
      }

      const profile = profileRes.status === 'fulfilled' ? profileRes.value.data || null : this.data.profile;
      const payload = productsRes.value.data || {};
      const items = Array.isArray(payload.items) ? payload.items : [];
      const cartCount = cartRes.status === 'fulfilled' ? this.extractCartCount(cartRes.value.data) : this.data.cartCount;

      const normalized = items.map((item) => {
        const hasPrice = Boolean(item.hasPrice && typeof item.minDisplayPrice === 'number');
        return {
          id: item.id,
          name: item.name,
          code: item.code,
          description: item.description || '',
          coverImageUrl: item.coverImageUrl || '',
          hasPrice,
          needQuote: Boolean(item.needQuote),
          hasInStock: Boolean(item.hasInStock),
          stockStatus: item.hasInStock ? '可下单' : '缺货',
          priceText: hasPrice ? `¥${formatAmount(item.minDisplayPrice)} 起` : '需报价',
          sideCategory: this.resolveSideCategory(item)
        };
      });
      const sideCountMap = this.buildSideCountMap(normalized);

      this.setData(
        {
          profile,
          page: Number(payload.page || 1),
          total: Number(payload.total || normalized.length),
          rawList: normalized,
          sideCountMap,
          sideCategories: this.decorateSideCategories(sideCountMap),
          cartCount,
          cartBadgeText: cartCount > 99 ? '99+' : String(cartCount || '')
        },
        () => this.applyFilters()
      );
    } catch (err) {
      const errorMessage = (err && err.message) || '加载商品失败';
      const sideCountMap = this.buildSideCountMap([]);
      this.setData({
        errorMessage,
        rawList: [],
        list: [],
        sideCountMap,
        sideCategories: this.decorateSideCategories(sideCountMap)
      });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  extractCartCount(cart) {
    const source = cart && typeof cart === 'object' ? cart : {};
    if (typeof source.totalQty === 'number' && Number.isFinite(source.totalQty)) {
      return Math.max(0, Number(source.totalQty));
    }
    if (Array.isArray(source.items)) {
      return source.items.reduce((sum, item) => sum + Number((item && item.qty) || 0), 0);
    }
    return 0;
  },

  onKeywordInput(e) {
    this.setData({ keyword: String(e.detail.value || '') });
  },

  onSearch() {
    this.applyFilters();
  },

  onClearKeyword() {
    if (!this.data.keyword) {
      return;
    }
    this.setData({ keyword: '' }, () => this.applyFilters());
  },

  onTapCategory(e) {
    const value = e.currentTarget.dataset.value;
    if (!value) {
      return;
    }
    this.setData({ category: String(value) }, () => this.applyFilters());
  },

  onTapSideCategory(e) {
    const value = String(e.currentTarget.dataset.value || '').trim();
    if (!value || value === this.data.sideCategory) {
      return;
    }
    this.setData({ sideCategory: value }, () => this.applyFilters());
  },

  onResetFilters() {
    if (!this.data.hasActiveFilters) {
      return;
    }
    this.setData({ keyword: '', category: 'ALL', sideCategory: 'ALL' }, () => this.applyFilters());
  },

  applyFilters() {
    const keyword = String(this.data.keyword || '').trim().toLowerCase();
    const category = this.data.category;
    const sideCategory = this.data.sideCategory;
    const commonProductIds = this.getCommonProductIds();
    const hasActiveFilters = Boolean(keyword || category !== 'ALL' || sideCategory !== 'ALL');

    const list = this.data.rawList.filter((item) => {
      if (sideCategory !== 'ALL' && item.sideCategory !== sideCategory) {
        return false;
      }

      if (keyword) {
        const text = `${item.name} ${item.code} ${item.description}`.toLowerCase();
        if (!text.includes(keyword)) {
          return false;
        }
      }

      if (category === 'COMMON' && !commonProductIds.has(item.id)) {
        return false;
      }
      if (category === 'NEED_QUOTE' && !item.needQuote) {
        return false;
      }
      if (category === 'OUT_OF_STOCK' && item.hasInStock) {
        return false;
      }

      return true;
    });

    this.setData({
      list,
      hasActiveFilters,
      activeSideLabel: this.getSideCategoryLabel(sideCategory)
    });
  },

  buildSideCountMap(list) {
    const map = SIDE_CATEGORIES.reduce((acc, item) => {
      acc[item.value] = 0;
      return acc;
    }, {});
    map.ALL = Array.isArray(list) ? list.length : 0;

    (Array.isArray(list) ? list : []).forEach((item) => {
      const key = item && item.sideCategory ? item.sideCategory : 'OTHER';
      if (typeof map[key] !== 'number') {
        map[key] = 0;
      }
      map[key] += 1;
    });

    return map;
  },

  decorateSideCategories(sideCountMap) {
    const countMap = sideCountMap && typeof sideCountMap === 'object' ? sideCountMap : {};
    return SIDE_CATEGORIES.map((item) => Object.assign({}, item, { count: Number(countMap[item.value] || 0) }));
  },

  getSideCategoryLabel(value) {
    const matched = SIDE_CATEGORIES.find((item) => item.value === value);
    return matched ? matched.label : '全部';
  },

  resolveSideCategory(source) {
    const text = `${source && source.name ? source.name : ''} ${source && source.description ? source.description : ''} ${source && source.code ? source.code : ''}`.toLowerCase();
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.RICE_FLOUR)) {
      return 'RICE_FLOUR';
    }
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.OIL)) {
      return 'OIL';
    }
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.SEASONING)) {
      return 'SEASONING';
    }
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.KITCHEN)) {
      return 'KITCHEN';
    }
    return 'OTHER';
  },

  guessSideCategoryByKeyword(keyword) {
    const text = String(keyword || '').trim().toLowerCase();
    if (!text) {
      return 'ALL';
    }
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.RICE_FLOUR)) {
      return 'RICE_FLOUR';
    }
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.OIL)) {
      return 'OIL';
    }
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.SEASONING)) {
      return 'SEASONING';
    }
    if (this.matchesCategoryKeywords(text, SIDE_CATEGORY_KEYWORDS.KITCHEN)) {
      return 'KITCHEN';
    }
    return 'ALL';
  },

  matchesCategoryKeywords(text, keywords) {
    const source = String(text || '');
    return (Array.isArray(keywords) ? keywords : []).some((keyword) => source.includes(String(keyword || '').toLowerCase()));
  },

  getCommonProductIds() {
    const history = mall.getHistory(200);
    const counter = {};
    (Array.isArray(history) ? history : []).forEach((item) => {
      const id = item && item.productId ? String(item.productId) : '';
      if (!id) {
        return;
      }
      counter[id] = Number(counter[id] || 0) + 1;
    });

    return new Set(
      Object.keys(counter).filter((id) => counter[id] >= 2)
    );
  },

  goDetail(e) {
    if (this.data.actionLoading) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    this.runNavAction(() => {
      wx.navigateTo({ url: `/pages/products/detail/index?id=${id}` });
    });
  },

  goCart() {
    this.runNavAction(() => {
      wx.switchTab({ url: '/pages/cart/index' });
    });
  },

  goQuoteCenter() {
    this.runNavAction(() => {
      wx.switchTab({ url: '/pages/cart/index' });
    });
  },

  runNavAction(handler) {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    try {
      handler();
    } finally {
      setTimeout(() => {
        this.setData({ actionLoading: false });
      }, 320);
    }
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
