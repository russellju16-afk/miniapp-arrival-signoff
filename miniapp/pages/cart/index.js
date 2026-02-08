const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const mall = require('../../../utils/mall');
const { formatAmount } = require('../../../utils/format');

Page({
  data: {
    loading: false,
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
    selectedAmountText: '0.00'
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
      this.setData({ loading: true });
      const res = await api.getCart();
      const cart = this.normalizeCart(res.data);

      const oldMap = this.data.selectedMap || {};
      const selectedMap = {};
      for (const item of cart.items) {
        selectedMap[item.id] = typeof oldMap[item.id] === 'boolean' ? oldMap[item.id] : true;
      }

      this.setData(
        {
          cart,
          selectedMap
        },
        () => {
          this.recalcSelection();
        }
      );
    } catch (err) {
      wx.showToast({ title: err.message || '加载购物车失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onToggleItem(e) {
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
    const next = !this.data.allSelected;
    const selectedMap = {};
    for (const item of this.data.cart.items) {
      selectedMap[item.id] = next;
    }

    this.setData({ selectedMap }, () => this.recalcSelection());
  },

  recalcSelection() {
    const items = Array.isArray(this.data.cart.items) ? this.data.cart.items : [];
    let selectedItemCount = 0;
    let selectedQty = 0;
    let selectedAmount = 0;

    for (const item of items) {
      const selected = Boolean(this.data.selectedMap[item.id]);
      if (!selected) {
        continue;
      }
      selectedItemCount += 1;
      selectedQty += Number(item.qty || 0);
      selectedAmount += Number(item.lineAmount || 0);
    }

    const allSelected = items.length > 0 && selectedItemCount === items.length;

    this.setData({
      allSelected,
      selectedItemCount,
      selectedQty,
      selectedAmount: Number(selectedAmount.toFixed(2)),
      selectedAmountText: formatAmount(selectedAmount)
    });
  },

  async onMinusQty(e) {
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
    const item = this.pickItemFromEvent(e);
    if (!item) {
      return;
    }
    const stock = Number(item.stock || 0);
    const nextQty = Number(item.qty) + 1;
    if (stock > 0 && nextQty > stock) {
      wx.showToast({ title: '超过库存', icon: 'none' });
      return;
    }
    await this.updateQty(item.id, nextQty);
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

  goCheckout() {
    const selectedItems = this.getSelectedItems();
    if (selectedItems.length === 0) {
      wx.showToast({ title: '请先勾选结算商品', icon: 'none' });
      return;
    }

    mall.setBuyNowPayload({
      source: 'cart',
      items: selectedItems.map((item) => ({
        skuId: item.skuId,
        qty: item.qty,
        productName: item.productName,
        skuName: item.skuName,
        specs: item.specs,
        specsText: item.specsText,
        unitPrice: item.unitPrice,
        coverImageUrl: item.coverImageUrl
      }))
    });

    wx.navigateTo({ url: '/pages/checkout/index?source=cart' });
  },

  getSelectedItems() {
    const list = Array.isArray(this.data.cart.items) ? this.data.cart.items : [];
    return list.filter((item) => Boolean(this.data.selectedMap[item.id]));
  },

  goProducts() {
    wx.navigateTo({ url: '/pages/products/list/index' });
  },

  goOrders() {
    wx.navigateTo({ url: '/pages/orders/list/index' });
  },

  goDeliveries() {
    wx.navigateTo({ url: '/pages/deliveries/list/index' });
  },

  pickItemFromEvent(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.cart.items || [];
    return list.find((item) => item.id === id);
  },

  normalizeCart(cart) {
    const raw = cart && typeof cart === 'object' ? cart : {};
    const items = Array.isArray(raw.items)
      ? raw.items.map((item) => {
          const lineAmount = Number(item.lineAmount || 0);
          return {
            ...item,
            lineAmount: lineAmount,
            lineAmountText: formatAmount(lineAmount),
            unitPriceText: formatAmount(item.unitPrice),
            specsText: this.stringifySpecs(item.specs)
          };
        })
      : [];

    return {
      ...raw,
      items,
      totalQty: Number(raw.totalQty || 0),
      totalAmount: Number(raw.totalAmount || 0),
      totalAmountText: formatAmount(raw.totalAmount)
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
