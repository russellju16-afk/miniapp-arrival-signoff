import { Prisma } from "../../generated/core-prisma-client";
import { corePrisma } from "../../db/core-prisma";

export interface CreateCustomerInput {
  name: string;
  phone?: string | null;
  status?: string;
  companyName?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  kingdeeCustomerId?: string | null;
  wechatOpenid?: string | null;
  accessToken?: string | null;
  tokenExpiresAt?: Date | null;
}

export interface UpsertRawDocumentInput {
  docType: string;
  kingdeeId?: string | null;
  number?: string | null;
  payloadJson: string;
  hash: string;
  fetchedAt?: Date;
}

export interface DeliveryListOptions {
  page: number;
  pageSize: number;
  status?: string;
}

export interface DeliveryUpsertInput {
  customerId: string;
  salesOrderId?: string | null;
  kingdeeBillId?: string | null;
  kingdeeBillNumber?: string | null;
  sourceDocNo?: string | null;
  detailsJson?: string | null;
  syncedAt?: Date | null;
  status?: string;
}

export interface ReconciliationLineInput {
  docType: string;
  docNo?: string | null;
  docDate?: Date | null;
  amount?: number | null;
  rawJson: string;
}

export interface UpsertProductInput {
  id?: string;
  code: string;
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  status?: string;
  defaultUnitId?: string | null;
  kingdeeMaterialId?: string | null;
}

export interface UpsertProductSkuInput {
  id?: string;
  productId: string;
  skuCode: string;
  skuName: string;
  specsJson?: string | null;
  price: number;
  stock: number;
  status?: string;
  unitId?: string | null;
  kingdeeMaterialId?: string | null;
}

export interface OrderLineInput {
  productId: string;
  skuId: string;
  productName: string;
  skuName: string;
  skuCode: string;
  qty: number;
  unitPrice: number;
  lineAmount: number;
  rawJson?: string | null;
}

export interface DeliveryInfoInput {
  mode: "DELIVERY" | "PICKUP";
  addressId?: string | null;
  expectedDate?: string | null;
  timeSlot?: string | null;
  unloadingRequirement?: string | null;
  note?: string | null;
}

class CoreRepo {
  async getTokenByEnv(currentEnv: string) {
    return corePrisma.kingdeeToken.findUnique({
      where: {
        env: currentEnv
      }
    });
  }

  async upsertToken(currentEnv: string, appToken: string, expiresAt: Date) {
    return corePrisma.kingdeeToken.upsert({
      where: {
        env: currentEnv
      },
      update: {
        appToken,
        expiresAt
      },
      create: {
        env: currentEnv,
        appToken,
        expiresAt
      }
    });
  }

  async createCustomer(input: CreateCustomerInput) {
    return corePrisma.customer.create({
      data: {
        name: input.name,
        phone: input.phone ?? null,
        status: input.status ?? "ACTIVE",
        companyName: input.companyName ?? null,
        contactName: input.contactName ?? null,
        contactPhone: input.contactPhone ?? null,
        kingdeeCustomerId: input.kingdeeCustomerId ?? null,
        wechatOpenid: input.wechatOpenid ?? null,
        accessToken: input.accessToken ?? null,
        tokenExpiresAt: input.tokenExpiresAt ?? null
      }
    });
  }

  async updateCustomerName(id: string, name: string, phone?: string | null) {
    return corePrisma.customer.update({
      where: { id },
      data: {
        name,
        ...(typeof phone !== "undefined" ? { phone } : {})
      }
    });
  }

  async updateCustomerProfile(
    id: string,
    input: {
      name?: string;
      phone?: string | null;
      status?: string;
      companyName?: string | null;
      contactName?: string | null;
      contactPhone?: string | null;
      kingdeeCustomerId?: string | null;
      wechatOpenid?: string | null;
      accessToken?: string | null;
      tokenExpiresAt?: Date | null;
    }
  ) {
    return corePrisma.customer.update({
      where: { id },
      data: {
        ...(typeof input.name !== "undefined" ? { name: input.name } : {}),
        ...(typeof input.phone !== "undefined" ? { phone: input.phone } : {}),
        ...(typeof input.status !== "undefined" ? { status: input.status } : {}),
        ...(typeof input.companyName !== "undefined" ? { companyName: input.companyName } : {}),
        ...(typeof input.contactName !== "undefined" ? { contactName: input.contactName } : {}),
        ...(typeof input.contactPhone !== "undefined" ? { contactPhone: input.contactPhone } : {}),
        ...(typeof input.kingdeeCustomerId !== "undefined"
          ? { kingdeeCustomerId: input.kingdeeCustomerId }
          : {}),
        ...(typeof input.wechatOpenid !== "undefined" ? { wechatOpenid: input.wechatOpenid } : {}),
        ...(typeof input.accessToken !== "undefined" ? { accessToken: input.accessToken } : {}),
        ...(typeof input.tokenExpiresAt !== "undefined" ? { tokenExpiresAt: input.tokenExpiresAt } : {})
      }
    });
  }

