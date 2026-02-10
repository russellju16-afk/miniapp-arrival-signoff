describe("core service auth and status gate", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.WECHAT_LOGIN_MOCK_ENABLED = "true";
    process.env.WECHAT_MOCK_OPENID = "o_test_auth";
  });

  test("loginWechat: 新用户创建 PENDING + 注册申请 + access token", async () => {
    const createdCustomer = {
      id: "customer-new",
      name: "测试公司",
      phone: "13800138000",
      status: "PENDING",
      companyName: "测试公司",
      contactName: "张三",
      contactPhone: "13800138000",
      wechatOpenid: "o_test_auth",
      kingdeeCustomerId: null,
      accessToken: null,
      tokenExpiresAt: null,
      createdAt: new Date("2026-02-08T00:00:00.000Z"),
      updatedAt: new Date("2026-02-08T00:00:00.000Z")
    };
    const tokenizedCustomer = {
      ...createdCustomer,
      accessToken: "token-new",
      tokenExpiresAt: new Date("2026-03-10T00:00:00.000Z")
    };

    const repo = {
      findCustomerByOpenid: jest.fn().mockResolvedValue(null),
      createCustomer: jest.fn().mockResolvedValue(createdCustomer),
      createCustomerRegistrationApplication: jest.fn().mockResolvedValue({ id: "reg-1" }),
      findCustomerById: jest
        .fn()
        .mockResolvedValueOnce(createdCustomer)
        .mockResolvedValueOnce(tokenizedCustomer),
      setCustomerAccessToken: jest.fn().mockResolvedValue(tokenizedCustomer),
      findCustomerByAccessToken: jest.fn().mockResolvedValue(null),
      getSetting: jest.fn().mockResolvedValue(null)
    };

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const result = await coreService.loginWechat({
      registration: {
        companyName: "测试公司",
        contactName: "张三",
        contactPhone: "13800138000",
        remark: "首次注册"
      }
    });

    expect(repo.createCustomer).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "PENDING",
        wechatOpenid: "o_test_auth",
        companyName: "测试公司",
        contactName: "张三",
        contactPhone: "13800138000"
      })
    );
    expect(repo.createCustomerRegistrationApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "customer-new",
        status: "PENDING"
      })
    );
    expect(result.openid).toBe("o_test_auth");
    expect(typeof result.accessToken).toBe("string");
    expect(result.accessToken.length).toBeGreaterThan(20);
    expect(result.customerProfile).toMatchObject({
      id: "customer-new",
      status: "PENDING",
      isKingdeeBound: false
    });
    expect(repo.setCustomerAccessToken).toHaveBeenCalledTimes(1);
  });

  test("loginWechat: ACTIVE 老用户仍返回 access token，不重复创建注册申请", async () => {
    const existingCustomer = {
      id: "customer-active",
      name: "老客户",
      phone: "13900000000",
      status: "ACTIVE",
      companyName: "老客户公司",
      contactName: "李四",
      contactPhone: "13900000000",
      wechatOpenid: "o_active",
      kingdeeCustomerId: "KD-CUST-1",
      accessToken: null,
      tokenExpiresAt: null,
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-02-08T00:00:00.000Z")
    };
    const tokenizedCustomer = {
      ...existingCustomer,
      accessToken: "token-active",
      tokenExpiresAt: new Date("2036-02-08T00:00:00.000Z")
    };

    const repo = {
      findCustomerByOpenid: jest.fn().mockResolvedValue(existingCustomer),
      updateCustomerProfile: jest.fn().mockResolvedValue(existingCustomer),
      createCustomerRegistrationApplication: jest.fn(),
      findCustomerById: jest
        .fn()
        .mockResolvedValueOnce(existingCustomer)
        .mockResolvedValueOnce(tokenizedCustomer),
      setCustomerAccessToken: jest.fn().mockResolvedValue(tokenizedCustomer),
      findCustomerByAccessToken: jest.fn().mockResolvedValue(null),
      getSetting: jest.fn().mockResolvedValue(null)
    };

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const result = await coreService.loginWechat({
      mockOpenid: "o_active"
    });

    expect(repo.createCustomerRegistrationApplication).not.toHaveBeenCalled();
    expect(result.openid).toBe("o_active");
    expect(typeof result.accessToken).toBe("string");
    expect(result.accessToken.length).toBeGreaterThan(20);
    expect(result.customerProfile).toMatchObject({
      id: "customer-active",
      status: "ACTIVE",
      isKingdeeBound: true
    });
    expect(repo.setCustomerAccessToken).toHaveBeenCalledTimes(1);
  });

  test("PENDING 客户可浏览商品但不可下单", async () => {
    const repo = {
      listProducts: jest.fn().mockResolvedValue([])
    };
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const pendingCustomer = {
      id: "customer-pending",
      name: "待审核客户",
      phone: null,
      status: "PENDING",
      companyName: null,
      contactName: null,
      contactPhone: null,
      wechatOpenid: "o_pending",
      kingdeeCustomerId: null,
      accessToken: "token-pending",
      tokenExpiresAt: new Date("2026-03-01T00:00:00.000Z")
    };

    const list = await coreService.listMiniProducts(pendingCustomer, { page: 1, pageSize: 20 });
    expect(list).toMatchObject({
      total: 0,
      items: []
    });

    await expect(
      coreService.createMiniOrder(pendingCustomer, {
        items: [
          {
            skuId: "sku-1",
            qty: 1
          }
        ]
      })
    ).rejects.toMatchObject({
      code: "MINI_FORBIDDEN_BY_STATUS"
    });
  });
});
