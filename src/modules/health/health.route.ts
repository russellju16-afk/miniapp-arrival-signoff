import { FastifyInstance } from "fastify";

import { env } from "../../config/env";

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => {
    return {
      ok: true,
      time: new Date().toISOString(),
      env: env.NODE_ENV
    };
  });
}
