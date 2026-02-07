import axios from "axios";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { redis } from "../../config/redis";
import { genAppSignature, genXApiSignature } from "../../lib/kingdee-signature";
import { AppError } from "../common/app-error";
import { kingdeeTenantRepo } from "./kingdee-tenant.repo";

interface CachedTokenPayload {
  token: string;
  expiresAt: string;
}

interface TokenRefreshResult {
  tenantId: string;
  appToken: string;
  tokenExpiresAt: Date;
}

interface ParsedTokenResponse {
  appToken: string;
  tokenExpiresAt: Date;
}

const tokenLogger = logger.child({ scope: "kingdee-token-service" });

class KingdeeTokenService {
  private readonly redisKeyPrefix = "kingdee:tenant:app-token";

  async getValidToken(tenantId: string): Promise<string> {
    const cachedToken = await this.readTokenFromRedis(tenantId);
    if (cachedToken && this.isTokenWithinSafeWindow(cachedToken.tokenExpiresAt)) {
      return cachedToken.appToken;
    }

    const tenant = await kingdeeTenantRepo.findById(tenantId);
    if (!tenant) {
      throw new AppError(404, "TENANT_NOT_FOUND", `未找到 tenant: ${tenantId}`);
    }

    if (tenant.appToken && tenant.tokenExpiresAt instanceof Date) {
      if (this.isTokenWithinSafeWindow(tenant.tokenExpiresAt)) {
        await this.writeTokenToRedis(tenantId, tenant.appToken, tenant.tokenExpiresAt);
        return tenant.appToken;
      }
    }

    try {
      const refreshed = await this.refreshToken(tenantId);
      return refreshed.appToken;
    } catch (error) {
      // 刷新失败时不覆盖旧 token，且若旧 token 仍未过期则兜底使用。
      if (tenant.appToken && tenant.tokenExpiresAt instanceof Date && this.isTokenNotExpired(tenant.tokenExpiresAt)) {
        tokenLogger.warn(
          {
            tenantId,
            tokenExpiresAt: tenant.tokenExpiresAt.toISOString()
          },
          "Token refresh failed, fallback to existing DB token"
        );

        await this.writeTokenToRedis(tenantId, tenant.appToken, tenant.tokenExpiresAt);
        return tenant.appToken;
      }

      throw error;
    }
  }

  async refreshToken(tenantId: string): Promise<TokenRefreshResult> {
    const tenant = await kingdeeTenantRepo.findById(tenantId);
    if (!tenant) {
      throw new AppError(404, "TENANT_NOT_FOUND", `未找到 tenant: ${tenantId}`);
    }

    this.assertTenantCredential(tenant);

    const requestMeta = this.buildTokenRequestMeta(tenant);

    let response;
    try {
      response = await axios.request({
        method: requestMeta.method,
        baseURL: requestMeta.baseURL,
        url: requestMeta.path,
        params: requestMeta.params,
        timeout: env.KINGDEE_APP_TOKEN_TIMEOUT_MS,
        headers: requestMeta.headers,
        validateStatus: () => true
      });
    } catch (error) {
      tokenLogger.error(
        {
          tenantId,
          request: requestMeta.sanitized,
          error: this.formatAxiosError(error)
        },
        "Kingdee token API request failed"
      );

      throw new AppError(502, "KINGDEE_TOKEN_REQUEST_FAILED", "请求金蝶获取 app-token 接口失败");
    }

    if (response.status !== 200) {
      tokenLogger.error(
        {
          tenantId,
          httpStatus: response.status,
          request: requestMeta.sanitized,
          response: this.sanitizeSensitiveData(response.data)
        },
        "Kingdee token API returned non-200"
      );

      throw new AppError(502, "KINGDEE_TOKEN_HTTP_ERROR", `获取 app-token 失败，HTTP 状态: ${response.status}`);
    }

    let parsed: ParsedTokenResponse;
    try {
      parsed = this.parseTokenResponse(response.data);
    } catch (error) {
      tokenLogger.error(
        {
          tenantId,
          request: requestMeta.sanitized,
          response: this.sanitizeSensitiveData(response.data),
          err: error
        },
        "Kingdee token response parse failed"
      );

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(502, "KINGDEE_TOKEN_RESPONSE_INVALID", "app-token 返回体异常");
    }

    // 仅在成功拿到新 token 后才落库，避免失败覆盖旧 token。
    await kingdeeTenantRepo.updateTokenById(tenantId, parsed.appToken, parsed.tokenExpiresAt);
    await this.writeTokenToRedis(tenantId, parsed.appToken, parsed.tokenExpiresAt);

    tokenLogger.info(
      {
        tenantId,
        tokenExpiresAt: parsed.tokenExpiresAt.toISOString(),
        appToken: this.maskSecret(parsed.appToken)
      },
      "Kingdee app-token refreshed"
    );

    return {
      tenantId,
      appToken: parsed.appToken,
      tokenExpiresAt: parsed.tokenExpiresAt
    };
  }

