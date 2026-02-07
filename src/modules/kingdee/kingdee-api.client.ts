import axios, { AxiosResponse } from "axios";

import { logger } from "../../config/logger";
import { genXApiSignature } from "../../lib/kingdee-signature";
import { AppError } from "../common/app-error";
import { kingdeeTenantRepo } from "../kingdee-tenant/kingdee-tenant.repo";
import { kingdeeTokenService } from "../kingdee-tenant/kingdee-token.service";

export type KingdeeHttpMethod = "GET" | "POST";

export type KingdeeQueryValue = string | number | boolean | null | undefined;

export interface KingdeeApiRequest {
  tenantId: string;
  method: KingdeeHttpMethod;
  path: string;
  query?: Record<string, KingdeeQueryValue>;
  body?: unknown;
}

interface KingdeeTenantSnapshot {
  id: string;
  clientId: string;
  clientSecret: string;
  domain: string;
}

const kingdeeApiLogger = logger.child({ scope: "kingdee-api-client" });

const KINGDEE_BASE_URL = "https://api.kingdee.com";
const KINGDEE_BASE_PATH = "/jdy";
const RETRYABLE_SERVER_ERROR_MAX_RETRY = 3;

class KingdeeApiClient {
  async request(request: KingdeeApiRequest): Promise<unknown> {
    const tenant = await this.getTenantSnapshot(request.tenantId);
    const method = request.method.toUpperCase() as KingdeeHttpMethod;
    const requestPath = this.normalizeRequestPath(request.path);
    const normalizedQuery = this.normalizeQuery(request.query ?? {});

    let appToken = await kingdeeTokenService.getValidToken(tenant.id);
    let authRetried = false;
    let duplicateOrTimestampRetried = false;

    let attempt = 0;
    while (attempt <= RETRYABLE_SERVER_ERROR_MAX_RETRY) {
      const timestamp = Date.now().toString();
      const nonce = this.generateNonce();
      const signature = genXApiSignature(
        method,
        requestPath,
        normalizedQuery,
        nonce,
        timestamp,
        tenant.clientSecret
      );

      const headers = {
        "Content-Type": "application/json",
        "X-Api-ClientID": tenant.clientId,
        "X-Api-Auth-Version": "2.0",
        "X-Api-TimeStamp": timestamp,
        "X-Api-Nonce": nonce,
        "X-Api-SignHeaders": "X-Api-TimeStamp,X-Api-Nonce",
        "X-Api-Signature": signature,
        "app-token": appToken,
        "X-GW-Router-Addr": tenant.domain
      };

      let response: AxiosResponse<unknown>;
      try {
        response = await axios.request({
          method,
          baseURL: KINGDEE_BASE_URL,
          url: requestPath,
          params: normalizedQuery,
          data: method === "GET" && typeof request.body === "undefined" ? undefined : request.body,
          headers,
          timeout: 15000,
          validateStatus: () => true
        });
      } catch (error) {
        if (attempt < RETRYABLE_SERVER_ERROR_MAX_RETRY) {
          await this.sleep(this.getBackoffDelayMs(attempt));
          attempt += 1;
          continue;
        }

        kingdeeApiLogger.error(
          {
            tenantId: tenant.id,
            method,
            path: requestPath,
            query: normalizedQuery,
            attempt,
            error: this.formatAxiosError(error)
          },
          "Kingdee request network failure"
        );

        throw new AppError(502, "KINGDEE_NETWORK_ERROR", "金蝶接口请求网络异常");
      }

      if (response.status >= 500) {
        if (attempt < RETRYABLE_SERVER_ERROR_MAX_RETRY) {
          await this.sleep(this.getBackoffDelayMs(attempt));
          attempt += 1;
          continue;
        }

        kingdeeApiLogger.error(
          {
            tenantId: tenant.id,
            method,
            path: requestPath,
            query: normalizedQuery,
            status: response.status,
            response: this.sanitizeSensitiveData(response.data)
          },
          "Kingdee request failed with 5xx after retries"
        );

        throw new AppError(502, "KINGDEE_HTTP_5XX", `金蝶接口返回 ${response.status}`);
      }

      if (this.isAuthFailure(response.status, response.data)) {
        if (!authRetried) {
          authRetried = true;

          const refreshed = await kingdeeTokenService.refreshToken(tenant.id);
          appToken = refreshed.appToken;
          continue;
        }
      }

      if (this.isDuplicateOrTimestampError(response.status, response.data)) {
        if (!duplicateOrTimestampRetried) {
          duplicateOrTimestampRetried = true;
          continue;
        }
      }

      return response.data;
    }

    throw new AppError(500, "KINGDEE_RETRY_EXHAUSTED", "金蝶接口重试耗尽");
  }

