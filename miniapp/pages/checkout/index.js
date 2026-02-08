const api = require('../../services/api');
const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatAmount } = require('../../utils/format');

Page({
  data: {
    source: 'cart',
    loading: false,
    pageReady: false,
    submitting: false,
    items: [],
    totalQty: 0,
    totalAmount: 0,
    totalAmountText: '0.00',
    addresses: [],
    selectedAddressId: '',
    selectedAddress: null,
    deliveryOptions: [
      { label: '普通配送（2-4 天）', value: 'standard', fee: 0 },
      { label: '加急配送（当日/次日）', value: 'express', fee: 12 }
    ],
    deliveryIndex: 0,
    couponOptions: [{ label: '不使用优惠券', value: '' }],
    couponIndex: 0,
    coupons: [],
    discountAmount: 0,
    discountAmountText: '0.00',
    deliveryFee: 0,
    deliveryFeeText: '0.00',
    payAmount: 0,
    payAmountText: '0.00',
    remark: ''
  },

  onLoad(options) {
    this.setData({
      source: options.source || 'cart'
    });
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.loadPageData();
  },

  async loadPageData() {
    try {
      this.setData({ loading: true });

      const items = await this.resolveCheckoutItems();
      const totals = this.computeTotals(items);

      const addresses = mall.ensureAddressSeed();
      const selectedAddress = this.pickDefaultAddress(addresses);
      const coupons = mall.getCoupons();
      const couponOptions = this.buildCouponOptions(coupons, totals.totalAmount);

      const defaultCouponIndex = couponOptions.findIndex((item) => item.recommended);

      this.setData(
        {
          pageReady: true,
          items,
          totalQty: totals.totalQty,
          totalAmount: totals.totalAmount,
          totalAmountText: formatAmount(totals.totalAmount),
          addresses,
          selectedAddressId: selectedAddress ? selectedAddress.id : '',
          selectedAddress,
          coupons,
          couponOptions,
          couponIndex: defaultCouponIndex >= 0 ? defaultCouponIndex : 0
        },
        () => {
          this.recalcPayAmount();
        }
      );
    } catch (err) {
      wx.showToast({ title: err.message || '结算数据加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async resolveCheckoutItems() {
    const payload = mall.getBuyNowPayload();
    if (payload && Array.isArray(payload.items) && payload.items.length > 0) {
      return this.normalizeCheckoutItems(payload.items);
    }

    const cartRes = await api.getCart();
    const cart = cartRes.data || {};
    const cartItems = Array.isArray(cart.items) ? cart.items : [];
    return this.normalizeCheckoutItems(cartItems);
  },

  normalizeCheckoutItems(items) {
    return (Array.isArray(items) ? items : [])
      .map((item) => {
        const skuId = String(item.skuId || '').trim();
        const qty = Number(item.qty || 0);
        const unitPrice = Number(item.unitPrice || item.price || 0);

        if (!skuId || !Number.isInteger(qty) || qty <= 0) {
          return null;
        }

        return {
          skuId,
          qty,
          productName: item.productName || item.name || '未命名商品',
          skuName: item.skuName || item.specName || '-',
          coverImageUrl: item.coverImageUrl || '',
          specsText: item.specsText || this.stringifySpecs(item.specs),
          unitPrice,
          unitPriceText: formatAmount(unitPrice),
          lineAmount: Number((qty * unitPrice).toFixed(2)),
          lineAmountText: formatAmount(qty * unitPrice)
        };
      })
      .filter(Boolean);
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

  computeTotals(items) {
    const list = Array.isArray(items) ? items : [];
    const totalQty = list.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const totalAmount = Number(
      list.reduce((sum, item) => sum + Number(item.lineAmount || 0), 0).toFixed(2)
    );
    return {
      totalQty,
      totalAmount
    };
  },

  pickDefaultAddress(addresses) {
    const list = Array.isArray(addresses) ? addresses : [];
    return list.find((item) => item.isDefault) || list[0] || null;
  },

  buildCouponOptions(coupons, totalAmount) {
    const base = [{ label: '不使用优惠券', value: '' }];
    const list = Array.isArray(coupons) ? coupons : [];

    for (const coupon of list) {
      const discount = mall.getCouponDiscount(coupon, totalAmount);
      const available = coupon.status === 'AVAILABLE' && discount > 0;
      const statusText = coupon.status === 'USED' ? '已使用' : available ? `可减 ¥${formatAmount(discount)}` : '暂不可用';
      base.push({
        label: `${coupon.name}（${statusText}）`,
        value: coupon.id,
        recommended: available
      });
    }

    return base;
  },

  onDeliveryChange(e) {
    const index = Number(e.detail.value || 0);
    this.setData({ deliveryIndex: index }, () => this.recalcPayAmount());
  },

  onCouponChange(e) {
    const index = Number(e.detail.value || 0);
    this.setData({ couponIndex: index }, () => this.recalcPayAmount());
  },

  onRemarkInput(e) {
    this.setData({ remark: String(e.detail.value || '') });
  },

  goManageAddress() {
    wx.navigateTo({ url: '/pages/address/index?select=1' });
  },

  goCouponCenter() {
    wx.navigateTo({ url: '/pages/coupons/index?select=1' });
  },

  recalcPayAmount() {
    const deliveryOption = this.data.deliveryOptions[this.data.deliveryIndex] || this.data.deliveryOptions[0];
    const deliveryFee = Number(deliveryOption.fee || 0);

    const selectedCouponId = this.data.couponOptions[this.data.couponIndex]
      ? this.data.couponOptions[this.data.couponIndex].value
      : '';
    const selectedCoupon = this.data.coupons.find((item) => item.id === selectedCouponId);
    const discountAmount = Number(mall.getCouponDiscount(selectedCoupon, this.data.totalAmount));

    const payAmount = Number(Math.max(0, this.data.totalAmount + deliveryFee - discountAmount).toFixed(2));

    this.setData({
      deliveryFee,
      deliveryFeeText: formatAmount(deliveryFee),
      discountAmount,
      discountAmountText: formatAmount(discountAmount),
      payAmount,
      payAmountText: formatAmount(payAmount)
    });
  },

  async submitOrder() {
    if (this.data.submitting) {
      return;
    }

    const items = Array.isArray(this.data.items) ? this.data.items : [];
    if (items.length === 0) {
      wx.showToast({ title: '暂无可结算商品', icon: 'none' });
      return;
    }

    if (!this.data.selectedAddress) {
      wx.showToast({ title: '请先选择收货地址', icon: 'none' });
      return;
    }

    const selectedCouponId = this.data.couponOptions[this.data.couponIndex]
      ? this.data.couponOptions[this.data.couponIndex].value
      : '';
    const selectedCoupon = this.data.coupons.find((item) => item.id === selectedCouponId) || null;
    const deliveryOption = this.data.deliveryOptions[this.data.deliveryIndex] || this.data.deliveryOptions[0];

    const idempotencyKey = this.genIdempotencyKey();

    const remarkSections = [];
    const remarkText = this.data.remark.trim();
    if (remarkText) {
      remarkSections.push(remarkText);
    }
    remarkSections.push(`配送:${deliveryOption.label}`);
    if (selectedCoupon) {
      remarkSections.push(`优惠:${selectedCoupon.name}`);
    }
    const orderRemark = remarkSections.join('；').slice(0, 480);

    try {
      this.setData({ submitting: true });

      const res = await api.createOrder(
        {
          remark: orderRemark || undefined,
          items: items.map((item) => ({ skuId: item.skuId, qty: item.qty }))
        },
        idempotencyKey
      );

      const order = res.data || {};
      if (selectedCoupon && order.id) {
        mall.markCouponUsed(selectedCoupon.id, order.id);
      }

      if (order.id) {
        mall.saveOrderMeta(order.id, {
          address: this.data.selectedAddress,
          delivery: deliveryOption,
          coupon: selectedCoupon,
          discountAmount: this.data.discountAmount,
          payAmount: this.data.payAmount,
          totalAmount: this.data.totalAmount,
          totalQty: this.data.totalQty
        });
      }

      mall.clearBuyNowPayload();

      wx.showToast({ title: '订单提交成功', icon: 'success' });

      if (order.id) {
        wx.navigateTo({ url: `/pages/orders/detail/index?id=${order.id}` });
      } else {
        wx.navigateTo({ url: '/pages/orders/list/index' });
      }
    } catch (err) {
      wx.showToast({ title: err.message || '提交订单失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  genIdempotencyKey() {
    const random = Math.random().toString(36).slice(2, 10);
    return `mini-checkout-${Date.now()}-${random}`;
  },

  goProducts() {
    wx.navigateTo({ url: '/pages/products/list/index' });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/checkout/index');
      wx.reLaunch({
        url: `/pages/login/index?redirect=${redirect}`
      });
      return false;
    }
    return true;
  }
});