  async getTokenStatus(): Promise<Array<Record<string, unknown>>> {
    const tenants = (await kingdeeTenantRepo.listAll()) as Array<Record<string, unknown>>;

    const statusList = await Promise.all(
      tenants.map(async (tenant) => {
        const tenantId = this.getString(tenant.id);
        const dbToken = this.getString(tenant.appToken);
        const dbExpiresAt = this.getDate(tenant.tokenExpiresAt);

        let redisToken: string | null = null;
        let redisExpiresAt: Date | null = null;

        if (tenantId) {
          const cached = await this.readTokenFromRedis(tenantId);
          if (cached) {
            redisToken = cached.appToken;
            redisExpiresAt = cached.tokenExpiresAt;
          }
        }

        const effectiveToken = redisToken ?? dbToken;
        const effectiveExpiresAt = redisExpiresAt ?? dbExpiresAt;

        return {
          tenant_id: tenantId,
          name: this.getString(tenant.name),
          app_key: this.getString(tenant.appKey),
          domain: this.getString(tenant.domain),
          app_token: this.maskSecret(effectiveToken),
          token_expires_at: effectiveExpiresAt ? effectiveExpiresAt.toISOString() : null,
          is_expired: effectiveExpiresAt ? !this.isTokenNotExpired(effectiveExpiresAt) : null,
          source: redisToken ? "redis" : dbToken ? "db" : "none"
        };
      })
    );

    return statusList;
  }

  private buildTokenRequestMeta(tenant: Record<string, unknown>): {
    method: "GET" | "POST";
    baseURL: string;
    path: string;
    params: Record<string, string>;
    headers: Record<string, string>;
    sanitized: Record<string, unknown>;
  } {
    const method = env.KINGDEE_APP_TOKEN_METHOD;
    const baseURL = env.KINGDEE_APP_TOKEN_BASE_URL;
    const path = env.KINGDEE_APP_TOKEN_PATH;

    const appKey = this.getString(tenant.appKey);
    const appSecret = this.getString(tenant.appSecret);
    const clientSecret = this.getString(tenant.clientSecret);
    const clientId = this.getString(tenant.clientId);
    const domain = this.getString(tenant.domain);

    if (!appKey || !appSecret || !clientSecret || !clientId) {
      throw new AppError(400, "TENANT_CREDENTIAL_INVALID", "tenant 缺少 app/client 鉴权信息");
    }

    const timestamp = Date.now().toString();
    const nonce = this.genNumericNonce();
    const appSignature = genAppSignature(appKey, appSecret);

    const params: Record<string, string> = {
      app_key: appKey,
      app_signature: appSignature
    };

    const signature = genXApiSignature(method, path, params, nonce, timestamp, clientSecret);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Api-ClientID": clientId,
      "X-Api-Auth-Version": "2.0",
      "X-Api-TimeStamp": timestamp,
      "X-Api-Nonce": nonce,
      "X-Api-SignHeaders": "X-Api-TimeStamp,X-Api-Nonce",
      "X-Api-SignHeader": "X-Api-TimeStamp,X-Api-Nonce",
      "X-Api-Signature": signature
    };

    if (domain) {
      headers["X-GW-Router-Addr"] = domain;
    }