  private async getTenantSnapshot(tenantId: string): Promise<KingdeeTenantSnapshot> {
    const tenant = (await kingdeeTenantRepo.findById(tenantId)) as Record<string, unknown> | null;
    if (!tenant) {
      throw new AppError(404, "TENANT_NOT_FOUND", `未找到 tenant: ${tenantId}`);
    }

    const id = this.getString(tenant.id);
    const clientId = this.getString(tenant.clientId);
    const clientSecret = this.getString(tenant.clientSecret);
    const domain = this.getString(tenant.domain);

    if (!id || !clientId || !clientSecret || !domain) {
      throw new AppError(400, "TENANT_CREDENTIAL_INVALID", "tenant 缺少 client_id/client_secret/domain");
    }

    return {
      id,
      clientId,
      clientSecret,
      domain
    };
  }

  private normalizeRequestPath(path: string): string {
    const trimmed = path.trim();
    if (!trimmed) {
      throw new AppError(400, "INVALID_PATH", "path 不能为空");
    }

    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    if (withLeadingSlash === KINGDEE_BASE_PATH) {
      return KINGDEE_BASE_PATH;
    }

    if (withLeadingSlash.startsWith(`${KINGDEE_BASE_PATH}/`)) {
      return withLeadingSlash;
    }

    return `${KINGDEE_BASE_PATH}${withLeadingSlash}`;
  }

  private normalizeQuery(query: Record<string, KingdeeQueryValue>): Record<string, string> {
    const normalized: Record<string, string> = {};

    for (const [rawKey, rawValue] of Object.entries(query)) {
      const key = rawKey.trim();
      if (!key) {
        continue;
      }

      if (typeof rawValue === "undefined" || rawValue === null) {
        continue;
      }

      normalized[key] = String(rawValue);
    }

    return normalized;
  }

  private isAuthFailure(status: number, payload: unknown): boolean {
    if (status === 401) {
      return true;
    }

    const desc = this.extractErrorDescription(payload).toLowerCase();
    if (!desc) {
      return false;
    }

    return ["鉴权", "unauthorized", "invalid token", "token失效", "token expired", "auth"].some((keyword) =>
      desc.includes(keyword)
    );
  }

  private isDuplicateOrTimestampError(status: number, payload: unknown): boolean {
    // 该类错误常见于 4xx / 业务 errcode，通常提示重复提交、时间戳过期、nonce 重复。
    if (status >= 500) {
      return false;
    }

    const desc = this.extractErrorDescription(payload).toLowerCase();
    if (!desc) {
      return false;
    }

    return ["重复提交", "重复请求", "时间戳", "timestamp", "nonce", "5分钟", "过期"].some((keyword) =>
      desc.includes(keyword)
    );
  }

  private extractErrorDescription(payload: unknown): string {
    if (!this.isRecord(payload)) {
      return "";
    }

    const candidates: Array<unknown> = [
      payload.description,
      payload.message,
      payload.msg,
      payload.error,
      this.isRecord(payload.data) ? payload.data.description : undefined,
      this.isRecord(payload.data) ? payload.data.message : undefined
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }

    return "";
  }

  private generateNonce(): string {
    const random = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0");
    return `${Date.now()}${random}`;
  }

  private getBackoffDelayMs(attempt: number): number {
    return 200 * 2 ** attempt;
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private formatAxiosError(error: unknown): Record<string, unknown> {
    if (axios.isAxiosError(error)) {
      return {
        code: error.code,
        message: error.message,
        status: error.response?.status ?? null,
        response: this.sanitizeSensitiveData(error.response?.data)
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message
      };
    }

    return {
      message: "unknown"
    };
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
      normalized === "xapisignature" ||
      normalized === "appsignature" ||
      normalized === "apptoken" ||
      normalized === "token"
    );
  }

  private maskSecret(value: string): string {
    if (value.length <= 8) {
      return `${value.slice(0, 1)}****${value.slice(-1)}`;
    }

    return `${value.slice(0, 4)}****${value.slice(-4)}`;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  private getString(value: unknown): string | null {
    return typeof value === "string" && value.length > 0 ? value : null;
  }
}

export const kingdeeApiClient = new KingdeeApiClient();
