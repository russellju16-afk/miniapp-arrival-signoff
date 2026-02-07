import { timingSafeEqual } from "node:crypto";

import { FastifyRequest } from "fastify";

import { env } from "../../config/env";
import { AppError } from "./app-error";

export function ensureAdminAuthorization(request: FastifyRequest): void {
  const token = parseBearerToken(request.headers.authorization);

  if (!token || !isTokenMatched(token, env.ADMIN_TOKEN)) {
    throw new AppError(401, "ADMIN_UNAUTHORIZED", "管理员鉴权失败");
  }
}

function parseBearerToken(header: string | undefined): string | null {
  if (!header) {
    return null;
  }

  const parts = header.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1] || null;
}

function isTokenMatched(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}
