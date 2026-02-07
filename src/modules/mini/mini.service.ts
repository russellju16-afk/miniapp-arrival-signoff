import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { Prisma } from "@prisma/client";
import QRCode from "qrcode";

import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { AppError } from "../common/app-error";
import { miniRepo } from "./mini.repo";
import {
  ConfirmStatementInput,
  MiniCustomerProfile,
  MiniDeliveryItem,
  MiniReceiptItem,
  MiniStatementLineItem,
  MiniStatementItem,
  SignDeliveryInput
} from "./mini.types";

interface SignDeliveryResult {
  delivery: Record<string, unknown>;
  receipt: Record<string, unknown>;
}

const miniLogger = logger.child({ scope: "mini-service" });

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif"
};

class MiniService {
  async loginByToken(token: string): Promise<Record<string, unknown>> {
    const customer = await this.resolveActiveCustomer(token);
    return this.serializeCustomer(customer);
  }

  async authenticateByAuthorizationHeader(authorizationHeader: string | undefined): Promise<MiniCustomerProfile> {
    const token = this.parseBearerToken(authorizationHeader);
    if (!token) {
      throw new AppError(401, "MINI_UNAUTHORIZED", "缺少或无效的 Bearer Token");
    }

    return this.resolveActiveCustomer(token);
  }

  async listPendingDeliveries(customer: MiniCustomerProfile): Promise<Record<string, unknown>[]> {
    const deliveries = (await miniRepo.listPendingDeliveries(customer.id, customer.tenantId)) as MiniDeliveryItem[];

    return deliveries.map((item) => this.serializeDelivery(item));
  }

  async getDeliveryDetail(customer: MiniCustomerProfile, deliveryId: string): Promise<Record<string, unknown>> {
    const delivery = (await miniRepo.findDeliveryByIdForCustomer(
      deliveryId,
      customer.id,
      customer.tenantId
    )) as (MiniDeliveryItem & { receipt?: MiniReceiptItem | null }) | null;

    if (!delivery) {
      throw new AppError(404, "DELIVERY_NOT_FOUND", "未找到对应发货单");
    }

    return {
      ...this.serializeDelivery(delivery),
      receipt: delivery.receipt ? this.serializeReceipt(delivery.receipt) : null
    };
  }

  async signDelivery(customer: MiniCustomerProfile, input: SignDeliveryInput): Promise<SignDeliveryResult> {
    const delivery = (await miniRepo.findDeliveryByIdForCustomer(
      input.deliveryId,
      customer.id,
      customer.tenantId
    )) as (MiniDeliveryItem & { receipt?: MiniReceiptItem | null }) | null;

    if (!delivery) {
      throw new AppError(404, "DELIVERY_NOT_FOUND", "未找到对应发货单");
    }

    if (delivery.status === "SIGNED" && delivery.receipt) {
      return {
        delivery: {
          ...this.serializeDelivery(delivery),
          receipt: this.serializeReceipt(delivery.receipt)
        },
        receipt: this.serializeReceipt(delivery.receipt)
      };
    }

    const signedAt = this.parseDateTime(input.signedAt, "signedAt");

    const signatureImageUrl = await this.saveBase64Asset({
      base64Payload: input.signatureBase64,
      tenantId: customer.tenantId,
      customerId: customer.id,
      deliveryId: delivery.id,
      filenamePrefix: "signature"
    });

    const photosBase64 = input.photosBase64 ?? [];
    const photoUrls: string[] = [];
    for (const [index, photoBase64] of photosBase64.entries()) {
      const photoUrl = await this.saveBase64Asset({
        base64Payload: photoBase64,
        tenantId: customer.tenantId,
        customerId: customer.id,
        deliveryId: delivery.id,
        filenamePrefix: `photo-${index + 1}`
      });
      photoUrls.push(photoUrl);
    }

    const receipt = (await miniRepo.upsertReceiptAndMarkDeliverySigned({
      deliveryId: delivery.id,
      customerId: customer.id,
      signerName: input.signerName.trim(),
      signedAt,
      signatureImageUrl,
      photos: this.toInputJsonValue(photoUrls),
      remark: input.remark?.trim() ?? null
    })) as MiniReceiptItem;

    const updatedDelivery = (await miniRepo.findDeliveryByIdForCustomer(
      delivery.id,
      customer.id,
      customer.tenantId
    )) as (MiniDeliveryItem & { receipt?: MiniReceiptItem | null }) | null;

    if (!updatedDelivery) {
      throw new AppError(500, "DELIVERY_UPDATED_NOT_FOUND", "签收成功但回读发货单失败");
    }

    miniLogger.info(
      {
        customerId: customer.id,
        deliveryId: delivery.id,
        receiptId: receipt.id
      },
      "Mini delivery signed"
    );

    return {
      delivery: {
        ...this.serializeDelivery(updatedDelivery),
        receipt: updatedDelivery.receipt ? this.serializeReceipt(updatedDelivery.receipt) : null
      },
      receipt: this.serializeReceipt(receipt)
    };
  }