    return {
      method,
      baseURL,
      path,
      params,
      headers,
      sanitized: {
        method,
        baseURL,
        path,
        params: this.sanitizeSensitiveData(params),
        headers: this.sanitizeSensitiveData(headers)
      }
    };
  }

  private parseTokenResponse(payload: unknown): ParsedTokenResponse {
    if (!this.isRecord(payload)) {
      throw new AppError(502, "KINGDEE_TOKEN_RESPONSE_INVALID", "app-token 返回体不是 JSON 对象");
    }

    const errcode = payload.errcode;
    if (typeof errcode === "number" && errcode !== 0) {
      const description = this.getString(payload.description) ?? "未知错误";
      throw new AppError(502, "KINGDEE_TOKEN_BUSINESS_ERROR", `获取 app-token 失败: ${description}`, {
        errcode,
        description
      });
    }

    const dataPayload = this.isRecord(payload.data) ? payload.data : payload;

    const appToken =
      this.readString(dataPayload, ["app_token", "appToken", "token", "auth_token"]) ??
      this.readString(payload, ["app_token", "appToken", "token", "auth_token"]);

    if (!appToken) {
      throw new AppError(502, "KINGDEE_TOKEN_MISSING", "返回体缺少 app-token");
    }

    const now = Date.now();

    const expiresAtFromDateString =
      this.readDate(dataPayload, ["token_expires_at", "tokenExpiresAt", "expires_at", "expiresAt"]) ??
      this.readDate(payload, ["token_expires_at", "tokenExpiresAt", "expires_at", "expiresAt"]);

    if (expiresAtFromDateString) {
      return {
        appToken,
        tokenExpiresAt: expiresAtFromDateString
      };
    }

    const expiresInSeconds =
      this.readNumber(dataPayload, ["expires_in", "expire_in", "expiresIn"]) ??
      this.readNumber(payload, ["expires_in", "expire_in", "expiresIn"]);

    const tokenExpiresAt = new Date(
      now + (Number.isFinite(expiresInSeconds) && expiresInSeconds > 0 ? expiresInSeconds : 24 * 60 * 60) * 1000
    );

    return {
      appToken,
      tokenExpiresAt
    };
  }

  private assertTenantCredential(tenant: Record<string, unknown>): void {
    if (!this.getString(tenant.clientId)) {
      throw new AppError(400, "TENANT_CLIENT_ID_REQUIRED", "tenant 缺少 client_id");
    }

    if (!this.getString(tenant.clientSecret)) {
      throw new AppError(400, "TENANT_CLIENT_SECRET_REQUIRED", "tenant 缺少 client_secret");
    }

    if (!this.getString(tenant.appKey)) {
      throw new AppError(400, "TENANT_APP_KEY_REQUIRED", "tenant 缺少 app_key");
    }

    if (!this.getString(tenant.appSecret)) {
      throw new AppError(400, "TENANT_APP_SECRET_REQUIRED", "tenant 缺少 app_secret");
    }
  }

  private isTokenWithinSafeWindow(tokenExpiresAt: Date): boolean {
    const remainMs = tokenExpiresAt.getTime() - Date.now();
    return remainMs > env.KINGDEE_TOKEN_REFRESH_WINDOW_SECONDS * 1000;
  }

  private isTokenNotExpired(tokenExpiresAt: Date): boolean {
    return tokenExpiresAt.getTime() > Date.now();
  }

  private getRedisKey(tenantId: string): string {
    return `${this.redisKeyPrefix}:${tenantId}`;
  }

  private async readTokenFromRedis(tenantId: string): Promise<{ appToken: string; tokenExpiresAt: Date } | null> {
    const raw = await redis.get(this.getRedisKey(tenantId));
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as CachedTokenPayload;
      const token = typeof parsed.token === "string" ? parsed.token : null;
      const expiresAt = typeof parsed.expiresAt === "string" ? new Date(parsed.expiresAt) : null;

      if (!token || !expiresAt || Number.isNaN(expiresAt.getTime())) {
        return null;
      }

      return {
        appToken: token,
        tokenExpiresAt: expiresAt
      };
    } catch {
      return null;
    }
  }

  private async writeTokenToRedis(tenantId: string, appToken: string, tokenExpiresAt: Date): Promise<void> {
    const remainSeconds = Math.floor((tokenExpiresAt.getTime() - Date.now()) / 1000);
    if (remainSeconds <= 0) {
      await redis.del(this.getRedisKey(tenantId));
      return;
    }

    const ttlSeconds = Math.max(60, remainSeconds);

    const payload: CachedTokenPayload = {
      token: appToken,
      expiresAt: tokenExpiresAt.toISOString()
    };

    await redis.set(this.getRedisKey(tenantId), JSON.stringify(payload), "EX", ttlSeconds);
  }

  private genNumericNonce(): string {
    const randomSuffix = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0");
    return `${Date.now()}${randomSuffix}`;
  }

  private sanitizeSensitiveData(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeSensitiveData(item));
    }

    if (!this.isRecord(data)) {
      return data;
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (this.isSensitiveKey(key)) {
        sanitized[key] = typeof value === "string" ? this.maskSecret(value) : "****";
      } else {
        sanitized[key] = this.sanitizeSensitiveData(value);
      }
    }

    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");

    return (
      normalized === "appsecret" ||
      normalized === "clientsecret" ||
      normalized === "appsignature" ||
      normalized === "xapisignature" ||
      normalized === "apptoken" ||
      normalized === "token"
    );
  }

  private maskSecret(secret: string | null): string | null {
    if (!secret) {
      return null;
    }

    if (secret.length <= 8) {
      return `${secret.slice(0, 1)}****${secret.slice(-1)}`;
    }

    return `${secret.slice(0, 4)}****${secret.slice(-4)}`;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  private readString(record: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
          return trimmed;
        }
      }
    }

    return undefined;
  }

  private readDate(record: Record<string, unknown>, keys: string[]): Date | null {
    const raw = this.readString(record, keys);
    if (!raw) {
      return null;
    }

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed;
  }

  private readNumber(record: Record<string, unknown>, keys: string[]): number {
    for (const key of keys) {
      const value = record[key];
      const numberValue = Number(value);
      if (Number.isFinite(numberValue) && numberValue > 0) {
        return numberValue;
      }
    }

    return 0;
  }

  private getString(value: unknown): string | null {
    return typeof value === "string" && value.length > 0 ? value : null;
  }

  private getDate(value: unknown): Date | null {
    return value instanceof Date && !Number.isNaN(value.getTime()) ? value : null;
  }

  private formatAxiosError(error: unknown): Record<string, unknown> {
    if (axios.isAxiosError(error)) {
      return {
        message: error.message,
        code: error.code,
        status: error.response?.status ?? null,
        data: this.sanitizeSensitiveData(error.response?.data)
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message
      };
    }

    return {
      message: "unknown error"
    };
  }
}

export const kingdeeTokenService = new KingdeeTokenService();
