import { prisma } from "../../db/prisma";

export interface KingdeeTenantUpsertInput {
  name?: string | null;
  clientId: string;
  clientSecret: string;
  appKey: string;
  appSecret: string;
  domain: string;
  appToken?: string | null;
  tokenExpiresAt?: Date | null;
}

class KingdeeTenantRepo {
  async findById(id: string) {
    const db = prisma as any;
    return db.kingdeeTenant.findUnique({
      where: {
        id
      }
    });
  }

  async findByAppKey(appKey: string) {
    const db = prisma as any;
    return db.kingdeeTenant.findUnique({
      where: {
        appKey
      }
    });
  }

  async updateTokenById(id: string, appToken: string, tokenExpiresAt: Date) {
    const db = prisma as any;
    return db.kingdeeTenant.update({
      where: {
        id
      },
      data: {
        appToken,
        tokenExpiresAt
      }
    });
  }

  async upsertByAppKey(input: KingdeeTenantUpsertInput) {
    const db = prisma as any;
    const createPayload = {
      name: input.name ?? null,
      clientId: input.clientId,
      clientSecret: input.clientSecret,
      appKey: input.appKey,
      appSecret: input.appSecret,
      domain: input.domain,
      appToken: input.appToken ?? null,
      tokenExpiresAt: input.tokenExpiresAt ?? null
    };

    const updatePayload = {
      name: input.name ?? null,
      clientId: input.clientId,
      clientSecret: input.clientSecret,
      appSecret: input.appSecret,
      domain: input.domain,
      appToken: input.appToken ?? null,
      tokenExpiresAt: input.tokenExpiresAt ?? null
    };

    return db.kingdeeTenant.upsert({
      where: {
        appKey: input.appKey
      },
      update: updatePayload,
      create: createPayload
    });
  }

  async listAll() {
    const db = prisma as any;
    return db.kingdeeTenant.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}

export const kingdeeTenantRepo = new KingdeeTenantRepo();
