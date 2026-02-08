import axios from "axios";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { genAppSignature, genXApiSignature } from "../../lib/kingdee-signature";
import { AppError } from "../common/app-error";
import { coreRepo } from "./core.repo";
import { maskSecret, sanitizeSensitiveObject } from "./sanitize.util";

interface CachedToken {
  appToken: string;
  expiresAt: number;
}

const tokenLogger = logger.child({ scope: "core-token-provider" });

class KingdeeTokenProvider {
  private readonly memoryCache = new Map<string, CachedToken>();

  async getValidToken(): Promise<string> {
    this.ensureCredentials();

    const cacheKey = env.NODE_ENV;
    const memory = this.memoryCache.get(cacheKey);
    if (memory && memory.expiresAt > Date.now() + 60_000) {
      return memory.appToken;
    }

    const dbToken = await coreRepo.getTokenByEnv(cacheKey);
    if (dbToken && dbToken.expiresAt.getTime() > Date.now() + 60_000) {
      this.memoryCache.set(cacheKey, {
        appToken: dbToken.appToken,
        expiresAt: dbToken.expiresAt.getTime()
      });
      return dbToken.appToken;
    }

    return this.refreshToken();
  }

  async refreshToken(): Promise<string> {
    this.ensureCredentials();

    const method = env.KD_APP_TOKEN_METHOD;
    const path = env.KD_APP_TOKEN_PATH;
    const timestamp = Date.now().toString();
    const nonce = this.genNonce();

    const appSignature = genAppSignature(env.KD_APP_KEY, env.KD_APP_SECRET);
    const params = {
      clientId: env.KD_CLIENT_ID,
      app_key: env.KD_APP_KEY,
      app_signature: appSignature
    };

    const signature = genXApiSignature(
      method,
      path,
      params,
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
      "X-GW-Router-Addr": env.KD_GW_ROUTER_ADDR
    };

    const response = await axios.request({
      method,
      baseURL: env.KD_BASE_URL,
      url: path,
      params,
      headers,
      timeout: env.KD_TIMEOUT_MS,
      validateStatus: () => true
    });

    if (response.status !== 200) {
      const responseData = sanitizeSensitiveObject(response.data);
      tokenLogger.error(
        {
          status: response.status,
          request: {
            method,
            url: `${env.KD_BASE_URL}${path}`,
            params: sanitizeSensitiveObject(params),
            headers: sanitizeSensitiveObject(headers)
          },
          response: responseData
        },
        "Get app-token failed with non-200"
      );

      const record = isRecord(response.data) ? response.data : {};
      throw new AppError(502, "KD_TOKEN_HTTP_ERROR", `获取 app-token 失败，HTTP ${response.status}`, {
        status: response.status,
        errcode: getNumber(record.errcode),
        description: getString(record.description),
        response: responseData
      });
    }

    const { appToken, expiresAt } = this.parseTokenPayload(response.data);

    await coreRepo.upsertToken(env.NODE_ENV, appToken, expiresAt);
    this.memoryCache.set(env.NODE_ENV, {
      appToken,
      expiresAt: expiresAt.getTime()
    });

    tokenLogger.info(
      {
        appToken: maskSecret(appToken),
        expiresAt: expiresAt.toISOString()
      },
      "App-token refreshed"
    );

    return appToken;
  }

  private parseTokenPayload(payload: unknown): { appToken: string; expiresAt: Date } {
    const record = isRecord(payload) ? payload : {};
    const businessCode = getNumber(record.errcode);
    if (businessCode !== null && businessCode !== 0) {
      throw new AppError(
        502,
        "KD_TOKEN_BUSINESS_ERROR",
        `获取 app-token 失败: ${getString(record.description) ?? "未知错误"}`,
        {
          errcode: businessCode,
          description: getString(record.description) ?? null
        }
      );
    }

    const data = isRecord(record.data) ? record.data : record;
    const candidates: Array<unknown> = [
      data.app_token,
      data["app-token"],
      data.appToken,
      data.token,
      data.access_token,
      data.accessToken,
      record.app_token,
      record["app-token"],
      record.appToken,
      record.token,
      record.access_token,
      record.accessToken
    ];

    let appToken: string | null = null;
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        appToken = candidate.trim();
        break;
      }
    }

    if (!appToken) {
      throw new AppError(502, "KD_TOKEN_PARSE_ERROR", "返回体中未找到 app-token");
    }

    const expiresAt =
      this.parseExpiresAt(data.expires) ??
      this.parseExpiresAt(data.expires_at) ??
      this.parseExpiresAt(data.expiresAt) ??
      this.parseExpiresAt(record.expires) ??
      this.parseExpiresAt(record.expires_at) ??
      this.parseExpiresAt(record.expiresAt) ??
      new Date(Date.now() + env.KD_TOKEN_CACHE_HOURS * 60 * 60 * 1000);

    return {
      appToken,
      expiresAt
    };
  }

  private parseExpiresAt(raw: unknown): Date | null {
    const asNumber =
      typeof raw === "number"
        ? raw
        : typeof raw === "string" && raw.trim()
          ? Number(raw.trim())
          : Number.NaN;

    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      return null;
    }

    const timestamp = asNumber < 1_000_000_000_000 ? asNumber * 1000 : asNumber;
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed;
  }

  private ensureCredentials(): void {
    const required = [
      ["KD_CLIENT_ID", env.KD_CLIENT_ID],
      ["KD_CLIENT_SECRET", env.KD_CLIENT_SECRET],
      ["KD_APP_KEY", env.KD_APP_KEY],
      ["KD_APP_SECRET", env.KD_APP_SECRET]
    ] as const;

    const missing = required.filter(([, value]) => !value.trim()).map(([key]) => key);
    if (missing.length > 0) {
      throw new AppError(400, "KD_CONFIG_MISSING", `缺少必要配置: ${missing.join(", ")}`);
    }
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

function getString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

export const kingdeeTokenProvider = new KingdeeTokenProvider();
