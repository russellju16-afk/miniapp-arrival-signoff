import { Prisma } from "@prisma/client";

export interface MiniCustomerProfile {
  id: string;
  tenantId: string;
  name: string;
  phone: string | null;
  kingdeeCustomerId: string | null;
  accessToken: string;
  tokenExpiresAt: Date | null;
}

export interface MiniDeliveryItem {
  id: string;
  tenantId: string;
  customerId: string;
  kingdeeDocNo: string;
  kingdeeDocId: string | null;
  shipDate: Date | null;
  items: Prisma.JsonValue | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MiniReceiptItem {
  id: string;
  deliveryId: string;
  customerId: string;
  signerName: string;
  signedAt: Date;
  signatureImageUrl: string;
  photos: Prisma.JsonValue | null;
  remark: string | null;
  createdAt: Date;
}

export interface MiniStatementItem {
  id: string;
  tenantId: string;
  customerId: string;
  periodStart: Date;
  periodEnd: Date;
  totalAmount: Prisma.Decimal;
  currency: string;
  status: string;
  confirmedAt: Date | null;
  confirmRemark: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MiniStatementLineItem {
  id: string;
  statementId: string;
  docType: string;
  docNo: string;
  docDate: Date | null;
  amount: Prisma.Decimal;
  raw: Prisma.JsonValue | null;
  createdAt: Date;
}

export interface SignDeliveryInput {
  deliveryId: string;
  signerName: string;
  signedAt?: string;
  signatureBase64: string;
  photosBase64?: string[];
  remark?: string;
}

export interface ConfirmStatementInput {
  statementId: string;
  confirmedAt?: string;
  remark?: string;
}
