describe("token-provider", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.KD_CLIENT_ID = "test-client-id";
    process.env.KD_CLIENT_SECRET = "test-client-secret";
    process.env.KD_APP_KEY = "test-app-key";
    process.env.KD_APP_SECRET = "test-app-secret";
    process.env.KD_BASE_URL = "http://127.0.0.1:9999";
    process.env.KD_GW_ROUTER_ADDR = "https://tf.jdy.com";
    process.env.KD_APP_TOKEN_PATH = "/jdyconnector/app_management/kingdee_auth_token";
    process.env.KD_APP_TOKEN_METHOD = "GET";
    process.env.KD_TIMEOUT_MS = "1000";
    process.env.KD_TOKEN_CACHE_HOURS = "24";
  });

  test("getValidToken 命中 DB 缓存时不调用远程", async () => {
    const axiosRequest = jest.fn();
    const getTokenByEnv = jest.fn().mockResolvedValue({
      appToken: "db-token",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });
    const upsertToken = jest.fn();

    jest.doMock("axios", () => ({
      __esModule: true,
      default: {
        request: axiosRequest
      }
    }));
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        getTokenByEnv,
        upsertToken
      }
    }));

    const { kingdeeTokenProvider } = await import("../src/modules/core/token-provider");
    const token = await kingdeeTokenProvider.getValidToken();

    expect(token).toBe("db-token");
    expect(getTokenByEnv).toHaveBeenCalledTimes(1);
    expect(axiosRequest).not.toHaveBeenCalled();
    expect(upsertToken).not.toHaveBeenCalled();
  });

  test("refreshToken 成功后会写入缓存，重复调用不再远程请求", async () => {
    const axiosRequest = jest.fn().mockResolvedValue({
      status: 200,
      data: {
        errcode: 0,
        data: {
          app_token: "remote-token"
        }
      }
    });
    const getTokenByEnv = jest.fn().mockResolvedValue(null);
    const upsertToken = jest.fn().mockResolvedValue(undefined);

    jest.doMock("axios", () => ({
      __esModule: true,
      default: {
        request: axiosRequest
      }
    }));
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        getTokenByEnv,
        upsertToken
      }
    }));

    const { kingdeeTokenProvider } = await import("../src/modules/core/token-provider");
    const token1 = await kingdeeTokenProvider.getValidToken();
    const token2 = await kingdeeTokenProvider.getValidToken();

    expect(token1).toBe("remote-token");
    expect(token2).toBe("remote-token");
    expect(axiosRequest).toHaveBeenCalledTimes(1);
    expect(upsertToken).toHaveBeenCalledTimes(1);
  });

  test("refreshToken 能解析 data.app-token 与 expires", async () => {
    const futureExpires = Date.now() + 2 * 60 * 60 * 1000;
    const axiosRequest = jest.fn().mockResolvedValue({
      status: 200,
      data: {
        errcode: 0,
        description: "成功",
        data: {
          "app-token": "hyphen-token",
          access_token: "fallback-token",
          expires: futureExpires
        }
      }
    });
    const getTokenByEnv = jest.fn().mockResolvedValue(null);
    const upsertToken = jest.fn().mockResolvedValue(undefined);

    jest.doMock("axios", () => ({
      __esModule: true,
      default: {
        request: axiosRequest
      }
    }));
    jest.doMock("../src/modules/core/core.repo", () => ({
      coreRepo: {
        getTokenByEnv,
        upsertToken
      }
    }));

    const { kingdeeTokenProvider } = await import("../src/modules/core/token-provider");
    const token = await kingdeeTokenProvider.refreshToken();

    expect(token).toBe("hyphen-token");
    expect(upsertToken).toHaveBeenCalledTimes(1);
    expect(upsertToken).toHaveBeenCalledWith(
      process.env.NODE_ENV ?? "test",
      "hyphen-token",
      expect.any(Date)
    );

    const [, , expiresAt] = upsertToken.mock.calls[0];
    expect(expiresAt.getTime()).toBe(futureExpires);
  });
});
