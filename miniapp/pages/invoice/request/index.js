const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatAmount, formatDateTime } = require('../../../utils/format');

Page({
  data: {
    loading: false,
    submitting: false,
    actionLoading: false,
    errorMessage: '',
    orders: [],
    profiles: [],
    profileIndex: 0,
    selectedProfileTitle: '-',
    remark: '',
    requests: [],
    selectedOrderCount: 0,
    selectableOrderCount: 0,
    submitDisabled: true
  },

  onLoad(options) {
    if (options.orderIds) {
      const ids = decodeURIComponent(options.orderIds)
        .split(',')
        .map((item) => String(item || '').trim())
        .filter(Boolean);
      const selectedOrderIdSet = {};
      ids.forEach((id) => {
        selectedOrderIdSet[id] = true;
      });
      this.__selectedOrderIdSet = selectedOrderIdSet;
    }
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
      const [ordersRes, profilesRes, requestsRes] = await Promise.all([
        api.getOrders({ page: 1, pageSize: 100 }),
        api.getInvoiceProfiles(),
        api.getInvoiceRequests()
      ]);

      const ordersPayload = ordersRes.data || {};
      const orders = Array.isArray(ordersPayload.items)
        ? ordersPayload.items
            .filter((item) => item.status !== 'CANCELED')
            .map((item) => ({
              id: item.id,
              orderNo: item.orderNo,
              status: item.status,
              totalAmountText: formatAmount(item.totalAmount),
              createdAtText: formatDateTime(item.createdAt),
              checked: Boolean(this.__selectedOrderIdSet && this.__selectedOrderIdSet[item.id])
            }))
        : [];

      const profiles = Array.isArray(profilesRes.data) ? profilesRes.data : [];
      const requests = Array.isArray(requestsRes.data)
        ? requestsRes.data.map((item) => ({
            id: item.id,
            status: item.status,
            orderCount: Array.isArray(item.orderIds) ? item.orderIds.length : 0,
            profileTitle: item.invoiceProfile && item.invoiceProfile.title ? item.invoiceProfile.title : '-',
            kingdeeRefId: item.kingdeeRefId || '-',
            createdAtText: formatDateTime(item.createdAt)
          }))
        : [];

      let profileIndex = 0;
      const defaultIndex = profiles.findIndex((item) => item.isDefault);
      if (defaultIndex >= 0) {
        profileIndex = defaultIndex;
      }
      const selectedProfile = profiles[profileIndex] || null;

      this.setData({
        orders,
        profiles,
        requests,
        profileIndex,
        selectedProfileTitle: selectedProfile && selectedProfile.title ? selectedProfile.title : '-'
      }, () => this.syncSelectionMeta());
    } catch (err) {
      const errorMessage = (err && err.message) || '加载开票中心失败，请稍后重试';
      this.setData({ errorMessage });
      wx.showToast({ title: errorMessage, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onToggleOrder(e) {
    if (this.data.loading || this.data.submitting) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    const orders = (this.data.orders || []).map((item) =>
      item.id === id
        ? {
            ...item,
            checked: !item.checked
          }
        : item
    );
    this.__selectedOrderIdSet = orders.reduce((acc, item) => {
      if (item.checked) {
        acc[item.id] = true;
      }
      return acc;
    }, {});
    this.setData({ orders }, () => this.syncSelectionMeta());
  },

  onProfileChange(e) {
    const profileIndex = Number(e.detail.value || 0);
    const profile = this.data.profiles[profileIndex] || null;
    this.setData({
      profileIndex,
      selectedProfileTitle: profile && profile.title ? profile.title : '-'
    }, () => this.syncSelectionMeta());
  },

  onRemarkInput(e) {
    this.setData({ remark: String(e.detail.value || '') });
  },

  getSelectedOrderIds() {
    return (this.data.orders || []).filter((item) => Boolean(item.checked)).map((item) => item.id);
  },

  async submitRequest() {
    if (this.data.submitting || this.data.loading || this.data.actionLoading) {
      return;
    }

    const orderIds = this.getSelectedOrderIds();
    if (orderIds.length === 0) {
      wx.showToast({ title: '请先选择订单', icon: 'none' });
      return;
    }

    const profile = this.data.profiles[this.data.profileIndex] || null;
    if (!profile) {
      wx.showToast({ title: '请先配置开票资料模板', icon: 'none' });
      return;
    }

    try {
      this.setData({ submitting: true });
      await api.createInvoiceRequest({
        orderIds,
        invoiceProfileId: profile.id,
        remark: String(this.data.remark || '').trim() || undefined
      });
      wx.showToast({ title: '开票申请已提交', icon: 'success' });
      this.setData({ remark: '' });
      await this.loadData();
    } catch (err) {
      wx.showToast({ title: err.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  goProfileManage() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.navigateTo({ url: '/pages/invoice/profiles/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  goOrders() {
    if (this.data.actionLoading) {
      return;
    }
    this.setData({ actionLoading: true });
    wx.switchTab({ url: '/pages/orders/list/index' });
    setTimeout(() => {
      this.setData({ actionLoading: false });
    }, 320);
  },

  refreshData() {
    if (this.data.loading) {
      return;
    }
    this.loadData();
  },

  syncSelectionMeta() {
    const orders = Array.isArray(this.data.orders) ? this.data.orders : [];
    const selectedOrderCount = orders.filter((item) => item.checked).length;
    const selectableOrderCount = orders.length;
    const hasProfile = Boolean(this.data.profiles[this.data.profileIndex]);
    this.setData({
      selectedOrderCount,
      selectableOrderCount,
      submitDisabled: !hasProfile || selectedOrderCount === 0 || this.data.submitting
    });
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent('/pages/invoice/request/index');
      wx.reLaunch({ url: `/pages/login/index?redirect=${redirect}` });
      return false;
    }
    return true;
  }
});
