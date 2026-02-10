describe("core service settings HOME_NOTICE + HOME_LAYOUT", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("updateAdminSettings: HOME_NOTICE 合法时会规范化并保存", async () => {
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
      HOME_NOTICE: {
        title: " 店铺通知 ",
        content: " 当日 17:30 前下单次日达 "
      }
    });

    expect(upsertSetting).toHaveBeenCalledTimes(1);
    expect(upsertSetting).toHaveBeenCalledWith("HOME_NOTICE", expect.stringContaining("店铺通知"));
    expect((result as Record<string, unknown>).HOME_NOTICE).toEqual({
      title: "店铺通知",
      content: "当日 17:30 前下单次日达"
    });
  });

  test("updateAdminSettings: HOME_LAYOUT 包含非法 key 时返回可读错误", async () => {
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        upsertSetting: jest.fn(),
        listSettings: jest.fn().mockResolvedValue([])
      }
    }));

    const { coreService } = await import("../src/modules/core/core.service");

    await expect(
      coreService.updateAdminSettings({
        HOME_LAYOUT: [{ key: "unknown", enabled: true }]
      })
    ).rejects.toMatchObject({
      code: "SETTINGS_HOME_LAYOUT_KEY_INVALID"
    });
  });

  test("getMiniProfile: 返回已配置的 homeNotice 与 homeLayout", async () => {
    const getSetting = jest.fn().mockImplementation(async (key: string) => {
      if (key === "HOME_NOTICE") {
        return {
          key,
          valueJson: JSON.stringify({
            title: " 店铺通知 ",
            content: " 当日 17:30 前下单次日达 "
          })
        };
      }
      if (key === "HOME_LAYOUT") {
        return {
          key,
          valueJson: JSON.stringify([
            { key: "notice", enabled: true },
            { key: "hot", enabled: false }
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

    expect((profile as Record<string, unknown>).homeNotice).toEqual({
      title: "店铺通知",
      content: "当日 17:30 前下单次日达"
    });
    expect((profile as Record<string, unknown>).homeLayout).toEqual([
      { key: "notice", enabled: true },
      { key: "hot", enabled: false },
      { key: "banners", enabled: true },
      { key: "categories", enabled: true },
      { key: "brandCenter", enabled: true },
      { key: "featured", enabled: true }
    ]);
  });
});
