import { logger } from "../config/logger";
import { coreService } from "../modules/core/core.service";

const jobLogger = logger.child({ scope: "job-sync-sales" });

export async function runSyncSalesJob(input: { fromTime?: number; toTime?: number } = {}): Promise<{
  deliveries: Awaited<ReturnType<typeof coreService.syncDeliveries>>;
  receipts: Awaited<ReturnType<typeof coreService.syncReceipts>>;
}> {
  const deliveries = await coreService.syncDeliveries(input);
  const receipts = await coreService.syncReceipts(input);

  jobLogger.info(
    {
      deliveries,
      receipts
    },
    "sync_sales 作业执行完成"
  );

  return {
    deliveries,
    receipts
  };
}
