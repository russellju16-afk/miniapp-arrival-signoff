describe("core admin diagnostics routes", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.ADMIN_TOKEN = "dev-admin-token";
  });

  test("GET /api/admin/diagnostics/kingdee 返回诊断结果", async () => {
    const runAdminKingdeeDiagnostics = jest.fn().mockResolvedValue({
      checkedAt: "2026-02-08T00:00:00.000Z",
      summary: { pass: 4, warn: 1, fail: 0, total: 5 },
      items: []
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        runAdminKingdeeDiagnostics,
        retryOrderWritebackByOrderNo: jest.fn()
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/admin/diagnostics/kingdee",
      headers: {
        authorization: "Bearer dev-admin-token"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(runAdminKingdeeDiagnostics).toHaveBeenCalledTimes(1);

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.summary.pass).toBe(4);

    await app.close();
  });

  test("POST /api/admin/diagnostics/orders/retry-writeback 支持按订单号触发", async () => {
    const retryOrderWritebackByOrderNo = jest.fn().mockResolvedValue({
      inputOrderNo: "SO-2026-0001",
      result: {
        retriedAt: "2026-02-08T00:00:00.000Z",
        writeback: {
          requestId: "req-123",
          traceId: "trace-123"
        }
      }
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        runAdminKingdeeDiagnostics: jest.fn(),
        retryOrderWritebackByOrderNo
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/diagnostics/orders/retry-writeback",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        orderNo: "SO-2026-0001"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(retryOrderWritebackByOrderNo).toHaveBeenCalledWith("SO-2026-0001");

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.inputOrderNo).toBe("SO-2026-0001");

    await app.close();
  });
});
