import "dotenv/config";

import { maskSecret } from "../src/modules/core/sanitize.util";
import { connectCorePrisma, corePrisma } from "../src/db/core-prisma";
import { coreService } from "../src/modules/core/core.service";
import { kingdeeTokenProvider } from "../src/modules/core/token-provider";

type StepStatus = "pass" | "fail" | "warn" | "skip";

interface StepResult {
  name: string;
  status: StepStatus;
  durationMs: number;
  message: string;
  details?: unknown;
  hint?: string;
}

async function main(): Promise<void> {
  const steps: StepResult[] = [];
  const required = ["KD_CLIENT_ID", "KD_CLIENT_SECRET", "KD_APP_KEY", "KD_APP_SECRET"];
  const missing = required.filter((key) => !(process.env[key] ?? "").trim());
  const writebackProbeEnabled = (process.env.KD_LIVE_CHECK_WRITEBACK_PROBE ?? "false") === "true";
  const writebackProbeOrderId = (process.env.KD_LIVE_CHECK_PROBE_ORDER_ID ?? "").trim();

  const envPreview = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    KD_BASE_URL: process.env.KD_BASE_URL ?? "https://api.kingdee.com",
    KD_GW_ROUTER_ADDR: process.env.KD_GW_ROUTER_ADDR ?? "https://tf.jdy.com",
    KD_CLIENT_ID: maskSecret(process.env.KD_CLIENT_ID ?? "", 2),
    KD_CLIENT_SECRET: maskSecret(process.env.KD_CLIENT_SECRET ?? "", 2),
    KD_APP_KEY: maskSecret(process.env.KD_APP_KEY ?? "", 2),
    KD_APP_SECRET: maskSecret(process.env.KD_APP_SECRET ?? "", 2),
    KD_MOCK_MODE: process.env.KD_MOCK_MODE ?? "true",
    KD_LIVE_CHECK_WRITEBACK_PROBE: writebackProbeEnabled,
    KD_LIVE_CHECK_PROBE_ORDER_ID: writebackProbeOrderId || null
  };

  steps.push({
    name: "env-preview",
    status: "pass",
    durationMs: 0,
    message: "环境变量预览（已脱敏）",
    details: envPreview
  });

  if (missing.length > 0) {
    steps.push({
      name: "credential-check",
      status: "fail",
      durationMs: 0,
      message: `缺少必要配置: ${missing.join(", ")}`,
      hint: "请在 .env 中补齐金蝶凭据后重试"
    });

    printReport(steps);
    process.exitCode = 1;
    return;
  }

  await runStep(steps, "db-connect", async () => {
    await connectCorePrisma();
    return {
      ok: true,
      message: "Core SQLite 连接成功"
    };
  });

  await runStep(steps, "token-refresh", async () => {
    const token = await kingdeeTokenProvider.refreshToken();
    return {
      ok: true,
      message: "app-token 刷新成功",
      details: {
        appToken: maskSecret(token)
      }
    };
  });

  const tokenStep = steps.find((item) => item.name === "token-refresh");
  if (tokenStep?.status !== "pass") {
    steps.push({
      name: "customer-list",
      status: "skip",
      durationMs: 0,
      message: "已跳过：token-refresh 失败"
    });
    steps.push({
      name: "sales-outbound-list",
      status: "skip",
      durationMs: 0,
      message: "已跳过：token-refresh 失败"
    });
    steps.push({
      name: "receipt-list",
      status: "skip",
      durationMs: 0,
      message: "已跳过：token-refresh 失败"
    });

    printReport(steps);
    process.exitCode = 1;
    return;
  }

  const customerStep = await runStep(steps, "customer-list", async () => {
    const result = await coreService.getCustomerList({
      page: "1",
      page_size: "1"
    });

    assertBusinessSuccess(result.data, "客户列表");
    const row = extractFirstRow(result.data);

    return {
      ok: true,
      message: "客户列表调用成功",
      details: {
        endpoint: result.endpoint,
        sample: row ?? null
      }
    };
  });

  let salesRow: Record<string, unknown> | null = null;
  const salesListStep = await runStep(steps, "sales-outbound-list", async () => {
    const result = await coreService.getSalesOutboundList({
      page: "1",
      page_size: "1"
    });

    assertBusinessSuccess(result.data, "销售出库单列表");
    salesRow = extractFirstRow(result.data);

    return {
      ok: true,
      message: "销售出库单列表调用成功",
      details: {
        endpoint: result.endpoint,
        sample: salesRow ?? null
      }
    };
  });

  if (salesListStep.status === "pass" && salesRow) {
    const detailQuery = buildDetailQuery(salesRow);
    if (detailQuery) {
      await runStep(steps, "sales-outbound-detail", async () => {
        const result = await coreService.getSalesOutboundDetail(detailQuery);
        assertBusinessSuccess(result.data, "销售出库单详情");
        return {
          ok: true,
          message: "销售出库单详情调用成功",
          details: {
            endpoint: result.endpoint
          }
        };
      });
    } else {
      steps.push({
        name: "sales-outbound-detail",
        status: "warn",
        durationMs: 0,
        message: "列表返回记录没有 id/number，跳过详情校验",
        hint: "可检查接口返回字段是否包含 id 或 number"
      });
    }
  }

  let receiptRow: Record<string, unknown> | null = null;
  const receiptListStep = await runStep(steps, "receipt-list", async () => {
    const result = await coreService.getReceiptList({
      page: "1",
      page_size: "1"
    });

    assertBusinessSuccess(result.data, "收款单列表");
    receiptRow = extractFirstRow(result.data);

    return {
      ok: true,
      message: "收款单列表调用成功",
      details: {
        endpoint: result.endpoint,
        sample: receiptRow ?? null
      }
    };
  });

  if (receiptListStep.status === "pass" && receiptRow) {
    const detailQuery = buildDetailQuery(receiptRow);
    if (detailQuery) {
      await runStep(steps, "receipt-detail", async () => {
        const result = await coreService.getReceiptDetail(detailQuery);
        assertBusinessSuccess(result.data, "收款单详情");

        return {
          ok: true,
          message: "收款单详情调用成功",
          details: {
            endpoint: result.endpoint
          }
        };
      });
    } else {
      steps.push({
        name: "receipt-detail",
        status: "warn",
        durationMs: 0,
        message: "列表返回记录没有 id/number，跳过详情校验",
        hint: "可检查接口返回字段是否包含 id 或 number"
      });
    }
  }

  if (!writebackProbeEnabled) {
    steps.push({
      name: "writeback-probe",
      status: "skip",
      durationMs: 0,
      message: "已跳过：未开启写回探测（KD_LIVE_CHECK_WRITEBACK_PROBE=false）"
    });
  } else if (!writebackProbeOrderId) {
    steps.push({
      name: "writeback-probe",
      status: "fail",
      durationMs: 0,
      message: "写回探测已开启，但缺少 KD_LIVE_CHECK_PROBE_ORDER_ID",
      hint: "请提供一个状态为 CREATED 或 WRITEBACK_FAILED 的订单 ID"
    });
  } else {
    await runStep(steps, "writeback-probe", async () => {
      const result = await coreService.retryOrderWriteback(writebackProbeOrderId);
      return {
        ok: true,
        message: "订单写回探测成功",
        details: {
          orderId: writebackProbeOrderId,
          beforeStatus: result.beforeStatus,
          afterStatus: result.afterStatus,
          writeback: result.writeback
        }
      };
    });
  }

  printReport(steps);
  process.exitCode = steps.some((step) => step.status === "fail") ? 1 : 0;
}

