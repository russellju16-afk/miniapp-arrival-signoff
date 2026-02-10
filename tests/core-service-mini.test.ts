describe("core service mini/business", () => {
  const makeMiniCustomer = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: "customer-1",
    name: "客户A",
    phone: null,
    status: "ACTIVE",
    companyName: null,
    contactName: null,
    contactPhone: null,
    wechatOpenid: "openid-1",
    kingdeeCustomerId: null,
    accessToken: "token-1",
    tokenExpiresAt: new Date("2026-03-08T00:00:00.000Z"),
    ...overrides
  });

  beforeEach(() => {
    jest.resetModules();
  });

  test("loginMini: token 过期时返回 MINI_TOKEN_EXPIRED", async () => {
    const now = Date.now();

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findCustomerByAccessToken: jest.fn().mockResolvedValue({
          id: "cust-1",
          name: "客户A",
          phone: null,
          kingdeeCustomerId: "CUST-A",
          accessToken: "token-1",
          tokenExpiresAt: new Date(now - 60_000)
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(coreService.loginMini({ token: "token-1" })).rejects.toMatchObject({
      code: "MINI_TOKEN_EXPIRED"
    });
  });

  test("signDelivery: 同幂等键重复提交返回幂等成功", async () => {
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findDeliveryById: jest.fn().mockResolvedValue({
          id: "delivery-1",
          customerId: "customer-1",
          status: "SIGNED",
          signedAt: new Date("2026-02-08T01:00:00.000Z"),
          signedPayloadJson: "{\"ok\":true}",
          signIdempotencyKey: "idem-1"
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const result = await coreService.signDelivery({
      deliveryId: "delivery-1",
      signerName: "张三",
      idempotencyKey: "idem-1"
    });

    expect(result).toMatchObject({
      id: "delivery-1",
      idempotent: true,
      status: "SIGNED"
    });
  });

  test("buildReconcileStatement: 仅统计当前 customer 的 raw 数据", async () => {
    const createReconciliation = jest.fn().mockResolvedValue({
      id: "statement-1"
    });
    const replaceReconciliationLines = jest.fn().mockResolvedValue(undefined);

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findCustomerById: jest.fn().mockResolvedValue({
          id: "customer-1",
          name: "客户A",
          kingdeeCustomerId: "CUST-A"
        }),
        listRawDocumentsByRangeAndTypes: jest.fn().mockResolvedValue([
          {
            docType: "销售出库单详情",
            number: "SAL-001",
            kingdeeId: "KD-1",
            payloadJson: JSON.stringify({
              customer_id: "CUST-A",
              total_amount: "100.5"
            }),
            fetchedAt: new Date("2026-02-08T01:00:00.000Z")
          },
          {
            docType: "销售出库单详情",
            number: "SAL-002",
            kingdeeId: "KD-2",
            payloadJson: JSON.stringify({
              customer_id: "CUST-B",
              total_amount: "999"
            }),
            fetchedAt: new Date("2026-02-08T02:00:00.000Z")
          }
        ]),
        findSalesOrderByKingdeeOrderNumber: jest.fn().mockResolvedValue(null),
        createReconciliation,
        replaceReconciliationLines
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const result = await coreService.buildReconcileStatement({
      customerId: "customer-1",
      from: "2026-02-01",
      to: "2026-02-28"
    });

    expect(result.statementId).toBe("statement-1");
    expect(result.docCount).toBe(1);
    expect(result.totalAmount).toBe(100.5);
    expect(replaceReconciliationLines).toHaveBeenCalledTimes(1);
    const [, lines] = replaceReconciliationLines.mock.calls[0];
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({
      docNo: "SAL-001",
      amount: 100.5
    });
  });

  test("runAdminSyncJob: deliveries 别名会路由到 syncDeliveries", async () => {
    const { coreService } = await import("../src/modules/core/core.service");
    const deliveriesSpy = jest.spyOn(coreService, "syncDeliveries").mockResolvedValue({
      jobName: "sync:deliveries",
      fromTime: 1,
      toTime: 2,
      pages: 1,
      totalRows: 1,
      inserted: 1,
      skipped: 0,
      warnings: []
    });

    const result = await coreService.runAdminSyncJob({
      jobName: "deliveries"
    });

    expect(deliveriesSpy).toHaveBeenCalledTimes(1);
    expect(result.jobName).toBe("sync:deliveries");
    expect(result.results).toHaveLength(1);
  });

  test("runAdminSyncJob: sync:all 会并行执行 deliveries + receipts", async () => {
    const { coreService } = await import("../src/modules/core/core.service");
    const deliveriesSpy = jest.spyOn(coreService, "syncDeliveries").mockResolvedValue({
      jobName: "sync:deliveries",
      fromTime: 1,
      toTime: 2,
      pages: 1,
      totalRows: 1,
      inserted: 1,
      skipped: 0,
      warnings: []
    });
    const receiptsSpy = jest.spyOn(coreService, "syncReceipts").mockResolvedValue({
      jobName: "sync:receipts",
      fromTime: 1,
      toTime: 2,
      pages: 1,
      totalRows: 1,
      inserted: 1,
      skipped: 0,
      warnings: []
    });

    const result = await coreService.runAdminSyncJob({
      jobName: "sync:all"
    });

    expect(deliveriesSpy).toHaveBeenCalledTimes(1);
    expect(receiptsSpy).toHaveBeenCalledTimes(1);
    expect(result.jobName).toBe("sync:all");
    expect(result.results).toHaveLength(2);
  });

  test("createMiniOrder: 同幂等键重复下单返回历史订单", async () => {
    const createSalesOrderWithLines = jest.fn();
    const existingOrder = {
      id: "order-1",
      orderNo: "SO-0001",
      status: "CONFIRMED",
      settlementMode: "OFFLINE",
      currency: "CNY",
      totalAmount: 88.5,
      remark: null,
      idempotencyKey: "idem-order-1",
      kingdeeOrderId: "KD-1",
      kingdeeOrderNumber: "XSDD-1",
      writebackError: null,
      createdAt: new Date("2026-02-08T00:00:00.000Z"),
      updatedAt: new Date("2026-02-08T00:00:00.000Z"),
      canceledAt: null,
      lines: [
        {
          id: "line-1",
          productId: "p-1",
          skuId: "s-1",
          productName: "演示商品",
          skuName: "标准件",
          skuCode: "SKU-1",
          qty: 1,
          unitPrice: 88.5,
          lineAmount: 88.5,
          rawJson: "{}"
        }
      ],
      deliveries: []
    };

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findSalesOrderByIdempotencyKey: jest.fn().mockResolvedValue({ id: "order-1" }),
        findSalesOrderByIdAndCustomer: jest.fn().mockResolvedValue(existingOrder),
        createSalesOrderWithLines,
        clearCartByCustomer: jest.fn()
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const result = await coreService.createMiniOrder(
      makeMiniCustomer({
        kingdeeCustomerId: "KD-CUST-1"
      }),
      { remark: "重复提交" },
      "idem-order-1"
    );

    expect(result).toMatchObject({
      id: "order-1",
      orderNo: "SO-0001"
    });
    expect(createSalesOrderWithLines).not.toHaveBeenCalled();
  });

  test("createMiniOrder: 写回失败时抛 ORDER_WRITEBACK_REMOTE_REJECTED", async () => {
    const createSalesOrderWithLines = jest.fn().mockResolvedValue({ id: "order-new" });
    const clearCartItemsByCustomerSkuIds = jest.fn().mockResolvedValue(undefined);

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findSalesOrderByIdempotencyKey: jest.fn().mockResolvedValue(null),
        upsertPriceCache: jest.fn().mockResolvedValue(undefined),
        getSetting: jest.fn().mockResolvedValue(null),
        findSkuById: jest.fn().mockResolvedValue({
          id: "sku-1",
          productId: "product-1",
          skuCode: "SKU-1",
          skuName: "标准件",
          price: 100,
          stock: 99,
          status: "ACTIVE",
          unitId: "Pcs",
          kingdeeMaterialId: "MAT-1",
          specsJson: "{\"颜色\":\"蓝色\"}",
          product: {
            id: "product-1",
            name: "演示商品",
            status: "ACTIVE",
            kingdeeMaterialId: "MAT-1"
          }
        }),
        createSalesOrderWithLines,
        clearCartByCustomer: jest.fn().mockResolvedValue(undefined),
        clearCartItemsByCustomerSkuIds,
        findSalesOrderById: jest.fn().mockResolvedValue({
          id: "order-new",
          orderNo: "SO-NEW",
          customerId: "customer-1",
          lines: [
            {
              id: "line-1",
              qty: 1,
              unitPrice: 100,
              skuCode: "SKU-1",
              productName: "演示商品",
              rawJson: "{\"kingdeeMaterialId\":\"MAT-1\",\"unitId\":\"Pcs\"}"
            }
          ]
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    jest.spyOn(coreService, "createOrderAndWritebackKingdee").mockResolvedValue({
      success: false,
      statusCode: 502,
      code: "ORDER_WRITEBACK_REMOTE_REJECTED",
      message: "写回失败(测试)",
      requestId: "req-test-1",
      traceId: "trace-test-1",
      summary: "remote rejected"
    });

    await expect(
      coreService.createMiniOrder(
        makeMiniCustomer({
          kingdeeCustomerId: "KD-CUST-1"
        }),
        {
          items: [{ skuId: "sku-1", qty: 1 }],
          remark: "测试"
        },
        "idem-fail-1"
      )
    ).rejects.toMatchObject({
      code: "ORDER_WRITEBACK_REMOTE_REJECTED"
    });

    expect(createSalesOrderWithLines).toHaveBeenCalledTimes(1);
    expect(clearCartItemsByCustomerSkuIds).toHaveBeenCalledWith("customer-1", ["sku-1"]);
  });

  test("createMiniOrder: 显式 items 下单时仅清理命中 sku 的购物车项", async () => {
    const createSalesOrderWithLines = jest.fn().mockResolvedValue({ id: "order-2" });
    const clearCartItemsByCustomerSkuIds = jest.fn().mockResolvedValue(undefined);

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findSalesOrderByIdempotencyKey: jest.fn().mockResolvedValue(null),
        upsertPriceCache: jest.fn().mockResolvedValue(undefined),
        getSetting: jest.fn().mockResolvedValue(null),
        findSkuById: jest.fn().mockResolvedValue({
          id: "sku-2",
          productId: "product-2",
          skuCode: "SKU-2",
          skuName: "规格2",
          price: 50,
          stock: 20,
          status: "ACTIVE",
          unitId: "Pcs",
          kingdeeMaterialId: "MAT-2",
          specsJson: "{}",
          product: {
            id: "product-2",
            name: "商品2",
            status: "ACTIVE",
            kingdeeMaterialId: "MAT-2"
          }
        }),
        createSalesOrderWithLines,
        clearCartByCustomer: jest.fn().mockResolvedValue(undefined),
        clearCartItemsByCustomerSkuIds,
        findSalesOrderById: jest.fn().mockResolvedValue({
          id: "order-2",
          orderNo: "SO-2",
          customerId: "customer-1",
          lines: [
            {
              id: "line-2",
              qty: 2,
              unitPrice: 50,
              skuCode: "SKU-2",
              productName: "商品2",
              rawJson: "{\"kingdeeMaterialId\":\"MAT-2\",\"unitId\":\"Pcs\"}"
            }
          ]
        }),
        findSalesOrderByIdAndCustomer: jest.fn().mockResolvedValue({
          id: "order-2",
          orderNo: "SO-2",
          status: "CONFIRMED",
          settlementMode: "OFFLINE",
          currency: "CNY",
          totalAmount: 100,
          remark: null,
          idempotencyKey: "idem-2",
          kingdeeOrderId: "KD-2",
          kingdeeOrderNumber: "XSDD-2",
          writebackError: null,
          createdAt: new Date("2026-02-08T03:00:00.000Z"),
          updatedAt: new Date("2026-02-08T03:00:00.000Z"),
          canceledAt: null,
          lines: [
            {
              id: "line-2",
              productId: "product-2",
              skuId: "sku-2",
              productName: "商品2",
              skuName: "规格2",
              skuCode: "SKU-2",
              qty: 2,
              unitPrice: 50,
              lineAmount: 100,
              rawJson: "{}"
            }
          ],
          deliveries: []
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    jest.spyOn(coreService, "createOrderAndWritebackKingdee").mockResolvedValue({
      success: true,
      statusCode: 200,
      code: "ORDER_WRITEBACK_OK",
      message: "ok",
      requestId: "req-2",
      traceId: "trace-2",
      summary: "ok"
    });

    const result = await coreService.createMiniOrder(
      makeMiniCustomer({
        kingdeeCustomerId: "KD-CUST-1"
      }),
      {
        items: [{ skuId: "sku-2", qty: 2 }],
        remark: "测试部分结算"
      },
      "idem-2"
    );

    expect(result).toMatchObject({
      id: "order-2",
      orderNo: "SO-2"
    });
    expect(clearCartItemsByCustomerSkuIds).toHaveBeenCalledWith("customer-1", ["sku-2"]);
  });

  test("createOrderAndWritebackKingdee: 请求参数非法时返回 ORDER_WRITEBACK_PARAM_INVALID", async () => {
    const updateSalesOrder = jest.fn().mockResolvedValue(undefined);
    const createOrderWritebackLog = jest.fn().mockResolvedValue(undefined);

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findCustomerById: jest.fn().mockResolvedValue({
          id: "customer-1",
          kingdeeCustomerId: "KD-CUST-1"
        }),
        updateSalesOrder,
        createOrderWritebackLog
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const result = await coreService.createOrderAndWritebackKingdee({
      id: "order-1",
      orderNo: "SO-1",
      customerId: "customer-1",
      lines: [
        {
          id: "line-1",
          qty: 0,
          unitPrice: 88.5,
          skuCode: "SKU-1",
          productName: "演示商品",
          rawJson: "{\"kingdeeMaterialId\":\"MAT-1\",\"unitId\":\"Pcs\"}"
        }
      ]
    });

    expect(result).toMatchObject({
      success: false,
      code: "ORDER_WRITEBACK_PARAM_INVALID"
    });
    expect(updateSalesOrder).toHaveBeenCalledTimes(1);
    expect(createOrderWritebackLog).toHaveBeenCalledWith(
      expect.objectContaining({
        salesOrderId: "order-1",
        errorCode: "ORDER_WRITEBACK_PARAM_INVALID"
      })
    );
  });

  test("cancelMiniOrder: 已确认订单不可取消", async () => {
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findSalesOrderByIdAndCustomer: jest.fn().mockResolvedValue({
          id: "order-1",
          status: "CONFIRMED"
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.cancelMiniOrder(
        makeMiniCustomer(),
        "order-1",
        "取消测试"
      )
    ).rejects.toMatchObject({
      code: "ORDER_CANCEL_NOT_ALLOWED"
    });
  });

  test("retryOrderWriteback: 返回重试前后状态与摘要", async () => {
    const beforeOrder = {
      id: "order-1",
      orderNo: "SO-1",
      status: "WRITEBACK_FAILED",
      settlementMode: "OFFLINE",
      currency: "CNY",
      totalAmount: 100,
      remark: null,
      idempotencyKey: "idem-1",
      kingdeeOrderId: null,
      kingdeeOrderNumber: null,
      writebackError: "old error",
      createdAt: new Date("2026-02-08T00:00:00.000Z"),
      updatedAt: new Date("2026-02-08T00:00:00.000Z"),
      canceledAt: null,
      customer: {
        id: "customer-1",
        name: "客户A",
        phone: null,
        kingdeeCustomerId: "KD-CUST-1"
      },
      lines: [
        {
          id: "line-1",
          productId: "p-1",
          skuId: "s-1",
          productName: "商品",
          skuName: "规格",
          skuCode: "SKU-1",
          qty: 1,
          unitPrice: 100,
          lineAmount: 100,
          rawJson: "{}"
        }
      ],
      deliveries: [],
      writebackLogs: []
    };
    const afterOrder = {
      ...beforeOrder,
      status: "CONFIRMED",
      kingdeeOrderId: "KD-1",
      kingdeeOrderNumber: "XSDD-1",
      writebackError: null,
      writebackLogs: [
        {
          id: "log-1",
          success: true,
          requestId: "req-1",
          traceId: "trace-1",
          summary: "ok",
          requestJson: "{}",
          responseJson: "{}",
          errorCode: null,
          errorMessage: null,
          createdAt: new Date("2026-02-08T00:05:00.000Z")
        }
      ]
    };

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        findSalesOrderByIdForAdmin: jest
          .fn()
          .mockResolvedValueOnce(beforeOrder)
          .mockResolvedValueOnce(afterOrder),
        findSalesOrderById: jest.fn().mockResolvedValue({
          id: "order-1",
          orderNo: "SO-1",
          customerId: "customer-1",
          lines: [
            {
              id: "line-1",
              qty: 1,
              unitPrice: 100,
              skuCode: "SKU-1",
              productName: "商品",
              rawJson: "{\"kingdeeMaterialId\":\"MAT-1\",\"unitId\":\"Pcs\"}"
            }
          ]
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    jest.spyOn(coreService, "createOrderAndWritebackKingdee").mockResolvedValue({
      success: true,
      statusCode: 200,
      code: "ORDER_WRITEBACK_OK",
      message: "ok",
      requestId: "req-1",
      traceId: "trace-1",
      summary: "ok"
    });

    const result = await coreService.retryOrderWriteback("order-1");
    expect(result).toMatchObject({
      beforeStatus: "WRITEBACK_FAILED",
      afterStatus: "CONFIRMED",
      writeback: {
        code: "ORDER_WRITEBACK_OK",
        requestId: "req-1"
      },
      order: {
        id: "order-1",
        status: "CONFIRMED"
      }
    });
  });
});
