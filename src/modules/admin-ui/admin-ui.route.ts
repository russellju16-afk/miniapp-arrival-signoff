import { promises as fs } from "node:fs";
import path from "node:path";

import { FastifyInstance } from "fastify";

const ADMIN_UI_ROOTS = [
  path.resolve(__dirname, "pages", "admin"),
  path.resolve(process.cwd(), "build", "modules", "admin-ui", "pages", "admin"),
  path.resolve(process.cwd(), "src", "modules", "admin-ui", "pages", "admin")
];

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function safeResolveAdminFile(rootPath: string, relativePath: string): string | null {
  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.resolve(rootPath, normalized);
  if (!fullPath.startsWith(rootPath)) {
    return null;
  }
  return fullPath;
}

async function findAdminFile(relativePath: string): Promise<string | null> {
  for (const rootPath of ADMIN_UI_ROOTS) {
    const filePath = safeResolveAdminFile(rootPath, relativePath);
    if (!filePath) {
      continue;
    }
    try {
      const stat = await fs.stat(filePath);
      if (stat.isFile()) {
        return filePath;
      }
    } catch {
      // continue to next root
    }
  }
  return null;
}

async function sendFile(app: FastifyInstance, requestPath: string) {
  const filePath = await findAdminFile(requestPath);
  if (!filePath) {
    return {
      statusCode: 404,
      body: "not found"
    };
  }

  const file = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream";
  app.log.debug({ filePath, contentType }, "Serve admin ui asset");
  return {
    statusCode: 200,
    contentType,
    body: file
  };
}

export async function adminUiRoutes(app: FastifyInstance): Promise<void> {
  app.get("/admin", async (_request, reply) => {
    const result = await sendFile(app, "index.html");
    reply.status(result.statusCode);
    reply.header("cache-control", "no-store");
    if (result.contentType) {
      reply.type(result.contentType);
    }
    return result.body;
  });

  app.get("/admin/", async (_request, reply) => {
    const result = await sendFile(app, "index.html");
    reply.status(result.statusCode);
    reply.header("cache-control", "no-store");
    if (result.contentType) {
      reply.type(result.contentType);
    }
    return result.body;
  });

  app.get("/admin/index.html", async (_request, reply) => {
    const result = await sendFile(app, "index.html");
    reply.status(result.statusCode);
    reply.header("cache-control", "no-store");
    if (result.contentType) {
      reply.type(result.contentType);
    }
    return result.body;
  });

  app.get<{ Params: { "*": string } }>("/admin/assets/*", async (request, reply) => {
    const requestedPath = request.params["*"] || "";
    const result = await sendFile(app, requestedPath);
    reply.status(result.statusCode);
    reply.header("cache-control", "no-store");
    if (result.contentType) {
      reply.type(result.contentType);
    }
    return result.body;
  });
}
