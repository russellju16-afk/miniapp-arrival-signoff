import axios, { AxiosRequestConfig } from "axios";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { genXApiSignature } from "../../lib/kingdee-signature";
import { AppError } from "../common/app-error";
import { kingdeeTokenProvider } from "./token-provider";
import { maskSecret, sanitizeSensitiveObject } from "./sanitize.util";

export type KdMethod = "GET" | "POST";

export interface KdRequestInput {
  method: KdMethod;
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
}

const kdLogger = logger.child({ scope: "core-kingdee-client" });

class KingdeeClient {
  async request(input: KdRequestInput): Promise<unknown> {
    let appToken = await kingdeeTokenProvider.getValidToken();
    let refreshed = false;

    const maxRetry = input.method === "GET" ? 2 : 0;
    let retry = 0;

    while (true) {
      const timestamp = Date.now().toString();
      const nonce = this.genNonce();
      const path = this.normalizePath(input.path);
      const query = this.normalizeQuery(input.query ?? {});
      const signature = genXApiSignature(
        input.method,
        path,
        query,
        nonce,
        timestamp,
        env.KD_CLIENT_SECRET
      );

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Api-ClientID": env.KD_CLIENT_ID,
        "X-Api-Auth-Version": "2.0",
        "X-Api-TimeStamp": timestamp,
        "X-Api-Nonce": nonce,
        "X-Api-SignHeaders": "X-Api-TimeStamp,X-Api-Nonce",
        // 文档存在 SignHeader / SignHeaders 两种写法，这里同时带上兼容不同网关实现。
        "X-Api-SignHeader": "X-Api-TimeStamp,X-Api-Nonce",
        "X-Api-Signature": signature,
        "app-token": appToken,
        "X-GW-Router-Addr": env.KD_GW_ROUTER_ADDR
      };

      const requestConfig: AxiosRequestConfig = {
        method: input.method,
        baseURL: env.KD_BASE_URL,
        url: path,
        params: query,
        data: input.body,
        headers,
        timeout: env.KD_TIMEOUT_MS,
        validateStatus: () => true
      };

      let response;
      try {
        response = await axios.request(requestConfig);
      } catch (error) {
        if (retry < maxRetry) {
          retry += 1;
          continue;
        }

        kdLogger.error(
          {
            path,
            method: input.method,
            query,
            error: error instanceof Error ? error.message : "unknown"
          },
          "Request network failed"
        );
        throw new AppError(502, "KD_NETWORK_ERROR", "调用金蝶接口网络异常");
      }

      if (this.isAuthError(response.status, response.data)) {
        if (!refreshed) {
          appToken = await kingdeeTokenProvider.refreshToken();
          refreshed = true;
          continue;
        }
      }

      if (response.status >= 500 && retry < maxRetry) {
        retry += 1;
        continue;
      }

      if (response.status !== 200) {
        kdLogger.error(
          {
            status: response.status,
            request: {
              ...requestConfig,
              headers: {
                ...headers,
                "app-token": maskSecret(appToken),
                "X-Api-Signature": maskSecret(signature)
              }
            },
            response: sanitizeSensitiveObject(response.data)
          },
          "Kingdee returned non-200"
        );

        throw new AppError(502, "KD_HTTP_ERROR", `金蝶接口返回 HTTP ${response.status}`);
      }

      return response.data;
    }
  }

  private normalizePath(path: string): string {
    if (!path.startsWith("/")) {
      return `/${path}`;
    }
    return path;
  }

  private normalizeQuery(query: Record<string, string | number | boolean | null | undefined>): Record<string, string> {
    const normalized: Record<string, string> = {};

    for (const [key, value] of Object.entries(query)) {
      if (typeof value === "undefined" || value === null) {
        continue;
      }
      normalized[key] = String(value);
    }

    return normalized;
  }

  private isAuthError(status: number, payload: unknown): boolean {
    if (status === 401) {
      return true;
    }

    const errcode = this.readNumber(payload, ["errcode"]);
    if (errcode === 1020002008) {
      return true;
    }

    const desc = this.readString(payload, ["description", "message", "msg"])?.toLowerCase() ?? "";
    return ["token", "unauthorized", "鉴权", "授权"].some((keyword) => desc.includes(keyword));
  }

  private readNumber(payload: unknown, keys: string[]): number | null {
    if (!isRecord(payload)) {
      return null;
    }

    for (const key of keys) {
      const value = payload[key];
      if (typeof value === "number") {
        return value;
      }
    }

    return null;
  }

  private readString(payload: unknown, keys: string[]): string | null {
    if (!isRecord(payload)) {
      return null;
    }

    for (const key of keys) {
      const value = payload[key];
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    return null;
  }

  private genNonce(): string {
    const rand = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0");
    return `${Date.now()}${rand}`;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const kingdeeClient = new KingdeeClient();