  async listStatements(
    customer: MiniCustomerProfile,
    from?: string,
    to?: string
  ): Promise<Record<string, unknown>[]> {
    const fromDate = from ? this.parseDateOnlyStart(from, "from") : undefined;
    const toDate = to ? this.parseDateOnlyEnd(to, "to") : undefined;

    const statements = (await miniRepo.listStatements({
      customerId: customer.id,
      tenantId: customer.tenantId,
      fromDate,
      toDate
    })) as MiniStatementItem[];

    return statements.map((item) => this.serializeStatement(item));
  }

  async getStatementDetail(customer: MiniCustomerProfile, statementId: string): Promise<Record<string, unknown>> {
    const statement = (await miniRepo.findStatementWithLines(
      statementId,
      customer.id,
      customer.tenantId
    )) as (MiniStatementItem & { lines: MiniStatementLineItem[] }) | null;

    if (!statement) {
      throw new AppError(404, "STATEMENT_NOT_FOUND", "未找到对应对账单");
    }

    return {
      ...this.serializeStatement(statement),
      lines: statement.lines.map((line) => this.serializeStatementLine(line))
    };
  }

  async confirmStatement(customer: MiniCustomerProfile, input: ConfirmStatementInput): Promise<Record<string, unknown>> {
    const confirmedAt = this.parseDateTime(input.confirmedAt, "confirmedAt");

    const updated = await miniRepo.confirmStatement(
      input.statementId,
      customer.id,
      customer.tenantId,
      confirmedAt,
      input.remark
    );

    if (!updated || updated.count === 0) {
      throw new AppError(404, "STATEMENT_NOT_FOUND", "未找到对应对账单");
    }

    const detail = await this.getStatementDetail(customer, input.statementId);

    miniLogger.info(
      {
        customerId: customer.id,
        statementId: input.statementId,
        confirmedAt: confirmedAt.toISOString()
      },
      "Mini statement confirmed"
    );

    return detail;
  }

