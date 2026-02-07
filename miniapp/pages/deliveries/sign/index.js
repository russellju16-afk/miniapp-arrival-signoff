const api = require('../../../services/api');
const auth = require('../../../utils/auth');
const { formatDate } = require('../../../utils/format');
const { fileToBase64DataUrl, detectMimeFromPath } = require('../../../utils/file');

Page({
  data: {
    id: '',
    delivery: null,
    signerName: '',
    remark: '',
    photos: [],
    submitting: false,
    canvasWidth: 320,
    canvasHeight: 180,
    hasSigned: false
  },

  onLoad(options) {
    this.ctx = null;
    this.lastPoint = null;
    this.isDrawing = false;
    this.setData({ id: options.id || '' });

    const session = auth.getSession();
    if (session && session.customer && session.customer.name) {
      this.setData({ signerName: session.customer.name });
    }
  },

  onReady() {
    this.initCanvasSize();
  },

  onShow() {
    if (!this.ensureLogin()) {
      return;
    }
    this.fetchDelivery();
  },

  async fetchDelivery() {
    const id = this.data.id;
    if (!id) {
      wx.showToast({ title: '参数缺失', icon: 'none' });
      return;
    }

    try {
      const res = await api.getDeliveryDetail(id);
      const detail = res.data || null;
      this.setData({
        delivery: detail
          ? {
              ...detail,
              ship_date_text: formatDate(detail.ship_date)
            }
          : null
      });
    } catch (err) {
      wx.showToast({ title: err.message || '加载详情失败', icon: 'none' });
    }
  },

  initCanvasSize() {
    wx.getSystemInfo({
      success: (info) => {
        const width = Math.max(260, info.windowWidth - 48);
        const height = 200;
        this.setData(
          {
            canvasWidth: width,
            canvasHeight: height
          },
          () => {
            this.initCanvas();
          }
        );
      },
      fail: () => {
        this.initCanvas();
      }
    });
  },

  initCanvas() {
    this.ctx = wx.createCanvasContext('signCanvas', this);
    this.ctx.setFillStyle('#ffffff');
    this.ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    this.ctx.setStrokeStyle('#111827');
    this.ctx.setLineWidth(3);
    this.ctx.setLineCap('round');
    this.ctx.setLineJoin('round');
    this.ctx.draw();
    this.setData({ hasSigned: false });
  },

  onSignerInput(e) {
    this.setData({ signerName: e.detail.value });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  handleTouchStart(e) {
    const point = this.getTouchPoint(e);
    if (!point) {
      return;
    }

    this.isDrawing = true;
    this.lastPoint = point;
    this.setData({ hasSigned: true });
  },

  handleTouchMove(e) {
    if (!this.isDrawing || !this.ctx) {
      return;
    }

    const point = this.getTouchPoint(e);
    if (!point || !this.lastPoint) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
    this.ctx.draw(true);

    this.lastPoint = point;
  },

  handleTouchEnd() {
    this.isDrawing = false;
    this.lastPoint = null;
  },

  clearSignature() {
    this.initCanvas();
  },

  choosePhotos() {
    const remain = 3 - this.data.photos.length;
    if (remain <= 0) {
      wx.showToast({ title: '最多 3 张', icon: 'none' });
      return;
    }

    wx.chooseImage({
      count: remain,
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      success: (res) => {
        const selected = res.tempFilePaths || [];
        const photos = [...this.data.photos, ...selected].slice(0, 3);
        this.setData({ photos });
      }
    });
  },

  removePhoto(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }

    const photos = [...this.data.photos];
    photos.splice(index, 1);
    this.setData({ photos });
  },

  previewPhoto(e) {
    const url = e.currentTarget.dataset.url;
    if (!url) {
      return;
    }

    wx.previewImage({
      current: url,
      urls: this.data.photos
    });
  },

  async submitSign() {
    if (this.data.submitting) {
      return;
    }

    const signerName = this.data.signerName.trim();
    if (!signerName) {
      wx.showToast({ title: '请输入签收人', icon: 'none' });
      return;
    }

    if (!this.data.hasSigned) {
      wx.showToast({ title: '请先手写签名', icon: 'none' });
      return;
    }

    try {
      this.setData({ submitting: true });

      const signaturePath = await this.exportSignatureFile();
      const signatureMime = detectMimeFromPath(signaturePath);
      const signatureBase64 = await fileToBase64DataUrl(signaturePath, signatureMime);

      const photosBase64 = [];
      for (const photoPath of this.data.photos) {
        const mime = detectMimeFromPath(photoPath);
        // 当前后端 /mini/deliveries/:id/sign 使用 base64 字段。
        const base64 = await fileToBase64DataUrl(photoPath, mime);
        photosBase64.push(base64);
      }

      await api.signDelivery(this.data.id, {
        signerName,
        signedAt: new Date().toISOString(),
        signatureBase64,
        photosBase64,
        remark: this.data.remark.trim()
      });

      wx.showToast({ title: '签收成功', icon: 'success' });
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/deliveries/detail/index?id=${this.data.id}`
        });
      }, 500);
    } catch (err) {
      wx.showToast({ title: err.message || '提交失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  exportSignatureFile() {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath(
        {
          canvasId: 'signCanvas',
          x: 0,
          y: 0,
          width: this.data.canvasWidth,
          height: this.data.canvasHeight,
          destWidth: this.data.canvasWidth * 2,
          destHeight: this.data.canvasHeight * 2,
          fileType: 'png',
          quality: 1,
          success: (res) => resolve(res.tempFilePath),
          fail: (err) => reject(err)
        },
        this
      );
    });
  },

  getTouchPoint(e) {
    const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    if (!touch) {
      return null;
    }

    return {
      x: touch.x,
      y: touch.y
    };
  },

  ensureLogin() {
    const token = auth.getToken();
    if (!token) {
      const redirect = encodeURIComponent(`/pages/deliveries/sign/index?id=${this.data.id}`);
      wx.reLaunch({
        url: `/pages/login/index?redirect=${redirect}`
      });
      return false;
    }
    return true;
  }
});
