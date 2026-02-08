import "dotenv/config";

import { connectCorePrisma, corePrisma } from "../src/db/core-prisma";
import { coreService } from "../src/modules/core/core.service";

async function main(): Promise<void> {
  await connectCorePrisma();
  const result = await coreService.pingKingdee();
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ok: true, ...result }, null, 2));
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: error instanceof Error ? error.message : "kd:ping failed"
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
