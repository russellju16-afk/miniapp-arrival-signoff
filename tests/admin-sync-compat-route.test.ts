describe("admin sync compatibility routes", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.ADMIN_TOKEN = "dev-admin-token";
  });

  test("GET /admin/sync/status 转发 core service 并带弃用响应头", async () => {
    const listAdminSyncStatus = jest.fn().mockResolvedValue([
      {
        scope: "development:sync:deliveries",
        jobName: "sync:deliveries",
        status: "SUCCESS"
      }
    ]);

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        listAdminSyncStatus,
        runAdminSyncJob: jest.fn()
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/admin/sync/status?jobName=sync:deliveries",
      headers: {
        authorization: "Bearer dev-admin-token"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers.deprecation).toBe("true");
    expect(response.headers.link).toContain("/api/admin/sync/run");
    expect(listAdminSyncStatus).toHaveBeenCalledWith("sync:deliveries");

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(Array.isArray(payload.data)).toBe(true);

    await app.close();
  });

  test("POST /admin/sync/run 转发 core service", async () => {
    const runAdminSyncJob = jest.fn().mockResolvedValue({
      tenantId: null,
      jobName: "sync:deliveries",
      startedAt: "2026-02-08T00:00:00.000Z",
      finishedAt: "2026-02-08T00:00:01.000Z",
      warnings: [],
      results: []
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        listAdminSyncStatus: jest.fn(),
        runAdminSyncJob
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/admin/sync/run",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        tenantId: "tenant-A",
        jobName: "deliveries",
        fromTime: 1738771200000,
        toTime: 1738857600000
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers.deprecation).toBe("true");
    expect(runAdminSyncJob).toHaveBeenCalledWith({
      tenantId: "tenant-A",
      jobName: "deliveries",
      fromTime: 1738771200000,
      toTime: 1738857600000
    });

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.jobName).toBe("sync:deliveries");

    await app.close();
  });
});
