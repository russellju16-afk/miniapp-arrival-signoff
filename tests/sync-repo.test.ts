describe("sync repo legacy db guard", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("listSyncJobs: 缺少 DATABASE_URL 时返回 503 可读错误", async () => {
    jest.doMock("../src/db/prisma", () => ({
      prisma: {
        syncJob: {
          findMany: jest
            .fn()
            .mockRejectedValue(
              new Error("PrismaClientInitializationError: Environment variable not found: DATABASE_URL.")
            )
        }
      }
    }));

    const { syncRepo } = await import("../src/modules/sync/sync.repo");

    await expect(syncRepo.listSyncJobs()).rejects.toMatchObject({
      statusCode: 503,
      code: "LEGACY_SYNC_DB_UNAVAILABLE"
    });
  });

  test("listSyncJobs: 其他数据库错误返回 500", async () => {
    jest.doMock("../src/db/prisma", () => ({
      prisma: {
        syncJob: {
          findMany: jest.fn().mockRejectedValue(new Error("unexpected legacy db error"))
        }
      }
    }));

    const { syncRepo } = await import("../src/modules/sync/sync.repo");

    await expect(syncRepo.listSyncJobs()).rejects.toMatchObject({
      statusCode: 500,
      code: "LEGACY_SYNC_DB_ERROR"
    });
  });
});
