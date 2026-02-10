const api = require('../../services/api');
const auth = require('../../utils/auth');
const { formatAmount } = require('../../utils/format');

const HOME_BANNERS = [
  {
    id: 'banner-common',
    theme: 'common',
    enabled: true,
    tag: '常购',
    title: '高频商品一键补货',
    subTitle: '按历史采购快速回填，缩短下单时间',
    cta: '进入常购专区',
    action: 'commonProducts',
    imageUrl: ''
  },
  {
    id: 'banner-quote',
    theme: 'quote',
    enabled: true,
    tag: '报价',
    title: '无价商品快速申请报价',
    subTitle: '购物车集中询价，避免漏提报价需求',
    cta: '前往报价入口',
    action: 'quote',
    imageUrl: ''
  },
  {
    id: 'banner-statement',
    theme: 'statement',
    enabled: true,
    tag: '对账',
    title: '账期与开票集中处理',
    subTitle: '对账确认与开票申请统一到业务中心',
    cta: '查看对账中心',
    action: 'statements',
    imageUrl: ''
  }
];

const DEFAULT_BRAND_CENTER_ITEMS = [
  { id: 'brand-1', name: '品牌A', logoUrl: '', enabled: true },
  { id: 'brand-2', name: '品牌B', logoUrl: '', enabled: true },
  { id: 'brand-3', name: '品牌C', logoUrl: '', enabled: true },
  { id: 'brand-4', name: '品牌D', logoUrl: '', enabled: true }
];

const CATEGORY_ENTRIES = [
  { id: 'rice', name: '米', keyword: '米', icon: '米' },
  { id: 'flour', name: '面', keyword: '面', icon: '面' },
  { id: 'oil', name: '油', keyword: '油', icon: '油' },
  { id: 'flavor', name: '调味', keyword: '调味', icon: '调' },
  { id: 'kitchen', name: '厨房', keyword: '厨房', icon: '厨' }
];

const DEFAULT_HOME_NOTICE = {
  title: '店铺通知',
  content: '当日 17:30 前下单次日达，17:30 后下单顺延一天。'
};

const HOME_LAYOUT_KEYS = ['banners', 'categories', 'brandCenter', 'notice', 'featured', 'hot'];
const HOME_LAYOUT_KEY_SET = new Set(HOME_LAYOUT_KEYS);

