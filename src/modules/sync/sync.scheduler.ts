import cron, { ScheduledTask } from "node-cron";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { syncRepo } from "./sync.repo";
import { syncService } from "./sync.service";

const schedulerLogger = logger.child({ scope: "sync-scheduler" });

const runningJobSet = new Set<string>();
const tasks: ScheduledTask[] = [];

export function startSyncScheduler(): void {
  if (!env.SYNC_SCHEDULER_ENABLED) {
    schedulerLogger.info("Sync scheduler is disabled by env");
    return;
  }

  const dailyTask = cron.schedule(env.SYNC_MASTER_DAILY_CRON, async () => {
    await dispatchForAllTenants("master_data_full");
  });

  const hourlyTask = cron.schedule(env.SYNC_DOCUMENT_HOURLY_CRON, async () => {
    await dispatchForAllTenants("documents_incremental");
  });

  tasks.push(dailyTask, hourlyTask);

  schedulerLogger.info(
    {
      dailyCron: env.SYNC_MASTER_DAILY_CRON,
      hourlyCron: env.SYNC_DOCUMENT_HOURLY_CRON
    },
    "Sync scheduler started"
  );
}

export function stopSyncScheduler(): void {
  for (const task of tasks) {
    task.stop();
    task.destroy();
  }

  tasks.length = 0;
  schedulerLogger.info("Sync scheduler stopped");
}

async function dispatchForAllTenants(jobName: "master_data_full" | "documents_incremental"): Promise<void> {
  const tenantIds = await syncRepo.listTenantIds();

  if (tenantIds.length === 0) {
    schedulerLogger.info({ jobName }, "Skip scheduled sync because no tenant configured");
    return;
  }

  for (const tenantId of tenantIds) {
    const lockKey = `${tenantId}:${jobName}`;
    if (runningJobSet.has(lockKey)) {
      schedulerLogger.warn({ tenantId, jobName }, "Skip scheduled sync because previous run still in progress");
      continue;
    }

    runningJobSet.add(lockKey);

    syncService
      .runJob({
        tenantId,
        jobName
      })
      .then((result) => {
        schedulerLogger.info(
          {
            tenantId,
            jobName,
            pulled: result.totalPulled,
            inserted: result.totalInserted,
            skipped: result.totalSkipped
          },
          "Scheduled sync finished"
        );
      })
      .catch((error) => {
        schedulerLogger.error(
          {
            tenantId,
            jobName,
            err: error
          },
          "Scheduled sync failed"
        );
      })
      .finally(() => {
        runningJobSet.delete(lockKey);
      });
  }
}
