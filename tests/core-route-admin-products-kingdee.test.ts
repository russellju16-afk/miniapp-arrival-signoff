describe("core admin kingdee products routes", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.ADMIN_TOKEN = "dev-admin-token";
  });

  test("GET /api/admin/products/kingdee/list 返回金蝶商品列表", async () => {
    const adminListKingdeeMaterials = jest.fn().mockResolvedValue({
      page: 1,
      pageSize: 20,
      total: 1,
      items: [
        {
          materialId: "KD-MAT-1001",
          materialNumber: "MAT-1001",
          materialName: "工业润滑油 A 型"
        }
      ]
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        adminListKingdeeMaterials,
        adminOneClickListKingdeeProducts: jest.fn()
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/admin/products/kingdee/list?page=1&pageSize=20&search=润滑",
      headers: {
        authorization: "Bearer dev-admin-token"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(adminListKingdeeMaterials).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      search: "润滑"
    });

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.items[0].materialId).toBe("KD-MAT-1001");

    await app.close();
  });

  test("POST /api/admin/products/kingdee/one-click-listing 支持批量一键上架", async () => {
    const adminOneClickListKingdeeProducts = jest.fn().mockResolvedValue({
      total: 2,
      successCount: 2,
      failedCount: 0,
      createdProducts: 1,
      updatedProducts: 1,
      items: [
        {
          materialId: "KD-MAT-1001",
          productId: "p-1",
          skuId: "s-1"
        }
      ],
      failed: []
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        adminListKingdeeMaterials: jest.fn(),
        adminOneClickListKingdeeProducts
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/admin/products/kingdee/one-click-listing",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        items: [
          {
            materialId: "KD-MAT-1001",
            materialNumber: "MAT-1001",
            materialName: "工业润滑油 A 型",
            materialModel: "18L/桶",
            unitId: "L"
          },
          {
            materialId: "KD-MAT-1002",
            materialNumber: "MAT-1002",
            materialName: "标准密封圈",
            materialModel: "DN50",
            unitId: "Pcs"
          }
        ]
      }
    });

    expect(response.statusCode).toBe(200);
    expect(adminOneClickListKingdeeProducts).toHaveBeenCalledWith({
      items: [
        {
          materialId: "KD-MAT-1001",
          materialNumber: "MAT-1001",
          materialName: "工业润滑油 A 型",
          materialModel: "18L/桶",
          unitId: "L"
        },
        {
          materialId: "KD-MAT-1002",
          materialNumber: "MAT-1002",
          materialName: "标准密封圈",
          materialModel: "DN50",
          unitId: "Pcs"
        }
      ]
    });

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.successCount).toBe(2);

    await app.close();
  });
});
