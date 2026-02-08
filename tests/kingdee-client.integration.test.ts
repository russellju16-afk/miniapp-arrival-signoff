import http from "node:http";
import { AddressInfo } from "node:net";

describe("kingdee-client integration (local mock server)", () => {
  test("GET 请求遇到 5xx 会自动重试并成功", async () => {
    let called = 0;
    const server = http.createServer((req, res) => {
      if (req.url?.startsWith("/jdy/v2/mock/retry")) {
        called += 1;
        if (called === 1) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ errcode: 500, description: "temporary error" }));
          return;
        }

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ errcode: 0, data: { ok: true, called } }));
        return;
      }

      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ errcode: 404 }));
    });
    await listen(server);
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    const getValidToken = jest.fn().mockResolvedValue("token-v1");
    const refreshToken = jest.fn().mockResolvedValue("token-v2");

    process.env.KD_BASE_URL = baseUrl;
    process.env.KD_CLIENT_ID = "test-client-id";
    process.env.KD_CLIENT_SECRET = "test-client-secret";
    process.env.KD_APP_KEY = "test-app-key";
    process.env.KD_APP_SECRET = "test-app-secret";
    process.env.KD_GW_ROUTER_ADDR = "https://tf.jdy.com";
    process.env.KD_TIMEOUT_MS = "3000";

    jest.resetModules();
    jest.doMock("../src/modules/core/token-provider", () => ({
      kingdeeTokenProvider: {
        getValidToken,
        refreshToken
      }
    }));

    const { kingdeeClient } = await import("../src/modules/core/kingdee-client");
    const result = await kingdeeClient.request({
      method: "GET",
      path: "/jdy/v2/mock/retry",
      query: { page: 1 }
    });

    expect(called).toBe(2);
    expect(getValidToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).toHaveBeenCalledTimes(0);
    expect(result).toEqual({ errcode: 0, data: { ok: true, called: 2 } });

    await closeServer(server);
  });

  test("401 鉴权失败会自动 refreshToken 后重试一次", async () => {
    let called = 0;
    const authHeaders: string[] = [];

    const server = http.createServer((req, res) => {
      if (req.url?.startsWith("/jdy/v2/mock/auth")) {
        called += 1;
        authHeaders.push(String(req.headers["app-token"] ?? ""));

        if (called === 1) {
          res.writeHead(401, { "content-type": "application/json" });
          res.end(JSON.stringify({ errcode: 1020002008, description: "token invalid" }));
          return;
        }

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ errcode: 0, data: { ok: true } }));
        return;
      }

      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ errcode: 404 }));
    });
    await listen(server);
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    const getValidToken = jest.fn().mockResolvedValue("token-old");
    const refreshToken = jest.fn().mockResolvedValue("token-new");

    process.env.KD_BASE_URL = baseUrl;
    process.env.KD_CLIENT_ID = "test-client-id";
    process.env.KD_CLIENT_SECRET = "test-client-secret";
    process.env.KD_APP_KEY = "test-app-key";
    process.env.KD_APP_SECRET = "test-app-secret";
    process.env.KD_GW_ROUTER_ADDR = "https://tf.jdy.com";
    process.env.KD_TIMEOUT_MS = "3000";

    jest.resetModules();
    jest.doMock("../src/modules/core/token-provider", () => ({
      kingdeeTokenProvider: {
        getValidToken,
        refreshToken
      }
    }));

    const { kingdeeClient } = await import("../src/modules/core/kingdee-client");
    const result = await kingdeeClient.request({
      method: "GET",
      path: "/jdy/v2/mock/auth"
    });

    expect(called).toBe(2);
    expect(getValidToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(authHeaders).toEqual(["token-old", "token-new"]);
    expect(result).toEqual({ errcode: 0, data: { ok: true } });

    await closeServer(server);
  });
});

async function listen(server: http.Server): Promise<void> {
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });
}

async function closeServer(server: http.Server): Promise<void> {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
}