  async findCustomerById(id: string) {
    return corePrisma.customer.findUnique({
      where: { id }
    });
  }

  async findCustomerByOpenid(openid: string) {
    return corePrisma.customer.findFirst({
      where: {
        wechatOpenid: openid
      }
    });
  }

  async findCustomerByKingdeeId(kingdeeCustomerId: string) {
    return corePrisma.customer.findFirst({
      where: {
        kingdeeCustomerId
      }
    });
  }

  async findCustomerByName(name: string) {
    return corePrisma.customer.findFirst({
      where: {
        name
      }
    });
  }

  async findCustomerByAccessToken(accessToken: string) {
    return corePrisma.customer.findFirst({
      where: {
        accessToken
      }
    });
  }

  async listCustomers() {
    return corePrisma.customer.findMany({
      include: {
        registrationApplications: {
          orderBy: [{ createdAt: "desc" }],
          take: 1
        }
      },
      orderBy: [{ updatedAt: "desc" }]
    });
  }

  async setCustomerAccessToken(id: string, accessToken: string, tokenExpiresAt: Date | null) {
    return corePrisma.customer.update({
      where: { id },
      data: {
        accessToken,
        tokenExpiresAt
      }
    });
  }

  async createCustomerRegistrationApplication(input: {
    customerId: string;
    payloadJson: string;
    status?: string;
  }) {
    return corePrisma.customerRegistrationApplication.create({
      data: {
        customerId: input.customerId,
        payloadJson: input.payloadJson,
        status: input.status ?? "PENDING"
      }
    });
  }

  async listCustomerRegistrationApplications(status?: string) {
    return corePrisma.customerRegistrationApplication.findMany({
      where: status
        ? {
            status
          }
        : undefined,
      include: {
        customer: true
      },
      orderBy: [{ createdAt: "desc" }]
    });
  }

  async findLatestRegistrationApplicationByCustomer(customerId: string) {
    return corePrisma.customerRegistrationApplication.findFirst({
      where: { customerId },
      orderBy: [{ createdAt: "desc" }]
    });
  }

  async findCustomerRegistrationApplicationById(id: string) {
    return corePrisma.customerRegistrationApplication.findUnique({
      where: { id },
      include: {
        customer: true
      }
    });
  }

  async reviewCustomerRegistrationApplication(input: {
    id: string;
    status: string;
    reviewedAt: Date;
    reviewRemark?: string | null;
  }) {
    return corePrisma.customerRegistrationApplication.update({
      where: { id: input.id },
      data: {
        status: input.status,
        reviewedAt: input.reviewedAt,
        reviewRemark: input.reviewRemark ?? null
      }
    });
  }

  async upsertProduct(input: UpsertProductInput) {
    const whereById = input.id?.trim();
    if (whereById) {
      return corePrisma.product.update({
        where: { id: whereById },
        data: {
          code: input.code.trim(),
          name: input.name.trim(),
          description: input.description ?? null,
          coverImageUrl: input.coverImageUrl ?? null,
          status: input.status ?? "ACTIVE",
          defaultUnitId: input.defaultUnitId ?? null,
          kingdeeMaterialId: input.kingdeeMaterialId ?? null
        }
      });
    }

    const existing = await corePrisma.product.findUnique({
      where: { code: input.code.trim() }
    });
    if (existing) {
      return corePrisma.product.update({
        where: { id: existing.id },
        data: {
          name: input.name.trim(),
          description: input.description ?? null,
          coverImageUrl: input.coverImageUrl ?? null,
          status: input.status ?? "ACTIVE",
          defaultUnitId: input.defaultUnitId ?? null,
          kingdeeMaterialId: input.kingdeeMaterialId ?? null
        }
      });
    }

    return corePrisma.product.create({
      data: {
        code: input.code.trim(),
        name: input.name.trim(),
        description: input.description ?? null,
        coverImageUrl: input.coverImageUrl ?? null,
        status: input.status ?? "ACTIVE",
        defaultUnitId: input.defaultUnitId ?? null,
        kingdeeMaterialId: input.kingdeeMaterialId ?? null
      }
    });
  }

  async listProducts(status?: string) {
    return corePrisma.product.findMany({
      where: status
        ? {
            status
          }
        : undefined,
      include: {
        skus: {
          orderBy: [{ createdAt: "asc" }]
        }
      },
      orderBy: [{ updatedAt: "desc" }]
    });
  }

