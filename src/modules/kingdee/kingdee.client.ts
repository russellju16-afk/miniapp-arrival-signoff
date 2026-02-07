import axios, { AxiosError, AxiosInstance, Method } from "axios";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { redis } from "../../config/redis";
import { AppError } from "../common/app-error";

const kingdeeLogger = logger.child({ scope: "kingdee" });

export interface KingdeeSignoffPayload {
  deliveryNo: string;
  signer: string;
  receivedAt: string;
  remark?: string;
  source: "wechat-mini-program";
  requestId: string;
}

class KingdeeClient {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: env.KINGDEE_BASE_URL,
      timeout: env.KINGDEE_TIMEOUT_MS,
      headers: {
        "content-type": "application/json"
      }
    });
  }

  async fetchDeliveryOrder(
    deliveryNo: string,
    requestId: string
  ): Promise<Record<string, unknown>> {
    const path = `${this.normalizePath(env.KINGDEE_DELIVERY_DETAIL_PATH)}/${encodeURIComponent(deliveryNo)}`;
    return this.request<Record<string, unknown>>("GET", path, undefined, requestId);
  }

  async submitSignoff(
    payload: KingdeeSignoffPayload,
    requestId: string
  ): Promise<Record<string, unknown>> {
    const path = this.normalizePath(env.KINGDEE_SIGNOFF_PATH);
    return this.request<Record<string, unknown>>("POST", path, payload, requestId);
  }

  private async getAccessToken(requestId: string): Promise<string> {
    const cacheKey = `kingdee:token:${env.KINGDEE_TENANT_ID}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.http.post(this.normalizePath(env.KINGDEE_AUTH_PATH), {
        appId: env.KINGDEE_APP_ID,
        appSecret: env.KINGDEE_APP_SECRET,
        tenantId: env.KINGDEE_TENANT_ID
      });

      const { token, expiresInSeconds } = this.extractToken(response.data);
      const ttl = Math.max(60, expiresInSeconds - 60);
      await redis.set(cacheKey, token, "EX", ttl);

      kingdeeLogger.info({ requestId, ttl }, "Refreshed Kingdee access token");
      return token;
    } catch (error) {
      throw this.toAppError(error, "鉴权失败", requestId);
    }
  }

  private extractToken(data: unknown): { token: string; expiresInSeconds: number } {
    if (typeof data !== "object" || data === null) {
      throw new AppError(502, "KINGDEE_AUTH_INVALID_RESPONSE", "金蝶鉴权响应格式错误");
    }

    const payload = data as Record<string, unknown>;
    const nested =
      typeof payload.data === "object" && payload.data !== null
        ? (payload.data as Record<string, unknown>)
        : undefined;

    const tokenCandidate =
      payload.access_token ??
      payload.accessToken ??
      payload.token ??
      nested?.access_token ??
      nested?.accessToken ??
      nested?.token;

    if (typeof tokenCandidate !== "string" || tokenCandidate.length === 0) {
      throw new AppError(502, "KINGDEE_AUTH_TOKEN_MISSING", "金蝶鉴权响应缺少 token");
    }

    const expiresCandidate =
      payload.expires_in ?? payload.expiresIn ?? nested?.expires_in ?? nested?.expiresIn ?? 7200;

    const expiresInSeconds = Number(expiresCandidate);
    if (!Number.isFinite(expiresInSeconds) || expiresInSeconds <= 0) {
      return { token: tokenCandidate, expiresInSeconds: 7200 };
    }

    return { token: tokenCandidate, expiresInSeconds };
  }

  private async request<T>(
    method: Method,
    path: string,
    body: unknown,
    requestId: string
  ): Promise<T> {
    try {
      const token = await this.getAccessToken(requestId);
      const response = await this.http.request<T>({
        method,
        url: path,
        data: body,
        headers: {
          authorization: `Bearer ${token}`,
          "x-request-id": requestId,
          "x-tenant-id": env.KINGDEE_TENANT_ID
        }
      });
      return response.data;
    } catch (error) {
      throw this.toAppError(error, `${method} ${path}`, requestId);
    }
  }

  private toAppError(error: unknown, action: string, requestId: string): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;
      kingdeeLogger.error(
        {
          requestId,
          action,
          status,
          data,
          err: error
        },
        "Kingdee API request failed"
      );

      return new AppError(502, "KINGDEE_API_ERROR", `金蝶接口调用失败: ${action}`, {
        status,
        data
      });
    }

    kingdeeLogger.error({ requestId, action, err: error }, "Unexpected Kingdee client error");
    return new AppError(502, "KINGDEE_API_ERROR", `金蝶接口调用失败: ${action}`);
  }

  private normalizePath(path: string): string {
    if (path.startsWith("/")) {
      return path;
    }

    return `/${path}`;
  }
}

export const kingdeeClient = new KingdeeClient();