async function runStep(
  steps: StepResult[],
  name: string,
  fn: () => Promise<{ ok: true; message: string; details?: unknown }>
): Promise<StepResult> {
  const startedAt = Date.now();
  try {
    const result = await fn();
    const step: StepResult = {
      name,
      status: "pass",
      durationMs: Date.now() - startedAt,
      message: result.message,
      details: result.details
    };
    steps.push(step);
    return step;
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    const step: StepResult = {
      name,
      status: "fail",
      durationMs: Date.now() - startedAt,
      message,
      hint: classifyFailureHint(message),
      details: safeErrorDetails(error)
    };
    steps.push(step);
    return step;
  }
}

function classifyFailureHint(message: string): string {
  const text = message.toLowerCase();
  if (message.includes("KD_CONFIG_MISSING") || message.includes("缺少必要配置")) {
    return "检查 .env 中 KD_CLIENT_ID/KD_CLIENT_SECRET/KD_APP_KEY/KD_APP_SECRET";
  }
  if (text.includes("signature") || message.includes("签名")) {
    return "重点检查签名串拼接规则、参数双重编码、末尾换行";
  }
  if (text.includes("app_id is empty") || text.includes("appid")) {
    return "优先检查 KD_CLIENT_ID 是否为正确应用ID，且该应用已在金蝶后台完成授权绑定";
  }
  if (text.includes("http 519")) {
    return "网关拒绝请求，通常是应用ID/授权关系/签名信息异常，建议先校验 clientId/appKey 绑定关系";
  }
  if (text.includes("timestamp") || message.includes("时间戳")) {
    return "检查服务器时钟，确保毫秒时间戳偏差在可接受范围";
  }
  if (text.includes("router") || message.includes("domain")) {
    return "检查 KD_GW_ROUTER_ADDR 是否与授权返回的 domain 一致";
  }
  if (text.includes("network") || text.includes("econn") || text.includes("timeout")) {
    return "检查网络连通性、DNS 和防火墙设置";
  }
  if (text.includes("401") || message.includes("鉴权")) {
    return "检查 app-token 是否可刷新、clientSecret/appKey/appSecret 是否正确";
  }
  return "查看 steps.details 获取更多上下文，再按错误码定位";
}

