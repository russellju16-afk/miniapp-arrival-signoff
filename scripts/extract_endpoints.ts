import path from "node:path";

import {
  extractEndpointIndex,
  resolveKingdeeDocPath,
  writeEndpointIndexFile
} from "../src/lib/kingdee-doc-parser";

function main(): void {
  const sourcePath = resolveKingdeeDocPath();
  const outputPath = path.resolve(process.cwd(), "kingdee_endpoints.json");

  const endpointIndex = extractEndpointIndex(sourcePath);
  writeEndpointIndexFile(outputPath, endpointIndex);

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        ok: true,
        sourcePath,
        outputPath,
        total: endpointIndex.total
      },
      null,
      2
    )
  );
}

main();
