describe("core service settings BRAND_CENTER_ITEMS", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("updateAdminSettings: BRAND_CENTER_ITEMS 合法时会规范化并保存", async () => {
    const stored = {} as Record<string, string>;
    const upsertSetting = jest.fn().mockImplementation(async (key: string, valueJson: string) => {
      stored[key] = valueJson;
      return { key, valueJson };
    });

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        upsertSetting,
        listSettings: jest.fn().mockImplementation(async (keys: string[]) =>
          keys
            .filter((key) => Object.prototype.hasOwnProperty.call(stored, key))
            .map((key) => ({ key, valueJson: stored[key] }))
        )
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    const result = await coreService.updateAdminSettings({
      BRAND_CENTER_ITEMS: [
        {
          id: " custom-id ",
          enabled: true,
          name: "  品牌甲  ",
          logoUrl: "https://example.com/logo.png"
        }
      ]
    });

    expect(upsertSetting).toHaveBeenCalledTimes(1);
    expect(upsertSetting).toHaveBeenCalledWith(
      "BRAND_CENTER_ITEMS",
      expect.stringContaining("品牌甲")
    );
    const brands = (result as Record<string, unknown>).BRAND_CENTER_ITEMS as Array<Record<string, unknown>>;
    expect(Array.isArray(brands)).toBe(true);
    expect(brands[0]).toMatchObject({
      id: "custom-id",
      enabled: true,
      name: "品牌甲",
      logoUrl: "https://example.com/logo.png"
    });
  });

  test("updateAdminSettings: BRAND_CENTER_ITEMS 缺少名称时返回可读错误", async () => {
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        upsertSetting: jest.fn(),
        listSettings: jest.fn().mockResolvedValue([])
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.updateAdminSettings({
        BRAND_CENTER_ITEMS: [
          {
            id: "brand-1",
            enabled: true,
            name: "   ",
            logoUrl: ""
          }
        ]
      })
    ).rejects.toMatchObject({
      code: "SETTINGS_BRAND_CENTER_NAME_REQUIRED"
    });
  });

  test("getMiniProfile: 返回已启用的品牌中心配置", async () => {
    const getSetting = jest.fn().mockImplementation(async (key: string) => {
      if (key === "BRAND_CENTER_ITEMS") {
        return {
          key,
          valueJson: JSON.stringify([
            {
              id: "brand-a",
              enabled: true,
              name: "  品牌甲 ",
              logoUrl: "https://example.com/a.png"
            },
            {
              id: "brand-b",
              enabled: false,
              name: "品牌乙",
              logoUrl: "https://example.com/b.png"
            }
          ])
        };
      }
      return null;
    });

    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        getSetting
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    const profile = await coreService.getMiniProfile({
      id: "customer-1",
      name: "客户A",
      phone: null,
      status: "ACTIVE",
      companyName: null,
      contactName: null,
      contactPhone: null,
      wechatOpenid: "openid-1",
      kingdeeCustomerId: "CUST-1",
      accessToken: "token-1",
      tokenExpiresAt: new Date("2026-02-09T00:00:00.000Z")
    });

    expect(Array.isArray((profile as Record<string, unknown>).brandCenterItems)).toBe(true);
    expect((profile as Record<string, unknown>).brandCenterItems).toEqual([
      {
        id: "brand-a",
        enabled: true,
        name: "品牌甲",
        logoUrl: "https://example.com/a.png"
      }
    ]);
  });
});
