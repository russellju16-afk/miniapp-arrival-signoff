const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const mall = require('../../../utils/mall');
const { formatAmount } = require('../../../utils/format');

Page({
  data: {
    id: '',
    loading: false,
    product: null,
    selectedSkuId: '',
    selectedSku: null,
    qty: 1,
    isFavorite: false,
    serviceItems: ['正品保障', '支持线下结算', '可开票']
  },

  onLoad(options) {
    this.setData({
      id: options.id || ''
    });
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchDetail();
  },

  async fetchDetail() {
    if (!this.data.id) {
      wx.showToast({ title: '参数缺失', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true });
      const res = await api.getProductDetail(this.data.id);
      const normalized = this.normalizeProduct(res.data || null);
      const skus = Array.isArray(normalized && normalized.skus) ? normalized.skus : [];
      const firstSku = skus.find((item) => item.status === 'ACTIVE') || skus[0] || null;

      this.setData(
        {
          product: normalized,
          selectedSkuId: firstSku ? firstSku.id : '',
          selectedSku: firstSku,
          qty: 1,
          isFavorite: mall.isFavorite(this.data.id)
        },
        () => {
          this.recordBrowseHistory();
        }
      );
    } catch (err) {
      wx.showToast({ title: err.message || '加载商品失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeProduct(product) {
    if (!product || typeof product !== 'object') {
      return null;
    }

    const skus = Array.isArray(product.skus)
      ? product.skus.map((item) => ({
          ...item,
          priceText: formatAmount(item.price),
          specsText: this.stringifySpecs(item.specs)
        }))
      : [];

    const minPrice = skus.length > 0 ? Math.min(...skus.map((sku) => Number(sku.price || 0))) : 0;

    return {
      ...product,
      skus,
      minPrice,
      minPriceText: formatAmount(minPrice)
    };
  },

  stringifySpecs(specs) {
    if (!specs || typeof specs !== 'object') {
      return '';
    }

    const entries = Object.entries(specs);
    if (entries.length === 0) {
      return '';
    }

    return entries
      .map(([key, value]) => `${key}:${String(value)}`)
      .join(' / ');
  },

  recordBrowseHistory() {
    const product = this.data.product;
    if (!product) {
      return;
    }

    mall.addHistoryItem({
      productId: product.id,
      name: product.name,
      code: product.code,
      coverImageUrl: product.coverImageUrl,
      minPriceText: product.minPriceText
    });
  },

  onSelectSku(e) {
    const skuId = e.currentTarget.dataset.id;
    const product = this.data.product || {};
    const skus = Array.isArray(product.skus) ? product.skus : [];
    const found = skus.find((item) => item.id === skuId);
    if (!found) {
      return;
    }
    if (found.status !== 'ACTIVE') {
      wx.showToast({ title: '该规格已下架', icon: 'none' });
      return;
    }

    this.setData({
      selectedSkuId: found.id,
      selectedSku: found,
      qty: 1
    });
  },

  onMinusQty() {
    const next = Math.max(1, Number(this.data.qty) - 1);
    this.setData({ qty: next });
  },

  onPlusQty() {
    const stock = this.data.selectedSku ? Number(this.data.selectedSku.stock || 0) : 0;
    const next = Number(this.data.qty) + 1;
    if (stock > 0 && next > stock) {
      wx.showToast({ title: '超过库存', icon: 'none' });
      return;
    }
    this.setData({ qty: next });
  },

  onQtyInput(e) {
    const value = Number(e.detail.value || 1);
    if (!Number.isFinite(value) || value <= 0) {
      this.setData({ qty: 1 });
      return;
    }

    const stock = this.data.selectedSku ? Number(this.data.selectedSku.stock || 0) : 0;
    const normalized = Math.floor(value);
    if (stock > 0 && normalized > stock) {
      this.setData({ qty: stock });
      return;
    }

    this.setData({ qty: normalized });
  },

  toggleFavorite() {
    const result = mall.toggleFavorite(this.data.id);
    this.setData({ isFavorite: result.favorited });
    wx.showToast({
      title: result.favorited ? '已加入收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  async addToCart() {
    const sku = this.data.selectedSku;
    if (!sku) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      return;
    }

    const qty = Number(this.data.qty);
    if (!Number.isInteger(qty) || qty <= 0) {
      wx.showToast({ title: '数量不合法', icon: 'none' });
      return;
    }

    try {
      await api.addCartItem({
        skuId: sku.id,
        qty
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '加入失败', icon: 'none' });
    }
  },

  buyNow() {
    const sku = this.data.selectedSku;
    if (!sku) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      return;
    }

    const qty = Number(this.data.qty);
    if (!Number.isInteger(qty) || qty <= 0) {
      wx.showToast({ title: '数量不合法', icon: 'none' });
      return;
    }

    const unitPrice = Number(sku.price || 0);

    mall.setBuyNowPayload({
      source: 'buyNow',
      items: [
        {
          skuId: sku.id,
          qty,
          productName: this.data.product ? this.data.product.name : '',
          skuName: sku.skuName,
          specs: sku.specs,
          specsText: sku.specsText,
          unitPrice,
          coverImageUrl: this.data.product ? this.data.product.coverImageUrl : ''
        }
      ]
    });

    wx.navigateTo({ url: '/pages/checkout/index?source=buyNow' });
  },

  goCart() {
    wx.navigateTo({ url: '/pages/cart/index' });
  },

  goFavorites() {
    wx.navigateTo({ url: '/pages/favorites/index' });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent(`/pages/products/detail/index?id=${this.data.id}`);
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
