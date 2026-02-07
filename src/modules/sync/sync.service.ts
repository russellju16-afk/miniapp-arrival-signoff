import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";

import { logger } from "../../config/logger";
import { AppError } from "../common/app-error";
import { kingdeeApiClient } from "../kingdee/kingdee-api.client";
import { syncRepo } from "./sync.repo";
import { RunSyncJobInput, SyncJobName, SyncRunResult, SyncStatusItem } from "./sync.types";

interface BizSyncConfig {
  bizType: Exclude<SyncJobName, "master_data_full" | "documents_incremental">;
  listPath: string;
  detailPath?: string;
  supportsModifyTime?: boolean;
}

interface BizSyncCounters {
  pulled: number;
  inserted: number;
  skipped: number;
}

interface SyncWindow {
  fromTime: number | null;
  toTime: number;
}

const syncLogger = logger.child({ scope: "kingdee-sync-service" });

const ALL_CONFIGS: Record<Exclude<SyncJobName, "master_data_full" | "documents_incremental">, BizSyncConfig> = {
  customer: { bizType: "customer", listPath: "/v2/bd/customer", supportsModifyTime: false },
  supplier: { bizType: "supplier", listPath: "/v2/bd/supplier", supportsModifyTime: false },
  sal_order: {
    bizType: "sal_order",
    listPath: "/v2/scm/sal_order",
    detailPath: "/v2/scm/sal_order_detail",
    supportsModifyTime: true
  },
  sal_out_bound: {
    bizType: "sal_out_bound",
    listPath: "/v2/scm/sal_out_bound",
    detailPath: "/v2/scm/sal_out_bound_detail",
    supportsModifyTime: true
  },
  sal_invoice: {
    bizType: "sal_invoice",
    listPath: "/v2/scm/sal_invoice_list",
    detailPath: "/v2/scm/sal_invoice_detail",
    supportsModifyTime: true
  },
  pur_order: {
    bizType: "pur_order",
    listPath: "/v2/scm/pur_order",
    detailPath: "/v2/scm/pur_order_detail",
    supportsModifyTime: true
  },
  pur_inbound: {
    bizType: "pur_inbound",
    listPath: "/v2/scm/pur_inbound",
    detailPath: "/v2/scm/pur_inbound_detail",
    supportsModifyTime: true
  },
  pur_invoice: {
    bizType: "pur_invoice",
    listPath: "/v2/scm/pur_invoice",
    supportsModifyTime: true
  },
  ap_credit: {
    bizType: "ap_credit",
    listPath: "/v2/arap/ap_credit",
    detailPath: "/v2/arap/ap_credit_detail",
    supportsModifyTime: true
  },
  ar_credit: {
    bizType: "ar_credit",
    listPath: "/v2/arap/ar_credit",
    detailPath: "/v2/arap/ar_credit_detail",
    supportsModifyTime: true
  },
  voucher: {
    bizType: "voucher",
    listPath: "/v2/fi/voucher",
    supportsModifyTime: true
  },
  inventory: {
    bizType: "inventory",
    listPath: "/v2/scm/inventory",
    supportsModifyTime: false
  },
  inventory_stock: {
    bizType: "inventory_stock",
    listPath: "/v2/scm/inventory_stock",
    supportsModifyTime: false
  }
};

const MASTER_DATA_JOB_CONFIGS: BizSyncConfig[] = [
  ALL_CONFIGS.customer,
  ALL_CONFIGS.supplier,
  ALL_CONFIGS.inventory,
  ALL_CONFIGS.inventory_stock
];

const DOCUMENT_INCREMENTAL_JOB_CONFIGS: BizSyncConfig[] = [
  ALL_CONFIGS.sal_order,
  ALL_CONFIGS.sal_out_bound,
  ALL_CONFIGS.sal_invoice,
  ALL_CONFIGS.pur_order,
  ALL_CONFIGS.pur_inbound,
  ALL_CONFIGS.pur_invoice,
  ALL_CONFIGS.ap_credit,
  ALL_CONFIGS.ar_credit
];

