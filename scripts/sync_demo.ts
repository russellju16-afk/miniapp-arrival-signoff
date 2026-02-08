import "dotenv/config";

import { connectCorePrisma, corePrisma } from "../src/db/core-prisma";
import { runSyncSalesJob } from "../src/jobs/sync_sales";

async function main(): Promise<void> {
  await connectCorePrisma();
  const result = await runSyncSalesJob();
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ok: true, data: result }, null, 2));
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: error instanceof Error ? error.message : "sync demo failed"
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
