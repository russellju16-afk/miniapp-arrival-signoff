import { Prisma } from "@prisma/client";

import { prisma } from "../../db/prisma";

export interface UpsertReceiptAndMarkSignedInput {
  deliveryId: string;
  customerId: string;
  signerName: string;
  signedAt: Date;
  signatureImageUrl: string;
  photos: Prisma.InputJsonValue | null;
  remark?: string | null;
}

export interface ListStatementsFilter {
  customerId: string;
  tenantId: string;
  fromDate?: Date;
  toDate?: Date;
}

class MiniRepo {
  async findCustomerByAccessToken(accessToken: string) {
    const db = prisma as any;

    return db.customer.findUnique({
      where: {
        accessToken
      }
    });
  }

  async listPendingDeliveries(customerId: string, tenantId: string) {
    const db = prisma as any;

    return db.delivery.findMany({
      where: {
        customerId,
        tenantId,
        status: {
          not: "SIGNED"
        }
      },
      orderBy: [{ shipDate: "desc" }, { createdAt: "desc" }]
    });
  }

  async findDeliveryByIdForCustomer(deliveryId: string, customerId: string, tenantId: string) {
    const db = prisma as any;

    return db.delivery.findFirst({
      where: {
        id: deliveryId,
        customerId,
        tenantId
      },
      include: {
        receipt: true
      }
    });
  }

  async findReceiptByDeliveryId(deliveryId: string) {
    const db = prisma as any;

    return db.receipt.findUnique({
      where: {
        deliveryId
      }
    });
  }

  async upsertReceiptAndMarkDeliverySigned(input: UpsertReceiptAndMarkSignedInput) {
    const db = prisma as any;

    return db.$transaction(async (tx: any) => {
      const receipt = await tx.receipt.upsert({
        where: {
          deliveryId: input.deliveryId
        },
        update: {
          customerId: input.customerId,
          signerName: input.signerName,
          signedAt: input.signedAt,
          signatureImageUrl: input.signatureImageUrl,
          photos: input.photos,
          remark: input.remark ?? null
        },
        create: {
          deliveryId: input.deliveryId,
          customerId: input.customerId,
          signerName: input.signerName,
          signedAt: input.signedAt,
          signatureImageUrl: input.signatureImageUrl,
          photos: input.photos,
          remark: input.remark ?? null
        }
      });

      await tx.delivery.update({
        where: {
          id: input.deliveryId
        },
        data: {
          status: "SIGNED"
        }
      });

      return receipt;
    });
  }

  async listStatements(filter: ListStatementsFilter) {
    const db = prisma as any;

    const where: Record<string, unknown> = {
      customerId: filter.customerId,
      tenantId: filter.tenantId
    };

    if (filter.fromDate) {
      where.periodStart = {
        gte: filter.fromDate
      };
    }

    if (filter.toDate) {
      where.periodEnd = {
        lte: filter.toDate
      };
    }

    return db.statement.findMany({
      where,
      orderBy: [{ periodStart: "desc" }, { createdAt: "desc" }]
    });
  }

  async findStatementWithLines(statementId: string, customerId: string, tenantId: string) {
    const db = prisma as any;

    return db.statement.findFirst({
      where: {
        id: statementId,
        customerId,
        tenantId
      },
      include: {
        lines: {
          orderBy: [{ docDate: "desc" }, { createdAt: "desc" }]
        }
      }
    });
  }

  async confirmStatement(statementId: string, customerId: string, tenantId: string, confirmedAt: Date, remark?: string) {
    const db = prisma as any;

    return db.statement.updateMany({
      where: {
        id: statementId,
        customerId,
        tenantId
      },
      data: {
        status: "CONFIRMED",
        confirmedAt,
        confirmRemark: remark ?? null
      }
    });
  }
}

export const miniRepo = new MiniRepo();