  async generateLoginQrcode(token: string): Promise<Record<string, string>> {
    const normalizedToken = token.trim();
    if (!normalizedToken) {
      throw new AppError(400, "TOKEN_REQUIRED", "token 不能为空");
    }

    try {
      const dataUrl = await QRCode.toDataURL(normalizedToken, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 320
      });

      return {
        token: normalizedToken,
        qrcodeDataUrl: dataUrl
      };
    } catch (error) {
      miniLogger.error({ err: error }, "Generate qrcode failed");
      throw new AppError(500, "QRCODE_GENERATE_FAILED", "生成二维码失败");
    }
  }

  private async resolveActiveCustomer(token: string): Promise<MiniCustomerProfile> {
    const normalizedToken = token.trim();
    if (!normalizedToken) {
      throw new AppError(401, "MINI_UNAUTHORIZED", "token 不能为空");
    }

    const customer = (await miniRepo.findCustomerByAccessToken(normalizedToken)) as MiniCustomerProfile | null;
    if (!customer) {
      throw new AppError(401, "MINI_UNAUTHORIZED", "token 无效");
    }

    if (customer.tokenExpiresAt && customer.tokenExpiresAt.getTime() <= Date.now()) {
      throw new AppError(401, "MINI_TOKEN_EXPIRED", "token 已过期");
    }

    return customer;
  }

  private parseBearerToken(header: string | undefined): string | null {
    if (!header) {
      return null;
    }

    const parts = header.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1] ?? null;
  }

  private parseDateTime(input: string | undefined, fieldName: string): Date {
    if (!input) {
      return new Date();
    }

    const date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      throw new AppError(400, "INVALID_DATETIME", `${fieldName} 必须是合法时间字符串`);
    }

    return date;
  }

  private parseDateOnlyStart(input: string, fieldName: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      throw new AppError(400, "INVALID_DATE", `${fieldName} 必须是 YYYY-MM-DD`);
    }

    return new Date(`${input}T00:00:00.000Z`);
  }

  private parseDateOnlyEnd(input: string, fieldName: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      throw new AppError(400, "INVALID_DATE", `${fieldName} 必须是 YYYY-MM-DD`);
    }

    return new Date(`${input}T23:59:59.999Z`);
  }

  private serializeCustomer(customer: MiniCustomerProfile): Record<string, unknown> {
    return {
      id: customer.id,
      tenant_id: customer.tenantId,
      name: customer.name,
      phone: customer.phone,
      kingdee_customer_id: customer.kingdeeCustomerId,
      token_expires_at: customer.tokenExpiresAt ? customer.tokenExpiresAt.toISOString() : null
    };
  }

  private serializeDelivery(delivery: MiniDeliveryItem): Record<string, unknown> {
    return {
      id: delivery.id,
      tenant_id: delivery.tenantId,
      customer_id: delivery.customerId,
      kingdee_doc_no: delivery.kingdeeDocNo,
      kingdee_doc_id: delivery.kingdeeDocId,
      ship_date: delivery.shipDate ? delivery.shipDate.toISOString() : null,
      items: delivery.items ?? null,
      status: delivery.status,
      created_at: delivery.createdAt.toISOString(),
      updated_at: delivery.updatedAt.toISOString()
    };
  }

  private serializeReceipt(receipt: MiniReceiptItem): Record<string, unknown> {
    return {
      id: receipt.id,
      delivery_id: receipt.deliveryId,
      customer_id: receipt.customerId,
      signer_name: receipt.signerName,
      signed_at: receipt.signedAt.toISOString(),
      signature_image_url: receipt.signatureImageUrl,
      photos: receipt.photos ?? [],
      remark: receipt.remark,
      created_at: receipt.createdAt.toISOString()
    };
  }

  private serializeStatement(statement: MiniStatementItem): Record<string, unknown> {
    return {
      id: statement.id,
      tenant_id: statement.tenantId,
      customer_id: statement.customerId,
      period_start: statement.periodStart.toISOString(),
      period_end: statement.periodEnd.toISOString(),
      total_amount: statement.totalAmount.toString(),
      currency: statement.currency,
      status: statement.status,
      confirmed_at: statement.confirmedAt ? statement.confirmedAt.toISOString() : null,
      confirm_remark: statement.confirmRemark,
      created_at: statement.createdAt.toISOString(),
      updated_at: statement.updatedAt.toISOString()
    };
  }

  private serializeStatementLine(line: MiniStatementLineItem): Record<string, unknown> {
    return {
      id: line.id,
      statement_id: line.statementId,
      doc_type: line.docType,
      doc_no: line.docNo,
      doc_date: line.docDate ? line.docDate.toISOString() : null,
      amount: line.amount.toString(),
      raw: line.raw ?? null,
      created_at: line.createdAt.toISOString()
    };
  }

  private async saveBase64Asset(input: {
    base64Payload: string;
    tenantId: string;
    customerId: string;
    deliveryId: string;
    filenamePrefix: string;
  }): Promise<string> {
    const { buffer, extension } = this.decodeBase64Payload(input.base64Payload);

    const relativeDir = path.join(
      "uploads",
      input.tenantId,
      input.customerId,
      input.deliveryId
    );

    const absoluteDir = path.resolve(process.cwd(), env.UPLOAD_DIR, input.tenantId, input.customerId, input.deliveryId);
    await fs.mkdir(absoluteDir, { recursive: true });

    const filename = `${input.filenamePrefix}-${Date.now()}-${randomUUID()}.${extension}`;
    const absoluteFilePath = path.join(absoluteDir, filename);
    await fs.writeFile(absoluteFilePath, buffer);

    const relativePath = `/${path.posix.join(relativeDir.split(path.sep).join(path.posix.sep), filename)}`;

    return `${env.UPLOAD_PUBLIC_BASE_URL.replace(/\/$/, "")}${relativePath}`;
  }

  private decodeBase64Payload(raw: string): { buffer: Buffer; extension: string } {
    const payload = raw.trim();
    if (!payload) {
      throw new AppError(400, "INVALID_BASE64", "图片 base64 不能为空");
    }

    const dataUrlMatch = payload.match(/^data:([^;]+);base64,(.+)$/i);

    let mimeType: string | null = null;
    let base64Content = payload;

    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1].toLowerCase();
      base64Content = dataUrlMatch[2];
    }

    const normalized = base64Content.replace(/\s+/g, "");

    let buffer: Buffer;
    try {
      buffer = Buffer.from(normalized, "base64");
    } catch {
      throw new AppError(400, "INVALID_BASE64", "图片 base64 格式非法");
    }

    if (!buffer.length) {
      throw new AppError(400, "INVALID_BASE64", "图片 base64 不能为空");
    }

    const extension = this.detectExtension(mimeType, buffer);

    return {
      buffer,
      extension
    };
  }

  private detectExtension(mimeType: string | null, buffer: Buffer): string {
    if (mimeType && MIME_EXTENSION_MAP[mimeType]) {
      return MIME_EXTENSION_MAP[mimeType];
    }

    if (buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return "png";
    }

    if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return "jpg";
    }

    return "bin";
  }

  private toInputJsonValue(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}

export const miniService = new MiniService();
