
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.KingdeeTokenScalarFieldEnum = {
  id: 'id',
  env: 'env',
  appToken: 'appToken',
  expiresAt: 'expiresAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.KingdeeRawDocumentScalarFieldEnum = {
  id: 'id',
  docType: 'docType',
  kingdeeId: 'kingdeeId',
  number: 'number',
  payloadJson: 'payloadJson',
  fetchedAt: 'fetchedAt',
  hash: 'hash'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  phone: 'phone',
  status: 'status',
  companyName: 'companyName',
  contactName: 'contactName',
  contactPhone: 'contactPhone',
  kingdeeCustomerId: 'kingdeeCustomerId',
  wechatOpenid: 'wechatOpenid',
  accessToken: 'accessToken',
  tokenExpiresAt: 'tokenExpiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomerRegistrationApplicationScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  payloadJson: 'payloadJson',
  status: 'status',
  createdAt: 'createdAt',
  reviewedAt: 'reviewedAt',
  reviewRemark: 'reviewRemark'
};

exports.Prisma.CustomerAddressScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  receiverName: 'receiverName',
  receiverPhone: 'receiverPhone',
  province: 'province',
  city: 'city',
  district: 'district',
  detail: 'detail',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceProfileScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  title: 'title',
  taxNo: 'taxNo',
  bankName: 'bankName',
  bankAccount: 'bankAccount',
  addressPhone: 'addressPhone',
  email: 'email',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuoteRequestScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  itemsJson: 'itemsJson',
  remark: 'remark',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceRequestScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  orderIdsJson: 'orderIdsJson',
  invoiceProfileId: 'invoiceProfileId',
  remark: 'remark',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  kingdeeRefId: 'kingdeeRefId'
};

exports.Prisma.SettingScalarFieldEnum = {
  key: 'key',
  valueJson: 'valueJson',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeliveryScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  salesOrderId: 'salesOrderId',
  kingdeeBillId: 'kingdeeBillId',
  kingdeeBillNumber: 'kingdeeBillNumber',
  sourceDocNo: 'sourceDocNo',
  detailsJson: 'detailsJson',
  syncedAt: 'syncedAt',
  status: 'status',
  signedAt: 'signedAt',
  signedPayloadJson: 'signedPayloadJson',
  signIdempotencyKey: 'signIdempotencyKey',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReconciliationScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  statementJson: 'statementJson',
  status: 'status',
  confirmedAt: 'confirmedAt',
  confirmRemark: 'confirmRemark',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReconciliationLineScalarFieldEnum = {
  id: 'id',
  reconciliationId: 'reconciliationId',
  docType: 'docType',
  docNo: 'docNo',
  docDate: 'docDate',
  amount: 'amount',
  rawJson: 'rawJson',
  createdAt: 'createdAt'
};

exports.Prisma.SyncCheckpointScalarFieldEnum = {
  id: 'id',
  scope: 'scope',
  jobName: 'jobName',
  cursorJson: 'cursorJson',
  status: 'status',
  errorMessage: 'errorMessage',
  lastRunAt: 'lastRunAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  coverImageUrl: 'coverImageUrl',
  status: 'status',
  defaultUnitId: 'defaultUnitId',
  kingdeeMaterialId: 'kingdeeMaterialId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductSkuScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  skuCode: 'skuCode',
  skuName: 'skuName',
  specsJson: 'specsJson',
  price: 'price',
  stock: 'stock',
  status: 'status',
  unitId: 'unitId',
  kingdeeMaterialId: 'kingdeeMaterialId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PriceCacheScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  skuId: 'skuId',
  unitPrice: 'unitPrice',
  currency: 'currency',
  source: 'source',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  customerId: 'customerId',
  productId: 'productId',
  skuId: 'skuId',
  qty: 'qty',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalesOrderScalarFieldEnum = {
  id: 'id',
  orderNo: 'orderNo',
  customerId: 'customerId',
  status: 'status',
  settlementMode: 'settlementMode',
  currency: 'currency',
  totalAmount: 'totalAmount',
  remark: 'remark',
  deliveryInfoJson: 'deliveryInfoJson',
  idempotencyKey: 'idempotencyKey',
  kingdeeOrderId: 'kingdeeOrderId',
  kingdeeOrderNumber: 'kingdeeOrderNumber',
  writebackError: 'writebackError',
  canceledAt: 'canceledAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalesOrderLineScalarFieldEnum = {
  id: 'id',
  salesOrderId: 'salesOrderId',
  productId: 'productId',
  skuId: 'skuId',
  productName: 'productName',
  skuName: 'skuName',
  skuCode: 'skuCode',
  qty: 'qty',
  unitPrice: 'unitPrice',
  lineAmount: 'lineAmount',
  rawJson: 'rawJson',
  createdAt: 'createdAt'
};

exports.Prisma.OrderWritebackLogScalarFieldEnum = {
  id: 'id',
  salesOrderId: 'salesOrderId',
  success: 'success',
  requestId: 'requestId',
  traceId: 'traceId',
  summary: 'summary',
  requestJson: 'requestJson',
  responseJson: 'responseJson',
  errorCode: 'errorCode',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  KingdeeToken: 'KingdeeToken',
  KingdeeRawDocument: 'KingdeeRawDocument',
  Customer: 'Customer',
  CustomerRegistrationApplication: 'CustomerRegistrationApplication',
  CustomerAddress: 'CustomerAddress',
  InvoiceProfile: 'InvoiceProfile',
  QuoteRequest: 'QuoteRequest',
  InvoiceRequest: 'InvoiceRequest',
  Setting: 'Setting',
  Delivery: 'Delivery',
  Reconciliation: 'Reconciliation',
  ReconciliationLine: 'ReconciliationLine',
  SyncCheckpoint: 'SyncCheckpoint',
  Product: 'Product',
  ProductSku: 'ProductSku',
  PriceCache: 'PriceCache',
  Cart: 'Cart',
  CartItem: 'CartItem',
  SalesOrder: 'SalesOrder',
  SalesOrderLine: 'SalesOrderLine',
  OrderWritebackLog: 'OrderWritebackLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