function safeErrorDetails(error: unknown): unknown {
  if (!(error instanceof Error)) {
    return null;
  }

  const appErrorLike = error as Error & { code?: unknown; details?: unknown };

  return {
    name: error.name,
    message: error.message,
    code: typeof appErrorLike.code === "string" ? appErrorLike.code : undefined,
    details: appErrorLike.details ?? undefined
  };
}

function assertBusinessSuccess(payload: unknown, label: string): void {
  if (!isRecord(payload)) {
    return;
  }

  const errcode = Number(payload.errcode);
  if (Number.isFinite(errcode) && errcode !== 0) {
    const description =
      typeof payload.description === "string" && payload.description.trim()
        ? payload.description.trim()
        : "未知业务错误";
    throw new Error(`${label} 业务失败: errcode=${errcode}, description=${description}`);
  }
}

function extractFirstRow(payload: unknown): Record<string, unknown> | null {
  const rows = extractRows(payload);
  if (rows.length === 0) {
    return null;
  }

  return isRecord(rows[0]) ? rows[0] : null;
}

function extractRows(payload: unknown): unknown[] {
  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.rows)) {
    return payload.rows;
  }

  if (!isRecord(payload.data)) {
    return [];
  }

  if (Array.isArray(payload.data.rows)) {
    return payload.data.rows;
  }
  if (Array.isArray(payload.data.list)) {
    return payload.data.list;
  }
  if (Array.isArray(payload.data.items)) {
    return payload.data.items;
  }

  return [];
}

function buildDetailQuery(row: Record<string, unknown>): Record<string, string> | null {
  const id = pickString(row, ["id", "bill_id", "doc_id"]);
  const number = pickString(row, ["number", "bill_no", "doc_no"]);
  if (!id && !number) {
    return null;
  }

  return {
    ...(id ? { id } : {}),
    ...(number ? { number } : {})
  };
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

function printReport(steps: StepResult[]): void {
  const ok = !steps.some((step) => step.status === "fail");
  const report = {
    ok,
    checkedAt: new Date().toISOString(),
    steps
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: error instanceof Error ? error.message : "kd live check failed"
        },
        null,
        2
      )
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await corePrisma.$disconnect();
  });