  async findProductById(id: string) {
    return corePrisma.product.findUnique({
      where: { id },
      include: {
        skus: {
          orderBy: [{ createdAt: "asc" }]
        }
      }
    });
  }

  async findProductByCode(code: string) {
    return corePrisma.product.findUnique({
      where: { code },
      include: {
        skus: {
          orderBy: [{ createdAt: "asc" }]
        }
      }
    });
  }

  async findProductByKingdeeMaterialId(kingdeeMaterialId: string) {
    return corePrisma.product.findFirst({
      where: { kingdeeMaterialId },
      include: {
        skus: {
          orderBy: [{ createdAt: "asc" }]
        }
      }
    });
  }

  async upsertProductSku(input: UpsertProductSkuInput) {
    const byId = input.id?.trim();
    if (byId) {
      return corePrisma.productSku.update({
        where: { id: byId },
        data: {
          productId: input.productId,
          skuCode: input.skuCode.trim(),
          skuName: input.skuName.trim(),
          specsJson: input.specsJson ?? null,
          price: input.price,
          stock: input.stock,
          status: input.status ?? "ACTIVE",
          unitId: input.unitId ?? null,
          kingdeeMaterialId: input.kingdeeMaterialId ?? null
        }
      });
    }

    const existing = await corePrisma.productSku.findUnique({
      where: {
        skuCode: input.skuCode.trim()
      }
    });
    if (existing) {
      return corePrisma.productSku.update({
        where: { id: existing.id },
        data: {
          productId: input.productId,
          skuName: input.skuName.trim(),
          specsJson: input.specsJson ?? null,
          price: input.price,
          stock: input.stock,
          status: input.status ?? "ACTIVE",
          unitId: input.unitId ?? null,
          kingdeeMaterialId: input.kingdeeMaterialId ?? null
        }
      });
    }

    return corePrisma.productSku.create({
      data: {
        productId: input.productId,
        skuCode: input.skuCode.trim(),
        skuName: input.skuName.trim(),
        specsJson: input.specsJson ?? null,
        price: input.price,
        stock: input.stock,
        status: input.status ?? "ACTIVE",
        unitId: input.unitId ?? null,
        kingdeeMaterialId: input.kingdeeMaterialId ?? null
      }
    });
  }

  async findSkuById(id: string) {
    return corePrisma.productSku.findUnique({
      where: { id },
      include: {
        product: true
      }
    });
  }

  async findSkuByCode(skuCode: string) {
    return corePrisma.productSku.findUnique({
      where: { skuCode },
      include: {
        product: true
      }
    });
  }

  async findSkuByKingdeeMaterialId(kingdeeMaterialId: string) {
    return corePrisma.productSku.findFirst({
      where: { kingdeeMaterialId },
      include: {
        product: true
      }
    });
  }

  async ensureCustomerCart(customerId: string) {
    return corePrisma.cart.upsert({
      where: { customerId },
      update: {},
      create: {
        customerId
      }
    });
  }

  async getCartByCustomer(customerId: string) {
    return corePrisma.cart.findUnique({
      where: {
        customerId
      },
      include: {
        items: {
          include: {
            product: true,
            sku: true
          },
          orderBy: [{ updatedAt: "desc" }]
        }
      }
    });
  }

