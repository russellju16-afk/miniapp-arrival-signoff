import { randomUUID } from "node:crypto";

import Fastify from "fastify";
import { ZodError } from "zod";

import { env } from "./config/env";
import { logger } from "./config/logger";
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
  // core 主线：统一 /api/*
  app.register(coreRoutes, { prefix: "/api" });
  // legacy 兼容：/mini/* 内部转发到 core service
  app.register(coreMiniCompatRoutes);
  app.register(kingdeeTenantRoutes);
  app.register(syncRoutes);
  app.register(wechatRoutes, { prefix: "/api" });

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
