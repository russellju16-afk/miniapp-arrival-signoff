import { logger } from "../../config/logger";
import { AppError } from "../common/app-error";
import { kingdeeTenantRepo, KingdeeTenantUpsertInput } from "./kingdee-tenant.repo";

const serviceLogger = logger.child({ scope: "kingdee-tenant-service" });

interface NormalizedTenantPayload {
  name?: string | null;
  clientId?: string;
  clientSecret?: string;
  appKey?: string;
  appSecret?: string;
  domain?: string;
  appToken?: string | null;
  tokenExpiresAt?: Date | null;
}

class KingdeeTenantService {
  async ingestWebhook(payload: unknown, requestId: string): Promise<void> {
    const normalized = this.normalizePayload(payload);

    if (!normalized.appKey || !normalized.appSecret || !normalized.domain) {
      throw new AppError(
        400,
        "INVALID_WEBHOOK_PAYLOAD",
        "Webhook payload 至少需要包含 app_key、app_secret、domain"
      );
    }

    const existing = await kingdeeTenantRepo.findByAppKey(normalized.appKey);

    const clientId = normalized.clientId ?? existing?.clientId;
    const clientSecret = normalized.clientSecret ?? existing?.clientSecret;

    if (!clientId || !clientSecret) {
      throw new AppError(
        400,
        "CLIENT_CREDENTIAL_REQUIRED",
        "缺少 client_id 或 client_secret，请先通过管理接口手工写入"
      );
    }

    const upsertInput: KingdeeTenantUpsertInput = {
      name: normalized.name ?? existing?.name ?? null,
      clientId,
      clientSecret,
      appKey: normalized.appKey,
      appSecret: normalized.appSecret,
      domain: normalized.domain,
      appToken: normalized.appToken ?? existing?.appToken ?? null,
      tokenExpiresAt: normalized.tokenExpiresAt ?? existing?.tokenExpiresAt ?? null
    };

    const saved = await kingdeeTenantRepo.upsertByAppKey(upsertInput);
    serviceLogger.info(
      {
        requestId,
        appKey: saved.appKey,
        domain: saved.domain
      },
      "Ingested Kingdee webhook tenant auth"
    );
  }

  async adminUpsert(payload: unknown, requestId: string): Promise<Record<string, unknown>> {
    const normalized = this.normalizePayload(payload);

    if (
      !normalized.clientId ||
      !normalized.clientSecret ||
      !normalized.appKey ||
      !normalized.appSecret ||
      !normalized.domain
    ) {
      throw new AppError(
        400,
        "INVALID_ADMIN_PAYLOAD",
        "请求体必须包含 clientId/clientSecret/app_key/app_secret/domain"
      );
    }

    const saved = await kingdeeTenantRepo.upsertByAppKey({
      name: normalized.name ?? null,
      clientId: normalized.clientId,
      clientSecret: normalized.clientSecret,
      appKey: normalized.appKey,
      appSecret: normalized.appSecret,
      domain: normalized.domain,
      appToken: normalized.appToken ?? null,
      tokenExpiresAt: normalized.tokenExpiresAt ?? null
    });

    serviceLogger.info(
      {
        requestId,
        appKey: saved.appKey,
        domain: saved.domain
      },
      "Admin upserted Kingdee tenant auth"
    );

    return this.toMaskedTenant(saved);
  }

  async listTenants(): Promise<Array<Record<string, unknown>>> {
    const tenants = await kingdeeTenantRepo.listAll();
    return (tenants as Array<Record<string, unknown>>).map((tenant) => this.toMaskedTenant(tenant));
  }

  sanitizePayloadForLog(payload: unknown): unknown {
    return this.sanitizeSensitiveData(payload);
  }

  private normalizePayload(payload: unknown): NormalizedTenantPayload {
    if (!this.isRecord(payload)) {
      throw new AppError(400, "INVALID_PAYLOAD", "请求体必须是 JSON 对象");
    }

    const tokenExpiresAtRaw = this.readString(payload, ["token_expires_at", "tokenExpiresAt"]);

    return {
      name: this.readString(payload, ["name"]) ?? null,
      clientId: this.readString(payload, ["client_id", "clientId"]),
      clientSecret: this.readString(payload, ["client_secret", "clientSecret"]),
      appKey: this.readString(payload, ["app_key", "appKey"]),
      appSecret: this.readString(payload, ["app_secret", "appSecret"]),
      domain: this.readString(payload, ["domain"]),
      appToken: this.readString(payload, ["app_token", "appToken"]) ?? null,
      tokenExpiresAt: tokenExpiresAtRaw ? this.parseDate(tokenExpiresAtRaw) : null
    };
  }

  private parseDate(value: string): Date {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new AppError(400, "INVALID_TOKEN_EXPIRES_AT", "token_expires_at 不是合法时间格式");
    }

    return parsed;
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

  private toMaskedTenant(tenant: Record<string, unknown>): Record<string, unknown> {
    const getString = (value: unknown): string | null =>
      typeof value === "string" ? value : null;
    const getDate = (value: unknown): Date | null => (value instanceof Date ? value : null);

    const id = getString(tenant.id);
    const name = getString(tenant.name);
    const clientId = getString(tenant.clientId);
    const clientSecret = getString(tenant.clientSecret);
    const appKey = getString(tenant.appKey);
    const appSecret = getString(tenant.appSecret);
    const domain = getString(tenant.domain);
    const appToken = getString(tenant.appToken);
    const tokenExpiresAt = getDate(tenant.tokenExpiresAt);
    const createdAt = getDate(tenant.createdAt);
    const updatedAt = getDate(tenant.updatedAt);

    return {
      id,
      name,
      client_id: clientId,
      client_secret: this.maskSecret(clientSecret),
      app_key: appKey,
      app_secret: this.maskSecret(appSecret),
      domain,
      app_token: this.maskSecret(appToken),
      token_expires_at: tokenExpiresAt ? tokenExpiresAt.toISOString() : null,
      created_at: createdAt ? createdAt.toISOString() : null,
      updated_at: updatedAt ? updatedAt.toISOString() : null
    };
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
    return normalized === "appsecret" || normalized === "clientsecret" || normalized === "apptoken";
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }
}

export const kingdeeTenantService = new KingdeeTenantService();
