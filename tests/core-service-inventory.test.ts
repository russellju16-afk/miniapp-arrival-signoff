describe("core service inventory snapshot", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.KD_MOCK_MODE = "false";
  });

  test("syncInventoryStockSnapshot: 聚合库存并排除配置仓库", async () => {
    const updateSkuStockByMaterialId = jest
      .fn()
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 2 });

    const getSetting = jest.fn((key: string) => {
      if (key === "EXCLUDED_WAREHOUSE_CODES") {
        return Promise.resolve({
          key,
          valueJson: JSON.stringify(["BAD", "W-2"])
        });
      }
      return Promise.resolve(null);
    });

    const repo = {
      listActiveSkusWithMaterialId: jest.fn().mockResolvedValue([
        { id: "sku-1", stock: 1, kingdeeMaterialId: "MAT-1", product: { status: "ACTIVE" } },
        { id: "sku-2", stock: 2, kingdeeMaterialId: "MAT-2", product: { status: "ACTIVE" } }
      ]),
      updateSkuStockByMaterialId,
      upsertSyncCheckpoint: jest.fn().mockResolvedValue(undefined),
      getSetting
    };

    const kingdeeRequest = jest.fn((input: { query?: Record<string, string> }) => {
      const materialId = input?.query?.material_id;
      if (materialId === "MAT-1") {
        return Promise.resolve({
          data: {
            rows: [
              { warehouse_code: "GOOD", qty: 10 },
              { warehouse_code: "BAD", qty: 5 }
            ]
          }
        });
      }
      return Promise.resolve({
        data: {
          rows: [
            { warehouse_id: "W-2", im_qty: 7 },
            { warehouse_id: "W-3", im_qty: 12 }
          ]
        }
      });
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
          if (keyword.includes("inventory_stock") || keyword.includes("库存")) {
            return {
              title: "商品仓库库存查询",
              fullTitle: "库存/商品仓库库存查询",
              method: "GET",
              path: "/v2/scm/inventory_stock"
            };
          }
          return null;
        })
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");
    const result = await coreService.syncInventoryStockSnapshot();

    expect(result).toMatchObject({
      jobName: "sync:inventory-stock-snapshot",
      touchedMaterials: 2,
      touchedSkus: 3,
      excludedWarehouseCount: 2
    });

    expect(updateSkuStockByMaterialId).toHaveBeenNthCalledWith(1, "MAT-1", 10);
    expect(updateSkuStockByMaterialId).toHaveBeenNthCalledWith(2, "MAT-2", 12);
  });
});
