describe("core admin settings routes", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.ADMIN_TOKEN = "dev-admin-token";
  });

  test("GET /api/admin/settings 返回系统设置", async () => {
    const getAdminSettings = jest.fn().mockResolvedValue({
      ORDER_WEBHOOK: "https://hook.example.com/order",
      PICKUP_ADDRESS: "深圳市南山区科技园仓"
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        getAdminSettings,
        updateAdminSettings: jest.fn(),
        testAdminWebhook: jest.fn()
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/admin/settings",
      headers: {
        authorization: "Bearer dev-admin-token"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(getAdminSettings).toHaveBeenCalledTimes(1);

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.PICKUP_ADDRESS).toBe("深圳市南山区科技园仓");

    await app.close();
  });

  test("PUT /api/admin/settings 可更新模块 webhook", async () => {
    const updateAdminSettings = jest.fn().mockResolvedValue({
      ORDER_WEBHOOK: "https://hook.example.com/order-new"
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        getAdminSettings: jest.fn(),
        updateAdminSettings,
        testAdminWebhook: jest.fn()
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "PUT",
      url: "/api/admin/settings",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        ORDER_WEBHOOK: "https://hook.example.com/order-new"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(updateAdminSettings).toHaveBeenCalledWith({
      ORDER_WEBHOOK: "https://hook.example.com/order-new"
    });

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.ORDER_WEBHOOK).toBe("https://hook.example.com/order-new");

    await app.close();
  });

  test("POST /api/admin/settings 可更新系统设置（兼容 PUT）", async () => {
    const updateAdminSettings = jest.fn().mockResolvedValue({
      PICKUP_ADDRESS: "深圳仓A-1号门"
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        getAdminSettings: jest.fn(),
        updateAdminSettings,
        testAdminWebhook: jest.fn()
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/settings",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        PICKUP_ADDRESS: "深圳仓A-1号门"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(updateAdminSettings).toHaveBeenCalledWith({
      PICKUP_ADDRESS: "深圳仓A-1号门"
    });

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.PICKUP_ADDRESS).toBe("深圳仓A-1号门");

    await app.close();
  });

  test("POST /api/admin/settings/test-webhook 支持 type 别名", async () => {
    const testAdminWebhook = jest.fn().mockResolvedValue({
      ok: true,
      key: "ORDER_WEBHOOK"
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        getAdminSettings: jest.fn(),
        updateAdminSettings: jest.fn(),
        testAdminWebhook
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/settings/test-webhook?type=ORDER",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        title: "订单测试",
        lines: ["line1"]
      }
    });

    expect(response.statusCode).toBe(200);
    expect(testAdminWebhook).toHaveBeenCalledWith({
      key: "ORDER_WEBHOOK",
      webhookUrl: undefined,
      title: "订单测试",
      lines: ["line1"]
    });

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.key).toBe("ORDER_WEBHOOK");

    await app.close();
  });

  test("PUT /api/admin/settings 轮播校验失败时返回可读错误", async () => {
    const { AppError } = await import("../src/modules/common/app-error");
    const updateAdminSettings = jest
      .fn()
      .mockRejectedValue(new AppError(400, "SETTINGS_HOME_BANNERS_EMPTY", "请至少配置 1 条首页轮播"));

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        getAdminSettings: jest.fn(),
        updateAdminSettings,
        testAdminWebhook: jest.fn()
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "PUT",
      url: "/api/admin/settings",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        HOME_BANNERS: []
      }
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(false);
    expect(payload.code).toBe("SETTINGS_HOME_BANNERS_EMPTY");
    expect(payload.message).toContain("首页轮播");
    expect(updateAdminSettings).toHaveBeenCalledWith({
      HOME_BANNERS: []
    });

    await app.close();
  });
});
