import cron, { ScheduledTask } from "node-cron";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { coreService } from "./core.service";

const schedulerLogger = logger.child({ scope: "core-scheduler" });

let inventoryTask: ScheduledTask | null = null;
let inventoryRunning = false;

export function startCoreScheduler(): void {
  if (!env.CORE_INVENTORY_SNAPSHOT_ENABLED) {
    schedulerLogger.info("Core inventory snapshot scheduler disabled by env");
    return;
  }

  if (inventoryTask) {
    return;
  }

  inventoryTask = cron.schedule(env.CORE_INVENTORY_SNAPSHOT_CRON, async () => {
    if (inventoryRunning) {
      schedulerLogger.warn("Skip inventory snapshot because previous run is still in progress");
      return;
    }

    inventoryRunning = true;
    try {
      const result = await coreService.syncInventoryStockSnapshot();
      schedulerLogger.info(
        {
          touchedMaterials: result.touchedMaterials,
          touchedSkus: result.touchedSkus,
          excludedWarehouseCount: result.excludedWarehouseCount
        },
        "Core inventory snapshot finished"
      );
    } catch (error) {
      schedulerLogger.error({ err: error }, "Core inventory snapshot failed");
    } finally {
      inventoryRunning = false;
    }
  });

  schedulerLogger.info(
    {
      cron: env.CORE_INVENTORY_SNAPSHOT_CRON
    },
    "Core scheduler started"
  );
}

export function stopCoreScheduler(): void {
  if (!inventoryTask) {
    return;
  }

  inventoryTask.stop();
  inventoryTask.destroy();
  inventoryTask = null;
  schedulerLogger.info("Core scheduler stopped");
}
