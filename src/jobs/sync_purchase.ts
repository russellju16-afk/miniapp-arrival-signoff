import { logger } from "../config/logger";
import { coreService } from "../modules/core/core.service";

const jobLogger = logger.child({ scope: "job-sync-purchase" });

export async function runSyncPurchaseJob(): Promise<Awaited<ReturnType<typeof coreService.runSyncDemo>>> {
  const result = await coreService.runSyncDemo();

  jobLogger.info(
    {
      result
    },
    "sync_purchase 作业执行完成（当前使用 demo 同步逻辑，后续可扩展为采购链路）"
  );

  return result;
}
