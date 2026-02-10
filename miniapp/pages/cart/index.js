const api = require('../../services/api');
const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatAmount } = require('../../utils/format');

Page({
  data: {
    loading: false,
    errorMessage: '',
    actionLoading: false,
    quoteSubmitting: false,
    cart: {
      items: [],
      totalQty: 0,
      totalAmount: 0,
      totalAmountText: '0.00'
    },
    selectedMap: {},
    allSelected: false,
    selectedItemCount: 0,
    selectedQty: 0,
    selectedAmount: 0,
    selectedAmountText: '0.00',
    selectedPricedCount: 0,
    selectedQuoteCount: 0,
    focusQuote: false
  },

  onLoad(options) {
    this.setData({
      focusQuote: options.focus === 'quote'
    });
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchCart();
  },

  onPullDownRefresh() {
    this.fetchCart().finally(() => wx.stopPullDownRefresh());
  },

  async fetchCart() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const res = await api.getCart();
      const cart = this.normalizeCart(res.data);

      const oldMap = this.data.selectedMap || {};
      const selectedMap = {};
      cart.items.forEach((item) => {
        selectedMap[item.id] = typeof oldMap[item.id] === 'boolean' ? oldMap[item.id] : true;
      });

      this.setData({ cart, selectedMap }, () => this.recalcSelection());
    } catch (err) {
      const errorMessage = (err && err.message) || '加载购物车失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeCart(cart) {
    const raw = cart && typeof cart === 'object' ? cart : {};
    const items = Array.isArray(raw.items)
      ? raw.items.map((item) => {
          const hasPrice = typeof item.unitPrice === 'number' && Number.isFinite(item.unitPrice);
          const lineAmount = typeof item.lineAmount === 'number' ? Number(item.lineAmount) : 0;
          return {
            id: item.id,
            productId: item.productId,
            skuId: item.skuId,
            productName: item.productName,
            skuName: item.skuName,
            skuCode: item.skuCode,
            specsText: this.stringifySpecs(item.specs),
            qty: Number(item.qty || 0),
            hasPrice,
            needQuote: Boolean(item.needQuote),
            inStock: Boolean(item.inStock),
            stockStatusText: item.inStock ? '可下单' : '缺货',
            unitPrice: hasPrice ? Number(item.unitPrice) : null,
            unitPriceText: hasPrice ? formatAmount(item.unitPrice) : '--',
            lineAmount,
            lineAmountText: hasPrice ? formatAmount(lineAmount) : '--'
          };
        })
      : [];

    const totalAmount = items
      .filter((item) => item.hasPrice)
      .reduce((sum, item) => sum + Number(item.lineAmount || 0), 0);

    return {
      ...raw,
      items,
      totalQty: Number(raw.totalQty || 0),
      totalAmount,
      totalAmountText: formatAmount(totalAmount)
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

  onToggleItem(e) {
    if (this.data.loading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }

    const selectedMap = {
      ...this.data.selectedMap,
      [id]: !this.data.selectedMap[id]
    };

    this.setData({ selectedMap }, () => this.recalcSelection());
  },

  onToggleAll() {
    if (this.data.loading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const next = !this.data.allSelected;
    const selectedMap = {};
    this.data.cart.items.forEach((item) => {
      selectedMap[item.id] = next;
    });
    this.setData({ selectedMap }, () => this.recalcSelection());
  },

  recalcSelection() {
    const items = Array.isArray(this.data.cart.items) ? this.data.cart.items : [];
    let selectedItemCount = 0;
    let selectedQty = 0;
    let selectedAmount = 0;
    let selectedPricedCount = 0;
    let selectedQuoteCount = 0;

    items.forEach((item) => {
      const selected = Boolean(this.data.selectedMap[item.id]);
      if (!selected) {
        return;
      }
      selectedItemCount += 1;
      selectedQty += Number(item.qty || 0);

      if (item.hasPrice) {
        selectedPricedCount += 1;
        selectedAmount += Number(item.lineAmount || 0);
      }

      if (item.needQuote) {
        selectedQuoteCount += 1;
      }
    });

    const allSelected = items.length > 0 && selectedItemCount === items.length;

    this.setData({
      allSelected,
      selectedItemCount,
      selectedQty,
      selectedAmount: Number(selectedAmount.toFixed(2)),
      selectedAmountText: formatAmount(selectedAmount),
      selectedPricedCount,
      selectedQuoteCount
    });
  },

  async onMinusQty(e) {
    if (this.data.loading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const item = this.pickItemFromEvent(e);
    if (!item) {
      return;
    }
    const nextQty = Number(item.qty) - 1;
    if (nextQty <= 0) {
      this.removeItem(e);
      return;
    }
    await this.updateQty(item.id, nextQty);
  },

  async onPlusQty(e) {
    if (this.data.loading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const item = this.pickItemFromEvent(e);
    if (!item) {
      return;
    }
    if (!item.inStock) {
      wx.showToast({ title: '库存不足', icon: 'none' });
      return;
    }
    await this.updateQty(item.id, Number(item.qty) + 1);
  },

  async updateQty(itemId, qty) {
    try {
      this.setData({ loading: true });
      const res = await api.updateCartItem(itemId, { qty });
      const cart = this.normalizeCart(res.data);
      this.setData({ cart }, () => this.recalcSelection());
    } catch (err) {
      wx.showToast({ title: err.message || '更新数量失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  removeItem(e) {
    if (this.data.loading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const item = this.pickItemFromEvent(e);
    if (!item) {
      return;
    }

    wx.showModal({
      title: '移除商品',
      content: `确认从购物车移除 ${item.productName} 吗？`,
      success: async (res) => {
        if (!res.confirm) {
          return;
        }
        try {
          this.setData({ loading: true });
          const result = await api.removeCartItem(item.id);
          const cart = this.normalizeCart(result.data);
          const selectedMap = { ...this.data.selectedMap };
          delete selectedMap[item.id];
          this.setData({ cart, selectedMap }, () => this.recalcSelection());
        } catch (err) {
          wx.showToast({ title: err.message || '移除失败', icon: 'none' });
        } finally {
          this.setData({ loading: false });
        }
      }
    });
  },

  checkoutPricedItems() {
    if (this.data.loading || this.data.actionLoading || this.data.quoteSubmitting) {
      return;
    }
    const selectedItems = this.getSelectedItems().filter((item) => item.hasPrice && item.inStock);
    if (selectedItems.length === 0) {
      wx.showToast({ title: '请先选择有价且可下单商品', icon: 'none' });
      return;
    }

    mall.setBuyNowPayload({
      source: 'cart',
      items: selectedItems.map((item) => ({
        skuId: item.skuId,
        qty: item.qty,
        expectedUnitPrice: Number(item.unitPrice),
        productName: item.productName,
        skuName: item.skuName,
        specsText: item.specsText,
        unitPrice: Number(item.unitPrice),
        needQuote: false
      }))
    });

    this.setData({ actionLoading: true });
    wx.navigateTo({ url: '/pages/checkout/index?source=cart' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  async submitQuoteForSelected() {
    if (this.data.quoteSubmitting || this.data.loading || this.data.actionLoading) {
      return;
    }
    const quoteItems = this.getSelectedItems().filter((item) => item.needQuote);
    if (quoteItems.length === 0) {
      wx.showToast({ title: '所选商品均已有价格', icon: 'none' });
      return;
    }

    try {
      this.setData({ quoteSubmitting: true });
      await api.createQuoteRequest({
        items: quoteItems.map((item) => ({
          skuId: item.skuId,
          qty: item.qty,
          specText: item.specsText || item.skuName
        })),
        remark: '来源: 购物车一并询价'
      });
      wx.showToast({ title: '询价单已提交', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '询价提交失败', icon: 'none' });
    } finally {
      this.setData({ quoteSubmitting: false });
    }
  },

  getSelectedItems() {
    return (this.data.cart.items || []).filter((item) => Boolean(this.data.selectedMap[item.id]));
  },

  pickItemFromEvent(e) {
    const id = e.currentTarget.dataset.id;
    return (this.data.cart.items || []).find((item) => item.id === id);
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

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.fetchCart();
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/cart/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
