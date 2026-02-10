const api = require('../../services/api');
const auth = require('../../utils/auth');
const mall = require('../../utils/mall');
const { formatAmount, formatDate } = require('../../utils/format');

const TIME_SLOT_OPTIONS = ['7-10', '10-12', '13-15', '15-18'];

function tomorrow() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return formatDate(date);
}

Page({
  data: {
    source: 'cart',
    loading: false,
    submitting: false,
    errorMessage: '',
    actionLoading: false,
    profile: null,
    items: [],
    totalQty: 0,
    totalAmount: 0,
    totalAmountText: '0.00',
    addresses: [],
    selectedAddressIndex: 0,
    selectedAddressId: '',
    selectedAddressText: '',
    deliveryMode: 'DELIVERY',
    expectedDate: tomorrow(),
    timeSlotOptions: TIME_SLOT_OPTIONS,
    timeSlotIndex: 1,
    unloadingRequirement: '',
    note: '',
    customerRemark: ''
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
    this.loadData();
  },

  async loadData() {
    try {
      this.setData({ loading: true, errorMessage: '' });
      const [profileRes, addressesRes] = await Promise.all([
        api.getMiniProfile(),
        api.getAddresses()
      ]);

      const profile = profileRes.data || null;
      const addresses = Array.isArray(addressesRes.data) ? addressesRes.data : [];
      const selectedAddress = addresses.find((item) => item.isDefault) || addresses[0] || null;
      const selectedAddressIndex = selectedAddress
        ? Math.max(0, addresses.findIndex((item) => item.id === selectedAddress.id))
        : 0;
      const items = await this.resolveCheckoutItems();
      const totals = this.computeTotals(items);

      this.setData({
        profile,
        addresses,
        selectedAddressIndex,
        selectedAddressId: selectedAddress ? selectedAddress.id : '',
        selectedAddressText: selectedAddress
          ? `${selectedAddress.province || ''}${selectedAddress.city || ''}${selectedAddress.district || ''}${selectedAddress.detail || ''}`
          : '',
        items,
        totalQty: totals.totalQty,
        totalAmount: totals.totalAmount,
        totalAmountText: formatAmount(totals.totalAmount)
      });
    } catch (err) {
      const errorMessage = (err && err.message) || '结算数据加载失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async resolveCheckoutItems() {
    const payload = mall.getBuyNowPayload();
    const list = payload && Array.isArray(payload.items) ? payload.items : [];

    return list
      .map((item) => {
        const skuId = String(item.skuId || '').trim();
        const qty = Number(item.qty || 0);
        const expectedUnitPrice = Number(item.expectedUnitPrice || item.unitPrice || 0);
        if (!skuId || !Number.isInteger(qty) || qty <= 0) {
          return null;
        }
        return {
          skuId,
          qty,
          expectedUnitPrice: Number.isFinite(expectedUnitPrice) ? Number(expectedUnitPrice) : 0,
          productName: item.productName || '',
          skuName: item.skuName || '',
          specsText: item.specsText || '',
          lineAmountText: formatAmount(expectedUnitPrice * qty)
        };
      })
      .filter(Boolean);
  },

  computeTotals(items) {
    const totalQty = (items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const totalAmount = Number(
      (items || []).reduce(
        (sum, item) => sum + Number(item.expectedUnitPrice || 0) * Number(item.qty || 0),
        0
      ).toFixed(2)
    );
    return { totalQty, totalAmount };
  },

  onSelectAddress(e) {
    const index = Number(e.detail.value || 0);
    const target = this.data.addresses[index] || null;
    this.setData({
      selectedAddressIndex: index,
      selectedAddressId: target ? target.id : '',
      selectedAddressText: target
        ? `${target.province || ''}${target.city || ''}${target.district || ''}${target.detail || ''}`
        : ''
    });
  },

  onSwitchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (!mode) {
      return;
    }
    this.setData({ deliveryMode: mode });
  },

  onDateChange(e) {
    this.setData({ expectedDate: e.detail.value });
  },

  onTimeSlotChange(e) {
    this.setData({ timeSlotIndex: Number(e.detail.value || 0) });
  },

  onFieldInput(e) {
    const field = e.currentTarget.dataset.field;
    if (!field) {
      return;
    }
    this.setData({
      [field]: String(e.detail.value || '')
    });
  },

  goManageAddress() {
    if (this.data.actionLoading || this.data.submitting) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.navigateTo({ url: '/pages/address/index?select=1' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  buildOrderPayload(acceptPriceChange) {
    const deliveryMode = this.data.deliveryMode;
    const selectedAddress =
      this.data.addresses[this.data.selectedAddressIndex] ||
      this.data.addresses.find((item) => item.id === this.data.selectedAddressId) ||
      null;

    if (deliveryMode === 'DELIVERY' && !selectedAddress) {
      throw new Error('请选择收货地址');
    }

    const delivery =
      deliveryMode === 'DELIVERY'
        ? {
            mode: 'DELIVERY',
            addressId: selectedAddress.id,
            expectedDate: this.data.expectedDate,
            timeSlot: this.data.timeSlotOptions[this.data.timeSlotIndex],
            unloadingRequirement: String(this.data.unloadingRequirement || '').trim() || undefined,
            note: String(this.data.note || '').trim() || undefined
          }
        : {
            mode: 'PICKUP',
            unloadingRequirement: String(this.data.unloadingRequirement || '').trim() || undefined,
            note: String(this.data.note || '').trim() || undefined
          };

    return {
      acceptPriceChange: Boolean(acceptPriceChange),
      remark: String(this.data.customerRemark || '').trim() || undefined,
      delivery,
      items: this.data.items.map((item) => ({
        skuId: item.skuId,
        qty: item.qty,
        expectedUnitPrice: item.expectedUnitPrice
      }))
    };
  },

  async submitOrder() {
    if (this.data.submitting || this.data.loading || this.data.actionLoading) {
      return;
    }

    if (!Array.isArray(this.data.items) || this.data.items.length === 0) {
      wx.showToast({ title: '暂无可结算商品', icon: 'none' });
      return;
    }

    await this.submitOrderWithOption(false);
  },

  async submitOrderWithOption(acceptPriceChange) {
    try {
      this.setData({ submitting: true });
      const idempotencyKey = this.genIdempotencyKey();
      const payload = this.buildOrderPayload(acceptPriceChange);
      const res = await api.createOrder(payload, idempotencyKey);
      const order = res.data || {};

      mall.clearBuyNowPayload();
      wx.showToast({ title: '订单提交成功', icon: 'success' });

      if (order.id) {
        this.setData({ actionLoading: true });
        wx.navigateTo({ url: `/pages/orders/detail/index?id=${order.id}` });
      } else {
        this.setData({ actionLoading: true });
        wx.switchTab({ url: '/pages/orders/list/index' });
      }
    } catch (err) {
      if (err && err.code === 'PRICE_CHANGED') {
        const detail = err.details || {};
        const skuId = detail.skuId || '';
        const newUnitPrice = Number(detail.newUnitPrice || 0);
        wx.showModal({
          title: '价格变更',
          content: `商品价格已更新为 ¥${formatAmount(newUnitPrice)}，是否按新价格提交？`,
          success: async (res) => {
            if (!res.confirm) {
              return;
            }
            if (skuId && Number.isFinite(newUnitPrice) && newUnitPrice > 0) {
              const nextItems = this.data.items.map((item) =>
                item.skuId === skuId
                  ? {
                      ...item,
                      expectedUnitPrice: newUnitPrice,
                      lineAmountText: formatAmount(newUnitPrice * item.qty)
                    }
                  : item
              );
              const totals = this.computeTotals(nextItems);
              this.setData({
                items: nextItems,
                totalQty: totals.totalQty,
                totalAmount: totals.totalAmount,
                totalAmountText: formatAmount(totals.totalAmount)
              });
            }
            await this.submitOrderWithOption(true);
          }
        });
        return;
      }

      if (err && err.code === 'NEED_QUOTE') {
        wx.showModal({
          title: '需报价',
          content: '当前商品暂无客户价，请先提交报价申请。',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/cart/index?focus=quote' });
            }
          }
        });
        return;
      }

      wx.showToast({ title: err.message || '提交订单失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false, actionLoading: false });
    }
  },

  genIdempotencyKey() {
    const random = Math.random().toString(36).slice(2, 10);
    return `mini-checkout-${Date.now()}-${random}`;
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.loadData();
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

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/checkout/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
