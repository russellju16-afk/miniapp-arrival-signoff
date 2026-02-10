describe("core service pricing guards", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.KD_MOCK_MODE = "false";
  });

  function buildActiveCustomer(overrides: Record<string, unknown> = {}) {
    return {
      id: "customer-1",
      name: "客户A",
      phone: null,
      status: "ACTIVE",
      companyName: "测试公司",
      contactName: "张三",
      contactPhone: "13800138000",
      wechatOpenid: "openid-1",
      kingdeeCustomerId: "KD-CUST-1",
      accessToken: "token-1",
      tokenExpiresAt: new Date("2026-03-08T00:00:00.000Z"),
      ...overrides
    };
  }

  function buildSku() {
    return {
      id: "sku-1",
      productId: "product-1",
      skuCode: "SKU-1",
      skuName: "标准件",
      price: 100,
      stock: 20,
      status: "ACTIVE",
      unitId: "Pcs",
      kingdeeMaterialId: "MAT-1",
      specsJson: "{}",
      product: {
        id: "product-1",
        name: "演示商品",
        status: "ACTIVE",
        kingdeeMaterialId: "MAT-1"
      }
    };
  }

  function mockRepoForPricing(extra: Record<string, unknown> = {}) {
    return {
      findSalesOrderByIdempotencyKey: jest.fn().mockResolvedValue(null),
      findSkuById: jest.fn().mockResolvedValue(buildSku()),
      upsertPriceCache: jest.fn().mockResolvedValue(undefined),
      createSalesOrderWithLines: jest.fn().mockResolvedValue({ id: "order-1" }),
      clearCartItemsByCustomerSkuIds: jest.fn().mockResolvedValue(undefined),
      clearCartByCustomer: jest.fn().mockResolvedValue(undefined),
      findSalesOrderById: jest.fn().mockResolvedValue(null),
      findSalesOrderByIdAndCustomer: jest.fn().mockResolvedValue(null),
      getSetting: jest.fn((key: string) => {
        if (key === "PRICING_CONTEXT") {
          return Promise.resolve({
            key,
            valueJson: JSON.stringify({
              billTypeId: "BILL-1",
              currencyId: "CNY",
              exchangeRate: "1",
              currency: "CNY"
            })
          });
        }
        return Promise.resolve(null);
      }),
      ...extra
    };
  }

  test("createMiniOrder: expectedUnitPrice 与金蝶价不一致返回 PRICE_CHANGED", async () => {
    const repo = mockRepoForPricing();
    const kingdeeRequest = jest.fn().mockResolvedValue({
      data: [{
        unit_price: 120
      }]
    });

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));
    jest.doMock("../src/modules/core/kingdee-client", () => ({
      kingdeeClient: {
        request: kingdeeRequest
      }
    }));
    jest.doMock("../src/modules/core/endpoint-catalog", () => ({
      endpointCatalog: {
        getByKey: jest.fn().mockReturnValue({
          title: "销售订单保存",
          fullTitle: "销售/销售订单保存",
          method: "POST",
          path: "/jdy/v2/scm/sal_order"
        }),
        findByContains: jest.fn((keyword: string) => {
          if (keyword.includes("价格")) {
            return {
              title: "商品价格策略",
              fullTitle: "销售/商品价格策略",
              method: "GET",
              path: "/jdy/v2/bd/material_price"
            };
          }
          return null;
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.createMiniOrder(
        buildActiveCustomer(),
        {
          items: [{ skuId: "sku-1", qty: 2, expectedUnitPrice: 100 }],
          acceptPriceChange: false
        },
        "idem-pricing-1"
      )
    ).rejects.toMatchObject({
      code: "PRICE_CHANGED"
    });

    expect(repo.upsertPriceCache).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "customer-1",
        skuId: "sku-1",
        unitPrice: 120
      })
    );
    expect(kingdeeRequest).toHaveBeenCalledTimes(1);
  });

  test("createMiniOrder: 无客户价返回 NEED_QUOTE", async () => {
    const repo = mockRepoForPricing();

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));
    jest.doMock("../src/modules/core/kingdee-client", () => ({
      kingdeeClient: {
        request: jest.fn().mockResolvedValue({ data: [{ note: "no price" }] })
      }
    }));
    jest.doMock("../src/modules/core/endpoint-catalog", () => ({
      endpointCatalog: {
        getByKey: jest.fn().mockReturnValue({
          title: "销售订单保存",
          fullTitle: "销售/销售订单保存",
          method: "POST",
          path: "/jdy/v2/scm/sal_order"
        }),
        findByContains: jest.fn().mockReturnValue({
          title: "商品价格策略",
          fullTitle: "销售/商品价格策略",
          method: "GET",
          path: "/jdy/v2/bd/material_price"
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.createMiniOrder(buildActiveCustomer(), {
        items: [{ skuId: "sku-1", qty: 1 }]
      })
    ).rejects.toMatchObject({
      code: "NEED_QUOTE"
    });
  });

  test("createMiniOrder: pricingContext 缺失返回 PRICING_CONTEXT_MISSING", async () => {
    const repo = mockRepoForPricing({
      getSetting: jest.fn().mockResolvedValue(null)
    });

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));
    jest.doMock("../src/modules/core/kingdee-client", () => ({
      kingdeeClient: {
        request: jest.fn().mockResolvedValue({ data: [{ unit_price: 99 }] })
      }
    }));
    jest.doMock("../src/modules/core/endpoint-catalog", () => ({
      endpointCatalog: {
        getByKey: jest.fn().mockReturnValue({
          title: "销售订单保存",
          fullTitle: "销售/销售订单保存",
          method: "POST",
          path: "/jdy/v2/scm/sal_order"
        }),
        findByContains: jest.fn().mockReturnValue({
          title: "商品价格策略",
          fullTitle: "销售/商品价格策略",
          method: "GET",
          path: "/jdy/v2/bd/material_price"
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.createMiniOrder(buildActiveCustomer(), {
        items: [{ skuId: "sku-1", qty: 1 }]
      })
    ).rejects.toMatchObject({
      code: "PRICING_CONTEXT_MISSING"
    });
  });
});