Page({
  data: {
    loading: false,
    actionLoading: false,
    errorMessage: '',
    banners: HOME_BANNERS,
    bannerCurrent: 0,
    brandItems: DEFAULT_BRAND_CENTER_ITEMS,
    profile: null,
    categoryEntries: CATEGORY_ENTRIES,
    featuredList: [],
    hotList: [],
    noticeTitle: DEFAULT_HOME_NOTICE.title,
    noticeContent: DEFAULT_HOME_NOTICE.content,
    layoutSections: HOME_LAYOUT_KEYS.map((key) => ({ key, enabled: true })),
    capabilityTips: ''
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.loadData();
  },

  async loadData() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const [profileRes, productsRes] = await Promise.all([
        api.getMiniProfile(),
        api.getProducts({ page: 1, pageSize: 20 })
      ]);

      const profile = profileRes.data || null;
      const productItems = productsRes && productsRes.data && Array.isArray(productsRes.data.items)
        ? productsRes.data.items
        : [];

      const normalized = productItems
        .filter((item) => item && item.status !== 'OFFLINE')
        .map((item) => {
          const hasPrice = Boolean(item.hasPrice && typeof item.minDisplayPrice === 'number');
          return {
            id: item.id,
            name: item.name,
            code: item.code,
            description: item.description || '',
            coverImageUrl: item.coverImageUrl || '',
            needQuote: Boolean(item.needQuote),
            hasInStock: Boolean(item.hasInStock),
            stockStatusText: item.hasInStock ? '可下单' : '缺货',
            priceText: hasPrice ? `¥${formatAmount(item.minDisplayPrice)}` : '需报价'
          };
        });

      const featuredList = normalized.slice(0, 4);
      const hotList = normalized.slice(4, 12);
      const homeNotice = this.normalizeHomeNotice(profile && profile.homeNotice);

      this.setData({
        profile,
        banners: this.normalizeBanners(profile && profile.homeBanners),
        brandItems: this.normalizeBrandCenter(profile && profile.brandCenterItems),
        layoutSections: this.normalizeHomeLayout(profile && profile.homeLayout),
        noticeTitle: homeNotice.title,
        noticeContent: homeNotice.content,
        featuredList,
        hotList,
        capabilityTips: this.buildCapabilityTips(profile)
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '加载首页失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  buildCapabilityTips(profile) {
    if (!profile || !profile.capabilities) {
      return '';
    }

    if (profile.status === 'PENDING') {
      return '账号审核中：可浏览商品与申请报价，暂不可下单/对账/开票。';
    }

    if (profile.status === 'REJECTED') {
      return '账号已驳回：请联系销售重新发起注册申请。';
    }

    if (!profile.isKingdeeBound) {
      return '账号未绑定金蝶客户：请联系管理员绑定后下单。';
    }

    return '账号已激活：支持下单、对账与开票申请。';
  },

  normalizeBanners(source) {
    const themeSet = new Set(['common', 'quote', 'statement', 'primary']);
    const actionSet = new Set(['commonProducts', 'quote', 'statements', 'invoiceRequest', 'products']);
    const list = Array.isArray(source) ? source : [];
    const normalized = list
      .map((item, index) => {
        if (!item || typeof item !== 'object') {
          return null;
        }
        const title = String(item.title || '').trim();
        if (!title) {
          return null;
        }
        const themeText = String(item.theme || 'common').trim();
        const actionText = String(item.action || 'commonProducts').trim();
        return {
          id: String(item.id || `banner-${index + 1}`),
          enabled: item.enabled !== false,
          theme: themeSet.has(themeText) ? themeText : 'common',
          tag: String(item.tag || '精选').trim() || '精选',
          title,
          subTitle: String(item.subTitle || '点击查看详情').trim() || '点击查看详情',
          cta: String(item.cta || '立即查看').trim() || '立即查看',
          action: actionSet.has(actionText) ? actionText : 'commonProducts',
          imageUrl: String(item.imageUrl || '').trim()
        };
      })
      .filter((item) => item && item.enabled)
      .slice(0, 8);

    return normalized.length > 0 ? normalized : HOME_BANNERS;
  },

  normalizeBrandCenter(source) {
    if (!Array.isArray(source)) {
      return DEFAULT_BRAND_CENTER_ITEMS.map((item) => ({
        ...item,
        initial: (item.name || '品').slice(0, 1)
      }));
    }

    return source
      .map((item, index) => {
        if (!item || typeof item !== 'object') {
          return null;
        }
        const name = String(item.name || '').trim();
        if (!name) {
          return null;
        }
        return {
          id: String(item.id || `brand-${index + 1}`),
          name,
          logoUrl: String(item.logoUrl || '').trim(),
          enabled: item.enabled !== false,
          initial: name.slice(0, 1)
        };
      })
      .filter((item) => item && item.enabled)
      .slice(0, 80);
  },

  normalizeHomeNotice(source) {
    if (!source || typeof source !== 'object') {
      return {
        title: DEFAULT_HOME_NOTICE.title,
        content: DEFAULT_HOME_NOTICE.content
      };
    }

    const title = String(source.title || '').trim().slice(0, 12) || DEFAULT_HOME_NOTICE.title;
    const content = String(source.content || '').trim().slice(0, 120) || DEFAULT_HOME_NOTICE.content;

    return {
      title,
      content
    };
  },

  normalizeHomeLayout(source) {
    const list = Array.isArray(source) ? source : [];
    const keySet = new Set();
    const normalized = [];

    list.forEach((item) => {
      if (!item || typeof item !== 'object') {
        return;
      }
      const key = String(item.key || '').trim();
      if (!HOME_LAYOUT_KEY_SET.has(key) || keySet.has(key)) {
        return;
      }
      keySet.add(key);
      normalized.push({
        key,
        enabled: item.enabled !== false
      });
    });

    HOME_LAYOUT_KEYS.forEach((key) => {
      if (!keySet.has(key)) {
        keySet.add(key);
        normalized.push({
          key,
          enabled: true
        });
      }
    });

    if (normalized.filter((item) => item.enabled).length === 0) {
      return HOME_LAYOUT_KEYS.map((key) => ({
        key,
        enabled: true
      }));
    }

    return normalized;
  },

  onTapCategory(e) {
    const keyword = String(e.currentTarget.dataset.keyword || '').trim();
    wx.setStorageSync('products_list_tab', 'ALL');
    wx.setStorageSync('products_list_preset_keyword', keyword);
    this.goProducts();
  },

  onTapBrand(e) {
    const keyword = String(e.currentTarget.dataset.keyword || '').trim();
    wx.setStorageSync('products_list_tab', 'ALL');
    wx.setStorageSync('products_list_preset_keyword', keyword);
    this.goProducts();
  },

  goCommonProducts() {
    wx.setStorageSync('products_list_tab', 'COMMON');
    wx.setStorageSync('products_list_preset_keyword', '');
    this.goProducts();
  },

  goQuote() {
    this.runNavAction(() => {
      wx.switchTab({ url: '/pages/cart/index' });
    });
  },

  goStatements() {
    this.runNavAction(() => {
      wx.navigateTo({ url: '/pages/statements/list/index' });
    });
  },

  goInvoiceRequest() {
    this.runNavAction(() => {
      wx.navigateTo({ url: '/pages/invoice/request/index' });
    });
  },

  goProducts() {
    this.runNavAction(() => {
      wx.switchTab({ url: '/pages/products/list/index' });
    });
  },

  goProductDetail(e) {
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

  onBannerChange(e) {
    this.setData({ bannerCurrent: Number(e.detail.current || 0) });
  },

  onBannerTap(e) {
    if (this.data.actionLoading) {
      return;
    }
    const action = e.currentTarget.dataset.action;
    if (action === 'commonProducts') {
      this.goCommonProducts();
      return;
    }
    if (action === 'quote') {
      this.goQuote();
      return;
    }
    if (action === 'statements') {
      this.goStatements();
      return;
    }
    if (action === 'invoiceRequest') {
      this.goInvoiceRequest();
      return;
    }
    this.goProducts();
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.loadData();
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
      const redirect = encodeURIComponent('/pages/home/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