  async upsertCartItem(input: {
    customerId: string;
    productId: string;
    skuId: string;
    qty: number;
  }) {
    const cart = await this.ensureCustomerCart(input.customerId);
    const existing = await corePrisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        skuId: input.skuId
      }
    });

    if (existing) {
      return corePrisma.cartItem.update({
        where: { id: existing.id },
        data: {
          qty: existing.qty + input.qty
        }
      });
    }

    return corePrisma.cartItem.create({
      data: {
        cartId: cart.id,
        customerId: input.customerId,
        productId: input.productId,
        skuId: input.skuId,
        qty: input.qty
      }
    });
  }

  async findCartItemByIdAndCustomer(id: string, customerId: string) {
    return corePrisma.cartItem.findFirst({
      where: {
        id,
        customerId
      }
    });
  }

  async findCartItemByCustomerAndSku(customerId: string, skuId: string) {
    return corePrisma.cartItem.findFirst({
      where: {
        customerId,
        skuId
      }
    });
  }

  async updateCartItemQty(id: string, qty: number) {
    return corePrisma.cartItem.update({
      where: { id },
      data: {
        qty
      }
    });
  }

  async removeCartItem(id: string) {
    return corePrisma.cartItem.delete({
      where: {
        id
      }
    });
  }

  async clearCartByCustomer(customerId: string) {
    const cart = await corePrisma.cart.findUnique({
      where: { customerId }
    });
    if (!cart) {
      return { count: 0 };
    }
    return corePrisma.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });
  }

  async clearCartItemsByCustomerSkuIds(customerId: string, skuIds: string[]) {
    const normalizedSkuIds = Array.from(
      new Set(
        skuIds
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      )
    );

    if (normalizedSkuIds.length === 0) {
      return { count: 0 };
    }

    return corePrisma.cartItem.deleteMany({
      where: {
        customerId,
        skuId: {
          in: normalizedSkuIds
        }
      }
    });
  }

  async listCustomerAddresses(customerId: string) {
    return corePrisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }]
    });
  }

  async findCustomerAddressById(customerId: string, addressId: string) {
    return corePrisma.customerAddress.findFirst({
      where: {
        id: addressId,
        customerId
      }
    });
  }

  async upsertCustomerAddress(input: {
    id?: string;
    customerId: string;
    receiverName: string;
    receiverPhone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    isDefault?: boolean;
  }) {
    return corePrisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.customerAddress.updateMany({
          where: { customerId: input.customerId },
          data: { isDefault: false }
        });
      }

      if (input.id?.trim()) {
        return tx.customerAddress.update({
          where: { id: input.id.trim() },
          data: {
            receiverName: input.receiverName,
            receiverPhone: input.receiverPhone,
            province: input.province,
            city: input.city,
            district: input.district,
            detail: input.detail,
            isDefault: Boolean(input.isDefault)
          }
        });
      }

      return tx.customerAddress.create({
        data: {
          customerId: input.customerId,
          receiverName: input.receiverName,
          receiverPhone: input.receiverPhone,
          province: input.province,
          city: input.city,
          district: input.district,
          detail: input.detail,
          isDefault: Boolean(input.isDefault)
        }
      });
    });
  }

  async removeCustomerAddress(customerId: string, addressId: string) {
    return corePrisma.customerAddress.deleteMany({
      where: {
        id: addressId,
        customerId
      }
    });
  }

  async listInvoiceProfiles(customerId: string) {
    return corePrisma.invoiceProfile.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }]
    });
  }

  async findInvoiceProfileById(customerId: string, profileId: string) {
    return corePrisma.invoiceProfile.findFirst({
      where: {
        id: profileId,
        customerId
      }
    });
  }

  async upsertInvoiceProfile(input: {
    id?: string;
    customerId: string;
    title: string;
    taxNo: string;
    bankName?: string | null;
    bankAccount?: string | null;
    addressPhone?: string | null;
    email?: string | null;
    isDefault?: boolean;
  }) {
    return corePrisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.invoiceProfile.updateMany({
          where: { customerId: input.customerId },
          data: { isDefault: false }
        });
      }

      if (input.id?.trim()) {
        return tx.invoiceProfile.update({
          where: { id: input.id.trim() },
          data: {
            title: input.title,
            taxNo: input.taxNo,
            bankName: input.bankName ?? null,
            bankAccount: input.bankAccount ?? null,
            addressPhone: input.addressPhone ?? null,
            email: input.email ?? null,
            isDefault: Boolean(input.isDefault)
          }
        });
      }

      return tx.invoiceProfile.create({
        data: {
          customerId: input.customerId,
          title: input.title,
          taxNo: input.taxNo,
          bankName: input.bankName ?? null,
          bankAccount: input.bankAccount ?? null,
          addressPhone: input.addressPhone ?? null,
          email: input.email ?? null,
          isDefault: Boolean(input.isDefault)
        }
      });
    });
  }

  async removeInvoiceProfile(customerId: string, profileId: string) {
    return corePrisma.invoiceProfile.deleteMany({
      where: {
        id: profileId,
        customerId
      }
    });
  }

  async createQuoteRequest(input: {
    customerId: string;
    itemsJson: string;
    remark?: string | null;
    status?: string;
  }) {
    return corePrisma.quoteRequest.create({
      data: {
        customerId: input.customerId,
        itemsJson: input.itemsJson,
        remark: input.remark ?? null,
        status: input.status ?? "PENDING"
      }
    });
  }

  async listQuoteRequestsByCustomer(customerId: string) {
    return corePrisma.quoteRequest.findMany({
      where: { customerId },
      orderBy: [{ createdAt: "desc" }]
    });
  }

  async createInvoiceRequest(input: {
    customerId: string;
    orderIdsJson: string;
    invoiceProfileId?: string | null;
    remark?: string | null;
    status?: string;
    kingdeeRefId?: string | null;
  }) {
    return corePrisma.invoiceRequest.create({
      data: {
        customerId: input.customerId,
        orderIdsJson: input.orderIdsJson,
        invoiceProfileId: input.invoiceProfileId ?? null,
        remark: input.remark ?? null,
        status: input.status ?? "PENDING",
        kingdeeRefId: input.kingdeeRefId ?? null
      }
    });
  }

  async updateInvoiceRequest(input: {
    id: string;
    status?: string;
    kingdeeRefId?: string | null;
    remark?: string | null;
  }) {
    return corePrisma.invoiceRequest.update({
      where: { id: input.id },
      data: {
        ...(typeof input.status !== "undefined" ? { status: input.status } : {}),
        ...(typeof input.kingdeeRefId !== "undefined" ? { kingdeeRefId: input.kingdeeRefId } : {}),
        ...(typeof input.remark !== "undefined" ? { remark: input.remark } : {})
      }
    });
  }

  async listInvoiceRequestsByCustomer(customerId: string) {
    return corePrisma.invoiceRequest.findMany({
      where: { customerId },
      include: {
        invoiceProfile: true
      },
      orderBy: [{ createdAt: "desc" }]
    });
  }

  async getSetting(key: string) {
    return corePrisma.setting.findUnique({
      where: { key }
    });
  }

  async listSettings(keys?: string[]) {
    return corePrisma.setting.findMany({
      where: keys && keys.length > 0 ? { key: { in: keys } } : undefined,
      orderBy: [{ key: "asc" }]
    });
  }

  async upsertSetting(key: string, valueJson: string) {
    return corePrisma.setting.upsert({
      where: { key },
      create: {
        key,
        valueJson
      },
      update: {
        valueJson
      }
    });
  }

  async findPriceCache(customerId: string, skuId: string) {
    return corePrisma.priceCache.findFirst({
      where: {
        customerId,
        skuId
      }
    });
  }

  async upsertPriceCache(input: {
    customerId: string;
    skuId: string;
    unitPrice: number;
    currency?: string;
    source?: string | null;
  }) {
    return corePrisma.priceCache.upsert({
      where: {
        customerId_skuId: {
          customerId: input.customerId,
          skuId: input.skuId
        }
      },
      create: {
        customerId: input.customerId,
        skuId: input.skuId,
        unitPrice: input.unitPrice,
        currency: input.currency ?? "CNY",
        source: input.source ?? null
      },
      update: {
        unitPrice: input.unitPrice,
        currency: input.currency ?? "CNY",
        source: input.source ?? null
      }
    });
  }

  async listSkusByMaterialIds(materialIds: string[]) {
    if (materialIds.length === 0) {
      return [];
    }
    return corePrisma.productSku.findMany({
      where: {
        kingdeeMaterialId: {
          in: materialIds
        }
      }
    });
  }

  async listActiveSkusWithMaterialId() {
    return corePrisma.productSku.findMany({
      where: {
        status: "ACTIVE",
        kingdeeMaterialId: {
          not: null
        }
      },
      include: {
        product: true
      }
    });
  }

  async updateSkuStockByMaterialId(materialId: string, stock: number) {
    return corePrisma.productSku.updateMany({
      where: {
        kingdeeMaterialId: materialId
      },
      data: {
        stock
      }
    });
  }

  async findSalesOrderByIdempotencyKey(customerId: string, idempotencyKey: string) {
    return corePrisma.salesOrder.findFirst({
      where: {
        customerId,
        idempotencyKey
      },
      include: {
        lines: true
      }
    });
  }

  async createSalesOrderWithLines(input: {
    orderNo: string;
    customerId: string;
    status: string;
    settlementMode: string;
    currency: string;
    totalAmount: number;
    remark?: string | null;
    deliveryInfoJson?: string | null;
    idempotencyKey?: string | null;
    lines: OrderLineInput[];
  }) {
    return corePrisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.create({
        data: {
          orderNo: input.orderNo,
          customerId: input.customerId,
          status: input.status,
          settlementMode: input.settlementMode,
          currency: input.currency,
          totalAmount: input.totalAmount,
          remark: input.remark ?? null,
          deliveryInfoJson: input.deliveryInfoJson ?? null,
          idempotencyKey: input.idempotencyKey ?? null
        }
      });

      if (input.lines.length > 0) {
        await tx.salesOrderLine.createMany({
          data: input.lines.map((line) => ({
            salesOrderId: order.id,
            productId: line.productId,
            skuId: line.skuId,
            productName: line.productName,
            skuName: line.skuName,
            skuCode: line.skuCode,
            qty: line.qty,
            unitPrice: line.unitPrice,
            lineAmount: line.lineAmount,
            rawJson: line.rawJson ?? null
          }))
        });
      }

      return order;
    });
  }

  async findSalesOrderById(id: string) {
    return corePrisma.salesOrder.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            product: true,
            sku: true
          },
          orderBy: [{ createdAt: "asc" }]
        }
      }
    });
  }

  async findSalesOrderByIdAndCustomer(id: string, customerId: string) {
    return corePrisma.salesOrder.findFirst({
      where: {
        id,
        customerId
      },
      include: {
        lines: {
          include: {
            product: true,
            sku: true
          },
          orderBy: [{ createdAt: "asc" }]
        },
        deliveries: {
          orderBy: [{ updatedAt: "desc" }]
        }
      }
    });
  }

  async listSalesOrdersByCustomerAndIds(customerId: string, ids: string[]) {
    if (ids.length === 0) {
      return [];
    }
    return corePrisma.salesOrder.findMany({
      where: {
        customerId,
        id: {
          in: ids
        }
      }
    });
  }

  async listSalesOrdersByCustomer(input: {
    customerId: string;
    page: number;
    pageSize: number;
    status?: string;
    orderNo?: string;
  }) {
    const where: Prisma.SalesOrderWhereInput = {
      customerId: input.customerId,
      status: input.status ?? undefined,
      orderNo: input.orderNo
        ? {
            contains: input.orderNo
          }
        : undefined
    };
    const [items, total] = await Promise.all([
      corePrisma.salesOrder.findMany({
        where,
        include: {
          lines: true,
          deliveries: true
        },
        orderBy: [{ createdAt: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize
      }),
      corePrisma.salesOrder.count({ where })
    ]);

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize
    };
  }

  async listSalesOrdersForAdmin(input: {
    page: number;
    pageSize: number;
    status?: string;
    customerId?: string;
    orderNo?: string;
    excludeMockWriteback?: boolean;
  }) {
    const excludeMockWriteback = input.excludeMockWriteback !== false;
    const where: Prisma.SalesOrderWhereInput = {
      status: input.status ?? undefined,
      customerId: input.customerId ?? undefined,
      orderNo: input.orderNo
        ? {
            contains: input.orderNo
          }
        : undefined,
      writebackLogs: excludeMockWriteback
        ? {
            none: {
              responseJson: {
                contains: "MOCK-KD-"
              }
            }
          }
        : undefined
    };

    const [items, total] = await Promise.all([
      corePrisma.salesOrder.findMany({
        where,
        include: {
          customer: true,
          lines: true,
          deliveries: true,
          writebackLogs: {
            orderBy: [{ createdAt: "desc" }],
            take: 3
          }
        },
        orderBy: [{ createdAt: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize
      }),
      corePrisma.salesOrder.count({ where })
    ]);

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize
    };
  }

  async findSalesOrderByIdForAdmin(id: string) {
    return corePrisma.salesOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        lines: {
          include: {
            product: true,
            sku: true
          },
          orderBy: [{ createdAt: "asc" }]
        },
        deliveries: {
          orderBy: [{ updatedAt: "desc" }]
        },
        writebackLogs: {
          orderBy: [{ createdAt: "desc" }],
          take: 20
        }
      }
    });
  }

  async updateSalesOrder(input: {
    id: string;
    status?: string;
    kingdeeOrderId?: string | null;
    kingdeeOrderNumber?: string | null;
    writebackError?: string | null;
    canceledAt?: Date | null;
    remark?: string | null;
    deliveryInfoJson?: string | null;
  }) {
    return corePrisma.salesOrder.update({
      where: { id: input.id },
      data: {
        ...(typeof input.status !== "undefined" ? { status: input.status } : {}),
        ...(typeof input.kingdeeOrderId !== "undefined" ? { kingdeeOrderId: input.kingdeeOrderId } : {}),
        ...(typeof input.kingdeeOrderNumber !== "undefined"
          ? { kingdeeOrderNumber: input.kingdeeOrderNumber }
          : {}),
        ...(typeof input.writebackError !== "undefined" ? { writebackError: input.writebackError } : {}),
        ...(typeof input.canceledAt !== "undefined" ? { canceledAt: input.canceledAt } : {}),
        ...(typeof input.remark !== "undefined" ? { remark: input.remark } : {}),
        ...(typeof input.deliveryInfoJson !== "undefined" ? { deliveryInfoJson: input.deliveryInfoJson } : {})
      }
    });
  }

  async createOrderWritebackLog(input: {
    salesOrderId: string;
    success: boolean;
    requestJson: string;
    responseJson?: string | null;
    errorCode?: string | null;
    errorMessage?: string | null;
    requestId?: string | null;
    traceId?: string | null;
    summary?: string | null;
  }) {
    return corePrisma.orderWritebackLog.create({
      data: {
        salesOrderId: input.salesOrderId,
        success: input.success,
        requestJson: input.requestJson,
        responseJson: input.responseJson ?? null,
        errorCode: input.errorCode ?? null,
        errorMessage: input.errorMessage ?? null,
        requestId: input.requestId ?? null,
        traceId: input.traceId ?? null,
        summary: input.summary ?? null
      }
    });
  }

  async listOrderWritebackLogsByOrder(salesOrderId: string, limit = 10) {
    return corePrisma.orderWritebackLog.findMany({
      where: {
        salesOrderId
      },
      orderBy: [{ createdAt: "desc" }],
      take: limit
    });
  }

  async findSalesOrderByKingdeeOrderNumber(orderNo: string) {
    return corePrisma.salesOrder.findFirst({
      where: {
        OR: [{ kingdeeOrderNumber: orderNo }, { orderNo }]
      }
    });
  }

  async attachDeliveryToSalesOrder(deliveryId: string, salesOrderId: string) {
    return corePrisma.delivery.update({
      where: {
        id: deliveryId
      },
      data: {
        salesOrderId
      }
    });
  }

  async listDeliveriesByCustomerId(customerId: string, options: DeliveryListOptions) {
    const where: Prisma.DeliveryWhereInput = {
      customerId,
      status: options.status ?? undefined
    };

    const [items, total] = await Promise.all([
      corePrisma.delivery.findMany({
        where,
        include: {
          salesOrder: true
        },
        orderBy: [{ updatedAt: "desc" }],
        skip: (options.page - 1) * options.pageSize,
        take: options.pageSize
      }),
      corePrisma.delivery.count({ where })
    ]);

    return {
      items,
      total,
      page: options.page,
      pageSize: options.pageSize
    };
  }

  async findDeliveryById(id: string) {
    return corePrisma.delivery.findUnique({
      where: { id },
      include: {
        salesOrder: true
      }
    });
  }

  async findDeliveryByIdAndCustomer(id: string, customerId: string) {
    return corePrisma.delivery.findFirst({
      where: {
        id,
        customerId
      },
      include: {
        salesOrder: true
      }
    });
  }

  async findDeliveryByBiz(kingdeeBillId?: string | null, kingdeeBillNumber?: string | null) {
    if (kingdeeBillId) {
      const found = await corePrisma.delivery.findFirst({
        where: {
          kingdeeBillId
        }
      });
      if (found) {
        return found;
      }
    }

    if (kingdeeBillNumber) {
      return corePrisma.delivery.findFirst({
        where: {
          kingdeeBillNumber
        }
      });
    }

    return null;
  }

  async upsertDeliveryFromSync(input: DeliveryUpsertInput) {
    const existing = await this.findDeliveryByBiz(input.kingdeeBillId, input.kingdeeBillNumber);

    if (existing) {
      return corePrisma.delivery.update({
        where: {
          id: existing.id
        },
        data: {
          customerId: input.customerId,
          salesOrderId: input.salesOrderId ?? existing.salesOrderId,
          kingdeeBillId: input.kingdeeBillId ?? existing.kingdeeBillId,
          kingdeeBillNumber: input.kingdeeBillNumber ?? existing.kingdeeBillNumber,
          sourceDocNo: input.sourceDocNo ?? existing.sourceDocNo,
          detailsJson: input.detailsJson ?? existing.detailsJson,
          syncedAt: input.syncedAt ?? new Date(),
          status: existing.status === "SIGNED" ? existing.status : input.status ?? "PENDING"
        }
      });
    }

    return corePrisma.delivery.create({
      data: {
        customerId: input.customerId,
        salesOrderId: input.salesOrderId ?? null,
        kingdeeBillId: input.kingdeeBillId ?? null,
        kingdeeBillNumber: input.kingdeeBillNumber ?? null,
        sourceDocNo: input.sourceDocNo ?? null,
        detailsJson: input.detailsJson ?? null,
        syncedAt: input.syncedAt ?? new Date(),
        status: input.status ?? "PENDING"
      }
    });
  }

  async signDelivery(input: {
    id: string;
    signedAt: Date;
    signedPayloadJson: string;
    idempotencyKey?: string | null;
  }) {
    return corePrisma.delivery.update({
      where: { id: input.id },
      data: {
        status: "SIGNED",
        signedAt: input.signedAt,
        signedPayloadJson: input.signedPayloadJson,
        signIdempotencyKey: input.idempotencyKey ?? null
      }
    });
  }

  async createReconciliation(input: {
    customerId: string;
    periodStart: Date;
    periodEnd: Date;
    statementJson: string;
    status?: string;
    confirmedAt?: Date | null;
  }) {
    return corePrisma.reconciliation.create({
      data: {
        customerId: input.customerId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        statementJson: input.statementJson,
        status: input.status ?? "PENDING",
        confirmedAt: input.confirmedAt ?? null
      }
    });
  }

  async replaceReconciliationLines(reconciliationId: string, lines: ReconciliationLineInput[]) {
    await corePrisma.reconciliationLine.deleteMany({
      where: {
        reconciliationId
      }
    });

    if (lines.length === 0) {
      return;
    }

    await corePrisma.reconciliationLine.createMany({
      data: lines.map((line) => ({
        reconciliationId,
        docType: line.docType,
        docNo: line.docNo ?? null,
        docDate: line.docDate ?? null,
        amount: line.amount ?? 0,
        rawJson: line.rawJson
      }))
    });
  }

  async listReconciliationsByCustomer(input: {
    customerId: string;
    periodStart: Date;
    periodEnd: Date;
    page: number;
    pageSize: number;
  }) {
    const where: Prisma.ReconciliationWhereInput = {
      customerId: input.customerId,
      periodStart: {
        gte: input.periodStart
      },
      periodEnd: {
        lte: input.periodEnd
      }
    };

    const [items, total] = await Promise.all([
      corePrisma.reconciliation.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize
      }),
      corePrisma.reconciliation.count({ where })
    ]);

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize
    };
  }

  async findReconciliationById(id: string) {
    return corePrisma.reconciliation.findUnique({
      where: { id }
    });
  }

  async findReconciliationDetail(id: string) {
    return corePrisma.reconciliation.findUnique({
      where: { id },
      include: {
        lines: true
      }
    });
  }

  async confirmReconciliation(input: {
    id: string;
    confirmedAt: Date;
    confirmRemark?: string | null;
  }) {
    return corePrisma.reconciliation.update({
      where: {
        id: input.id
      },
      data: {
        status: "CONFIRMED",
        confirmedAt: input.confirmedAt,
        confirmRemark: input.confirmRemark ?? null
      }
    });
  }

  async listRawDocumentsByRange(docType: string | null, from: Date, to: Date) {
    return corePrisma.kingdeeRawDocument.findMany({
      where: {
        fetchedAt: {
          gte: from,
          lte: to
        },
        docType: docType ?? undefined
      },
      orderBy: [{ fetchedAt: "desc" }]
    });
  }

  async listRawDocumentsByRangeAndTypes(docTypes: string[], from: Date, to: Date) {
    return corePrisma.kingdeeRawDocument.findMany({
      where: {
        fetchedAt: {
          gte: from,
          lte: to
        },
        docType: {
          in: docTypes
        }
      },
      orderBy: [{ fetchedAt: "desc" }]
    });
  }

  async findRawDocumentByHash(docType: string, hash: string, kingdeeId?: string | null) {
    return corePrisma.kingdeeRawDocument.findFirst({
      where: {
        docType,
        hash,
        kingdeeId: kingdeeId ?? undefined
      }
    });
  }

  async insertRawDocument(input: UpsertRawDocumentInput) {
    return corePrisma.kingdeeRawDocument.create({
      data: {
        docType: input.docType,
        kingdeeId: input.kingdeeId ?? null,
        number: input.number ?? null,
        payloadJson: input.payloadJson,
        hash: input.hash,
        fetchedAt: input.fetchedAt ?? new Date()
      }
    });
  }

  async getSyncCheckpoint(scope: string) {
    return corePrisma.syncCheckpoint.findUnique({
      where: { scope }
    });
  }

  async upsertSyncCheckpoint(input: {
    scope: string;
    jobName: string;
    cursorJson: string;
    status: string;
    errorMessage?: string | null;
  }) {
    return corePrisma.syncCheckpoint.upsert({
      where: {
        scope: input.scope
      },
      create: {
        scope: input.scope,
        jobName: input.jobName,
        cursorJson: input.cursorJson,
        status: input.status,
        errorMessage: input.errorMessage ?? null,
        lastRunAt: new Date()
      },
      update: {
        jobName: input.jobName,
        cursorJson: input.cursorJson,
        status: input.status,
        errorMessage: input.errorMessage ?? null,
        lastRunAt: new Date()
      }
    });
  }

  async listSyncCheckpoints(jobName?: string) {
    return corePrisma.syncCheckpoint.findMany({
      where: jobName
        ? {
            jobName
          }
        : undefined,
      orderBy: [{ updatedAt: "desc" }]
    });
  }
}

export const coreRepo = new CoreRepo();
