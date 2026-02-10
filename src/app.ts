import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import Fastify from "fastify";
import { ZodError } from "zod";

import { env } from "./config/env";
import { logger } from "./config/logger";
import { adminUiRoutes } from "./modules/admin-ui/admin-ui.route";
import { AppError } from "./modules/common/app-error";
import { coreMiniCompatRoutes } from "./modules/core/core-mini-compat.route";
import { coreRoutes } from "./modules/core/core.route";
import { healthRoutes } from "./modules/health/health.route";
import { kingdeeTenantRoutes } from "./modules/kingdee-tenant/kingdee-tenant.route";
import { syncRoutes } from "./modules/sync";
import { wechatRoutes } from "./modules/wechat/wechat.route";

export function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
    bodyLimit: 6 * 1024 * 1024,
    requestIdHeader: "x-request-id",
    requestIdLogLabel: "requestId",
    genReqId: (req) => {
      const incoming = req.headers["x-request-id"];
      if (typeof incoming === "string" && incoming.trim().length > 0) {
        return incoming;
      }
      return randomUUID();
    }
  });

  app.addHook("onRequest", async (request, reply) => {
    reply.header("x-request-id", request.id);
  });

  app.addHook("onSend", async (request, reply, payload) => {
    if (request.url.startsWith("/mini/")) {
      // legacy 小程序路由保留兼容，主线已迁移到 /api/mini/*
      reply.header("Deprecation", "true");
      reply.header("Sunset", "Mon, 30 Jun 2026 00:00:00 GMT");
      reply.header("Link", '</api/mini/login>; rel="successor-version"');
    }
    if (request.url.startsWith("/admin/sync/")) {
      // legacy 同步管理路由保留兼容，主线已迁移到 /api/admin/sync/*
      reply.header("Deprecation", "true");
      reply.header("Sunset", "Mon, 30 Jun 2026 00:00:00 GMT");
      reply.header("Link", '</api/admin/sync/run>; rel="successor-version"');
    }
    return payload;
  });

  app.register(healthRoutes);
  app.register(adminUiRoutes);
  // core 主线：统一 /api/*
  app.register(coreRoutes, { prefix: "/api" });
  // legacy 兼容：/mini/* 内部转发到 core service
  app.register(coreMiniCompatRoutes);
  app.register(kingdeeTenantRoutes);
  app.register(syncRoutes);
  app.register(wechatRoutes, { prefix: "/api" });

  app.get<{ Params: { "*": string } }>("/uploads/*", async (request, reply) => {
    const rawPath = String(request.params["*"] || "");
    if (!rawPath.trim() || rawPath.includes("\0")) {
      return reply.status(400).send({
        ok: false,
        code: "INVALID_UPLOAD_PATH",
        message: "文件路径无效",
        requestId: request.id
      });
    }

    const normalizedPath = rawPath.replace(/\\/g, "/").replace(/^\/+/, "");
    if (normalizedPath.includes("..")) {
      return reply.status(400).send({
        ok: false,
        code: "INVALID_UPLOAD_PATH",
        message: "文件路径无效",
        requestId: request.id
      });
    }

    const uploadsBaseDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    const targetPath = path.resolve(uploadsBaseDir, normalizedPath);
    const pathPrefix = `${uploadsBaseDir}${path.sep}`;
    if (targetPath !== uploadsBaseDir && !targetPath.startsWith(pathPrefix)) {
      return reply.status(403).send({
        ok: false,
        code: "UPLOAD_PATH_FORBIDDEN",
        message: "无权限访问该文件",
        requestId: request.id
      });
    }

    let content: Buffer;
    try {
      const stat = await fs.stat(targetPath);
      if (!stat.isFile()) {
        throw new Error("not-file");
      }
      content = await fs.readFile(targetPath);
    } catch {
      return reply.status(404).send({
        ok: false,
        code: "UPLOAD_NOT_FOUND",
        message: "文件不存在",
        requestId: request.id
      });
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml"
    };
    const contentType = contentTypeMap[ext] || "application/octet-stream";
    reply.type(contentType);
    reply.header("cache-control", "public, max-age=300");
    return content;
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      request.log.warn({ err: error, code: error.code }, "Handled business error");
      reply.status(error.statusCode).send({
        ok: false,
        code: error.code,
        message: error.message,
        requestId: request.id,
        details: error.details ?? null
      });
      return;
    }

    if (error instanceof ZodError) {
      reply.status(400).send({
        ok: false,
        code: "INVALID_REQUEST",
        message: "请求参数校验失败",
        requestId: request.id,
        details: error.flatten()
      });
      return;
    }

    request.log.error({ err: error }, "Unhandled error");
    reply.status(500).send({
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "服务器内部错误",
      requestId: request.id
    });
  });

  app.get("/", async () => {
    return {
      ok: true,
      message: "Kingdee WeChat backend is running",
      env: env.NODE_ENV
    };
  });

  return app;
}