class SyncService {
  async runJob(input: RunSyncJobInput): Promise<SyncRunResult> {
    const configs = this.resolveConfigs(input.jobName);
    const currentJob = await syncRepo.findSyncJob(input.tenantId, input.jobName);
    const window = this.resolveSyncWindow(input, currentJob as Record<string, unknown> | null);

    await syncRepo.upsertSyncJob({
      tenantId: input.tenantId,
      jobName: input.jobName,
      status: "RUNNING",
      error: null
    });

    const warnings: string[] = [];
    let totalPulled = 0;
    let totalInserted = 0;
    let totalSkipped = 0;

    try {
      for (const config of configs) {
        const counters = await this.syncBizData({
          tenantId: input.tenantId,
          config,
          fromTime: window.fromTime,
          toTime: window.toTime,
          warnings
        });

        totalPulled += counters.pulled;
        totalInserted += counters.inserted;
        totalSkipped += counters.skipped;
      }

      const result: SyncRunResult = {
        tenantId: input.tenantId,
        jobName: input.jobName,
        fromTime: window.fromTime,
        toTime: window.toTime,
        totalPulled,
        totalInserted,
        totalSkipped,
        warnings
      };

      await syncRepo.upsertSyncJob({
        tenantId: input.tenantId,
        jobName: input.jobName,
        status: "SUCCESS",
        error: null,
        lastSuccessAt: new Date(),
        lastCursor: result as unknown as Prisma.InputJsonValue
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "unknown sync error";

      await syncRepo.upsertSyncJob({
        tenantId: input.tenantId,
        jobName: input.jobName,
        status: "FAILED",
        error: errorMessage
      });

      throw error;
    }
  }

  async getStatus(tenantId?: string): Promise<SyncStatusItem[]> {
    const jobs = (await syncRepo.listSyncJobs(tenantId)) as Array<Record<string, unknown>>;

    return jobs.map((job) => ({
      tenant_id: this.toStringValue(job.tenantId),
      job_name: this.toStringValue(job.jobName),
      status: this.toStringValue(job.status),
      last_success_at: this.toDateIso(job.lastSuccessAt),
      last_cursor: job.lastCursor ?? null,
      error: typeof job.error === "string" ? job.error : null,
      updated_at: this.toDateIso(job.updatedAt)
    }));
  }

  private async syncBizData(input: {
    tenantId: string;
    config: BizSyncConfig;
    fromTime: number | null;
    toTime: number;
    warnings: string[];
  }): Promise<BizSyncCounters> {
    const pageSize = 50;
    let page = 1;

    let pulled = 0;
    let inserted = 0;
    let skipped = 0;

    const useModifyFilter = input.fromTime !== null && input.config.supportsModifyTime !== false;
    let degradeToFullPage = false;

    while (true) {
      const query: Record<string, string | number> = {
        page,
        page_size: pageSize
      };

      if (useModifyFilter && !degradeToFullPage) {
        if (input.fromTime !== null) {
          query.modify_start_time = input.fromTime;
        }
        query.modify_end_time = input.toTime;
      }

      const listResponse = await kingdeeApiClient.request({
        tenantId: input.tenantId,
        method: "GET",
        path: input.config.listPath,
        query
      });

      const bizError = this.extractBizError(listResponse);
      if (bizError) {
        if (useModifyFilter && !degradeToFullPage && this.isModifyTimeUnsupported(bizError.description)) {
          degradeToFullPage = true;
          input.warnings.push(
            `${input.config.bizType}: 接口疑似不支持 modify_start_time/modify_end_time，已降级为全量分页`
          );
          continue;
        }

        throw new AppError(
          502,
          "KINGDEE_SYNC_LIST_ERROR",
          `${input.config.bizType} 列表接口返回错误: ${bizError.description}`
        );
      }

      const items = this.extractListItems(listResponse);
      if (items.length === 0) {
        break;
      }

      for (const item of items) {
        const bizId = this.extractBizId(item);
        const saveResult = await this.saveRawRecord({
          tenantId: input.tenantId,
          bizType: input.config.bizType,
          bizId,
          data: item
        });

        pulled += 1;
        inserted += saveResult.inserted ? 1 : 0;
        skipped += saveResult.inserted ? 0 : 1;

        if (input.config.detailPath && bizId) {
          const detailResponse = await this.fetchDetailWithFallback(
            input.tenantId,
            input.config,
            bizId,
            input.warnings
          );

          const detailSaveResult = await this.saveRawRecord({
            tenantId: input.tenantId,
            bizType: `${input.config.bizType}_detail`,
            bizId,
            data: detailResponse
          });

          pulled += 1;
          inserted += detailSaveResult.inserted ? 1 : 0;
          skipped += detailSaveResult.inserted ? 0 : 1;
        }
      }

      if (items.length < pageSize) {
        break;
      }

      page += 1;
      if (page > 1000) {
        input.warnings.push(`${input.config.bizType}: 分页超过 1000 页，已中断后续拉取`);
        break;
      }
    }

    syncLogger.info(
      {
        tenantId: input.tenantId,
        bizType: input.config.bizType,
        pulled,
        inserted,
        skipped,
        fromTime: input.fromTime,
        toTime: input.toTime
      },
      "Sync biz data completed"
    );

    return { pulled, inserted, skipped };
  }

  private async fetchDetailWithFallback(
    tenantId: string,
    config: BizSyncConfig,
    bizId: string,
    warnings: string[]
  ): Promise<unknown> {
    const detailPath = config.detailPath;
    if (!detailPath) {
      throw new AppError(500, "SYNC_DETAIL_PATH_MISSING", `${config.bizType} 缺少详情接口路径`);
    }

    const candidateKeys = ["id", "fid", "bill_id", "billNo", "number", "code"];

    let lastErrorDescription = "";
    for (const key of candidateKeys) {
      const response = await kingdeeApiClient.request({
        tenantId,
        method: "GET",
        path: detailPath,
        query: {
          [key]: bizId
        }
      });

      const bizError = this.extractBizError(response);
      if (!bizError) {
        return response;
      }

      lastErrorDescription = bizError.description;
      if (!this.isParameterRelatedError(bizError.description)) {
        break;
      }
    }

    warnings.push(`${config.bizType}: biz_id=${bizId} 详情拉取失败，原因=${lastErrorDescription || "unknown"}`);
    return {
      _sync_warning: true,
      biz_id: bizId,
      detail_path: detailPath,
      description: lastErrorDescription || "detail fetch failed"
    };
  }

  private async saveRawRecord(input: {
    tenantId: string;
    bizType: string;
    bizId: string | null;
    data: unknown;
  }): Promise<{ inserted: boolean }> {
    const normalizedData = this.toInputJsonValue(input.data);
    const hash = this.computeHash(input.data);

    if (input.bizId) {
      const latest = await syncRepo.findLatestRawByBizId(input.tenantId, input.bizType, input.bizId);
      if (latest && typeof latest.hash === "string" && latest.hash === hash) {
        return { inserted: false };
      }
    }

    await syncRepo.createRaw({
      tenantId: input.tenantId,
      bizType: input.bizType,
      bizId: input.bizId,
      data: normalizedData,
      hash,
      pulledAt: new Date()
    });

    return { inserted: true };
  }

  private resolveConfigs(jobName: SyncJobName): BizSyncConfig[] {
    if (jobName === "master_data_full") {
      return MASTER_DATA_JOB_CONFIGS;
    }

    if (jobName === "documents_incremental") {
      return DOCUMENT_INCREMENTAL_JOB_CONFIGS;
    }

    const config = ALL_CONFIGS[jobName as keyof typeof ALL_CONFIGS];
    if (!config) {
      throw new AppError(400, "SYNC_JOB_UNSUPPORTED", `不支持的 jobName: ${jobName}`);
    }

    return [config];
  }

  private resolveSyncWindow(input: RunSyncJobInput, currentJob: Record<string, unknown> | null): SyncWindow {
    const toTime = typeof input.toTime === "number" && Number.isFinite(input.toTime) ? input.toTime : Date.now();

    if (typeof input.fromTime === "number" && Number.isFinite(input.fromTime)) {
      return {
        fromTime: input.fromTime,
        toTime
      };
    }

    if (input.jobName === "documents_incremental") {
      const lastCursor = this.isRecord(currentJob?.lastCursor) ? currentJob?.lastCursor : null;
      const cursorToTime = this.toNumber(lastCursor?.toTime);

      if (cursorToTime) {
        return {
          fromTime: cursorToTime,
          toTime
        };
      }

      return {
        fromTime: toTime - 60 * 60 * 1000,
        toTime
      };
    }

    if (
      input.jobName !== "master_data_full" &&
      this.resolveConfigs(input.jobName)[0]?.supportsModifyTime !== false
    ) {
      return {
        fromTime: toTime - 60 * 60 * 1000,
        toTime
      };
    }

    return {
      fromTime: null,
      toTime
    };
  }

  private extractListItems(payload: unknown): Array<Record<string, unknown>> {
    const firstArray = this.findFirstArray(payload);
    if (!firstArray) {
      return [];
    }

    return firstArray.filter((item): item is Record<string, unknown> => this.isRecord(item));
  }

  private findFirstArray(payload: unknown, depth = 0): unknown[] | null {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (!this.isRecord(payload) || depth > 4) {
      return null;
    }

    const preferredKeys = ["list", "rows", "records", "items", "result", "data"];
    for (const key of preferredKeys) {
      if (key in payload) {
        const found = this.findFirstArray(payload[key], depth + 1);
        if (found) {
          return found;
        }
      }
    }

    for (const value of Object.values(payload)) {
      const found = this.findFirstArray(value, depth + 1);
      if (found) {
        return found;
      }
    }

    return null;
  }

  private extractBizId(item: Record<string, unknown>): string | null {
    const candidateKeys = [
      "id",
      "Id",
      "ID",
      "fid",
      "FID",
      "bill_id",
      "billId",
      "bill_no",
      "billNo",
      "number",
      "code",
      "order_no",
      "orderNo"
    ];

    for (const key of candidateKeys) {
      const value = item[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }

      if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
      }
    }

    return null;
  }

  private extractBizError(payload: unknown): { code: number; description: string } | null {
    if (!this.isRecord(payload)) {
      return null;
    }

    const errcode = this.toNumber(payload.errcode);
    if (errcode === null || errcode === 0) {
      return null;
    }

    const description = this.toStringValue(payload.description) || this.toStringValue(payload.message) || "unknown";
    return {
      code: errcode,
      description
    };
  }

  private isModifyTimeUnsupported(description: string): boolean {
    const lower = description.toLowerCase();
    return (
      lower.includes("modify_start_time") ||
      lower.includes("modify_end_time") ||
      lower.includes("不支持") ||
      lower.includes("unknown") ||
      lower.includes("非法参数")
    );
  }

  private isParameterRelatedError(description: string): boolean {
    const lower = description.toLowerCase();
    return lower.includes("参数") || lower.includes("param") || lower.includes("必填") || lower.includes("unknown");
  }

  private computeHash(data: unknown): string {
    const stable = this.stableSerialize(data);
    return createHash("sha256").update(stable, "utf8").digest("hex");
  }

  private stableSerialize(data: unknown): string {
    if (data === null || typeof data !== "object") {
      return JSON.stringify(data);
    }

    if (Array.isArray(data)) {
      return `[${data.map((item) => this.stableSerialize(item)).join(",")}]`;
    }

    const record = data as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    const pairs = keys.map((key) => `${JSON.stringify(key)}:${this.stableSerialize(record[key])}`);
    return `{${pairs.join(",")}}`;
  }

  private toInputJsonValue(data: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
  }

  private toStringValue(value: unknown): string {
    return typeof value === "string" ? value : "";
  }

  private toDateIso(value: unknown): string | null {
    return value instanceof Date ? value.toISOString() : null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  private toNumber(value: unknown): number | null {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  }
}

export const syncService = new SyncService();
