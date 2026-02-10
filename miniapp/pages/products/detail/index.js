const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const mall = require('../../../utils/mall');
const { formatAmount } = require('../../../utils/format');

Page({
  data: {
    id: '',
    loading: false,
    errorMessage: '',
    actionLoading: false,
    addCartLoading: false,
    quoteSubmitting: false,
    product: null,
    selectedSkuId: '',
    selectedSku: null,
    qty: 1
  },

  onLoad(options) {
    this.setData({ id: options.id || '' });
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchDetail();
  },

  async fetchDetail() {
    if (!this.data.id) {
      const errorMessage = '参数缺失，无法加载商品详情';
      this.setData({ errorMessage });
      wx.showToast({ title: '参数缺失', icon: 'none' });
      return;
    }

    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getProductDetail(this.data.id);
      const product = this.normalizeProduct(res.data || null);
      const selectedSku = this.pickDefaultSku(product);

      this.setData({
        product,
        selectedSkuId: selectedSku ? selectedSku.id : '',
        selectedSku,
        qty: 1
      });

      if (product) {
        mall.addHistoryItem({
          productId: product.id,
          name: product.name,
          code: product.code,
          coverImageUrl: product.coverImageUrl || '',
          minPriceText: product.priceText
        });
      }
    } catch (err) {
      const errorMessage = (err && err.message) || '加载详情失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeProduct(product) {
    if (!product || typeof product !== 'object') {
      return null;
    }
    const skus = Array.isArray(product.skus)
      ? product.skus.map((sku) => {
          const specsText = this.stringifySpecs(sku.specs);
          const hasPrice = typeof sku.displayPrice === 'number';
          return {
            ...sku,
            specsText,
            hasPrice,
            displayPriceText: hasPrice ? formatAmount(sku.displayPrice) : '需报价',
            stockStatusText: sku.inStock ? '可下单' : '缺货'
          };
        })
      : [];

    const hasPrice = Boolean(product.hasPrice && typeof product.minDisplayPrice === 'number');

    return {
      ...product,
      skus,
      hasPrice,
      priceText: hasPrice ? `¥${formatAmount(product.minDisplayPrice)} 起` : '需报价'
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
    return entries.map(([k, v]) => `${k}:${String(v)}`).join(' / ');
  },

  pickDefaultSku(product) {
    if (!product || !Array.isArray(product.skus)) {
      return null;
    }
    return (
      product.skus.find((item) => item.inStock && !item.needQuote) ||
      product.skus.find((item) => item.inStock) ||
      product.skus[0] ||
      null
    );
  },

  onSelectSku(e) {
    if (this.data.loading || this.data.addCartLoading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const skuId = e.currentTarget.dataset.id;
    const skus = this.data.product && Array.isArray(this.data.product.skus) ? this.data.product.skus : [];
    const sku = skus.find((item) => item.id === skuId);
    if (!sku) {
      return;
    }
    this.setData({
      selectedSkuId: sku.id,
      selectedSku: sku,
      qty: 1
    });
  },

  onMinusQty() {
    if (this.data.loading || this.data.addCartLoading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    this.setData({ qty: Math.max(1, Number(this.data.qty || 1) - 1) });
  },

  onPlusQty() {
    if (this.data.loading || this.data.addCartLoading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const selectedSku = this.data.selectedSku;
    if (!selectedSku || !selectedSku.inStock) {
      wx.showToast({ title: '当前规格缺货', icon: 'none' });
      return;
    }
    this.setData({ qty: Number(this.data.qty || 1) + 1 });
  },

  onQtyInput(e) {
    if (this.data.loading || this.data.addCartLoading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const next = Math.floor(Number(e.detail.value || 1));
    this.setData({ qty: Number.isFinite(next) && next > 0 ? next : 1 });
  },

  async addToCart() {
    if (this.data.addCartLoading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const sku = this.data.selectedSku;
    if (!sku) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      return;
    }
    if (!sku.inStock) {
      wx.showToast({ title: '库存不足', icon: 'none' });
      return;
    }

    try {
      this.setData({ addCartLoading: true });
      await api.addCartItem({
        skuId: sku.id,
        qty: Number(this.data.qty || 1)
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '加入失败', icon: 'none' });
    } finally {
      this.setData({ addCartLoading: false });
    }
  },

  buyNow() {
    if (this.data.actionLoading || this.data.addCartLoading || this.data.quoteSubmitting) {
      return;
    }
    const sku = this.data.selectedSku;
    if (!sku) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      return;
    }
    if (!sku.inStock) {
      wx.showToast({ title: '库存不足', icon: 'none' });
      return;
    }

    if (!sku.hasPrice) {
      this.submitSingleQuoteRequest();
      return;
    }

    mall.setBuyNowPayload({
      source: 'buyNow',
      items: [
        {
          skuId: sku.id,
          qty: Number(this.data.qty || 1),
          expectedUnitPrice: Number(sku.displayPrice),
          productName: this.data.product ? this.data.product.name : '',
          skuName: sku.skuName,
          specsText: sku.specsText,
          unitPrice: Number(sku.displayPrice || 0),
          needQuote: false
        }
      ]
    });

    this.setData({ actionLoading: true });
    wx.navigateTo({ url: '/pages/checkout/index?source=buyNow' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  async submitSingleQuoteRequest() {
    if (this.data.quoteSubmitting || this.data.actionLoading || this.data.addCartLoading) {
      return;
    }
    const sku = this.data.selectedSku;
    if (!sku) {
      return;
    }

    try {
      this.setData({ quoteSubmitting: true });
      await api.createQuoteRequest({
        items: [
          {
            skuId: sku.id,
            qty: Number(this.data.qty || 1),
            specText: sku.specsText || sku.skuName
          }
        ],
        remark: `来源: 商品详情 ${this.data.product ? this.data.product.name : ''}`
      });
      wx.showToast({ title: '报价申请已提交', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ quoteSubmitting: false });
    }
  },

  goCart() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.switchTab({ url: '/pages/cart/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.fetchDetail();
  },

  goProducts() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.switchTab({ url: '/pages/products/list/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
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
