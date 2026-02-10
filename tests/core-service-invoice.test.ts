describe("core service invoice center", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.KD_MOCK_MODE = "false";
  });

  function buildCustomer() {
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
      tokenExpiresAt: new Date("2026-03-08T00:00:00.000Z")
    };
  }

  test("createMiniInvoiceRequest: 未命中开票接口时仅留痕(PENDING)", async () => {
    const repo = {
      listSalesOrdersByCustomerAndIds: jest.fn().mockResolvedValue([
        { id: "order-1" },
        { id: "order-2" }
      ]),
      createInvoiceRequest: jest.fn().mockResolvedValue({
        id: "inv-req-1",
        status: "PENDING",
        createdAt: new Date("2026-02-08T00:00:00.000Z")
      }),
      listInvoiceRequestsByCustomer: jest.fn().mockResolvedValue([
        {
          id: "inv-req-1",
          orderIdsJson: JSON.stringify(["order-1", "order-2"]),
          invoiceProfileId: null,
          invoiceProfile: null,
          remark: "按月开票",
          status: "PENDING",
          kingdeeRefId: null,
          createdAt: new Date("2026-02-08T00:00:00.000Z"),
          updatedAt: new Date("2026-02-08T00:00:00.000Z")
        }
      ]),
      getSetting: jest.fn().mockResolvedValue(null)
    };

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));
    jest.doMock("../src/modules/core/endpoint-catalog", () => ({
      endpointCatalog: {
        getByKey: jest.fn().mockReturnValue({
          title: "销售订单保存",
          fullTitle: "销售/销售订单保存",
          method: "POST",
          path: "/jdy/v2/scm/sal_order"
        }),
        findByContains: jest.fn().mockReturnValue(null)
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    const result = await coreService.createMiniInvoiceRequest(buildCustomer(), {
      orderIds: ["order-1", "order-2"],
      remark: "按月开票"
    });

    expect(result).toMatchObject({
      id: "inv-req-1",
      status: "PENDING",
      kingdeeRefId: null
    });
    expect(repo.createInvoiceRequest).toHaveBeenCalledTimes(1);
  });

  test("createMiniInvoiceRequest: 命中开票接口并回写 SUBMITTED", async () => {
    const sendFeishuTextWebhook = jest.fn().mockResolvedValue({ ok: true });
    const repo = {
      listSalesOrdersByCustomerAndIds: jest.fn().mockResolvedValue([{ id: "order-1" }]),
      createInvoiceRequest: jest.fn().mockResolvedValue({
        id: "inv-req-2",
        status: "PENDING",
        createdAt: new Date("2026-02-08T00:00:00.000Z")
      }),
      findInvoiceProfileById: jest.fn().mockResolvedValue({
        id: "profile-1",
        title: "测试抬头",
        taxNo: "91330100XXXX",
        bankName: "招商银行",
        bankAccount: "6222000000000000",
        addressPhone: "广东深圳 0755-000000",
        email: "finance@example.com"
      }),
      updateInvoiceRequest: jest.fn().mockResolvedValue(undefined),
      listInvoiceRequestsByCustomer: jest.fn().mockResolvedValue([
        {
          id: "inv-req-2",
          orderIdsJson: JSON.stringify(["order-1"]),
          invoiceProfileId: "profile-1",
          invoiceProfile: {
            id: "profile-1",
            title: "测试抬头",
            taxNo: "91330100XXXX"
          },
          remark: "尽快处理",
          status: "SUBMITTED",
          kingdeeRefId: "KD-INV-001",
          createdAt: new Date("2026-02-08T00:00:00.000Z"),
          updatedAt: new Date("2026-02-08T00:05:00.000Z")
        }
      ]),
      getSetting: jest.fn((key: string) => {
        if (key === "FINANCE_WEBHOOK") {
          return Promise.resolve({ key, valueJson: JSON.stringify("https://hook.example.com/finance") });
        }
        return Promise.resolve(null);
      })
    };

    const kingdeeRequest = jest.fn().mockResolvedValue({
      data: { id: "KD-INV-001" }
    });

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: repo
    }));
    jest.doMock("../src/modules/notifications/feishu-webhook.sender", () => ({
      sendFeishuTextWebhook
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
          if (["手工开票保存", "开票", "发票", "申请"].some((item) => keyword.includes(item))) {
            return {
              title: "手工开票保存",
              fullTitle: "财务/手工开票保存",
              method: "POST",
              path: "/jdy/v2/finance/manual_invoice_save"
            };
          }
          return null;
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    const result = await coreService.createMiniInvoiceRequest(buildCustomer(), {
      orderIds: ["order-1"],
      invoiceProfileId: "profile-1",
      remark: "尽快处理"
    });

    expect(result).toMatchObject({
      id: "inv-req-2",
      status: "SUBMITTED",
      kingdeeRefId: "KD-INV-001"
    });
    expect(repo.updateInvoiceRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "inv-req-2",
        status: "SUBMITTED",
        kingdeeRefId: "KD-INV-001"
      })
    );
    expect(sendFeishuTextWebhook).toHaveBeenCalledTimes(1);
    expect(kingdeeRequest).toHaveBeenCalledTimes(1);
  });
});
