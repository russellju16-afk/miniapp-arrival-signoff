describe("core service settings HOME_BANNERS", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("updateAdminSettings: HOME_BANNERS 合法时会规范化并保存", async () => {
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
      HOME_BANNERS: [
        {
          id: " custom-id ",
          enabled: true,
          tag: "  常购 ",
          title: "  高频商品一键补货  ",
          subTitle: "副标题",
          cta: "立即查看",
          theme: "common",
          action: "commonProducts",
          imageUrl: "https://example.com/banner.png"
        }
      ]
    });

    expect(upsertSetting).toHaveBeenCalledTimes(1);
    expect(upsertSetting).toHaveBeenCalledWith(
      "HOME_BANNERS",
      expect.stringContaining("高频商品一键补货")
    );
    const banners = (result as Record<string, unknown>).HOME_BANNERS as Array<Record<string, unknown>>;
    expect(Array.isArray(banners)).toBe(true);
    expect(banners[0]).toMatchObject({
      id: "custom-id",
      title: "高频商品一键补货",
      theme: "common",
      action: "commonProducts"
    });
  });

  test("updateAdminSettings: HOME_BANNERS 为空时返回可读错误", async () => {
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        upsertSetting: jest.fn(),
        listSettings: jest.fn().mockResolvedValue([])
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.updateAdminSettings({
        HOME_BANNERS: []
      })
    ).rejects.toMatchObject({
      code: "SETTINGS_HOME_BANNERS_EMPTY"
    });
  });

  test("updateAdminSettings: HOME_BANNERS 包含非法主题时会失败", async () => {
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        upsertSetting: jest.fn(),
        listSettings: jest.fn().mockResolvedValue([])
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.updateAdminSettings({
        HOME_BANNERS: [
          {
            id: "banner-1",
            enabled: true,
            tag: "精选",
            title: "测试轮播",
            subTitle: "测试",
            cta: "查看",
            theme: "unknown-theme",
            action: "products"
          }
        ]
      })
    ).rejects.toMatchObject({
      code: "SETTINGS_HOME_BANNERS_THEME_INVALID"
    });
  });
});
