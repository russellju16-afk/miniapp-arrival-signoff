
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model KingdeeToken
 * 
 */
export type KingdeeToken = $Result.DefaultSelection<Prisma.$KingdeeTokenPayload>
/**
 * Model KingdeeRawDocument
 * 
 */
export type KingdeeRawDocument = $Result.DefaultSelection<Prisma.$KingdeeRawDocumentPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Delivery
 * 
 */
export type Delivery = $Result.DefaultSelection<Prisma.$DeliveryPayload>
/**
 * Model Reconciliation
 * 
 */
export type Reconciliation = $Result.DefaultSelection<Prisma.$ReconciliationPayload>
/**
 * Model ReconciliationLine
 * 
 */
export type ReconciliationLine = $Result.DefaultSelection<Prisma.$ReconciliationLinePayload>
/**
 * Model SyncCheckpoint
 * 
 */
export type SyncCheckpoint = $Result.DefaultSelection<Prisma.$SyncCheckpointPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ProductSku
 * 
 */
export type ProductSku = $Result.DefaultSelection<Prisma.$ProductSkuPayload>
/**
 * Model Cart
 * 
 */
export type Cart = $Result.DefaultSelection<Prisma.$CartPayload>
/**
 * Model CartItem
 * 
 */
export type CartItem = $Result.DefaultSelection<Prisma.$CartItemPayload>
/**
 * Model SalesOrder
 * 
 */
export type SalesOrder = $Result.DefaultSelection<Prisma.$SalesOrderPayload>
/**
 * Model SalesOrderLine
 * 
 */
export type SalesOrderLine = $Result.DefaultSelection<Prisma.$SalesOrderLinePayload>
/**
 * Model OrderWritebackLog
 * 
 */
export type OrderWritebackLog = $Result.DefaultSelection<Prisma.$OrderWritebackLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more KingdeeTokens
 * const kingdeeTokens = await prisma.kingdeeToken.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more KingdeeTokens
   * const kingdeeTokens = await prisma.kingdeeToken.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.kingdeeToken`: Exposes CRUD operations for the **KingdeeToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KingdeeTokens
    * const kingdeeTokens = await prisma.kingdeeToken.findMany()
    * ```
    */
  get kingdeeToken(): Prisma.KingdeeTokenDelegate<ExtArgs>;

  /**
   * `prisma.kingdeeRawDocument`: Exposes CRUD operations for the **KingdeeRawDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KingdeeRawDocuments
    * const kingdeeRawDocuments = await prisma.kingdeeRawDocument.findMany()
    * ```
    */
  get kingdeeRawDocument(): Prisma.KingdeeRawDocumentDelegate<ExtArgs>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs>;

  /**
   * `prisma.delivery`: Exposes CRUD operations for the **Delivery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Deliveries
    * const deliveries = await prisma.delivery.findMany()
    * ```
    */
  get delivery(): Prisma.DeliveryDelegate<ExtArgs>;

  /**
   * `prisma.reconciliation`: Exposes CRUD operations for the **Reconciliation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reconciliations
    * const reconciliations = await prisma.reconciliation.findMany()
    * ```
    */
  get reconciliation(): Prisma.ReconciliationDelegate<ExtArgs>;

  /**
   * `prisma.reconciliationLine`: Exposes CRUD operations for the **ReconciliationLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReconciliationLines
    * const reconciliationLines = await prisma.reconciliationLine.findMany()
    * ```
    */
  get reconciliationLine(): Prisma.ReconciliationLineDelegate<ExtArgs>;

  /**
   * `prisma.syncCheckpoint`: Exposes CRUD operations for the **SyncCheckpoint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncCheckpoints
    * const syncCheckpoints = await prisma.syncCheckpoint.findMany()
    * ```
    */
  get syncCheckpoint(): Prisma.SyncCheckpointDelegate<ExtArgs>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs>;

  /**
   * `prisma.productSku`: Exposes CRUD operations for the **ProductSku** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductSkus
    * const productSkus = await prisma.productSku.findMany()
    * ```
    */
  get productSku(): Prisma.ProductSkuDelegate<ExtArgs>;

  /**
   * `prisma.cart`: Exposes CRUD operations for the **Cart** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Carts
    * const carts = await prisma.cart.findMany()
    * ```
    */
  get cart(): Prisma.CartDelegate<ExtArgs>;

  /**
   * `prisma.cartItem`: Exposes CRUD operations for the **CartItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CartItems
    * const cartItems = await prisma.cartItem.findMany()
    * ```
    */
  get cartItem(): Prisma.CartItemDelegate<ExtArgs>;

  /**
   * `prisma.salesOrder`: Exposes CRUD operations for the **SalesOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SalesOrders
    * const salesOrders = await prisma.salesOrder.findMany()
    * ```
    */
  get salesOrder(): Prisma.SalesOrderDelegate<ExtArgs>;

  /**
   * `prisma.salesOrderLine`: Exposes CRUD operations for the **SalesOrderLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SalesOrderLines
    * const salesOrderLines = await prisma.salesOrderLine.findMany()
    * ```
    */
  get salesOrderLine(): Prisma.SalesOrderLineDelegate<ExtArgs>;

  /**
   * `prisma.orderWritebackLog`: Exposes CRUD operations for the **OrderWritebackLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderWritebackLogs
    * const orderWritebackLogs = await prisma.orderWritebackLog.findMany()
    * ```
    */
  get orderWritebackLog(): Prisma.OrderWritebackLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    KingdeeToken: 'KingdeeToken',
    KingdeeRawDocument: 'KingdeeRawDocument',
    Customer: 'Customer',
    Delivery: 'Delivery',
    Reconciliation: 'Reconciliation',
    ReconciliationLine: 'ReconciliationLine',
    SyncCheckpoint: 'SyncCheckpoint',
    Product: 'Product',
    ProductSku: 'ProductSku',
    Cart: 'Cart',
    CartItem: 'CartItem',
    SalesOrder: 'SalesOrder',
    SalesOrderLine: 'SalesOrderLine',
    OrderWritebackLog: 'OrderWritebackLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "kingdeeToken" | "kingdeeRawDocument" | "customer" | "delivery" | "reconciliation" | "reconciliationLine" | "syncCheckpoint" | "product" | "productSku" | "cart" | "cartItem" | "salesOrder" | "salesOrderLine" | "orderWritebackLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      KingdeeToken: {
        payload: Prisma.$KingdeeTokenPayload<ExtArgs>
        fields: Prisma.KingdeeTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KingdeeTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KingdeeTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>
          }
          findFirst: {
            args: Prisma.KingdeeTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KingdeeTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>
          }
          findMany: {
            args: Prisma.KingdeeTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>[]
          }
          create: {
            args: Prisma.KingdeeTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>
          }
          createMany: {
            args: Prisma.KingdeeTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KingdeeTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>[]
          }
          delete: {
            args: Prisma.KingdeeTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>
          }
          update: {
            args: Prisma.KingdeeTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>
          }
          deleteMany: {
            args: Prisma.KingdeeTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KingdeeTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.KingdeeTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeTokenPayload>
          }
          aggregate: {
            args: Prisma.KingdeeTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKingdeeToken>
          }
          groupBy: {
            args: Prisma.KingdeeTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<KingdeeTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.KingdeeTokenCountArgs<ExtArgs>
            result: $Utils.Optional<KingdeeTokenCountAggregateOutputType> | number
          }
        }
      }
      KingdeeRawDocument: {
        payload: Prisma.$KingdeeRawDocumentPayload<ExtArgs>
        fields: Prisma.KingdeeRawDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KingdeeRawDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KingdeeRawDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>
          }
          findFirst: {
            args: Prisma.KingdeeRawDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KingdeeRawDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>
          }
          findMany: {
            args: Prisma.KingdeeRawDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>[]
          }
          create: {
            args: Prisma.KingdeeRawDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>
          }
          createMany: {
            args: Prisma.KingdeeRawDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KingdeeRawDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>[]
          }
          delete: {
            args: Prisma.KingdeeRawDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>
          }
          update: {
            args: Prisma.KingdeeRawDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>
          }
          deleteMany: {
            args: Prisma.KingdeeRawDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KingdeeRawDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.KingdeeRawDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KingdeeRawDocumentPayload>
          }
          aggregate: {
            args: Prisma.KingdeeRawDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKingdeeRawDocument>
          }
          groupBy: {
            args: Prisma.KingdeeRawDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<KingdeeRawDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.KingdeeRawDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<KingdeeRawDocumentCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Delivery: {
        payload: Prisma.$DeliveryPayload<ExtArgs>
        fields: Prisma.DeliveryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeliveryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeliveryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          findFirst: {
            args: Prisma.DeliveryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeliveryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          findMany: {
            args: Prisma.DeliveryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>[]
          }
          create: {
            args: Prisma.DeliveryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          createMany: {
            args: Prisma.DeliveryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeliveryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>[]
          }
          delete: {
            args: Prisma.DeliveryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          update: {
            args: Prisma.DeliveryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          deleteMany: {
            args: Prisma.DeliveryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeliveryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DeliveryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          aggregate: {
            args: Prisma.DeliveryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDelivery>
          }
          groupBy: {
            args: Prisma.DeliveryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeliveryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeliveryCountArgs<ExtArgs>
            result: $Utils.Optional<DeliveryCountAggregateOutputType> | number
          }
        }
      }
      Reconciliation: {
        payload: Prisma.$ReconciliationPayload<ExtArgs>
        fields: Prisma.ReconciliationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReconciliationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReconciliationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          findFirst: {
            args: Prisma.ReconciliationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReconciliationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          findMany: {
            args: Prisma.ReconciliationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>[]
          }
          create: {
            args: Prisma.ReconciliationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          createMany: {
            args: Prisma.ReconciliationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReconciliationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>[]
          }
          delete: {
            args: Prisma.ReconciliationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          update: {
            args: Prisma.ReconciliationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          deleteMany: {
            args: Prisma.ReconciliationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReconciliationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReconciliationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          aggregate: {
            args: Prisma.ReconciliationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReconciliation>
          }
          groupBy: {
            args: Prisma.ReconciliationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReconciliationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReconciliationCountArgs<ExtArgs>
            result: $Utils.Optional<ReconciliationCountAggregateOutputType> | number
          }
        }
      }
      ReconciliationLine: {
        payload: Prisma.$ReconciliationLinePayload<ExtArgs>
        fields: Prisma.ReconciliationLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReconciliationLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReconciliationLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>
          }
          findFirst: {
            args: Prisma.ReconciliationLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReconciliationLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>
          }
          findMany: {
            args: Prisma.ReconciliationLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>[]
          }
          create: {
            args: Prisma.ReconciliationLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>
          }
          createMany: {
            args: Prisma.ReconciliationLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReconciliationLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>[]
          }
          delete: {
            args: Prisma.ReconciliationLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>
          }
          update: {
            args: Prisma.ReconciliationLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>
          }
          deleteMany: {
            args: Prisma.ReconciliationLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReconciliationLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReconciliationLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationLinePayload>
          }
          aggregate: {
            args: Prisma.ReconciliationLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReconciliationLine>
          }
          groupBy: {
            args: Prisma.ReconciliationLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReconciliationLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReconciliationLineCountArgs<ExtArgs>
            result: $Utils.Optional<ReconciliationLineCountAggregateOutputType> | number
          }
        }
      }
      SyncCheckpoint: {
        payload: Prisma.$SyncCheckpointPayload<ExtArgs>
        fields: Prisma.SyncCheckpointFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncCheckpointFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncCheckpointFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>
          }
          findFirst: {
            args: Prisma.SyncCheckpointFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncCheckpointFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>
          }
          findMany: {
            args: Prisma.SyncCheckpointFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>[]
          }
          create: {
            args: Prisma.SyncCheckpointCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>
          }
          createMany: {
            args: Prisma.SyncCheckpointCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncCheckpointCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>[]
          }
          delete: {
            args: Prisma.SyncCheckpointDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>
          }
          update: {
            args: Prisma.SyncCheckpointUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>
          }
          deleteMany: {
            args: Prisma.SyncCheckpointDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncCheckpointUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SyncCheckpointUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncCheckpointPayload>
          }
          aggregate: {
            args: Prisma.SyncCheckpointAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncCheckpoint>
          }
          groupBy: {
            args: Prisma.SyncCheckpointGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncCheckpointGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncCheckpointCountArgs<ExtArgs>
            result: $Utils.Optional<SyncCheckpointCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ProductSku: {
        payload: Prisma.$ProductSkuPayload<ExtArgs>
        fields: Prisma.ProductSkuFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductSkuFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductSkuFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>
          }
          findFirst: {
            args: Prisma.ProductSkuFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductSkuFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>
          }
          findMany: {
            args: Prisma.ProductSkuFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>[]
          }
          create: {
            args: Prisma.ProductSkuCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>
          }
          createMany: {
            args: Prisma.ProductSkuCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductSkuCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>[]
          }
          delete: {
            args: Prisma.ProductSkuDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>
          }
          update: {
            args: Prisma.ProductSkuUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>
          }
          deleteMany: {
            args: Prisma.ProductSkuDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductSkuUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductSkuUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSkuPayload>
          }
          aggregate: {
            args: Prisma.ProductSkuAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductSku>
          }
          groupBy: {
            args: Prisma.ProductSkuGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductSkuGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductSkuCountArgs<ExtArgs>
            result: $Utils.Optional<ProductSkuCountAggregateOutputType> | number
          }
        }
      }
      Cart: {
        payload: Prisma.$CartPayload<ExtArgs>
        fields: Prisma.CartFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CartFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CartFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          findFirst: {
            args: Prisma.CartFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CartFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          findMany: {
            args: Prisma.CartFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>[]
          }
          create: {
            args: Prisma.CartCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          createMany: {
            args: Prisma.CartCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CartCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>[]
          }
          delete: {
            args: Prisma.CartDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          update: {
            args: Prisma.CartUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          deleteMany: {
            args: Prisma.CartDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CartUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CartUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          aggregate: {
            args: Prisma.CartAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCart>
          }
          groupBy: {
            args: Prisma.CartGroupByArgs<ExtArgs>
            result: $Utils.Optional<CartGroupByOutputType>[]
          }
          count: {
            args: Prisma.CartCountArgs<ExtArgs>
            result: $Utils.Optional<CartCountAggregateOutputType> | number
          }
        }
      }
      CartItem: {
        payload: Prisma.$CartItemPayload<ExtArgs>
        fields: Prisma.CartItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CartItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CartItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findFirst: {
            args: Prisma.CartItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CartItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findMany: {
            args: Prisma.CartItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          create: {
            args: Prisma.CartItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          createMany: {
            args: Prisma.CartItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CartItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          delete: {
            args: Prisma.CartItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          update: {
            args: Prisma.CartItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          deleteMany: {
            args: Prisma.CartItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CartItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CartItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          aggregate: {
            args: Prisma.CartItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCartItem>
          }
          groupBy: {
            args: Prisma.CartItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<CartItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.CartItemCountArgs<ExtArgs>
            result: $Utils.Optional<CartItemCountAggregateOutputType> | number
          }
        }
      }
      SalesOrder: {
        payload: Prisma.$SalesOrderPayload<ExtArgs>
        fields: Prisma.SalesOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalesOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalesOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>
          }
          findFirst: {
            args: Prisma.SalesOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalesOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>
          }
          findMany: {
            args: Prisma.SalesOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>[]
          }
          create: {
            args: Prisma.SalesOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>
          }
          createMany: {
            args: Prisma.SalesOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalesOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>[]
          }
          delete: {
            args: Prisma.SalesOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>
          }
          update: {
            args: Prisma.SalesOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>
          }
          deleteMany: {
            args: Prisma.SalesOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalesOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SalesOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderPayload>
          }
          aggregate: {
            args: Prisma.SalesOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSalesOrder>
          }
          groupBy: {
            args: Prisma.SalesOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalesOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalesOrderCountArgs<ExtArgs>
            result: $Utils.Optional<SalesOrderCountAggregateOutputType> | number
          }
        }
      }
      SalesOrderLine: {
        payload: Prisma.$SalesOrderLinePayload<ExtArgs>
        fields: Prisma.SalesOrderLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalesOrderLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalesOrderLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>
          }
          findFirst: {
            args: Prisma.SalesOrderLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalesOrderLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>
          }
          findMany: {
            args: Prisma.SalesOrderLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>[]
          }
          create: {
            args: Prisma.SalesOrderLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>
          }
          createMany: {
            args: Prisma.SalesOrderLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalesOrderLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>[]
          }
          delete: {
            args: Prisma.SalesOrderLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>
          }
          update: {
            args: Prisma.SalesOrderLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>
          }
          deleteMany: {
            args: Prisma.SalesOrderLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalesOrderLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SalesOrderLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesOrderLinePayload>
          }
          aggregate: {
            args: Prisma.SalesOrderLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSalesOrderLine>
          }
          groupBy: {
            args: Prisma.SalesOrderLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalesOrderLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalesOrderLineCountArgs<ExtArgs>
            result: $Utils.Optional<SalesOrderLineCountAggregateOutputType> | number
          }
        }
      }
      OrderWritebackLog: {
        payload: Prisma.$OrderWritebackLogPayload<ExtArgs>
        fields: Prisma.OrderWritebackLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderWritebackLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderWritebackLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>
          }
          findFirst: {
            args: Prisma.OrderWritebackLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderWritebackLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>
          }
          findMany: {
            args: Prisma.OrderWritebackLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>[]
          }
          create: {
            args: Prisma.OrderWritebackLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>
          }
          createMany: {
            args: Prisma.OrderWritebackLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderWritebackLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>[]
          }
          delete: {
            args: Prisma.OrderWritebackLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>
          }
          update: {
            args: Prisma.OrderWritebackLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>
          }
          deleteMany: {
            args: Prisma.OrderWritebackLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderWritebackLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderWritebackLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderWritebackLogPayload>
          }
          aggregate: {
            args: Prisma.OrderWritebackLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderWritebackLog>
          }
          groupBy: {
            args: Prisma.OrderWritebackLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderWritebackLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderWritebackLogCountArgs<ExtArgs>
            result: $Utils.Optional<OrderWritebackLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    deliveries: number
    reconciliations: number
    cartItems: number
    salesOrders: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deliveries?: boolean | CustomerCountOutputTypeCountDeliveriesArgs
    reconciliations?: boolean | CustomerCountOutputTypeCountReconciliationsArgs
    cartItems?: boolean | CustomerCountOutputTypeCountCartItemsArgs
    salesOrders?: boolean | CustomerCountOutputTypeCountSalesOrdersArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountDeliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountReconciliationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReconciliationWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountCartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountSalesOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesOrderWhereInput
  }


  /**
   * Count Type ReconciliationCountOutputType
   */

  export type ReconciliationCountOutputType = {
    lines: number
  }

  export type ReconciliationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lines?: boolean | ReconciliationCountOutputTypeCountLinesArgs
  }

  // Custom InputTypes
  /**
   * ReconciliationCountOutputType without action
   */
  export type ReconciliationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationCountOutputType
     */
    select?: ReconciliationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReconciliationCountOutputType without action
   */
  export type ReconciliationCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReconciliationLineWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    skus: number
    cartItems: number
    orderLines: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skus?: boolean | ProductCountOutputTypeCountSkusArgs
    cartItems?: boolean | ProductCountOutputTypeCountCartItemsArgs
    orderLines?: boolean | ProductCountOutputTypeCountOrderLinesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountSkusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductSkuWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountCartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountOrderLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesOrderLineWhereInput
  }


  /**
   * Count Type ProductSkuCountOutputType
   */

  export type ProductSkuCountOutputType = {
    cartItems: number
    orderLines: number
  }

  export type ProductSkuCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cartItems?: boolean | ProductSkuCountOutputTypeCountCartItemsArgs
    orderLines?: boolean | ProductSkuCountOutputTypeCountOrderLinesArgs
  }

  // Custom InputTypes
  /**
   * ProductSkuCountOutputType without action
   */
  export type ProductSkuCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSkuCountOutputType
     */
    select?: ProductSkuCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductSkuCountOutputType without action
   */
  export type ProductSkuCountOutputTypeCountCartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
  }

  /**
   * ProductSkuCountOutputType without action
   */
  export type ProductSkuCountOutputTypeCountOrderLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesOrderLineWhereInput
  }


  /**
   * Count Type CartCountOutputType
   */

  export type CartCountOutputType = {
    items: number
  }

  export type CartCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | CartCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * CartCountOutputType without action
   */
  export type CartCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartCountOutputType
     */
    select?: CartCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CartCountOutputType without action
   */
  export type CartCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
  }


  /**
   * Count Type SalesOrderCountOutputType
   */

  export type SalesOrderCountOutputType = {
    lines: number
    writebackLogs: number
    deliveries: number
  }

  export type SalesOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lines?: boolean | SalesOrderCountOutputTypeCountLinesArgs
    writebackLogs?: boolean | SalesOrderCountOutputTypeCountWritebackLogsArgs
    deliveries?: boolean | SalesOrderCountOutputTypeCountDeliveriesArgs
  }

  // Custom InputTypes
  /**
   * SalesOrderCountOutputType without action
   */
  export type SalesOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderCountOutputType
     */
    select?: SalesOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SalesOrderCountOutputType without action
   */
  export type SalesOrderCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesOrderLineWhereInput
  }

  /**
   * SalesOrderCountOutputType without action
   */
  export type SalesOrderCountOutputTypeCountWritebackLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWritebackLogWhereInput
  }

  /**
   * SalesOrderCountOutputType without action
   */
  export type SalesOrderCountOutputTypeCountDeliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model KingdeeToken
   */

  export type AggregateKingdeeToken = {
    _count: KingdeeTokenCountAggregateOutputType | null
    _avg: KingdeeTokenAvgAggregateOutputType | null
    _sum: KingdeeTokenSumAggregateOutputType | null
    _min: KingdeeTokenMinAggregateOutputType | null
    _max: KingdeeTokenMaxAggregateOutputType | null
  }

  export type KingdeeTokenAvgAggregateOutputType = {
    id: number | null
  }

  export type KingdeeTokenSumAggregateOutputType = {
    id: number | null
  }

  export type KingdeeTokenMinAggregateOutputType = {
    id: number | null
    env: string | null
    appToken: string | null
    expiresAt: Date | null
    updatedAt: Date | null
  }

  export type KingdeeTokenMaxAggregateOutputType = {
    id: number | null
    env: string | null
    appToken: string | null
    expiresAt: Date | null
    updatedAt: Date | null
  }

  export type KingdeeTokenCountAggregateOutputType = {
    id: number
    env: number
    appToken: number
    expiresAt: number
    updatedAt: number
    _all: number
  }


  export type KingdeeTokenAvgAggregateInputType = {
    id?: true
  }

  export type KingdeeTokenSumAggregateInputType = {
    id?: true
  }

  export type KingdeeTokenMinAggregateInputType = {
    id?: true
    env?: true
    appToken?: true
    expiresAt?: true
    updatedAt?: true
  }

  export type KingdeeTokenMaxAggregateInputType = {
    id?: true
    env?: true
    appToken?: true
    expiresAt?: true
    updatedAt?: true
  }

  export type KingdeeTokenCountAggregateInputType = {
    id?: true
    env?: true
    appToken?: true
    expiresAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KingdeeTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KingdeeToken to aggregate.
     */
    where?: KingdeeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeTokens to fetch.
     */
    orderBy?: KingdeeTokenOrderByWithRelationInput | KingdeeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KingdeeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KingdeeTokens
    **/
    _count?: true | KingdeeTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KingdeeTokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KingdeeTokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KingdeeTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KingdeeTokenMaxAggregateInputType
  }

  export type GetKingdeeTokenAggregateType<T extends KingdeeTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateKingdeeToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKingdeeToken[P]>
      : GetScalarType<T[P], AggregateKingdeeToken[P]>
  }




  export type KingdeeTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KingdeeTokenWhereInput
    orderBy?: KingdeeTokenOrderByWithAggregationInput | KingdeeTokenOrderByWithAggregationInput[]
    by: KingdeeTokenScalarFieldEnum[] | KingdeeTokenScalarFieldEnum
    having?: KingdeeTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KingdeeTokenCountAggregateInputType | true
    _avg?: KingdeeTokenAvgAggregateInputType
    _sum?: KingdeeTokenSumAggregateInputType
    _min?: KingdeeTokenMinAggregateInputType
    _max?: KingdeeTokenMaxAggregateInputType
  }

  export type KingdeeTokenGroupByOutputType = {
    id: number
    env: string
    appToken: string
    expiresAt: Date
    updatedAt: Date
    _count: KingdeeTokenCountAggregateOutputType | null
    _avg: KingdeeTokenAvgAggregateOutputType | null
    _sum: KingdeeTokenSumAggregateOutputType | null
    _min: KingdeeTokenMinAggregateOutputType | null
    _max: KingdeeTokenMaxAggregateOutputType | null
  }

  type GetKingdeeTokenGroupByPayload<T extends KingdeeTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KingdeeTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KingdeeTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KingdeeTokenGroupByOutputType[P]>
            : GetScalarType<T[P], KingdeeTokenGroupByOutputType[P]>
        }
      >
    >


  export type KingdeeTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    env?: boolean
    appToken?: boolean
    expiresAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["kingdeeToken"]>

  export type KingdeeTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    env?: boolean
    appToken?: boolean
    expiresAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["kingdeeToken"]>

  export type KingdeeTokenSelectScalar = {
    id?: boolean
    env?: boolean
    appToken?: boolean
    expiresAt?: boolean
    updatedAt?: boolean
  }


  export type $KingdeeTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KingdeeToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      env: string
      appToken: string
      expiresAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kingdeeToken"]>
    composites: {}
  }

  type KingdeeTokenGetPayload<S extends boolean | null | undefined | KingdeeTokenDefaultArgs> = $Result.GetResult<Prisma.$KingdeeTokenPayload, S>

  type KingdeeTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<KingdeeTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: KingdeeTokenCountAggregateInputType | true
    }

  export interface KingdeeTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KingdeeToken'], meta: { name: 'KingdeeToken' } }
    /**
     * Find zero or one KingdeeToken that matches the filter.
     * @param {KingdeeTokenFindUniqueArgs} args - Arguments to find a KingdeeToken
     * @example
     * // Get one KingdeeToken
     * const kingdeeToken = await prisma.kingdeeToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KingdeeTokenFindUniqueArgs>(args: SelectSubset<T, KingdeeTokenFindUniqueArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one KingdeeToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {KingdeeTokenFindUniqueOrThrowArgs} args - Arguments to find a KingdeeToken
     * @example
     * // Get one KingdeeToken
     * const kingdeeToken = await prisma.kingdeeToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KingdeeTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, KingdeeTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first KingdeeToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeTokenFindFirstArgs} args - Arguments to find a KingdeeToken
     * @example
     * // Get one KingdeeToken
     * const kingdeeToken = await prisma.kingdeeToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KingdeeTokenFindFirstArgs>(args?: SelectSubset<T, KingdeeTokenFindFirstArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first KingdeeToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeTokenFindFirstOrThrowArgs} args - Arguments to find a KingdeeToken
     * @example
     * // Get one KingdeeToken
     * const kingdeeToken = await prisma.kingdeeToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KingdeeTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, KingdeeTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more KingdeeTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KingdeeTokens
     * const kingdeeTokens = await prisma.kingdeeToken.findMany()
     * 
     * // Get first 10 KingdeeTokens
     * const kingdeeTokens = await prisma.kingdeeToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kingdeeTokenWithIdOnly = await prisma.kingdeeToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KingdeeTokenFindManyArgs>(args?: SelectSubset<T, KingdeeTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a KingdeeToken.
     * @param {KingdeeTokenCreateArgs} args - Arguments to create a KingdeeToken.
     * @example
     * // Create one KingdeeToken
     * const KingdeeToken = await prisma.kingdeeToken.create({
     *   data: {
     *     // ... data to create a KingdeeToken
     *   }
     * })
     * 
     */
    create<T extends KingdeeTokenCreateArgs>(args: SelectSubset<T, KingdeeTokenCreateArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many KingdeeTokens.
     * @param {KingdeeTokenCreateManyArgs} args - Arguments to create many KingdeeTokens.
     * @example
     * // Create many KingdeeTokens
     * const kingdeeToken = await prisma.kingdeeToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KingdeeTokenCreateManyArgs>(args?: SelectSubset<T, KingdeeTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KingdeeTokens and returns the data saved in the database.
     * @param {KingdeeTokenCreateManyAndReturnArgs} args - Arguments to create many KingdeeTokens.
     * @example
     * // Create many KingdeeTokens
     * const kingdeeToken = await prisma.kingdeeToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KingdeeTokens and only return the `id`
     * const kingdeeTokenWithIdOnly = await prisma.kingdeeToken.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KingdeeTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, KingdeeTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a KingdeeToken.
     * @param {KingdeeTokenDeleteArgs} args - Arguments to delete one KingdeeToken.
     * @example
     * // Delete one KingdeeToken
     * const KingdeeToken = await prisma.kingdeeToken.delete({
     *   where: {
     *     // ... filter to delete one KingdeeToken
     *   }
     * })
     * 
     */
    delete<T extends KingdeeTokenDeleteArgs>(args: SelectSubset<T, KingdeeTokenDeleteArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one KingdeeToken.
     * @param {KingdeeTokenUpdateArgs} args - Arguments to update one KingdeeToken.
     * @example
     * // Update one KingdeeToken
     * const kingdeeToken = await prisma.kingdeeToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KingdeeTokenUpdateArgs>(args: SelectSubset<T, KingdeeTokenUpdateArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more KingdeeTokens.
     * @param {KingdeeTokenDeleteManyArgs} args - Arguments to filter KingdeeTokens to delete.
     * @example
     * // Delete a few KingdeeTokens
     * const { count } = await prisma.kingdeeToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KingdeeTokenDeleteManyArgs>(args?: SelectSubset<T, KingdeeTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KingdeeTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KingdeeTokens
     * const kingdeeToken = await prisma.kingdeeToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KingdeeTokenUpdateManyArgs>(args: SelectSubset<T, KingdeeTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one KingdeeToken.
     * @param {KingdeeTokenUpsertArgs} args - Arguments to update or create a KingdeeToken.
     * @example
     * // Update or create a KingdeeToken
     * const kingdeeToken = await prisma.kingdeeToken.upsert({
     *   create: {
     *     // ... data to create a KingdeeToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KingdeeToken we want to update
     *   }
     * })
     */
    upsert<T extends KingdeeTokenUpsertArgs>(args: SelectSubset<T, KingdeeTokenUpsertArgs<ExtArgs>>): Prisma__KingdeeTokenClient<$Result.GetResult<Prisma.$KingdeeTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of KingdeeTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeTokenCountArgs} args - Arguments to filter KingdeeTokens to count.
     * @example
     * // Count the number of KingdeeTokens
     * const count = await prisma.kingdeeToken.count({
     *   where: {
     *     // ... the filter for the KingdeeTokens we want to count
     *   }
     * })
    **/
    count<T extends KingdeeTokenCountArgs>(
      args?: Subset<T, KingdeeTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KingdeeTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KingdeeToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KingdeeTokenAggregateArgs>(args: Subset<T, KingdeeTokenAggregateArgs>): Prisma.PrismaPromise<GetKingdeeTokenAggregateType<T>>

    /**
     * Group by KingdeeToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KingdeeTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KingdeeTokenGroupByArgs['orderBy'] }
        : { orderBy?: KingdeeTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KingdeeTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKingdeeTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KingdeeToken model
   */
  readonly fields: KingdeeTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KingdeeToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KingdeeTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KingdeeToken model
   */ 
  interface KingdeeTokenFieldRefs {
    readonly id: FieldRef<"KingdeeToken", 'Int'>
    readonly env: FieldRef<"KingdeeToken", 'String'>
    readonly appToken: FieldRef<"KingdeeToken", 'String'>
    readonly expiresAt: FieldRef<"KingdeeToken", 'DateTime'>
    readonly updatedAt: FieldRef<"KingdeeToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KingdeeToken findUnique
   */
  export type KingdeeTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeToken to fetch.
     */
    where: KingdeeTokenWhereUniqueInput
  }

  /**
   * KingdeeToken findUniqueOrThrow
   */
  export type KingdeeTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeToken to fetch.
     */
    where: KingdeeTokenWhereUniqueInput
  }

  /**
   * KingdeeToken findFirst
   */
  export type KingdeeTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeToken to fetch.
     */
    where?: KingdeeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeTokens to fetch.
     */
    orderBy?: KingdeeTokenOrderByWithRelationInput | KingdeeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KingdeeTokens.
     */
    cursor?: KingdeeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KingdeeTokens.
     */
    distinct?: KingdeeTokenScalarFieldEnum | KingdeeTokenScalarFieldEnum[]
  }

  /**
   * KingdeeToken findFirstOrThrow
   */
  export type KingdeeTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeToken to fetch.
     */
    where?: KingdeeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeTokens to fetch.
     */
    orderBy?: KingdeeTokenOrderByWithRelationInput | KingdeeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KingdeeTokens.
     */
    cursor?: KingdeeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KingdeeTokens.
     */
    distinct?: KingdeeTokenScalarFieldEnum | KingdeeTokenScalarFieldEnum[]
  }

  /**
   * KingdeeToken findMany
   */
  export type KingdeeTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeTokens to fetch.
     */
    where?: KingdeeTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeTokens to fetch.
     */
    orderBy?: KingdeeTokenOrderByWithRelationInput | KingdeeTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KingdeeTokens.
     */
    cursor?: KingdeeTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeTokens.
     */
    skip?: number
    distinct?: KingdeeTokenScalarFieldEnum | KingdeeTokenScalarFieldEnum[]
  }

  /**
   * KingdeeToken create
   */
  export type KingdeeTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * The data needed to create a KingdeeToken.
     */
    data: XOR<KingdeeTokenCreateInput, KingdeeTokenUncheckedCreateInput>
  }

  /**
   * KingdeeToken createMany
   */
  export type KingdeeTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KingdeeTokens.
     */
    data: KingdeeTokenCreateManyInput | KingdeeTokenCreateManyInput[]
  }

  /**
   * KingdeeToken createManyAndReturn
   */
  export type KingdeeTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many KingdeeTokens.
     */
    data: KingdeeTokenCreateManyInput | KingdeeTokenCreateManyInput[]
  }

  /**
   * KingdeeToken update
   */
  export type KingdeeTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * The data needed to update a KingdeeToken.
     */
    data: XOR<KingdeeTokenUpdateInput, KingdeeTokenUncheckedUpdateInput>
    /**
     * Choose, which KingdeeToken to update.
     */
    where: KingdeeTokenWhereUniqueInput
  }

  /**
   * KingdeeToken updateMany
   */
  export type KingdeeTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KingdeeTokens.
     */
    data: XOR<KingdeeTokenUpdateManyMutationInput, KingdeeTokenUncheckedUpdateManyInput>
    /**
     * Filter which KingdeeTokens to update
     */
    where?: KingdeeTokenWhereInput
  }

  /**
   * KingdeeToken upsert
   */
  export type KingdeeTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * The filter to search for the KingdeeToken to update in case it exists.
     */
    where: KingdeeTokenWhereUniqueInput
    /**
     * In case the KingdeeToken found by the `where` argument doesn't exist, create a new KingdeeToken with this data.
     */
    create: XOR<KingdeeTokenCreateInput, KingdeeTokenUncheckedCreateInput>
    /**
     * In case the KingdeeToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KingdeeTokenUpdateInput, KingdeeTokenUncheckedUpdateInput>
  }

  /**
   * KingdeeToken delete
   */
  export type KingdeeTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
    /**
     * Filter which KingdeeToken to delete.
     */
    where: KingdeeTokenWhereUniqueInput
  }

  /**
   * KingdeeToken deleteMany
   */
  export type KingdeeTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KingdeeTokens to delete
     */
    where?: KingdeeTokenWhereInput
  }

  /**
   * KingdeeToken without action
   */
  export type KingdeeTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeToken
     */
    select?: KingdeeTokenSelect<ExtArgs> | null
  }


  /**
   * Model KingdeeRawDocument
   */

  export type AggregateKingdeeRawDocument = {
    _count: KingdeeRawDocumentCountAggregateOutputType | null
    _avg: KingdeeRawDocumentAvgAggregateOutputType | null
    _sum: KingdeeRawDocumentSumAggregateOutputType | null
    _min: KingdeeRawDocumentMinAggregateOutputType | null
    _max: KingdeeRawDocumentMaxAggregateOutputType | null
  }

  export type KingdeeRawDocumentAvgAggregateOutputType = {
    id: number | null
  }

  export type KingdeeRawDocumentSumAggregateOutputType = {
    id: number | null
  }

  export type KingdeeRawDocumentMinAggregateOutputType = {
    id: number | null
    docType: string | null
    kingdeeId: string | null
    number: string | null
    payloadJson: string | null
    fetchedAt: Date | null
    hash: string | null
  }

  export type KingdeeRawDocumentMaxAggregateOutputType = {
    id: number | null
    docType: string | null
    kingdeeId: string | null
    number: string | null
    payloadJson: string | null
    fetchedAt: Date | null
    hash: string | null
  }

  export type KingdeeRawDocumentCountAggregateOutputType = {
    id: number
    docType: number
    kingdeeId: number
    number: number
    payloadJson: number
    fetchedAt: number
    hash: number
    _all: number
  }


  export type KingdeeRawDocumentAvgAggregateInputType = {
    id?: true
  }

  export type KingdeeRawDocumentSumAggregateInputType = {
    id?: true
  }

  export type KingdeeRawDocumentMinAggregateInputType = {
    id?: true
    docType?: true
    kingdeeId?: true
    number?: true
    payloadJson?: true
    fetchedAt?: true
    hash?: true
  }

  export type KingdeeRawDocumentMaxAggregateInputType = {
    id?: true
    docType?: true
    kingdeeId?: true
    number?: true
    payloadJson?: true
    fetchedAt?: true
    hash?: true
  }

  export type KingdeeRawDocumentCountAggregateInputType = {
    id?: true
    docType?: true
    kingdeeId?: true
    number?: true
    payloadJson?: true
    fetchedAt?: true
    hash?: true
    _all?: true
  }

  export type KingdeeRawDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KingdeeRawDocument to aggregate.
     */
    where?: KingdeeRawDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeRawDocuments to fetch.
     */
    orderBy?: KingdeeRawDocumentOrderByWithRelationInput | KingdeeRawDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KingdeeRawDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeRawDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeRawDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KingdeeRawDocuments
    **/
    _count?: true | KingdeeRawDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KingdeeRawDocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KingdeeRawDocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KingdeeRawDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KingdeeRawDocumentMaxAggregateInputType
  }

  export type GetKingdeeRawDocumentAggregateType<T extends KingdeeRawDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateKingdeeRawDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKingdeeRawDocument[P]>
      : GetScalarType<T[P], AggregateKingdeeRawDocument[P]>
  }




  export type KingdeeRawDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KingdeeRawDocumentWhereInput
    orderBy?: KingdeeRawDocumentOrderByWithAggregationInput | KingdeeRawDocumentOrderByWithAggregationInput[]
    by: KingdeeRawDocumentScalarFieldEnum[] | KingdeeRawDocumentScalarFieldEnum
    having?: KingdeeRawDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KingdeeRawDocumentCountAggregateInputType | true
    _avg?: KingdeeRawDocumentAvgAggregateInputType
    _sum?: KingdeeRawDocumentSumAggregateInputType
    _min?: KingdeeRawDocumentMinAggregateInputType
    _max?: KingdeeRawDocumentMaxAggregateInputType
  }

  export type KingdeeRawDocumentGroupByOutputType = {
    id: number
    docType: string
    kingdeeId: string | null
    number: string | null
    payloadJson: string
    fetchedAt: Date
    hash: string
    _count: KingdeeRawDocumentCountAggregateOutputType | null
    _avg: KingdeeRawDocumentAvgAggregateOutputType | null
    _sum: KingdeeRawDocumentSumAggregateOutputType | null
    _min: KingdeeRawDocumentMinAggregateOutputType | null
    _max: KingdeeRawDocumentMaxAggregateOutputType | null
  }

  type GetKingdeeRawDocumentGroupByPayload<T extends KingdeeRawDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KingdeeRawDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KingdeeRawDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KingdeeRawDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], KingdeeRawDocumentGroupByOutputType[P]>
        }
      >
    >


  export type KingdeeRawDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    docType?: boolean
    kingdeeId?: boolean
    number?: boolean
    payloadJson?: boolean
    fetchedAt?: boolean
    hash?: boolean
  }, ExtArgs["result"]["kingdeeRawDocument"]>

  export type KingdeeRawDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    docType?: boolean
    kingdeeId?: boolean
    number?: boolean
    payloadJson?: boolean
    fetchedAt?: boolean
    hash?: boolean
  }, ExtArgs["result"]["kingdeeRawDocument"]>

  export type KingdeeRawDocumentSelectScalar = {
    id?: boolean
    docType?: boolean
    kingdeeId?: boolean
    number?: boolean
    payloadJson?: boolean
    fetchedAt?: boolean
    hash?: boolean
  }


  export type $KingdeeRawDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KingdeeRawDocument"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      docType: string
      kingdeeId: string | null
      number: string | null
      payloadJson: string
      fetchedAt: Date
      hash: string
    }, ExtArgs["result"]["kingdeeRawDocument"]>
    composites: {}
  }

  type KingdeeRawDocumentGetPayload<S extends boolean | null | undefined | KingdeeRawDocumentDefaultArgs> = $Result.GetResult<Prisma.$KingdeeRawDocumentPayload, S>

  type KingdeeRawDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<KingdeeRawDocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: KingdeeRawDocumentCountAggregateInputType | true
    }

  export interface KingdeeRawDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KingdeeRawDocument'], meta: { name: 'KingdeeRawDocument' } }
    /**
     * Find zero or one KingdeeRawDocument that matches the filter.
     * @param {KingdeeRawDocumentFindUniqueArgs} args - Arguments to find a KingdeeRawDocument
     * @example
     * // Get one KingdeeRawDocument
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KingdeeRawDocumentFindUniqueArgs>(args: SelectSubset<T, KingdeeRawDocumentFindUniqueArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one KingdeeRawDocument that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {KingdeeRawDocumentFindUniqueOrThrowArgs} args - Arguments to find a KingdeeRawDocument
     * @example
     * // Get one KingdeeRawDocument
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KingdeeRawDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, KingdeeRawDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first KingdeeRawDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeRawDocumentFindFirstArgs} args - Arguments to find a KingdeeRawDocument
     * @example
     * // Get one KingdeeRawDocument
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KingdeeRawDocumentFindFirstArgs>(args?: SelectSubset<T, KingdeeRawDocumentFindFirstArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first KingdeeRawDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeRawDocumentFindFirstOrThrowArgs} args - Arguments to find a KingdeeRawDocument
     * @example
     * // Get one KingdeeRawDocument
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KingdeeRawDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, KingdeeRawDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more KingdeeRawDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeRawDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KingdeeRawDocuments
     * const kingdeeRawDocuments = await prisma.kingdeeRawDocument.findMany()
     * 
     * // Get first 10 KingdeeRawDocuments
     * const kingdeeRawDocuments = await prisma.kingdeeRawDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kingdeeRawDocumentWithIdOnly = await prisma.kingdeeRawDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KingdeeRawDocumentFindManyArgs>(args?: SelectSubset<T, KingdeeRawDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a KingdeeRawDocument.
     * @param {KingdeeRawDocumentCreateArgs} args - Arguments to create a KingdeeRawDocument.
     * @example
     * // Create one KingdeeRawDocument
     * const KingdeeRawDocument = await prisma.kingdeeRawDocument.create({
     *   data: {
     *     // ... data to create a KingdeeRawDocument
     *   }
     * })
     * 
     */
    create<T extends KingdeeRawDocumentCreateArgs>(args: SelectSubset<T, KingdeeRawDocumentCreateArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many KingdeeRawDocuments.
     * @param {KingdeeRawDocumentCreateManyArgs} args - Arguments to create many KingdeeRawDocuments.
     * @example
     * // Create many KingdeeRawDocuments
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KingdeeRawDocumentCreateManyArgs>(args?: SelectSubset<T, KingdeeRawDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KingdeeRawDocuments and returns the data saved in the database.
     * @param {KingdeeRawDocumentCreateManyAndReturnArgs} args - Arguments to create many KingdeeRawDocuments.
     * @example
     * // Create many KingdeeRawDocuments
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KingdeeRawDocuments and only return the `id`
     * const kingdeeRawDocumentWithIdOnly = await prisma.kingdeeRawDocument.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KingdeeRawDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, KingdeeRawDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a KingdeeRawDocument.
     * @param {KingdeeRawDocumentDeleteArgs} args - Arguments to delete one KingdeeRawDocument.
     * @example
     * // Delete one KingdeeRawDocument
     * const KingdeeRawDocument = await prisma.kingdeeRawDocument.delete({
     *   where: {
     *     // ... filter to delete one KingdeeRawDocument
     *   }
     * })
     * 
     */
    delete<T extends KingdeeRawDocumentDeleteArgs>(args: SelectSubset<T, KingdeeRawDocumentDeleteArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one KingdeeRawDocument.
     * @param {KingdeeRawDocumentUpdateArgs} args - Arguments to update one KingdeeRawDocument.
     * @example
     * // Update one KingdeeRawDocument
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KingdeeRawDocumentUpdateArgs>(args: SelectSubset<T, KingdeeRawDocumentUpdateArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more KingdeeRawDocuments.
     * @param {KingdeeRawDocumentDeleteManyArgs} args - Arguments to filter KingdeeRawDocuments to delete.
     * @example
     * // Delete a few KingdeeRawDocuments
     * const { count } = await prisma.kingdeeRawDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KingdeeRawDocumentDeleteManyArgs>(args?: SelectSubset<T, KingdeeRawDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KingdeeRawDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeRawDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KingdeeRawDocuments
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KingdeeRawDocumentUpdateManyArgs>(args: SelectSubset<T, KingdeeRawDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one KingdeeRawDocument.
     * @param {KingdeeRawDocumentUpsertArgs} args - Arguments to update or create a KingdeeRawDocument.
     * @example
     * // Update or create a KingdeeRawDocument
     * const kingdeeRawDocument = await prisma.kingdeeRawDocument.upsert({
     *   create: {
     *     // ... data to create a KingdeeRawDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KingdeeRawDocument we want to update
     *   }
     * })
     */
    upsert<T extends KingdeeRawDocumentUpsertArgs>(args: SelectSubset<T, KingdeeRawDocumentUpsertArgs<ExtArgs>>): Prisma__KingdeeRawDocumentClient<$Result.GetResult<Prisma.$KingdeeRawDocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of KingdeeRawDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeRawDocumentCountArgs} args - Arguments to filter KingdeeRawDocuments to count.
     * @example
     * // Count the number of KingdeeRawDocuments
     * const count = await prisma.kingdeeRawDocument.count({
     *   where: {
     *     // ... the filter for the KingdeeRawDocuments we want to count
     *   }
     * })
    **/
    count<T extends KingdeeRawDocumentCountArgs>(
      args?: Subset<T, KingdeeRawDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KingdeeRawDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KingdeeRawDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeRawDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KingdeeRawDocumentAggregateArgs>(args: Subset<T, KingdeeRawDocumentAggregateArgs>): Prisma.PrismaPromise<GetKingdeeRawDocumentAggregateType<T>>

    /**
     * Group by KingdeeRawDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KingdeeRawDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KingdeeRawDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KingdeeRawDocumentGroupByArgs['orderBy'] }
        : { orderBy?: KingdeeRawDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KingdeeRawDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKingdeeRawDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KingdeeRawDocument model
   */
  readonly fields: KingdeeRawDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KingdeeRawDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KingdeeRawDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KingdeeRawDocument model
   */ 
  interface KingdeeRawDocumentFieldRefs {
    readonly id: FieldRef<"KingdeeRawDocument", 'Int'>
    readonly docType: FieldRef<"KingdeeRawDocument", 'String'>
    readonly kingdeeId: FieldRef<"KingdeeRawDocument", 'String'>
    readonly number: FieldRef<"KingdeeRawDocument", 'String'>
    readonly payloadJson: FieldRef<"KingdeeRawDocument", 'String'>
    readonly fetchedAt: FieldRef<"KingdeeRawDocument", 'DateTime'>
    readonly hash: FieldRef<"KingdeeRawDocument", 'String'>
  }
    

  // Custom InputTypes
  /**
   * KingdeeRawDocument findUnique
   */
  export type KingdeeRawDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeRawDocument to fetch.
     */
    where: KingdeeRawDocumentWhereUniqueInput
  }

  /**
   * KingdeeRawDocument findUniqueOrThrow
   */
  export type KingdeeRawDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeRawDocument to fetch.
     */
    where: KingdeeRawDocumentWhereUniqueInput
  }

  /**
   * KingdeeRawDocument findFirst
   */
  export type KingdeeRawDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeRawDocument to fetch.
     */
    where?: KingdeeRawDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeRawDocuments to fetch.
     */
    orderBy?: KingdeeRawDocumentOrderByWithRelationInput | KingdeeRawDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KingdeeRawDocuments.
     */
    cursor?: KingdeeRawDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeRawDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeRawDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KingdeeRawDocuments.
     */
    distinct?: KingdeeRawDocumentScalarFieldEnum | KingdeeRawDocumentScalarFieldEnum[]
  }

  /**
   * KingdeeRawDocument findFirstOrThrow
   */
  export type KingdeeRawDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeRawDocument to fetch.
     */
    where?: KingdeeRawDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeRawDocuments to fetch.
     */
    orderBy?: KingdeeRawDocumentOrderByWithRelationInput | KingdeeRawDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KingdeeRawDocuments.
     */
    cursor?: KingdeeRawDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeRawDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeRawDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KingdeeRawDocuments.
     */
    distinct?: KingdeeRawDocumentScalarFieldEnum | KingdeeRawDocumentScalarFieldEnum[]
  }

  /**
   * KingdeeRawDocument findMany
   */
  export type KingdeeRawDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * Filter, which KingdeeRawDocuments to fetch.
     */
    where?: KingdeeRawDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KingdeeRawDocuments to fetch.
     */
    orderBy?: KingdeeRawDocumentOrderByWithRelationInput | KingdeeRawDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KingdeeRawDocuments.
     */
    cursor?: KingdeeRawDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KingdeeRawDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KingdeeRawDocuments.
     */
    skip?: number
    distinct?: KingdeeRawDocumentScalarFieldEnum | KingdeeRawDocumentScalarFieldEnum[]
  }

  /**
   * KingdeeRawDocument create
   */
  export type KingdeeRawDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * The data needed to create a KingdeeRawDocument.
     */
    data: XOR<KingdeeRawDocumentCreateInput, KingdeeRawDocumentUncheckedCreateInput>
  }

  /**
   * KingdeeRawDocument createMany
   */
  export type KingdeeRawDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KingdeeRawDocuments.
     */
    data: KingdeeRawDocumentCreateManyInput | KingdeeRawDocumentCreateManyInput[]
  }

  /**
   * KingdeeRawDocument createManyAndReturn
   */
  export type KingdeeRawDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many KingdeeRawDocuments.
     */
    data: KingdeeRawDocumentCreateManyInput | KingdeeRawDocumentCreateManyInput[]
  }

  /**
   * KingdeeRawDocument update
   */
  export type KingdeeRawDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * The data needed to update a KingdeeRawDocument.
     */
    data: XOR<KingdeeRawDocumentUpdateInput, KingdeeRawDocumentUncheckedUpdateInput>
    /**
     * Choose, which KingdeeRawDocument to update.
     */
    where: KingdeeRawDocumentWhereUniqueInput
  }

  /**
   * KingdeeRawDocument updateMany
   */
  export type KingdeeRawDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KingdeeRawDocuments.
     */
    data: XOR<KingdeeRawDocumentUpdateManyMutationInput, KingdeeRawDocumentUncheckedUpdateManyInput>
    /**
     * Filter which KingdeeRawDocuments to update
     */
    where?: KingdeeRawDocumentWhereInput
  }

  /**
   * KingdeeRawDocument upsert
   */
  export type KingdeeRawDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * The filter to search for the KingdeeRawDocument to update in case it exists.
     */
    where: KingdeeRawDocumentWhereUniqueInput
    /**
     * In case the KingdeeRawDocument found by the `where` argument doesn't exist, create a new KingdeeRawDocument with this data.
     */
    create: XOR<KingdeeRawDocumentCreateInput, KingdeeRawDocumentUncheckedCreateInput>
    /**
     * In case the KingdeeRawDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KingdeeRawDocumentUpdateInput, KingdeeRawDocumentUncheckedUpdateInput>
  }

  /**
   * KingdeeRawDocument delete
   */
  export type KingdeeRawDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
    /**
     * Filter which KingdeeRawDocument to delete.
     */
    where: KingdeeRawDocumentWhereUniqueInput
  }

  /**
   * KingdeeRawDocument deleteMany
   */
  export type KingdeeRawDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KingdeeRawDocuments to delete
     */
    where?: KingdeeRawDocumentWhereInput
  }

  /**
   * KingdeeRawDocument without action
   */
  export type KingdeeRawDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KingdeeRawDocument
     */
    select?: KingdeeRawDocumentSelect<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    kingdeeCustomerId: string | null
    wechatOpenid: string | null
    accessToken: string | null
    tokenExpiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    kingdeeCustomerId: string | null
    wechatOpenid: string | null
    accessToken: string | null
    tokenExpiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    kingdeeCustomerId: number
    wechatOpenid: number
    accessToken: number
    tokenExpiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    kingdeeCustomerId?: true
    wechatOpenid?: true
    accessToken?: true
    tokenExpiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    kingdeeCustomerId?: true
    wechatOpenid?: true
    accessToken?: true
    tokenExpiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    kingdeeCustomerId?: true
    wechatOpenid?: true
    accessToken?: true
    tokenExpiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    name: string
    phone: string | null
    kingdeeCustomerId: string | null
    wechatOpenid: string | null
    accessToken: string | null
    tokenExpiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    kingdeeCustomerId?: boolean
    wechatOpenid?: boolean
    accessToken?: boolean
    tokenExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deliveries?: boolean | Customer$deliveriesArgs<ExtArgs>
    reconciliations?: boolean | Customer$reconciliationsArgs<ExtArgs>
    cart?: boolean | Customer$cartArgs<ExtArgs>
    cartItems?: boolean | Customer$cartItemsArgs<ExtArgs>
    salesOrders?: boolean | Customer$salesOrdersArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    kingdeeCustomerId?: boolean
    wechatOpenid?: boolean
    accessToken?: boolean
    tokenExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    kingdeeCustomerId?: boolean
    wechatOpenid?: boolean
    accessToken?: boolean
    tokenExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deliveries?: boolean | Customer$deliveriesArgs<ExtArgs>
    reconciliations?: boolean | Customer$reconciliationsArgs<ExtArgs>
    cart?: boolean | Customer$cartArgs<ExtArgs>
    cartItems?: boolean | Customer$cartItemsArgs<ExtArgs>
    salesOrders?: boolean | Customer$salesOrdersArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      deliveries: Prisma.$DeliveryPayload<ExtArgs>[]
      reconciliations: Prisma.$ReconciliationPayload<ExtArgs>[]
      cart: Prisma.$CartPayload<ExtArgs> | null
      cartItems: Prisma.$CartItemPayload<ExtArgs>[]
      salesOrders: Prisma.$SalesOrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string | null
      kingdeeCustomerId: string | null
      wechatOpenid: string | null
      accessToken: string | null
      tokenExpiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deliveries<T extends Customer$deliveriesArgs<ExtArgs> = {}>(args?: Subset<T, Customer$deliveriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findMany"> | Null>
    reconciliations<T extends Customer$reconciliationsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$reconciliationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findMany"> | Null>
    cart<T extends Customer$cartArgs<ExtArgs> = {}>(args?: Subset<T, Customer$cartArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    cartItems<T extends Customer$cartItemsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$cartItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany"> | Null>
    salesOrders<T extends Customer$salesOrdersArgs<ExtArgs> = {}>(args?: Subset<T, Customer$salesOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */ 
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly kingdeeCustomerId: FieldRef<"Customer", 'String'>
    readonly wechatOpenid: FieldRef<"Customer", 'String'>
    readonly accessToken: FieldRef<"Customer", 'String'>
    readonly tokenExpiresAt: FieldRef<"Customer", 'DateTime'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer.deliveries
   */
  export type Customer$deliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    where?: DeliveryWhereInput
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    cursor?: DeliveryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * Customer.reconciliations
   */
  export type Customer$reconciliationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    where?: ReconciliationWhereInput
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    cursor?: ReconciliationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReconciliationScalarFieldEnum | ReconciliationScalarFieldEnum[]
  }

  /**
   * Customer.cart
   */
  export type Customer$cartArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    where?: CartWhereInput
  }

  /**
   * Customer.cartItems
   */
  export type Customer$cartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    cursor?: CartItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * Customer.salesOrders
   */
  export type Customer$salesOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    where?: SalesOrderWhereInput
    orderBy?: SalesOrderOrderByWithRelationInput | SalesOrderOrderByWithRelationInput[]
    cursor?: SalesOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesOrderScalarFieldEnum | SalesOrderScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Delivery
   */

  export type AggregateDelivery = {
    _count: DeliveryCountAggregateOutputType | null
    _min: DeliveryMinAggregateOutputType | null
    _max: DeliveryMaxAggregateOutputType | null
  }

  export type DeliveryMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    salesOrderId: string | null
    kingdeeBillId: string | null
    kingdeeBillNumber: string | null
    sourceDocNo: string | null
    detailsJson: string | null
    syncedAt: Date | null
    status: string | null
    signedAt: Date | null
    signedPayloadJson: string | null
    signIdempotencyKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeliveryMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    salesOrderId: string | null
    kingdeeBillId: string | null
    kingdeeBillNumber: string | null
    sourceDocNo: string | null
    detailsJson: string | null
    syncedAt: Date | null
    status: string | null
    signedAt: Date | null
    signedPayloadJson: string | null
    signIdempotencyKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeliveryCountAggregateOutputType = {
    id: number
    customerId: number
    salesOrderId: number
    kingdeeBillId: number
    kingdeeBillNumber: number
    sourceDocNo: number
    detailsJson: number
    syncedAt: number
    status: number
    signedAt: number
    signedPayloadJson: number
    signIdempotencyKey: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeliveryMinAggregateInputType = {
    id?: true
    customerId?: true
    salesOrderId?: true
    kingdeeBillId?: true
    kingdeeBillNumber?: true
    sourceDocNo?: true
    detailsJson?: true
    syncedAt?: true
    status?: true
    signedAt?: true
    signedPayloadJson?: true
    signIdempotencyKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeliveryMaxAggregateInputType = {
    id?: true
    customerId?: true
    salesOrderId?: true
    kingdeeBillId?: true
    kingdeeBillNumber?: true
    sourceDocNo?: true
    detailsJson?: true
    syncedAt?: true
    status?: true
    signedAt?: true
    signedPayloadJson?: true
    signIdempotencyKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeliveryCountAggregateInputType = {
    id?: true
    customerId?: true
    salesOrderId?: true
    kingdeeBillId?: true
    kingdeeBillNumber?: true
    sourceDocNo?: true
    detailsJson?: true
    syncedAt?: true
    status?: true
    signedAt?: true
    signedPayloadJson?: true
    signIdempotencyKey?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeliveryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Delivery to aggregate.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Deliveries
    **/
    _count?: true | DeliveryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeliveryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeliveryMaxAggregateInputType
  }

  export type GetDeliveryAggregateType<T extends DeliveryAggregateArgs> = {
        [P in keyof T & keyof AggregateDelivery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDelivery[P]>
      : GetScalarType<T[P], AggregateDelivery[P]>
  }




  export type DeliveryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryWhereInput
    orderBy?: DeliveryOrderByWithAggregationInput | DeliveryOrderByWithAggregationInput[]
    by: DeliveryScalarFieldEnum[] | DeliveryScalarFieldEnum
    having?: DeliveryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeliveryCountAggregateInputType | true
    _min?: DeliveryMinAggregateInputType
    _max?: DeliveryMaxAggregateInputType
  }

  export type DeliveryGroupByOutputType = {
    id: string
    customerId: string
    salesOrderId: string | null
    kingdeeBillId: string | null
    kingdeeBillNumber: string | null
    sourceDocNo: string | null
    detailsJson: string | null
    syncedAt: Date | null
    status: string
    signedAt: Date | null
    signedPayloadJson: string | null
    signIdempotencyKey: string | null
    createdAt: Date
    updatedAt: Date
    _count: DeliveryCountAggregateOutputType | null
    _min: DeliveryMinAggregateOutputType | null
    _max: DeliveryMaxAggregateOutputType | null
  }

  type GetDeliveryGroupByPayload<T extends DeliveryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeliveryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeliveryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeliveryGroupByOutputType[P]>
            : GetScalarType<T[P], DeliveryGroupByOutputType[P]>
        }
      >
    >


  export type DeliverySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    salesOrderId?: boolean
    kingdeeBillId?: boolean
    kingdeeBillNumber?: boolean
    sourceDocNo?: boolean
    detailsJson?: boolean
    syncedAt?: boolean
    status?: boolean
    signedAt?: boolean
    signedPayloadJson?: boolean
    signIdempotencyKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    salesOrder?: boolean | Delivery$salesOrderArgs<ExtArgs>
  }, ExtArgs["result"]["delivery"]>

  export type DeliverySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    salesOrderId?: boolean
    kingdeeBillId?: boolean
    kingdeeBillNumber?: boolean
    sourceDocNo?: boolean
    detailsJson?: boolean
    syncedAt?: boolean
    status?: boolean
    signedAt?: boolean
    signedPayloadJson?: boolean
    signIdempotencyKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    salesOrder?: boolean | Delivery$salesOrderArgs<ExtArgs>
  }, ExtArgs["result"]["delivery"]>

  export type DeliverySelectScalar = {
    id?: boolean
    customerId?: boolean
    salesOrderId?: boolean
    kingdeeBillId?: boolean
    kingdeeBillNumber?: boolean
    sourceDocNo?: boolean
    detailsJson?: boolean
    syncedAt?: boolean
    status?: boolean
    signedAt?: boolean
    signedPayloadJson?: boolean
    signIdempotencyKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeliveryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    salesOrder?: boolean | Delivery$salesOrderArgs<ExtArgs>
  }
  export type DeliveryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    salesOrder?: boolean | Delivery$salesOrderArgs<ExtArgs>
  }

  export type $DeliveryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Delivery"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      salesOrder: Prisma.$SalesOrderPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      salesOrderId: string | null
      kingdeeBillId: string | null
      kingdeeBillNumber: string | null
      sourceDocNo: string | null
      detailsJson: string | null
      syncedAt: Date | null
      status: string
      signedAt: Date | null
      signedPayloadJson: string | null
      signIdempotencyKey: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["delivery"]>
    composites: {}
  }

  type DeliveryGetPayload<S extends boolean | null | undefined | DeliveryDefaultArgs> = $Result.GetResult<Prisma.$DeliveryPayload, S>

  type DeliveryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DeliveryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeliveryCountAggregateInputType | true
    }

  export interface DeliveryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Delivery'], meta: { name: 'Delivery' } }
    /**
     * Find zero or one Delivery that matches the filter.
     * @param {DeliveryFindUniqueArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeliveryFindUniqueArgs>(args: SelectSubset<T, DeliveryFindUniqueArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Delivery that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DeliveryFindUniqueOrThrowArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeliveryFindUniqueOrThrowArgs>(args: SelectSubset<T, DeliveryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Delivery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryFindFirstArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeliveryFindFirstArgs>(args?: SelectSubset<T, DeliveryFindFirstArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Delivery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryFindFirstOrThrowArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeliveryFindFirstOrThrowArgs>(args?: SelectSubset<T, DeliveryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Deliveries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Deliveries
     * const deliveries = await prisma.delivery.findMany()
     * 
     * // Get first 10 Deliveries
     * const deliveries = await prisma.delivery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deliveryWithIdOnly = await prisma.delivery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeliveryFindManyArgs>(args?: SelectSubset<T, DeliveryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Delivery.
     * @param {DeliveryCreateArgs} args - Arguments to create a Delivery.
     * @example
     * // Create one Delivery
     * const Delivery = await prisma.delivery.create({
     *   data: {
     *     // ... data to create a Delivery
     *   }
     * })
     * 
     */
    create<T extends DeliveryCreateArgs>(args: SelectSubset<T, DeliveryCreateArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Deliveries.
     * @param {DeliveryCreateManyArgs} args - Arguments to create many Deliveries.
     * @example
     * // Create many Deliveries
     * const delivery = await prisma.delivery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeliveryCreateManyArgs>(args?: SelectSubset<T, DeliveryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Deliveries and returns the data saved in the database.
     * @param {DeliveryCreateManyAndReturnArgs} args - Arguments to create many Deliveries.
     * @example
     * // Create many Deliveries
     * const delivery = await prisma.delivery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Deliveries and only return the `id`
     * const deliveryWithIdOnly = await prisma.delivery.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeliveryCreateManyAndReturnArgs>(args?: SelectSubset<T, DeliveryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Delivery.
     * @param {DeliveryDeleteArgs} args - Arguments to delete one Delivery.
     * @example
     * // Delete one Delivery
     * const Delivery = await prisma.delivery.delete({
     *   where: {
     *     // ... filter to delete one Delivery
     *   }
     * })
     * 
     */
    delete<T extends DeliveryDeleteArgs>(args: SelectSubset<T, DeliveryDeleteArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Delivery.
     * @param {DeliveryUpdateArgs} args - Arguments to update one Delivery.
     * @example
     * // Update one Delivery
     * const delivery = await prisma.delivery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeliveryUpdateArgs>(args: SelectSubset<T, DeliveryUpdateArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Deliveries.
     * @param {DeliveryDeleteManyArgs} args - Arguments to filter Deliveries to delete.
     * @example
     * // Delete a few Deliveries
     * const { count } = await prisma.delivery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeliveryDeleteManyArgs>(args?: SelectSubset<T, DeliveryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Deliveries
     * const delivery = await prisma.delivery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeliveryUpdateManyArgs>(args: SelectSubset<T, DeliveryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Delivery.
     * @param {DeliveryUpsertArgs} args - Arguments to update or create a Delivery.
     * @example
     * // Update or create a Delivery
     * const delivery = await prisma.delivery.upsert({
     *   create: {
     *     // ... data to create a Delivery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Delivery we want to update
     *   }
     * })
     */
    upsert<T extends DeliveryUpsertArgs>(args: SelectSubset<T, DeliveryUpsertArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Deliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryCountArgs} args - Arguments to filter Deliveries to count.
     * @example
     * // Count the number of Deliveries
     * const count = await prisma.delivery.count({
     *   where: {
     *     // ... the filter for the Deliveries we want to count
     *   }
     * })
    **/
    count<T extends DeliveryCountArgs>(
      args?: Subset<T, DeliveryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeliveryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Delivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeliveryAggregateArgs>(args: Subset<T, DeliveryAggregateArgs>): Prisma.PrismaPromise<GetDeliveryAggregateType<T>>

    /**
     * Group by Delivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeliveryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeliveryGroupByArgs['orderBy'] }
        : { orderBy?: DeliveryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeliveryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeliveryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Delivery model
   */
  readonly fields: DeliveryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Delivery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeliveryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    salesOrder<T extends Delivery$salesOrderArgs<ExtArgs> = {}>(args?: Subset<T, Delivery$salesOrderArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Delivery model
   */ 
  interface DeliveryFieldRefs {
    readonly id: FieldRef<"Delivery", 'String'>
    readonly customerId: FieldRef<"Delivery", 'String'>
    readonly salesOrderId: FieldRef<"Delivery", 'String'>
    readonly kingdeeBillId: FieldRef<"Delivery", 'String'>
    readonly kingdeeBillNumber: FieldRef<"Delivery", 'String'>
    readonly sourceDocNo: FieldRef<"Delivery", 'String'>
    readonly detailsJson: FieldRef<"Delivery", 'String'>
    readonly syncedAt: FieldRef<"Delivery", 'DateTime'>
    readonly status: FieldRef<"Delivery", 'String'>
    readonly signedAt: FieldRef<"Delivery", 'DateTime'>
    readonly signedPayloadJson: FieldRef<"Delivery", 'String'>
    readonly signIdempotencyKey: FieldRef<"Delivery", 'String'>
    readonly createdAt: FieldRef<"Delivery", 'DateTime'>
    readonly updatedAt: FieldRef<"Delivery", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Delivery findUnique
   */
  export type DeliveryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery findUniqueOrThrow
   */
  export type DeliveryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery findFirst
   */
  export type DeliveryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deliveries.
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deliveries.
     */
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * Delivery findFirstOrThrow
   */
  export type DeliveryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deliveries.
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deliveries.
     */
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * Delivery findMany
   */
  export type DeliveryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Deliveries to fetch.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Deliveries.
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * Delivery create
   */
  export type DeliveryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * The data needed to create a Delivery.
     */
    data: XOR<DeliveryCreateInput, DeliveryUncheckedCreateInput>
  }

  /**
   * Delivery createMany
   */
  export type DeliveryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Deliveries.
     */
    data: DeliveryCreateManyInput | DeliveryCreateManyInput[]
  }

  /**
   * Delivery createManyAndReturn
   */
  export type DeliveryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Deliveries.
     */
    data: DeliveryCreateManyInput | DeliveryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Delivery update
   */
  export type DeliveryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * The data needed to update a Delivery.
     */
    data: XOR<DeliveryUpdateInput, DeliveryUncheckedUpdateInput>
    /**
     * Choose, which Delivery to update.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery updateMany
   */
  export type DeliveryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Deliveries.
     */
    data: XOR<DeliveryUpdateManyMutationInput, DeliveryUncheckedUpdateManyInput>
    /**
     * Filter which Deliveries to update
     */
    where?: DeliveryWhereInput
  }

  /**
   * Delivery upsert
   */
  export type DeliveryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * The filter to search for the Delivery to update in case it exists.
     */
    where: DeliveryWhereUniqueInput
    /**
     * In case the Delivery found by the `where` argument doesn't exist, create a new Delivery with this data.
     */
    create: XOR<DeliveryCreateInput, DeliveryUncheckedCreateInput>
    /**
     * In case the Delivery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeliveryUpdateInput, DeliveryUncheckedUpdateInput>
  }

  /**
   * Delivery delete
   */
  export type DeliveryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter which Delivery to delete.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery deleteMany
   */
  export type DeliveryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deliveries to delete
     */
    where?: DeliveryWhereInput
  }

  /**
   * Delivery.salesOrder
   */
  export type Delivery$salesOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    where?: SalesOrderWhereInput
  }

  /**
   * Delivery without action
   */
  export type DeliveryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
  }


  /**
   * Model Reconciliation
   */

  export type AggregateReconciliation = {
    _count: ReconciliationCountAggregateOutputType | null
    _min: ReconciliationMinAggregateOutputType | null
    _max: ReconciliationMaxAggregateOutputType | null
  }

  export type ReconciliationMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    periodStart: Date | null
    periodEnd: Date | null
    statementJson: string | null
    status: string | null
    confirmedAt: Date | null
    confirmRemark: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReconciliationMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    periodStart: Date | null
    periodEnd: Date | null
    statementJson: string | null
    status: string | null
    confirmedAt: Date | null
    confirmRemark: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReconciliationCountAggregateOutputType = {
    id: number
    customerId: number
    periodStart: number
    periodEnd: number
    statementJson: number
    status: number
    confirmedAt: number
    confirmRemark: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReconciliationMinAggregateInputType = {
    id?: true
    customerId?: true
    periodStart?: true
    periodEnd?: true
    statementJson?: true
    status?: true
    confirmedAt?: true
    confirmRemark?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReconciliationMaxAggregateInputType = {
    id?: true
    customerId?: true
    periodStart?: true
    periodEnd?: true
    statementJson?: true
    status?: true
    confirmedAt?: true
    confirmRemark?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReconciliationCountAggregateInputType = {
    id?: true
    customerId?: true
    periodStart?: true
    periodEnd?: true
    statementJson?: true
    status?: true
    confirmedAt?: true
    confirmRemark?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReconciliationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reconciliation to aggregate.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reconciliations
    **/
    _count?: true | ReconciliationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReconciliationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReconciliationMaxAggregateInputType
  }

  export type GetReconciliationAggregateType<T extends ReconciliationAggregateArgs> = {
        [P in keyof T & keyof AggregateReconciliation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReconciliation[P]>
      : GetScalarType<T[P], AggregateReconciliation[P]>
  }




  export type ReconciliationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReconciliationWhereInput
    orderBy?: ReconciliationOrderByWithAggregationInput | ReconciliationOrderByWithAggregationInput[]
    by: ReconciliationScalarFieldEnum[] | ReconciliationScalarFieldEnum
    having?: ReconciliationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReconciliationCountAggregateInputType | true
    _min?: ReconciliationMinAggregateInputType
    _max?: ReconciliationMaxAggregateInputType
  }

  export type ReconciliationGroupByOutputType = {
    id: string
    customerId: string
    periodStart: Date
    periodEnd: Date
    statementJson: string
    status: string
    confirmedAt: Date | null
    confirmRemark: string | null
    createdAt: Date
    updatedAt: Date
    _count: ReconciliationCountAggregateOutputType | null
    _min: ReconciliationMinAggregateOutputType | null
    _max: ReconciliationMaxAggregateOutputType | null
  }

  type GetReconciliationGroupByPayload<T extends ReconciliationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReconciliationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReconciliationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReconciliationGroupByOutputType[P]>
            : GetScalarType<T[P], ReconciliationGroupByOutputType[P]>
        }
      >
    >


  export type ReconciliationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    statementJson?: boolean
    status?: boolean
    confirmedAt?: boolean
    confirmRemark?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    lines?: boolean | Reconciliation$linesArgs<ExtArgs>
    _count?: boolean | ReconciliationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reconciliation"]>

  export type ReconciliationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    statementJson?: boolean
    status?: boolean
    confirmedAt?: boolean
    confirmRemark?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reconciliation"]>

  export type ReconciliationSelectScalar = {
    id?: boolean
    customerId?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    statementJson?: boolean
    status?: boolean
    confirmedAt?: boolean
    confirmRemark?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReconciliationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    lines?: boolean | Reconciliation$linesArgs<ExtArgs>
    _count?: boolean | ReconciliationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReconciliationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }

  export type $ReconciliationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reconciliation"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      lines: Prisma.$ReconciliationLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      periodStart: Date
      periodEnd: Date
      statementJson: string
      status: string
      confirmedAt: Date | null
      confirmRemark: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["reconciliation"]>
    composites: {}
  }

  type ReconciliationGetPayload<S extends boolean | null | undefined | ReconciliationDefaultArgs> = $Result.GetResult<Prisma.$ReconciliationPayload, S>

  type ReconciliationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReconciliationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReconciliationCountAggregateInputType | true
    }

  export interface ReconciliationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reconciliation'], meta: { name: 'Reconciliation' } }
    /**
     * Find zero or one Reconciliation that matches the filter.
     * @param {ReconciliationFindUniqueArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReconciliationFindUniqueArgs>(args: SelectSubset<T, ReconciliationFindUniqueArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Reconciliation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReconciliationFindUniqueOrThrowArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReconciliationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReconciliationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Reconciliation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationFindFirstArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReconciliationFindFirstArgs>(args?: SelectSubset<T, ReconciliationFindFirstArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Reconciliation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationFindFirstOrThrowArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReconciliationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReconciliationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reconciliations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reconciliations
     * const reconciliations = await prisma.reconciliation.findMany()
     * 
     * // Get first 10 Reconciliations
     * const reconciliations = await prisma.reconciliation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reconciliationWithIdOnly = await prisma.reconciliation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReconciliationFindManyArgs>(args?: SelectSubset<T, ReconciliationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Reconciliation.
     * @param {ReconciliationCreateArgs} args - Arguments to create a Reconciliation.
     * @example
     * // Create one Reconciliation
     * const Reconciliation = await prisma.reconciliation.create({
     *   data: {
     *     // ... data to create a Reconciliation
     *   }
     * })
     * 
     */
    create<T extends ReconciliationCreateArgs>(args: SelectSubset<T, ReconciliationCreateArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reconciliations.
     * @param {ReconciliationCreateManyArgs} args - Arguments to create many Reconciliations.
     * @example
     * // Create many Reconciliations
     * const reconciliation = await prisma.reconciliation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReconciliationCreateManyArgs>(args?: SelectSubset<T, ReconciliationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reconciliations and returns the data saved in the database.
     * @param {ReconciliationCreateManyAndReturnArgs} args - Arguments to create many Reconciliations.
     * @example
     * // Create many Reconciliations
     * const reconciliation = await prisma.reconciliation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reconciliations and only return the `id`
     * const reconciliationWithIdOnly = await prisma.reconciliation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReconciliationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReconciliationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Reconciliation.
     * @param {ReconciliationDeleteArgs} args - Arguments to delete one Reconciliation.
     * @example
     * // Delete one Reconciliation
     * const Reconciliation = await prisma.reconciliation.delete({
     *   where: {
     *     // ... filter to delete one Reconciliation
     *   }
     * })
     * 
     */
    delete<T extends ReconciliationDeleteArgs>(args: SelectSubset<T, ReconciliationDeleteArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Reconciliation.
     * @param {ReconciliationUpdateArgs} args - Arguments to update one Reconciliation.
     * @example
     * // Update one Reconciliation
     * const reconciliation = await prisma.reconciliation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReconciliationUpdateArgs>(args: SelectSubset<T, ReconciliationUpdateArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reconciliations.
     * @param {ReconciliationDeleteManyArgs} args - Arguments to filter Reconciliations to delete.
     * @example
     * // Delete a few Reconciliations
     * const { count } = await prisma.reconciliation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReconciliationDeleteManyArgs>(args?: SelectSubset<T, ReconciliationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reconciliations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reconciliations
     * const reconciliation = await prisma.reconciliation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReconciliationUpdateManyArgs>(args: SelectSubset<T, ReconciliationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reconciliation.
     * @param {ReconciliationUpsertArgs} args - Arguments to update or create a Reconciliation.
     * @example
     * // Update or create a Reconciliation
     * const reconciliation = await prisma.reconciliation.upsert({
     *   create: {
     *     // ... data to create a Reconciliation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reconciliation we want to update
     *   }
     * })
     */
    upsert<T extends ReconciliationUpsertArgs>(args: SelectSubset<T, ReconciliationUpsertArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reconciliations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationCountArgs} args - Arguments to filter Reconciliations to count.
     * @example
     * // Count the number of Reconciliations
     * const count = await prisma.reconciliation.count({
     *   where: {
     *     // ... the filter for the Reconciliations we want to count
     *   }
     * })
    **/
    count<T extends ReconciliationCountArgs>(
      args?: Subset<T, ReconciliationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReconciliationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reconciliation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReconciliationAggregateArgs>(args: Subset<T, ReconciliationAggregateArgs>): Prisma.PrismaPromise<GetReconciliationAggregateType<T>>

    /**
     * Group by Reconciliation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReconciliationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReconciliationGroupByArgs['orderBy'] }
        : { orderBy?: ReconciliationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReconciliationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReconciliationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reconciliation model
   */
  readonly fields: ReconciliationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reconciliation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReconciliationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    lines<T extends Reconciliation$linesArgs<ExtArgs> = {}>(args?: Subset<T, Reconciliation$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reconciliation model
   */ 
  interface ReconciliationFieldRefs {
    readonly id: FieldRef<"Reconciliation", 'String'>
    readonly customerId: FieldRef<"Reconciliation", 'String'>
    readonly periodStart: FieldRef<"Reconciliation", 'DateTime'>
    readonly periodEnd: FieldRef<"Reconciliation", 'DateTime'>
    readonly statementJson: FieldRef<"Reconciliation", 'String'>
    readonly status: FieldRef<"Reconciliation", 'String'>
    readonly confirmedAt: FieldRef<"Reconciliation", 'DateTime'>
    readonly confirmRemark: FieldRef<"Reconciliation", 'String'>
    readonly createdAt: FieldRef<"Reconciliation", 'DateTime'>
    readonly updatedAt: FieldRef<"Reconciliation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reconciliation findUnique
   */
  export type ReconciliationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation findUniqueOrThrow
   */
  export type ReconciliationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation findFirst
   */
  export type ReconciliationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reconciliations.
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reconciliations.
     */
    distinct?: ReconciliationScalarFieldEnum | ReconciliationScalarFieldEnum[]
  }

  /**
   * Reconciliation findFirstOrThrow
   */
  export type ReconciliationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reconciliations.
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reconciliations.
     */
    distinct?: ReconciliationScalarFieldEnum | ReconciliationScalarFieldEnum[]
  }

  /**
   * Reconciliation findMany
   */
  export type ReconciliationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliations to fetch.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reconciliations.
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    distinct?: ReconciliationScalarFieldEnum | ReconciliationScalarFieldEnum[]
  }

  /**
   * Reconciliation create
   */
  export type ReconciliationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * The data needed to create a Reconciliation.
     */
    data: XOR<ReconciliationCreateInput, ReconciliationUncheckedCreateInput>
  }

  /**
   * Reconciliation createMany
   */
  export type ReconciliationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reconciliations.
     */
    data: ReconciliationCreateManyInput | ReconciliationCreateManyInput[]
  }

  /**
   * Reconciliation createManyAndReturn
   */
  export type ReconciliationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reconciliations.
     */
    data: ReconciliationCreateManyInput | ReconciliationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reconciliation update
   */
  export type ReconciliationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * The data needed to update a Reconciliation.
     */
    data: XOR<ReconciliationUpdateInput, ReconciliationUncheckedUpdateInput>
    /**
     * Choose, which Reconciliation to update.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation updateMany
   */
  export type ReconciliationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reconciliations.
     */
    data: XOR<ReconciliationUpdateManyMutationInput, ReconciliationUncheckedUpdateManyInput>
    /**
     * Filter which Reconciliations to update
     */
    where?: ReconciliationWhereInput
  }

  /**
   * Reconciliation upsert
   */
  export type ReconciliationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * The filter to search for the Reconciliation to update in case it exists.
     */
    where: ReconciliationWhereUniqueInput
    /**
     * In case the Reconciliation found by the `where` argument doesn't exist, create a new Reconciliation with this data.
     */
    create: XOR<ReconciliationCreateInput, ReconciliationUncheckedCreateInput>
    /**
     * In case the Reconciliation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReconciliationUpdateInput, ReconciliationUncheckedUpdateInput>
  }

  /**
   * Reconciliation delete
   */
  export type ReconciliationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter which Reconciliation to delete.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation deleteMany
   */
  export type ReconciliationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reconciliations to delete
     */
    where?: ReconciliationWhereInput
  }

  /**
   * Reconciliation.lines
   */
  export type Reconciliation$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    where?: ReconciliationLineWhereInput
    orderBy?: ReconciliationLineOrderByWithRelationInput | ReconciliationLineOrderByWithRelationInput[]
    cursor?: ReconciliationLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReconciliationLineScalarFieldEnum | ReconciliationLineScalarFieldEnum[]
  }

  /**
   * Reconciliation without action
   */
  export type ReconciliationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
  }


  /**
   * Model ReconciliationLine
   */

  export type AggregateReconciliationLine = {
    _count: ReconciliationLineCountAggregateOutputType | null
    _avg: ReconciliationLineAvgAggregateOutputType | null
    _sum: ReconciliationLineSumAggregateOutputType | null
    _min: ReconciliationLineMinAggregateOutputType | null
    _max: ReconciliationLineMaxAggregateOutputType | null
  }

  export type ReconciliationLineAvgAggregateOutputType = {
    id: number | null
    amount: number | null
  }

  export type ReconciliationLineSumAggregateOutputType = {
    id: number | null
    amount: number | null
  }

  export type ReconciliationLineMinAggregateOutputType = {
    id: number | null
    reconciliationId: string | null
    docType: string | null
    docNo: string | null
    docDate: Date | null
    amount: number | null
    rawJson: string | null
    createdAt: Date | null
  }

  export type ReconciliationLineMaxAggregateOutputType = {
    id: number | null
    reconciliationId: string | null
    docType: string | null
    docNo: string | null
    docDate: Date | null
    amount: number | null
    rawJson: string | null
    createdAt: Date | null
  }

  export type ReconciliationLineCountAggregateOutputType = {
    id: number
    reconciliationId: number
    docType: number
    docNo: number
    docDate: number
    amount: number
    rawJson: number
    createdAt: number
    _all: number
  }


  export type ReconciliationLineAvgAggregateInputType = {
    id?: true
    amount?: true
  }

  export type ReconciliationLineSumAggregateInputType = {
    id?: true
    amount?: true
  }

  export type ReconciliationLineMinAggregateInputType = {
    id?: true
    reconciliationId?: true
    docType?: true
    docNo?: true
    docDate?: true
    amount?: true
    rawJson?: true
    createdAt?: true
  }

  export type ReconciliationLineMaxAggregateInputType = {
    id?: true
    reconciliationId?: true
    docType?: true
    docNo?: true
    docDate?: true
    amount?: true
    rawJson?: true
    createdAt?: true
  }

  export type ReconciliationLineCountAggregateInputType = {
    id?: true
    reconciliationId?: true
    docType?: true
    docNo?: true
    docDate?: true
    amount?: true
    rawJson?: true
    createdAt?: true
    _all?: true
  }

  export type ReconciliationLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReconciliationLine to aggregate.
     */
    where?: ReconciliationLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReconciliationLines to fetch.
     */
    orderBy?: ReconciliationLineOrderByWithRelationInput | ReconciliationLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReconciliationLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReconciliationLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReconciliationLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReconciliationLines
    **/
    _count?: true | ReconciliationLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReconciliationLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReconciliationLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReconciliationLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReconciliationLineMaxAggregateInputType
  }

  export type GetReconciliationLineAggregateType<T extends ReconciliationLineAggregateArgs> = {
        [P in keyof T & keyof AggregateReconciliationLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReconciliationLine[P]>
      : GetScalarType<T[P], AggregateReconciliationLine[P]>
  }




  export type ReconciliationLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReconciliationLineWhereInput
    orderBy?: ReconciliationLineOrderByWithAggregationInput | ReconciliationLineOrderByWithAggregationInput[]
    by: ReconciliationLineScalarFieldEnum[] | ReconciliationLineScalarFieldEnum
    having?: ReconciliationLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReconciliationLineCountAggregateInputType | true
    _avg?: ReconciliationLineAvgAggregateInputType
    _sum?: ReconciliationLineSumAggregateInputType
    _min?: ReconciliationLineMinAggregateInputType
    _max?: ReconciliationLineMaxAggregateInputType
  }

  export type ReconciliationLineGroupByOutputType = {
    id: number
    reconciliationId: string
    docType: string
    docNo: string | null
    docDate: Date | null
    amount: number
    rawJson: string
    createdAt: Date
    _count: ReconciliationLineCountAggregateOutputType | null
    _avg: ReconciliationLineAvgAggregateOutputType | null
    _sum: ReconciliationLineSumAggregateOutputType | null
    _min: ReconciliationLineMinAggregateOutputType | null
    _max: ReconciliationLineMaxAggregateOutputType | null
  }

  type GetReconciliationLineGroupByPayload<T extends ReconciliationLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReconciliationLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReconciliationLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReconciliationLineGroupByOutputType[P]>
            : GetScalarType<T[P], ReconciliationLineGroupByOutputType[P]>
        }
      >
    >


  export type ReconciliationLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reconciliationId?: boolean
    docType?: boolean
    docNo?: boolean
    docDate?: boolean
    amount?: boolean
    rawJson?: boolean
    createdAt?: boolean
    reconciliation?: boolean | ReconciliationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reconciliationLine"]>

  export type ReconciliationLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reconciliationId?: boolean
    docType?: boolean
    docNo?: boolean
    docDate?: boolean
    amount?: boolean
    rawJson?: boolean
    createdAt?: boolean
    reconciliation?: boolean | ReconciliationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reconciliationLine"]>

  export type ReconciliationLineSelectScalar = {
    id?: boolean
    reconciliationId?: boolean
    docType?: boolean
    docNo?: boolean
    docDate?: boolean
    amount?: boolean
    rawJson?: boolean
    createdAt?: boolean
  }

  export type ReconciliationLineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reconciliation?: boolean | ReconciliationDefaultArgs<ExtArgs>
  }
  export type ReconciliationLineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reconciliation?: boolean | ReconciliationDefaultArgs<ExtArgs>
  }

  export type $ReconciliationLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReconciliationLine"
    objects: {
      reconciliation: Prisma.$ReconciliationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      reconciliationId: string
      docType: string
      docNo: string | null
      docDate: Date | null
      amount: number
      rawJson: string
      createdAt: Date
    }, ExtArgs["result"]["reconciliationLine"]>
    composites: {}
  }

  type ReconciliationLineGetPayload<S extends boolean | null | undefined | ReconciliationLineDefaultArgs> = $Result.GetResult<Prisma.$ReconciliationLinePayload, S>

  type ReconciliationLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReconciliationLineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReconciliationLineCountAggregateInputType | true
    }

  export interface ReconciliationLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReconciliationLine'], meta: { name: 'ReconciliationLine' } }
    /**
     * Find zero or one ReconciliationLine that matches the filter.
     * @param {ReconciliationLineFindUniqueArgs} args - Arguments to find a ReconciliationLine
     * @example
     * // Get one ReconciliationLine
     * const reconciliationLine = await prisma.reconciliationLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReconciliationLineFindUniqueArgs>(args: SelectSubset<T, ReconciliationLineFindUniqueArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReconciliationLine that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReconciliationLineFindUniqueOrThrowArgs} args - Arguments to find a ReconciliationLine
     * @example
     * // Get one ReconciliationLine
     * const reconciliationLine = await prisma.reconciliationLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReconciliationLineFindUniqueOrThrowArgs>(args: SelectSubset<T, ReconciliationLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReconciliationLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLineFindFirstArgs} args - Arguments to find a ReconciliationLine
     * @example
     * // Get one ReconciliationLine
     * const reconciliationLine = await prisma.reconciliationLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReconciliationLineFindFirstArgs>(args?: SelectSubset<T, ReconciliationLineFindFirstArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReconciliationLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLineFindFirstOrThrowArgs} args - Arguments to find a ReconciliationLine
     * @example
     * // Get one ReconciliationLine
     * const reconciliationLine = await prisma.reconciliationLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReconciliationLineFindFirstOrThrowArgs>(args?: SelectSubset<T, ReconciliationLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReconciliationLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReconciliationLines
     * const reconciliationLines = await prisma.reconciliationLine.findMany()
     * 
     * // Get first 10 ReconciliationLines
     * const reconciliationLines = await prisma.reconciliationLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reconciliationLineWithIdOnly = await prisma.reconciliationLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReconciliationLineFindManyArgs>(args?: SelectSubset<T, ReconciliationLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReconciliationLine.
     * @param {ReconciliationLineCreateArgs} args - Arguments to create a ReconciliationLine.
     * @example
     * // Create one ReconciliationLine
     * const ReconciliationLine = await prisma.reconciliationLine.create({
     *   data: {
     *     // ... data to create a ReconciliationLine
     *   }
     * })
     * 
     */
    create<T extends ReconciliationLineCreateArgs>(args: SelectSubset<T, ReconciliationLineCreateArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReconciliationLines.
     * @param {ReconciliationLineCreateManyArgs} args - Arguments to create many ReconciliationLines.
     * @example
     * // Create many ReconciliationLines
     * const reconciliationLine = await prisma.reconciliationLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReconciliationLineCreateManyArgs>(args?: SelectSubset<T, ReconciliationLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReconciliationLines and returns the data saved in the database.
     * @param {ReconciliationLineCreateManyAndReturnArgs} args - Arguments to create many ReconciliationLines.
     * @example
     * // Create many ReconciliationLines
     * const reconciliationLine = await prisma.reconciliationLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReconciliationLines and only return the `id`
     * const reconciliationLineWithIdOnly = await prisma.reconciliationLine.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReconciliationLineCreateManyAndReturnArgs>(args?: SelectSubset<T, ReconciliationLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReconciliationLine.
     * @param {ReconciliationLineDeleteArgs} args - Arguments to delete one ReconciliationLine.
     * @example
     * // Delete one ReconciliationLine
     * const ReconciliationLine = await prisma.reconciliationLine.delete({
     *   where: {
     *     // ... filter to delete one ReconciliationLine
     *   }
     * })
     * 
     */
    delete<T extends ReconciliationLineDeleteArgs>(args: SelectSubset<T, ReconciliationLineDeleteArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReconciliationLine.
     * @param {ReconciliationLineUpdateArgs} args - Arguments to update one ReconciliationLine.
     * @example
     * // Update one ReconciliationLine
     * const reconciliationLine = await prisma.reconciliationLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReconciliationLineUpdateArgs>(args: SelectSubset<T, ReconciliationLineUpdateArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReconciliationLines.
     * @param {ReconciliationLineDeleteManyArgs} args - Arguments to filter ReconciliationLines to delete.
     * @example
     * // Delete a few ReconciliationLines
     * const { count } = await prisma.reconciliationLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReconciliationLineDeleteManyArgs>(args?: SelectSubset<T, ReconciliationLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReconciliationLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReconciliationLines
     * const reconciliationLine = await prisma.reconciliationLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReconciliationLineUpdateManyArgs>(args: SelectSubset<T, ReconciliationLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReconciliationLine.
     * @param {ReconciliationLineUpsertArgs} args - Arguments to update or create a ReconciliationLine.
     * @example
     * // Update or create a ReconciliationLine
     * const reconciliationLine = await prisma.reconciliationLine.upsert({
     *   create: {
     *     // ... data to create a ReconciliationLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReconciliationLine we want to update
     *   }
     * })
     */
    upsert<T extends ReconciliationLineUpsertArgs>(args: SelectSubset<T, ReconciliationLineUpsertArgs<ExtArgs>>): Prisma__ReconciliationLineClient<$Result.GetResult<Prisma.$ReconciliationLinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReconciliationLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLineCountArgs} args - Arguments to filter ReconciliationLines to count.
     * @example
     * // Count the number of ReconciliationLines
     * const count = await prisma.reconciliationLine.count({
     *   where: {
     *     // ... the filter for the ReconciliationLines we want to count
     *   }
     * })
    **/
    count<T extends ReconciliationLineCountArgs>(
      args?: Subset<T, ReconciliationLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReconciliationLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReconciliationLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReconciliationLineAggregateArgs>(args: Subset<T, ReconciliationLineAggregateArgs>): Prisma.PrismaPromise<GetReconciliationLineAggregateType<T>>

    /**
     * Group by ReconciliationLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReconciliationLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReconciliationLineGroupByArgs['orderBy'] }
        : { orderBy?: ReconciliationLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReconciliationLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReconciliationLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReconciliationLine model
   */
  readonly fields: ReconciliationLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReconciliationLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReconciliationLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reconciliation<T extends ReconciliationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReconciliationDefaultArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReconciliationLine model
   */ 
  interface ReconciliationLineFieldRefs {
    readonly id: FieldRef<"ReconciliationLine", 'Int'>
    readonly reconciliationId: FieldRef<"ReconciliationLine", 'String'>
    readonly docType: FieldRef<"ReconciliationLine", 'String'>
    readonly docNo: FieldRef<"ReconciliationLine", 'String'>
    readonly docDate: FieldRef<"ReconciliationLine", 'DateTime'>
    readonly amount: FieldRef<"ReconciliationLine", 'Float'>
    readonly rawJson: FieldRef<"ReconciliationLine", 'String'>
    readonly createdAt: FieldRef<"ReconciliationLine", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReconciliationLine findUnique
   */
  export type ReconciliationLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * Filter, which ReconciliationLine to fetch.
     */
    where: ReconciliationLineWhereUniqueInput
  }

  /**
   * ReconciliationLine findUniqueOrThrow
   */
  export type ReconciliationLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * Filter, which ReconciliationLine to fetch.
     */
    where: ReconciliationLineWhereUniqueInput
  }

  /**
   * ReconciliationLine findFirst
   */
  export type ReconciliationLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * Filter, which ReconciliationLine to fetch.
     */
    where?: ReconciliationLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReconciliationLines to fetch.
     */
    orderBy?: ReconciliationLineOrderByWithRelationInput | ReconciliationLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReconciliationLines.
     */
    cursor?: ReconciliationLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReconciliationLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReconciliationLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReconciliationLines.
     */
    distinct?: ReconciliationLineScalarFieldEnum | ReconciliationLineScalarFieldEnum[]
  }

  /**
   * ReconciliationLine findFirstOrThrow
   */
  export type ReconciliationLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * Filter, which ReconciliationLine to fetch.
     */
    where?: ReconciliationLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReconciliationLines to fetch.
     */
    orderBy?: ReconciliationLineOrderByWithRelationInput | ReconciliationLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReconciliationLines.
     */
    cursor?: ReconciliationLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReconciliationLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReconciliationLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReconciliationLines.
     */
    distinct?: ReconciliationLineScalarFieldEnum | ReconciliationLineScalarFieldEnum[]
  }

  /**
   * ReconciliationLine findMany
   */
  export type ReconciliationLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * Filter, which ReconciliationLines to fetch.
     */
    where?: ReconciliationLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReconciliationLines to fetch.
     */
    orderBy?: ReconciliationLineOrderByWithRelationInput | ReconciliationLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReconciliationLines.
     */
    cursor?: ReconciliationLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReconciliationLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReconciliationLines.
     */
    skip?: number
    distinct?: ReconciliationLineScalarFieldEnum | ReconciliationLineScalarFieldEnum[]
  }

  /**
   * ReconciliationLine create
   */
  export type ReconciliationLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * The data needed to create a ReconciliationLine.
     */
    data: XOR<ReconciliationLineCreateInput, ReconciliationLineUncheckedCreateInput>
  }

  /**
   * ReconciliationLine createMany
   */
  export type ReconciliationLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReconciliationLines.
     */
    data: ReconciliationLineCreateManyInput | ReconciliationLineCreateManyInput[]
  }

  /**
   * ReconciliationLine createManyAndReturn
   */
  export type ReconciliationLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReconciliationLines.
     */
    data: ReconciliationLineCreateManyInput | ReconciliationLineCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReconciliationLine update
   */
  export type ReconciliationLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * The data needed to update a ReconciliationLine.
     */
    data: XOR<ReconciliationLineUpdateInput, ReconciliationLineUncheckedUpdateInput>
    /**
     * Choose, which ReconciliationLine to update.
     */
    where: ReconciliationLineWhereUniqueInput
  }

  /**
   * ReconciliationLine updateMany
   */
  export type ReconciliationLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReconciliationLines.
     */
    data: XOR<ReconciliationLineUpdateManyMutationInput, ReconciliationLineUncheckedUpdateManyInput>
    /**
     * Filter which ReconciliationLines to update
     */
    where?: ReconciliationLineWhereInput
  }

  /**
   * ReconciliationLine upsert
   */
  export type ReconciliationLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * The filter to search for the ReconciliationLine to update in case it exists.
     */
    where: ReconciliationLineWhereUniqueInput
    /**
     * In case the ReconciliationLine found by the `where` argument doesn't exist, create a new ReconciliationLine with this data.
     */
    create: XOR<ReconciliationLineCreateInput, ReconciliationLineUncheckedCreateInput>
    /**
     * In case the ReconciliationLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReconciliationLineUpdateInput, ReconciliationLineUncheckedUpdateInput>
  }

  /**
   * ReconciliationLine delete
   */
  export type ReconciliationLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
    /**
     * Filter which ReconciliationLine to delete.
     */
    where: ReconciliationLineWhereUniqueInput
  }

  /**
   * ReconciliationLine deleteMany
   */
  export type ReconciliationLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReconciliationLines to delete
     */
    where?: ReconciliationLineWhereInput
  }

  /**
   * ReconciliationLine without action
   */
  export type ReconciliationLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLine
     */
    select?: ReconciliationLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationLineInclude<ExtArgs> | null
  }


  /**
   * Model SyncCheckpoint
   */

  export type AggregateSyncCheckpoint = {
    _count: SyncCheckpointCountAggregateOutputType | null
    _avg: SyncCheckpointAvgAggregateOutputType | null
    _sum: SyncCheckpointSumAggregateOutputType | null
    _min: SyncCheckpointMinAggregateOutputType | null
    _max: SyncCheckpointMaxAggregateOutputType | null
  }

  export type SyncCheckpointAvgAggregateOutputType = {
    id: number | null
  }

  export type SyncCheckpointSumAggregateOutputType = {
    id: number | null
  }

  export type SyncCheckpointMinAggregateOutputType = {
    id: number | null
    scope: string | null
    jobName: string | null
    cursorJson: string | null
    status: string | null
    errorMessage: string | null
    lastRunAt: Date | null
    updatedAt: Date | null
  }

  export type SyncCheckpointMaxAggregateOutputType = {
    id: number | null
    scope: string | null
    jobName: string | null
    cursorJson: string | null
    status: string | null
    errorMessage: string | null
    lastRunAt: Date | null
    updatedAt: Date | null
  }

  export type SyncCheckpointCountAggregateOutputType = {
    id: number
    scope: number
    jobName: number
    cursorJson: number
    status: number
    errorMessage: number
    lastRunAt: number
    updatedAt: number
    _all: number
  }


  export type SyncCheckpointAvgAggregateInputType = {
    id?: true
  }

  export type SyncCheckpointSumAggregateInputType = {
    id?: true
  }

  export type SyncCheckpointMinAggregateInputType = {
    id?: true
    scope?: true
    jobName?: true
    cursorJson?: true
    status?: true
    errorMessage?: true
    lastRunAt?: true
    updatedAt?: true
  }

  export type SyncCheckpointMaxAggregateInputType = {
    id?: true
    scope?: true
    jobName?: true
    cursorJson?: true
    status?: true
    errorMessage?: true
    lastRunAt?: true
    updatedAt?: true
  }

  export type SyncCheckpointCountAggregateInputType = {
    id?: true
    scope?: true
    jobName?: true
    cursorJson?: true
    status?: true
    errorMessage?: true
    lastRunAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SyncCheckpointAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncCheckpoint to aggregate.
     */
    where?: SyncCheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncCheckpoints to fetch.
     */
    orderBy?: SyncCheckpointOrderByWithRelationInput | SyncCheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncCheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncCheckpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncCheckpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncCheckpoints
    **/
    _count?: true | SyncCheckpointCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncCheckpointAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncCheckpointSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncCheckpointMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncCheckpointMaxAggregateInputType
  }

  export type GetSyncCheckpointAggregateType<T extends SyncCheckpointAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncCheckpoint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncCheckpoint[P]>
      : GetScalarType<T[P], AggregateSyncCheckpoint[P]>
  }




  export type SyncCheckpointGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncCheckpointWhereInput
    orderBy?: SyncCheckpointOrderByWithAggregationInput | SyncCheckpointOrderByWithAggregationInput[]
    by: SyncCheckpointScalarFieldEnum[] | SyncCheckpointScalarFieldEnum
    having?: SyncCheckpointScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncCheckpointCountAggregateInputType | true
    _avg?: SyncCheckpointAvgAggregateInputType
    _sum?: SyncCheckpointSumAggregateInputType
    _min?: SyncCheckpointMinAggregateInputType
    _max?: SyncCheckpointMaxAggregateInputType
  }

  export type SyncCheckpointGroupByOutputType = {
    id: number
    scope: string
    jobName: string
    cursorJson: string
    status: string
    errorMessage: string | null
    lastRunAt: Date
    updatedAt: Date
    _count: SyncCheckpointCountAggregateOutputType | null
    _avg: SyncCheckpointAvgAggregateOutputType | null
    _sum: SyncCheckpointSumAggregateOutputType | null
    _min: SyncCheckpointMinAggregateOutputType | null
    _max: SyncCheckpointMaxAggregateOutputType | null
  }

  type GetSyncCheckpointGroupByPayload<T extends SyncCheckpointGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncCheckpointGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncCheckpointGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncCheckpointGroupByOutputType[P]>
            : GetScalarType<T[P], SyncCheckpointGroupByOutputType[P]>
        }
      >
    >


  export type SyncCheckpointSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scope?: boolean
    jobName?: boolean
    cursorJson?: boolean
    status?: boolean
    errorMessage?: boolean
    lastRunAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncCheckpoint"]>

  export type SyncCheckpointSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scope?: boolean
    jobName?: boolean
    cursorJson?: boolean
    status?: boolean
    errorMessage?: boolean
    lastRunAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["syncCheckpoint"]>

  export type SyncCheckpointSelectScalar = {
    id?: boolean
    scope?: boolean
    jobName?: boolean
    cursorJson?: boolean
    status?: boolean
    errorMessage?: boolean
    lastRunAt?: boolean
    updatedAt?: boolean
  }


  export type $SyncCheckpointPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncCheckpoint"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scope: string
      jobName: string
      cursorJson: string
      status: string
      errorMessage: string | null
      lastRunAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["syncCheckpoint"]>
    composites: {}
  }

  type SyncCheckpointGetPayload<S extends boolean | null | undefined | SyncCheckpointDefaultArgs> = $Result.GetResult<Prisma.$SyncCheckpointPayload, S>

  type SyncCheckpointCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SyncCheckpointFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SyncCheckpointCountAggregateInputType | true
    }

  export interface SyncCheckpointDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncCheckpoint'], meta: { name: 'SyncCheckpoint' } }
    /**
     * Find zero or one SyncCheckpoint that matches the filter.
     * @param {SyncCheckpointFindUniqueArgs} args - Arguments to find a SyncCheckpoint
     * @example
     * // Get one SyncCheckpoint
     * const syncCheckpoint = await prisma.syncCheckpoint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncCheckpointFindUniqueArgs>(args: SelectSubset<T, SyncCheckpointFindUniqueArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SyncCheckpoint that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SyncCheckpointFindUniqueOrThrowArgs} args - Arguments to find a SyncCheckpoint
     * @example
     * // Get one SyncCheckpoint
     * const syncCheckpoint = await prisma.syncCheckpoint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncCheckpointFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncCheckpointFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SyncCheckpoint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncCheckpointFindFirstArgs} args - Arguments to find a SyncCheckpoint
     * @example
     * // Get one SyncCheckpoint
     * const syncCheckpoint = await prisma.syncCheckpoint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncCheckpointFindFirstArgs>(args?: SelectSubset<T, SyncCheckpointFindFirstArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SyncCheckpoint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncCheckpointFindFirstOrThrowArgs} args - Arguments to find a SyncCheckpoint
     * @example
     * // Get one SyncCheckpoint
     * const syncCheckpoint = await prisma.syncCheckpoint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncCheckpointFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncCheckpointFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SyncCheckpoints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncCheckpointFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncCheckpoints
     * const syncCheckpoints = await prisma.syncCheckpoint.findMany()
     * 
     * // Get first 10 SyncCheckpoints
     * const syncCheckpoints = await prisma.syncCheckpoint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncCheckpointWithIdOnly = await prisma.syncCheckpoint.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncCheckpointFindManyArgs>(args?: SelectSubset<T, SyncCheckpointFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SyncCheckpoint.
     * @param {SyncCheckpointCreateArgs} args - Arguments to create a SyncCheckpoint.
     * @example
     * // Create one SyncCheckpoint
     * const SyncCheckpoint = await prisma.syncCheckpoint.create({
     *   data: {
     *     // ... data to create a SyncCheckpoint
     *   }
     * })
     * 
     */
    create<T extends SyncCheckpointCreateArgs>(args: SelectSubset<T, SyncCheckpointCreateArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SyncCheckpoints.
     * @param {SyncCheckpointCreateManyArgs} args - Arguments to create many SyncCheckpoints.
     * @example
     * // Create many SyncCheckpoints
     * const syncCheckpoint = await prisma.syncCheckpoint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncCheckpointCreateManyArgs>(args?: SelectSubset<T, SyncCheckpointCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncCheckpoints and returns the data saved in the database.
     * @param {SyncCheckpointCreateManyAndReturnArgs} args - Arguments to create many SyncCheckpoints.
     * @example
     * // Create many SyncCheckpoints
     * const syncCheckpoint = await prisma.syncCheckpoint.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncCheckpoints and only return the `id`
     * const syncCheckpointWithIdOnly = await prisma.syncCheckpoint.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncCheckpointCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncCheckpointCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SyncCheckpoint.
     * @param {SyncCheckpointDeleteArgs} args - Arguments to delete one SyncCheckpoint.
     * @example
     * // Delete one SyncCheckpoint
     * const SyncCheckpoint = await prisma.syncCheckpoint.delete({
     *   where: {
     *     // ... filter to delete one SyncCheckpoint
     *   }
     * })
     * 
     */
    delete<T extends SyncCheckpointDeleteArgs>(args: SelectSubset<T, SyncCheckpointDeleteArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SyncCheckpoint.
     * @param {SyncCheckpointUpdateArgs} args - Arguments to update one SyncCheckpoint.
     * @example
     * // Update one SyncCheckpoint
     * const syncCheckpoint = await prisma.syncCheckpoint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncCheckpointUpdateArgs>(args: SelectSubset<T, SyncCheckpointUpdateArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SyncCheckpoints.
     * @param {SyncCheckpointDeleteManyArgs} args - Arguments to filter SyncCheckpoints to delete.
     * @example
     * // Delete a few SyncCheckpoints
     * const { count } = await prisma.syncCheckpoint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncCheckpointDeleteManyArgs>(args?: SelectSubset<T, SyncCheckpointDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncCheckpoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncCheckpointUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncCheckpoints
     * const syncCheckpoint = await prisma.syncCheckpoint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncCheckpointUpdateManyArgs>(args: SelectSubset<T, SyncCheckpointUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SyncCheckpoint.
     * @param {SyncCheckpointUpsertArgs} args - Arguments to update or create a SyncCheckpoint.
     * @example
     * // Update or create a SyncCheckpoint
     * const syncCheckpoint = await prisma.syncCheckpoint.upsert({
     *   create: {
     *     // ... data to create a SyncCheckpoint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncCheckpoint we want to update
     *   }
     * })
     */
    upsert<T extends SyncCheckpointUpsertArgs>(args: SelectSubset<T, SyncCheckpointUpsertArgs<ExtArgs>>): Prisma__SyncCheckpointClient<$Result.GetResult<Prisma.$SyncCheckpointPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SyncCheckpoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncCheckpointCountArgs} args - Arguments to filter SyncCheckpoints to count.
     * @example
     * // Count the number of SyncCheckpoints
     * const count = await prisma.syncCheckpoint.count({
     *   where: {
     *     // ... the filter for the SyncCheckpoints we want to count
     *   }
     * })
    **/
    count<T extends SyncCheckpointCountArgs>(
      args?: Subset<T, SyncCheckpointCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncCheckpointCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncCheckpoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncCheckpointAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncCheckpointAggregateArgs>(args: Subset<T, SyncCheckpointAggregateArgs>): Prisma.PrismaPromise<GetSyncCheckpointAggregateType<T>>

    /**
     * Group by SyncCheckpoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncCheckpointGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncCheckpointGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncCheckpointGroupByArgs['orderBy'] }
        : { orderBy?: SyncCheckpointGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncCheckpointGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncCheckpointGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncCheckpoint model
   */
  readonly fields: SyncCheckpointFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncCheckpoint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncCheckpointClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncCheckpoint model
   */ 
  interface SyncCheckpointFieldRefs {
    readonly id: FieldRef<"SyncCheckpoint", 'Int'>
    readonly scope: FieldRef<"SyncCheckpoint", 'String'>
    readonly jobName: FieldRef<"SyncCheckpoint", 'String'>
    readonly cursorJson: FieldRef<"SyncCheckpoint", 'String'>
    readonly status: FieldRef<"SyncCheckpoint", 'String'>
    readonly errorMessage: FieldRef<"SyncCheckpoint", 'String'>
    readonly lastRunAt: FieldRef<"SyncCheckpoint", 'DateTime'>
    readonly updatedAt: FieldRef<"SyncCheckpoint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SyncCheckpoint findUnique
   */
  export type SyncCheckpointFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * Filter, which SyncCheckpoint to fetch.
     */
    where: SyncCheckpointWhereUniqueInput
  }

  /**
   * SyncCheckpoint findUniqueOrThrow
   */
  export type SyncCheckpointFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * Filter, which SyncCheckpoint to fetch.
     */
    where: SyncCheckpointWhereUniqueInput
  }

  /**
   * SyncCheckpoint findFirst
   */
  export type SyncCheckpointFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * Filter, which SyncCheckpoint to fetch.
     */
    where?: SyncCheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncCheckpoints to fetch.
     */
    orderBy?: SyncCheckpointOrderByWithRelationInput | SyncCheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncCheckpoints.
     */
    cursor?: SyncCheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncCheckpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncCheckpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncCheckpoints.
     */
    distinct?: SyncCheckpointScalarFieldEnum | SyncCheckpointScalarFieldEnum[]
  }

  /**
   * SyncCheckpoint findFirstOrThrow
   */
  export type SyncCheckpointFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * Filter, which SyncCheckpoint to fetch.
     */
    where?: SyncCheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncCheckpoints to fetch.
     */
    orderBy?: SyncCheckpointOrderByWithRelationInput | SyncCheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncCheckpoints.
     */
    cursor?: SyncCheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncCheckpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncCheckpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncCheckpoints.
     */
    distinct?: SyncCheckpointScalarFieldEnum | SyncCheckpointScalarFieldEnum[]
  }

  /**
   * SyncCheckpoint findMany
   */
  export type SyncCheckpointFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * Filter, which SyncCheckpoints to fetch.
     */
    where?: SyncCheckpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncCheckpoints to fetch.
     */
    orderBy?: SyncCheckpointOrderByWithRelationInput | SyncCheckpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncCheckpoints.
     */
    cursor?: SyncCheckpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncCheckpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncCheckpoints.
     */
    skip?: number
    distinct?: SyncCheckpointScalarFieldEnum | SyncCheckpointScalarFieldEnum[]
  }

  /**
   * SyncCheckpoint create
   */
  export type SyncCheckpointCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * The data needed to create a SyncCheckpoint.
     */
    data: XOR<SyncCheckpointCreateInput, SyncCheckpointUncheckedCreateInput>
  }

  /**
   * SyncCheckpoint createMany
   */
  export type SyncCheckpointCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncCheckpoints.
     */
    data: SyncCheckpointCreateManyInput | SyncCheckpointCreateManyInput[]
  }

  /**
   * SyncCheckpoint createManyAndReturn
   */
  export type SyncCheckpointCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SyncCheckpoints.
     */
    data: SyncCheckpointCreateManyInput | SyncCheckpointCreateManyInput[]
  }

  /**
   * SyncCheckpoint update
   */
  export type SyncCheckpointUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * The data needed to update a SyncCheckpoint.
     */
    data: XOR<SyncCheckpointUpdateInput, SyncCheckpointUncheckedUpdateInput>
    /**
     * Choose, which SyncCheckpoint to update.
     */
    where: SyncCheckpointWhereUniqueInput
  }

  /**
   * SyncCheckpoint updateMany
   */
  export type SyncCheckpointUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncCheckpoints.
     */
    data: XOR<SyncCheckpointUpdateManyMutationInput, SyncCheckpointUncheckedUpdateManyInput>
    /**
     * Filter which SyncCheckpoints to update
     */
    where?: SyncCheckpointWhereInput
  }

  /**
   * SyncCheckpoint upsert
   */
  export type SyncCheckpointUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * The filter to search for the SyncCheckpoint to update in case it exists.
     */
    where: SyncCheckpointWhereUniqueInput
    /**
     * In case the SyncCheckpoint found by the `where` argument doesn't exist, create a new SyncCheckpoint with this data.
     */
    create: XOR<SyncCheckpointCreateInput, SyncCheckpointUncheckedCreateInput>
    /**
     * In case the SyncCheckpoint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncCheckpointUpdateInput, SyncCheckpointUncheckedUpdateInput>
  }

  /**
   * SyncCheckpoint delete
   */
  export type SyncCheckpointDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
    /**
     * Filter which SyncCheckpoint to delete.
     */
    where: SyncCheckpointWhereUniqueInput
  }

  /**
   * SyncCheckpoint deleteMany
   */
  export type SyncCheckpointDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncCheckpoints to delete
     */
    where?: SyncCheckpointWhereInput
  }

  /**
   * SyncCheckpoint without action
   */
  export type SyncCheckpointDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncCheckpoint
     */
    select?: SyncCheckpointSelect<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    description: string | null
    coverImageUrl: string | null
    status: string | null
    defaultUnitId: string | null
    kingdeeMaterialId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    description: string | null
    coverImageUrl: string | null
    status: string | null
    defaultUnitId: string | null
    kingdeeMaterialId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    code: number
    name: number
    description: number
    coverImageUrl: number
    status: number
    defaultUnitId: number
    kingdeeMaterialId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    coverImageUrl?: true
    status?: true
    defaultUnitId?: true
    kingdeeMaterialId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    coverImageUrl?: true
    status?: true
    defaultUnitId?: true
    kingdeeMaterialId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    coverImageUrl?: true
    status?: true
    defaultUnitId?: true
    kingdeeMaterialId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    code: string
    name: string
    description: string | null
    coverImageUrl: string | null
    status: string
    defaultUnitId: string | null
    kingdeeMaterialId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    coverImageUrl?: boolean
    status?: boolean
    defaultUnitId?: boolean
    kingdeeMaterialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    skus?: boolean | Product$skusArgs<ExtArgs>
    cartItems?: boolean | Product$cartItemsArgs<ExtArgs>
    orderLines?: boolean | Product$orderLinesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    coverImageUrl?: boolean
    status?: boolean
    defaultUnitId?: boolean
    kingdeeMaterialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    coverImageUrl?: boolean
    status?: boolean
    defaultUnitId?: boolean
    kingdeeMaterialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skus?: boolean | Product$skusArgs<ExtArgs>
    cartItems?: boolean | Product$cartItemsArgs<ExtArgs>
    orderLines?: boolean | Product$orderLinesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      skus: Prisma.$ProductSkuPayload<ExtArgs>[]
      cartItems: Prisma.$CartItemPayload<ExtArgs>[]
      orderLines: Prisma.$SalesOrderLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      description: string | null
      coverImageUrl: string | null
      status: string
      defaultUnitId: string | null
      kingdeeMaterialId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skus<T extends Product$skusArgs<ExtArgs> = {}>(args?: Subset<T, Product$skusArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findMany"> | Null>
    cartItems<T extends Product$cartItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$cartItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany"> | Null>
    orderLines<T extends Product$orderLinesArgs<ExtArgs> = {}>(args?: Subset<T, Product$orderLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */ 
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly code: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly coverImageUrl: FieldRef<"Product", 'String'>
    readonly status: FieldRef<"Product", 'String'>
    readonly defaultUnitId: FieldRef<"Product", 'String'>
    readonly kingdeeMaterialId: FieldRef<"Product", 'String'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
  }

  /**
   * Product.skus
   */
  export type Product$skusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    where?: ProductSkuWhereInput
    orderBy?: ProductSkuOrderByWithRelationInput | ProductSkuOrderByWithRelationInput[]
    cursor?: ProductSkuWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductSkuScalarFieldEnum | ProductSkuScalarFieldEnum[]
  }

  /**
   * Product.cartItems
   */
  export type Product$cartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    cursor?: CartItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * Product.orderLines
   */
  export type Product$orderLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    where?: SalesOrderLineWhereInput
    orderBy?: SalesOrderLineOrderByWithRelationInput | SalesOrderLineOrderByWithRelationInput[]
    cursor?: SalesOrderLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesOrderLineScalarFieldEnum | SalesOrderLineScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ProductSku
   */

  export type AggregateProductSku = {
    _count: ProductSkuCountAggregateOutputType | null
    _avg: ProductSkuAvgAggregateOutputType | null
    _sum: ProductSkuSumAggregateOutputType | null
    _min: ProductSkuMinAggregateOutputType | null
    _max: ProductSkuMaxAggregateOutputType | null
  }

  export type ProductSkuAvgAggregateOutputType = {
    price: number | null
    stock: number | null
  }

  export type ProductSkuSumAggregateOutputType = {
    price: number | null
    stock: number | null
  }

  export type ProductSkuMinAggregateOutputType = {
    id: string | null
    productId: string | null
    skuCode: string | null
    skuName: string | null
    specsJson: string | null
    price: number | null
    stock: number | null
    status: string | null
    unitId: string | null
    kingdeeMaterialId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductSkuMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    skuCode: string | null
    skuName: string | null
    specsJson: string | null
    price: number | null
    stock: number | null
    status: string | null
    unitId: string | null
    kingdeeMaterialId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductSkuCountAggregateOutputType = {
    id: number
    productId: number
    skuCode: number
    skuName: number
    specsJson: number
    price: number
    stock: number
    status: number
    unitId: number
    kingdeeMaterialId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductSkuAvgAggregateInputType = {
    price?: true
    stock?: true
  }

  export type ProductSkuSumAggregateInputType = {
    price?: true
    stock?: true
  }

  export type ProductSkuMinAggregateInputType = {
    id?: true
    productId?: true
    skuCode?: true
    skuName?: true
    specsJson?: true
    price?: true
    stock?: true
    status?: true
    unitId?: true
    kingdeeMaterialId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductSkuMaxAggregateInputType = {
    id?: true
    productId?: true
    skuCode?: true
    skuName?: true
    specsJson?: true
    price?: true
    stock?: true
    status?: true
    unitId?: true
    kingdeeMaterialId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductSkuCountAggregateInputType = {
    id?: true
    productId?: true
    skuCode?: true
    skuName?: true
    specsJson?: true
    price?: true
    stock?: true
    status?: true
    unitId?: true
    kingdeeMaterialId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductSkuAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductSku to aggregate.
     */
    where?: ProductSkuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSkus to fetch.
     */
    orderBy?: ProductSkuOrderByWithRelationInput | ProductSkuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductSkuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSkus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSkus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductSkus
    **/
    _count?: true | ProductSkuCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductSkuAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSkuSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductSkuMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductSkuMaxAggregateInputType
  }

  export type GetProductSkuAggregateType<T extends ProductSkuAggregateArgs> = {
        [P in keyof T & keyof AggregateProductSku]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductSku[P]>
      : GetScalarType<T[P], AggregateProductSku[P]>
  }




  export type ProductSkuGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductSkuWhereInput
    orderBy?: ProductSkuOrderByWithAggregationInput | ProductSkuOrderByWithAggregationInput[]
    by: ProductSkuScalarFieldEnum[] | ProductSkuScalarFieldEnum
    having?: ProductSkuScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductSkuCountAggregateInputType | true
    _avg?: ProductSkuAvgAggregateInputType
    _sum?: ProductSkuSumAggregateInputType
    _min?: ProductSkuMinAggregateInputType
    _max?: ProductSkuMaxAggregateInputType
  }

  export type ProductSkuGroupByOutputType = {
    id: string
    productId: string
    skuCode: string
    skuName: string
    specsJson: string | null
    price: number
    stock: number
    status: string
    unitId: string | null
    kingdeeMaterialId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProductSkuCountAggregateOutputType | null
    _avg: ProductSkuAvgAggregateOutputType | null
    _sum: ProductSkuSumAggregateOutputType | null
    _min: ProductSkuMinAggregateOutputType | null
    _max: ProductSkuMaxAggregateOutputType | null
  }

  type GetProductSkuGroupByPayload<T extends ProductSkuGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductSkuGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductSkuGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductSkuGroupByOutputType[P]>
            : GetScalarType<T[P], ProductSkuGroupByOutputType[P]>
        }
      >
    >


  export type ProductSkuSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    skuCode?: boolean
    skuName?: boolean
    specsJson?: boolean
    price?: boolean
    stock?: boolean
    status?: boolean
    unitId?: boolean
    kingdeeMaterialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    cartItems?: boolean | ProductSku$cartItemsArgs<ExtArgs>
    orderLines?: boolean | ProductSku$orderLinesArgs<ExtArgs>
    _count?: boolean | ProductSkuCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productSku"]>

  export type ProductSkuSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    skuCode?: boolean
    skuName?: boolean
    specsJson?: boolean
    price?: boolean
    stock?: boolean
    status?: boolean
    unitId?: boolean
    kingdeeMaterialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productSku"]>

  export type ProductSkuSelectScalar = {
    id?: boolean
    productId?: boolean
    skuCode?: boolean
    skuName?: boolean
    specsJson?: boolean
    price?: boolean
    stock?: boolean
    status?: boolean
    unitId?: boolean
    kingdeeMaterialId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductSkuInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    cartItems?: boolean | ProductSku$cartItemsArgs<ExtArgs>
    orderLines?: boolean | ProductSku$orderLinesArgs<ExtArgs>
    _count?: boolean | ProductSkuCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductSkuIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductSkuPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductSku"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
      cartItems: Prisma.$CartItemPayload<ExtArgs>[]
      orderLines: Prisma.$SalesOrderLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      skuCode: string
      skuName: string
      specsJson: string | null
      price: number
      stock: number
      status: string
      unitId: string | null
      kingdeeMaterialId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["productSku"]>
    composites: {}
  }

  type ProductSkuGetPayload<S extends boolean | null | undefined | ProductSkuDefaultArgs> = $Result.GetResult<Prisma.$ProductSkuPayload, S>

  type ProductSkuCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductSkuFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductSkuCountAggregateInputType | true
    }

  export interface ProductSkuDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductSku'], meta: { name: 'ProductSku' } }
    /**
     * Find zero or one ProductSku that matches the filter.
     * @param {ProductSkuFindUniqueArgs} args - Arguments to find a ProductSku
     * @example
     * // Get one ProductSku
     * const productSku = await prisma.productSku.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductSkuFindUniqueArgs>(args: SelectSubset<T, ProductSkuFindUniqueArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProductSku that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductSkuFindUniqueOrThrowArgs} args - Arguments to find a ProductSku
     * @example
     * // Get one ProductSku
     * const productSku = await prisma.productSku.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductSkuFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductSkuFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProductSku that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSkuFindFirstArgs} args - Arguments to find a ProductSku
     * @example
     * // Get one ProductSku
     * const productSku = await prisma.productSku.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductSkuFindFirstArgs>(args?: SelectSubset<T, ProductSkuFindFirstArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProductSku that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSkuFindFirstOrThrowArgs} args - Arguments to find a ProductSku
     * @example
     * // Get one ProductSku
     * const productSku = await prisma.productSku.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductSkuFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductSkuFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProductSkus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSkuFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductSkus
     * const productSkus = await prisma.productSku.findMany()
     * 
     * // Get first 10 ProductSkus
     * const productSkus = await prisma.productSku.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productSkuWithIdOnly = await prisma.productSku.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductSkuFindManyArgs>(args?: SelectSubset<T, ProductSkuFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProductSku.
     * @param {ProductSkuCreateArgs} args - Arguments to create a ProductSku.
     * @example
     * // Create one ProductSku
     * const ProductSku = await prisma.productSku.create({
     *   data: {
     *     // ... data to create a ProductSku
     *   }
     * })
     * 
     */
    create<T extends ProductSkuCreateArgs>(args: SelectSubset<T, ProductSkuCreateArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProductSkus.
     * @param {ProductSkuCreateManyArgs} args - Arguments to create many ProductSkus.
     * @example
     * // Create many ProductSkus
     * const productSku = await prisma.productSku.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductSkuCreateManyArgs>(args?: SelectSubset<T, ProductSkuCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductSkus and returns the data saved in the database.
     * @param {ProductSkuCreateManyAndReturnArgs} args - Arguments to create many ProductSkus.
     * @example
     * // Create many ProductSkus
     * const productSku = await prisma.productSku.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductSkus and only return the `id`
     * const productSkuWithIdOnly = await prisma.productSku.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductSkuCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductSkuCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProductSku.
     * @param {ProductSkuDeleteArgs} args - Arguments to delete one ProductSku.
     * @example
     * // Delete one ProductSku
     * const ProductSku = await prisma.productSku.delete({
     *   where: {
     *     // ... filter to delete one ProductSku
     *   }
     * })
     * 
     */
    delete<T extends ProductSkuDeleteArgs>(args: SelectSubset<T, ProductSkuDeleteArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProductSku.
     * @param {ProductSkuUpdateArgs} args - Arguments to update one ProductSku.
     * @example
     * // Update one ProductSku
     * const productSku = await prisma.productSku.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductSkuUpdateArgs>(args: SelectSubset<T, ProductSkuUpdateArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProductSkus.
     * @param {ProductSkuDeleteManyArgs} args - Arguments to filter ProductSkus to delete.
     * @example
     * // Delete a few ProductSkus
     * const { count } = await prisma.productSku.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductSkuDeleteManyArgs>(args?: SelectSubset<T, ProductSkuDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductSkus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSkuUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductSkus
     * const productSku = await prisma.productSku.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductSkuUpdateManyArgs>(args: SelectSubset<T, ProductSkuUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProductSku.
     * @param {ProductSkuUpsertArgs} args - Arguments to update or create a ProductSku.
     * @example
     * // Update or create a ProductSku
     * const productSku = await prisma.productSku.upsert({
     *   create: {
     *     // ... data to create a ProductSku
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductSku we want to update
     *   }
     * })
     */
    upsert<T extends ProductSkuUpsertArgs>(args: SelectSubset<T, ProductSkuUpsertArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProductSkus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSkuCountArgs} args - Arguments to filter ProductSkus to count.
     * @example
     * // Count the number of ProductSkus
     * const count = await prisma.productSku.count({
     *   where: {
     *     // ... the filter for the ProductSkus we want to count
     *   }
     * })
    **/
    count<T extends ProductSkuCountArgs>(
      args?: Subset<T, ProductSkuCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductSkuCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductSku.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSkuAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductSkuAggregateArgs>(args: Subset<T, ProductSkuAggregateArgs>): Prisma.PrismaPromise<GetProductSkuAggregateType<T>>

    /**
     * Group by ProductSku.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSkuGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductSkuGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductSkuGroupByArgs['orderBy'] }
        : { orderBy?: ProductSkuGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductSkuGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductSkuGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductSku model
   */
  readonly fields: ProductSkuFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductSku.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductSkuClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    cartItems<T extends ProductSku$cartItemsArgs<ExtArgs> = {}>(args?: Subset<T, ProductSku$cartItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany"> | Null>
    orderLines<T extends ProductSku$orderLinesArgs<ExtArgs> = {}>(args?: Subset<T, ProductSku$orderLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductSku model
   */ 
  interface ProductSkuFieldRefs {
    readonly id: FieldRef<"ProductSku", 'String'>
    readonly productId: FieldRef<"ProductSku", 'String'>
    readonly skuCode: FieldRef<"ProductSku", 'String'>
    readonly skuName: FieldRef<"ProductSku", 'String'>
    readonly specsJson: FieldRef<"ProductSku", 'String'>
    readonly price: FieldRef<"ProductSku", 'Float'>
    readonly stock: FieldRef<"ProductSku", 'Int'>
    readonly status: FieldRef<"ProductSku", 'String'>
    readonly unitId: FieldRef<"ProductSku", 'String'>
    readonly kingdeeMaterialId: FieldRef<"ProductSku", 'String'>
    readonly createdAt: FieldRef<"ProductSku", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductSku", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductSku findUnique
   */
  export type ProductSkuFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * Filter, which ProductSku to fetch.
     */
    where: ProductSkuWhereUniqueInput
  }

  /**
   * ProductSku findUniqueOrThrow
   */
  export type ProductSkuFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * Filter, which ProductSku to fetch.
     */
    where: ProductSkuWhereUniqueInput
  }

  /**
   * ProductSku findFirst
   */
  export type ProductSkuFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * Filter, which ProductSku to fetch.
     */
    where?: ProductSkuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSkus to fetch.
     */
    orderBy?: ProductSkuOrderByWithRelationInput | ProductSkuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductSkus.
     */
    cursor?: ProductSkuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSkus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSkus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductSkus.
     */
    distinct?: ProductSkuScalarFieldEnum | ProductSkuScalarFieldEnum[]
  }

  /**
   * ProductSku findFirstOrThrow
   */
  export type ProductSkuFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * Filter, which ProductSku to fetch.
     */
    where?: ProductSkuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSkus to fetch.
     */
    orderBy?: ProductSkuOrderByWithRelationInput | ProductSkuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductSkus.
     */
    cursor?: ProductSkuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSkus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSkus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductSkus.
     */
    distinct?: ProductSkuScalarFieldEnum | ProductSkuScalarFieldEnum[]
  }

  /**
   * ProductSku findMany
   */
  export type ProductSkuFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * Filter, which ProductSkus to fetch.
     */
    where?: ProductSkuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSkus to fetch.
     */
    orderBy?: ProductSkuOrderByWithRelationInput | ProductSkuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductSkus.
     */
    cursor?: ProductSkuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSkus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSkus.
     */
    skip?: number
    distinct?: ProductSkuScalarFieldEnum | ProductSkuScalarFieldEnum[]
  }

  /**
   * ProductSku create
   */
  export type ProductSkuCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductSku.
     */
    data: XOR<ProductSkuCreateInput, ProductSkuUncheckedCreateInput>
  }

  /**
   * ProductSku createMany
   */
  export type ProductSkuCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductSkus.
     */
    data: ProductSkuCreateManyInput | ProductSkuCreateManyInput[]
  }

  /**
   * ProductSku createManyAndReturn
   */
  export type ProductSkuCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProductSkus.
     */
    data: ProductSkuCreateManyInput | ProductSkuCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductSku update
   */
  export type ProductSkuUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductSku.
     */
    data: XOR<ProductSkuUpdateInput, ProductSkuUncheckedUpdateInput>
    /**
     * Choose, which ProductSku to update.
     */
    where: ProductSkuWhereUniqueInput
  }

  /**
   * ProductSku updateMany
   */
  export type ProductSkuUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductSkus.
     */
    data: XOR<ProductSkuUpdateManyMutationInput, ProductSkuUncheckedUpdateManyInput>
    /**
     * Filter which ProductSkus to update
     */
    where?: ProductSkuWhereInput
  }

  /**
   * ProductSku upsert
   */
  export type ProductSkuUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductSku to update in case it exists.
     */
    where: ProductSkuWhereUniqueInput
    /**
     * In case the ProductSku found by the `where` argument doesn't exist, create a new ProductSku with this data.
     */
    create: XOR<ProductSkuCreateInput, ProductSkuUncheckedCreateInput>
    /**
     * In case the ProductSku was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductSkuUpdateInput, ProductSkuUncheckedUpdateInput>
  }

  /**
   * ProductSku delete
   */
  export type ProductSkuDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
    /**
     * Filter which ProductSku to delete.
     */
    where: ProductSkuWhereUniqueInput
  }

  /**
   * ProductSku deleteMany
   */
  export type ProductSkuDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductSkus to delete
     */
    where?: ProductSkuWhereInput
  }

  /**
   * ProductSku.cartItems
   */
  export type ProductSku$cartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    cursor?: CartItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * ProductSku.orderLines
   */
  export type ProductSku$orderLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    where?: SalesOrderLineWhereInput
    orderBy?: SalesOrderLineOrderByWithRelationInput | SalesOrderLineOrderByWithRelationInput[]
    cursor?: SalesOrderLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesOrderLineScalarFieldEnum | SalesOrderLineScalarFieldEnum[]
  }

  /**
   * ProductSku without action
   */
  export type ProductSkuDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSku
     */
    select?: ProductSkuSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSkuInclude<ExtArgs> | null
  }


  /**
   * Model Cart
   */

  export type AggregateCart = {
    _count: CartCountAggregateOutputType | null
    _min: CartMinAggregateOutputType | null
    _max: CartMaxAggregateOutputType | null
  }

  export type CartMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartCountAggregateOutputType = {
    id: number
    customerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CartMinAggregateInputType = {
    id?: true
    customerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartMaxAggregateInputType = {
    id?: true
    customerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartCountAggregateInputType = {
    id?: true
    customerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CartAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cart to aggregate.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Carts
    **/
    _count?: true | CartCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CartMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CartMaxAggregateInputType
  }

  export type GetCartAggregateType<T extends CartAggregateArgs> = {
        [P in keyof T & keyof AggregateCart]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCart[P]>
      : GetScalarType<T[P], AggregateCart[P]>
  }




  export type CartGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartWhereInput
    orderBy?: CartOrderByWithAggregationInput | CartOrderByWithAggregationInput[]
    by: CartScalarFieldEnum[] | CartScalarFieldEnum
    having?: CartScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CartCountAggregateInputType | true
    _min?: CartMinAggregateInputType
    _max?: CartMaxAggregateInputType
  }

  export type CartGroupByOutputType = {
    id: string
    customerId: string
    createdAt: Date
    updatedAt: Date
    _count: CartCountAggregateOutputType | null
    _min: CartMinAggregateOutputType | null
    _max: CartMaxAggregateOutputType | null
  }

  type GetCartGroupByPayload<T extends CartGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CartGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CartGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CartGroupByOutputType[P]>
            : GetScalarType<T[P], CartGroupByOutputType[P]>
        }
      >
    >


  export type CartSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    items?: boolean | Cart$itemsArgs<ExtArgs>
    _count?: boolean | CartCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cart"]>

  export type CartSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cart"]>

  export type CartSelectScalar = {
    id?: boolean
    customerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CartInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    items?: boolean | Cart$itemsArgs<ExtArgs>
    _count?: boolean | CartCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CartIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }

  export type $CartPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cart"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      items: Prisma.$CartItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cart"]>
    composites: {}
  }

  type CartGetPayload<S extends boolean | null | undefined | CartDefaultArgs> = $Result.GetResult<Prisma.$CartPayload, S>

  type CartCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CartFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CartCountAggregateInputType | true
    }

  export interface CartDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cart'], meta: { name: 'Cart' } }
    /**
     * Find zero or one Cart that matches the filter.
     * @param {CartFindUniqueArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CartFindUniqueArgs>(args: SelectSubset<T, CartFindUniqueArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Cart that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CartFindUniqueOrThrowArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CartFindUniqueOrThrowArgs>(args: SelectSubset<T, CartFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Cart that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartFindFirstArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CartFindFirstArgs>(args?: SelectSubset<T, CartFindFirstArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Cart that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartFindFirstOrThrowArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CartFindFirstOrThrowArgs>(args?: SelectSubset<T, CartFindFirstOrThrowArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Carts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Carts
     * const carts = await prisma.cart.findMany()
     * 
     * // Get first 10 Carts
     * const carts = await prisma.cart.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cartWithIdOnly = await prisma.cart.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CartFindManyArgs>(args?: SelectSubset<T, CartFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Cart.
     * @param {CartCreateArgs} args - Arguments to create a Cart.
     * @example
     * // Create one Cart
     * const Cart = await prisma.cart.create({
     *   data: {
     *     // ... data to create a Cart
     *   }
     * })
     * 
     */
    create<T extends CartCreateArgs>(args: SelectSubset<T, CartCreateArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Carts.
     * @param {CartCreateManyArgs} args - Arguments to create many Carts.
     * @example
     * // Create many Carts
     * const cart = await prisma.cart.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CartCreateManyArgs>(args?: SelectSubset<T, CartCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Carts and returns the data saved in the database.
     * @param {CartCreateManyAndReturnArgs} args - Arguments to create many Carts.
     * @example
     * // Create many Carts
     * const cart = await prisma.cart.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Carts and only return the `id`
     * const cartWithIdOnly = await prisma.cart.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CartCreateManyAndReturnArgs>(args?: SelectSubset<T, CartCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Cart.
     * @param {CartDeleteArgs} args - Arguments to delete one Cart.
     * @example
     * // Delete one Cart
     * const Cart = await prisma.cart.delete({
     *   where: {
     *     // ... filter to delete one Cart
     *   }
     * })
     * 
     */
    delete<T extends CartDeleteArgs>(args: SelectSubset<T, CartDeleteArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Cart.
     * @param {CartUpdateArgs} args - Arguments to update one Cart.
     * @example
     * // Update one Cart
     * const cart = await prisma.cart.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CartUpdateArgs>(args: SelectSubset<T, CartUpdateArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Carts.
     * @param {CartDeleteManyArgs} args - Arguments to filter Carts to delete.
     * @example
     * // Delete a few Carts
     * const { count } = await prisma.cart.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CartDeleteManyArgs>(args?: SelectSubset<T, CartDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Carts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Carts
     * const cart = await prisma.cart.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CartUpdateManyArgs>(args: SelectSubset<T, CartUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cart.
     * @param {CartUpsertArgs} args - Arguments to update or create a Cart.
     * @example
     * // Update or create a Cart
     * const cart = await prisma.cart.upsert({
     *   create: {
     *     // ... data to create a Cart
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cart we want to update
     *   }
     * })
     */
    upsert<T extends CartUpsertArgs>(args: SelectSubset<T, CartUpsertArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Carts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartCountArgs} args - Arguments to filter Carts to count.
     * @example
     * // Count the number of Carts
     * const count = await prisma.cart.count({
     *   where: {
     *     // ... the filter for the Carts we want to count
     *   }
     * })
    **/
    count<T extends CartCountArgs>(
      args?: Subset<T, CartCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CartCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CartAggregateArgs>(args: Subset<T, CartAggregateArgs>): Prisma.PrismaPromise<GetCartAggregateType<T>>

    /**
     * Group by Cart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CartGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CartGroupByArgs['orderBy'] }
        : { orderBy?: CartGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CartGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCartGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cart model
   */
  readonly fields: CartFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cart.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CartClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    items<T extends Cart$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Cart$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cart model
   */ 
  interface CartFieldRefs {
    readonly id: FieldRef<"Cart", 'String'>
    readonly customerId: FieldRef<"Cart", 'String'>
    readonly createdAt: FieldRef<"Cart", 'DateTime'>
    readonly updatedAt: FieldRef<"Cart", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cart findUnique
   */
  export type CartFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart findUniqueOrThrow
   */
  export type CartFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart findFirst
   */
  export type CartFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Carts.
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Carts.
     */
    distinct?: CartScalarFieldEnum | CartScalarFieldEnum[]
  }

  /**
   * Cart findFirstOrThrow
   */
  export type CartFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Carts.
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Carts.
     */
    distinct?: CartScalarFieldEnum | CartScalarFieldEnum[]
  }

  /**
   * Cart findMany
   */
  export type CartFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Carts to fetch.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Carts.
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    distinct?: CartScalarFieldEnum | CartScalarFieldEnum[]
  }

  /**
   * Cart create
   */
  export type CartCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * The data needed to create a Cart.
     */
    data: XOR<CartCreateInput, CartUncheckedCreateInput>
  }

  /**
   * Cart createMany
   */
  export type CartCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Carts.
     */
    data: CartCreateManyInput | CartCreateManyInput[]
  }

  /**
   * Cart createManyAndReturn
   */
  export type CartCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Carts.
     */
    data: CartCreateManyInput | CartCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cart update
   */
  export type CartUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * The data needed to update a Cart.
     */
    data: XOR<CartUpdateInput, CartUncheckedUpdateInput>
    /**
     * Choose, which Cart to update.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart updateMany
   */
  export type CartUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Carts.
     */
    data: XOR<CartUpdateManyMutationInput, CartUncheckedUpdateManyInput>
    /**
     * Filter which Carts to update
     */
    where?: CartWhereInput
  }

  /**
   * Cart upsert
   */
  export type CartUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * The filter to search for the Cart to update in case it exists.
     */
    where: CartWhereUniqueInput
    /**
     * In case the Cart found by the `where` argument doesn't exist, create a new Cart with this data.
     */
    create: XOR<CartCreateInput, CartUncheckedCreateInput>
    /**
     * In case the Cart was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CartUpdateInput, CartUncheckedUpdateInput>
  }

  /**
   * Cart delete
   */
  export type CartDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter which Cart to delete.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart deleteMany
   */
  export type CartDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Carts to delete
     */
    where?: CartWhereInput
  }

  /**
   * Cart.items
   */
  export type Cart$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    cursor?: CartItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * Cart without action
   */
  export type CartDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
  }


  /**
   * Model CartItem
   */

  export type AggregateCartItem = {
    _count: CartItemCountAggregateOutputType | null
    _avg: CartItemAvgAggregateOutputType | null
    _sum: CartItemSumAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  export type CartItemAvgAggregateOutputType = {
    qty: number | null
  }

  export type CartItemSumAggregateOutputType = {
    qty: number | null
  }

  export type CartItemMinAggregateOutputType = {
    id: string | null
    cartId: string | null
    customerId: string | null
    productId: string | null
    skuId: string | null
    qty: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartItemMaxAggregateOutputType = {
    id: string | null
    cartId: string | null
    customerId: string | null
    productId: string | null
    skuId: string | null
    qty: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartItemCountAggregateOutputType = {
    id: number
    cartId: number
    customerId: number
    productId: number
    skuId: number
    qty: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CartItemAvgAggregateInputType = {
    qty?: true
  }

  export type CartItemSumAggregateInputType = {
    qty?: true
  }

  export type CartItemMinAggregateInputType = {
    id?: true
    cartId?: true
    customerId?: true
    productId?: true
    skuId?: true
    qty?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartItemMaxAggregateInputType = {
    id?: true
    cartId?: true
    customerId?: true
    productId?: true
    skuId?: true
    qty?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartItemCountAggregateInputType = {
    id?: true
    cartId?: true
    customerId?: true
    productId?: true
    skuId?: true
    qty?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CartItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItem to aggregate.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CartItems
    **/
    _count?: true | CartItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CartItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CartItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CartItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CartItemMaxAggregateInputType
  }

  export type GetCartItemAggregateType<T extends CartItemAggregateArgs> = {
        [P in keyof T & keyof AggregateCartItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCartItem[P]>
      : GetScalarType<T[P], AggregateCartItem[P]>
  }




  export type CartItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithAggregationInput | CartItemOrderByWithAggregationInput[]
    by: CartItemScalarFieldEnum[] | CartItemScalarFieldEnum
    having?: CartItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CartItemCountAggregateInputType | true
    _avg?: CartItemAvgAggregateInputType
    _sum?: CartItemSumAggregateInputType
    _min?: CartItemMinAggregateInputType
    _max?: CartItemMaxAggregateInputType
  }

  export type CartItemGroupByOutputType = {
    id: string
    cartId: string
    customerId: string
    productId: string
    skuId: string
    qty: number
    createdAt: Date
    updatedAt: Date
    _count: CartItemCountAggregateOutputType | null
    _avg: CartItemAvgAggregateOutputType | null
    _sum: CartItemSumAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  type GetCartItemGroupByPayload<T extends CartItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CartItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CartItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CartItemGroupByOutputType[P]>
            : GetScalarType<T[P], CartItemGroupByOutputType[P]>
        }
      >
    >


  export type CartItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cartId?: boolean
    customerId?: boolean
    productId?: boolean
    skuId?: boolean
    qty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cart?: boolean | CartDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cartItem"]>

  export type CartItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cartId?: boolean
    customerId?: boolean
    productId?: boolean
    skuId?: boolean
    qty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cart?: boolean | CartDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cartItem"]>

  export type CartItemSelectScalar = {
    id?: boolean
    cartId?: boolean
    customerId?: boolean
    productId?: boolean
    skuId?: boolean
    qty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CartItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cart?: boolean | CartDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }
  export type CartItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cart?: boolean | CartDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }

  export type $CartItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CartItem"
    objects: {
      cart: Prisma.$CartPayload<ExtArgs>
      customer: Prisma.$CustomerPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
      sku: Prisma.$ProductSkuPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cartId: string
      customerId: string
      productId: string
      skuId: string
      qty: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cartItem"]>
    composites: {}
  }

  type CartItemGetPayload<S extends boolean | null | undefined | CartItemDefaultArgs> = $Result.GetResult<Prisma.$CartItemPayload, S>

  type CartItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CartItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CartItemCountAggregateInputType | true
    }

  export interface CartItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CartItem'], meta: { name: 'CartItem' } }
    /**
     * Find zero or one CartItem that matches the filter.
     * @param {CartItemFindUniqueArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CartItemFindUniqueArgs>(args: SelectSubset<T, CartItemFindUniqueArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CartItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CartItemFindUniqueOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CartItemFindUniqueOrThrowArgs>(args: SelectSubset<T, CartItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CartItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CartItemFindFirstArgs>(args?: SelectSubset<T, CartItemFindFirstArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CartItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CartItemFindFirstOrThrowArgs>(args?: SelectSubset<T, CartItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CartItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CartItems
     * const cartItems = await prisma.cartItem.findMany()
     * 
     * // Get first 10 CartItems
     * const cartItems = await prisma.cartItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CartItemFindManyArgs>(args?: SelectSubset<T, CartItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CartItem.
     * @param {CartItemCreateArgs} args - Arguments to create a CartItem.
     * @example
     * // Create one CartItem
     * const CartItem = await prisma.cartItem.create({
     *   data: {
     *     // ... data to create a CartItem
     *   }
     * })
     * 
     */
    create<T extends CartItemCreateArgs>(args: SelectSubset<T, CartItemCreateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CartItems.
     * @param {CartItemCreateManyArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CartItemCreateManyArgs>(args?: SelectSubset<T, CartItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CartItems and returns the data saved in the database.
     * @param {CartItemCreateManyAndReturnArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CartItems and only return the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CartItemCreateManyAndReturnArgs>(args?: SelectSubset<T, CartItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CartItem.
     * @param {CartItemDeleteArgs} args - Arguments to delete one CartItem.
     * @example
     * // Delete one CartItem
     * const CartItem = await prisma.cartItem.delete({
     *   where: {
     *     // ... filter to delete one CartItem
     *   }
     * })
     * 
     */
    delete<T extends CartItemDeleteArgs>(args: SelectSubset<T, CartItemDeleteArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CartItem.
     * @param {CartItemUpdateArgs} args - Arguments to update one CartItem.
     * @example
     * // Update one CartItem
     * const cartItem = await prisma.cartItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CartItemUpdateArgs>(args: SelectSubset<T, CartItemUpdateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CartItems.
     * @param {CartItemDeleteManyArgs} args - Arguments to filter CartItems to delete.
     * @example
     * // Delete a few CartItems
     * const { count } = await prisma.cartItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CartItemDeleteManyArgs>(args?: SelectSubset<T, CartItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CartItems
     * const cartItem = await prisma.cartItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CartItemUpdateManyArgs>(args: SelectSubset<T, CartItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CartItem.
     * @param {CartItemUpsertArgs} args - Arguments to update or create a CartItem.
     * @example
     * // Update or create a CartItem
     * const cartItem = await prisma.cartItem.upsert({
     *   create: {
     *     // ... data to create a CartItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CartItem we want to update
     *   }
     * })
     */
    upsert<T extends CartItemUpsertArgs>(args: SelectSubset<T, CartItemUpsertArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemCountArgs} args - Arguments to filter CartItems to count.
     * @example
     * // Count the number of CartItems
     * const count = await prisma.cartItem.count({
     *   where: {
     *     // ... the filter for the CartItems we want to count
     *   }
     * })
    **/
    count<T extends CartItemCountArgs>(
      args?: Subset<T, CartItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CartItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CartItemAggregateArgs>(args: Subset<T, CartItemAggregateArgs>): Prisma.PrismaPromise<GetCartItemAggregateType<T>>

    /**
     * Group by CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CartItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CartItemGroupByArgs['orderBy'] }
        : { orderBy?: CartItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CartItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCartItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CartItem model
   */
  readonly fields: CartItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CartItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CartItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cart<T extends CartDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CartDefaultArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sku<T extends ProductSkuDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductSkuDefaultArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CartItem model
   */ 
  interface CartItemFieldRefs {
    readonly id: FieldRef<"CartItem", 'String'>
    readonly cartId: FieldRef<"CartItem", 'String'>
    readonly customerId: FieldRef<"CartItem", 'String'>
    readonly productId: FieldRef<"CartItem", 'String'>
    readonly skuId: FieldRef<"CartItem", 'String'>
    readonly qty: FieldRef<"CartItem", 'Int'>
    readonly createdAt: FieldRef<"CartItem", 'DateTime'>
    readonly updatedAt: FieldRef<"CartItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CartItem findUnique
   */
  export type CartItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findUniqueOrThrow
   */
  export type CartItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findFirst
   */
  export type CartItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findFirstOrThrow
   */
  export type CartItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findMany
   */
  export type CartItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItems to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem create
   */
  export type CartItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The data needed to create a CartItem.
     */
    data: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
  }

  /**
   * CartItem createMany
   */
  export type CartItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[]
  }

  /**
   * CartItem createManyAndReturn
   */
  export type CartItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CartItem update
   */
  export type CartItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The data needed to update a CartItem.
     */
    data: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
    /**
     * Choose, which CartItem to update.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem updateMany
   */
  export type CartItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CartItems.
     */
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyInput>
    /**
     * Filter which CartItems to update
     */
    where?: CartItemWhereInput
  }

  /**
   * CartItem upsert
   */
  export type CartItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The filter to search for the CartItem to update in case it exists.
     */
    where: CartItemWhereUniqueInput
    /**
     * In case the CartItem found by the `where` argument doesn't exist, create a new CartItem with this data.
     */
    create: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
    /**
     * In case the CartItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
  }

  /**
   * CartItem delete
   */
  export type CartItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter which CartItem to delete.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem deleteMany
   */
  export type CartItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItems to delete
     */
    where?: CartItemWhereInput
  }

  /**
   * CartItem without action
   */
  export type CartItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
  }


  /**
   * Model SalesOrder
   */

  export type AggregateSalesOrder = {
    _count: SalesOrderCountAggregateOutputType | null
    _avg: SalesOrderAvgAggregateOutputType | null
    _sum: SalesOrderSumAggregateOutputType | null
    _min: SalesOrderMinAggregateOutputType | null
    _max: SalesOrderMaxAggregateOutputType | null
  }

  export type SalesOrderAvgAggregateOutputType = {
    totalAmount: number | null
  }

  export type SalesOrderSumAggregateOutputType = {
    totalAmount: number | null
  }

  export type SalesOrderMinAggregateOutputType = {
    id: string | null
    orderNo: string | null
    customerId: string | null
    status: string | null
    settlementMode: string | null
    currency: string | null
    totalAmount: number | null
    remark: string | null
    idempotencyKey: string | null
    kingdeeOrderId: string | null
    kingdeeOrderNumber: string | null
    writebackError: string | null
    canceledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesOrderMaxAggregateOutputType = {
    id: string | null
    orderNo: string | null
    customerId: string | null
    status: string | null
    settlementMode: string | null
    currency: string | null
    totalAmount: number | null
    remark: string | null
    idempotencyKey: string | null
    kingdeeOrderId: string | null
    kingdeeOrderNumber: string | null
    writebackError: string | null
    canceledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesOrderCountAggregateOutputType = {
    id: number
    orderNo: number
    customerId: number
    status: number
    settlementMode: number
    currency: number
    totalAmount: number
    remark: number
    idempotencyKey: number
    kingdeeOrderId: number
    kingdeeOrderNumber: number
    writebackError: number
    canceledAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SalesOrderAvgAggregateInputType = {
    totalAmount?: true
  }

  export type SalesOrderSumAggregateInputType = {
    totalAmount?: true
  }

  export type SalesOrderMinAggregateInputType = {
    id?: true
    orderNo?: true
    customerId?: true
    status?: true
    settlementMode?: true
    currency?: true
    totalAmount?: true
    remark?: true
    idempotencyKey?: true
    kingdeeOrderId?: true
    kingdeeOrderNumber?: true
    writebackError?: true
    canceledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesOrderMaxAggregateInputType = {
    id?: true
    orderNo?: true
    customerId?: true
    status?: true
    settlementMode?: true
    currency?: true
    totalAmount?: true
    remark?: true
    idempotencyKey?: true
    kingdeeOrderId?: true
    kingdeeOrderNumber?: true
    writebackError?: true
    canceledAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesOrderCountAggregateInputType = {
    id?: true
    orderNo?: true
    customerId?: true
    status?: true
    settlementMode?: true
    currency?: true
    totalAmount?: true
    remark?: true
    idempotencyKey?: true
    kingdeeOrderId?: true
    kingdeeOrderNumber?: true
    writebackError?: true
    canceledAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SalesOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesOrder to aggregate.
     */
    where?: SalesOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrders to fetch.
     */
    orderBy?: SalesOrderOrderByWithRelationInput | SalesOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalesOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SalesOrders
    **/
    _count?: true | SalesOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SalesOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SalesOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalesOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalesOrderMaxAggregateInputType
  }

  export type GetSalesOrderAggregateType<T extends SalesOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateSalesOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSalesOrder[P]>
      : GetScalarType<T[P], AggregateSalesOrder[P]>
  }




  export type SalesOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesOrderWhereInput
    orderBy?: SalesOrderOrderByWithAggregationInput | SalesOrderOrderByWithAggregationInput[]
    by: SalesOrderScalarFieldEnum[] | SalesOrderScalarFieldEnum
    having?: SalesOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalesOrderCountAggregateInputType | true
    _avg?: SalesOrderAvgAggregateInputType
    _sum?: SalesOrderSumAggregateInputType
    _min?: SalesOrderMinAggregateInputType
    _max?: SalesOrderMaxAggregateInputType
  }

  export type SalesOrderGroupByOutputType = {
    id: string
    orderNo: string
    customerId: string
    status: string
    settlementMode: string
    currency: string
    totalAmount: number
    remark: string | null
    idempotencyKey: string | null
    kingdeeOrderId: string | null
    kingdeeOrderNumber: string | null
    writebackError: string | null
    canceledAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SalesOrderCountAggregateOutputType | null
    _avg: SalesOrderAvgAggregateOutputType | null
    _sum: SalesOrderSumAggregateOutputType | null
    _min: SalesOrderMinAggregateOutputType | null
    _max: SalesOrderMaxAggregateOutputType | null
  }

  type GetSalesOrderGroupByPayload<T extends SalesOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalesOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalesOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalesOrderGroupByOutputType[P]>
            : GetScalarType<T[P], SalesOrderGroupByOutputType[P]>
        }
      >
    >


  export type SalesOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNo?: boolean
    customerId?: boolean
    status?: boolean
    settlementMode?: boolean
    currency?: boolean
    totalAmount?: boolean
    remark?: boolean
    idempotencyKey?: boolean
    kingdeeOrderId?: boolean
    kingdeeOrderNumber?: boolean
    writebackError?: boolean
    canceledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    lines?: boolean | SalesOrder$linesArgs<ExtArgs>
    writebackLogs?: boolean | SalesOrder$writebackLogsArgs<ExtArgs>
    deliveries?: boolean | SalesOrder$deliveriesArgs<ExtArgs>
    _count?: boolean | SalesOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesOrder"]>

  export type SalesOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNo?: boolean
    customerId?: boolean
    status?: boolean
    settlementMode?: boolean
    currency?: boolean
    totalAmount?: boolean
    remark?: boolean
    idempotencyKey?: boolean
    kingdeeOrderId?: boolean
    kingdeeOrderNumber?: boolean
    writebackError?: boolean
    canceledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesOrder"]>

  export type SalesOrderSelectScalar = {
    id?: boolean
    orderNo?: boolean
    customerId?: boolean
    status?: boolean
    settlementMode?: boolean
    currency?: boolean
    totalAmount?: boolean
    remark?: boolean
    idempotencyKey?: boolean
    kingdeeOrderId?: boolean
    kingdeeOrderNumber?: boolean
    writebackError?: boolean
    canceledAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SalesOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    lines?: boolean | SalesOrder$linesArgs<ExtArgs>
    writebackLogs?: boolean | SalesOrder$writebackLogsArgs<ExtArgs>
    deliveries?: boolean | SalesOrder$deliveriesArgs<ExtArgs>
    _count?: boolean | SalesOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SalesOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }

  export type $SalesOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SalesOrder"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      lines: Prisma.$SalesOrderLinePayload<ExtArgs>[]
      writebackLogs: Prisma.$OrderWritebackLogPayload<ExtArgs>[]
      deliveries: Prisma.$DeliveryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderNo: string
      customerId: string
      status: string
      settlementMode: string
      currency: string
      totalAmount: number
      remark: string | null
      idempotencyKey: string | null
      kingdeeOrderId: string | null
      kingdeeOrderNumber: string | null
      writebackError: string | null
      canceledAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["salesOrder"]>
    composites: {}
  }

  type SalesOrderGetPayload<S extends boolean | null | undefined | SalesOrderDefaultArgs> = $Result.GetResult<Prisma.$SalesOrderPayload, S>

  type SalesOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SalesOrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SalesOrderCountAggregateInputType | true
    }

  export interface SalesOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SalesOrder'], meta: { name: 'SalesOrder' } }
    /**
     * Find zero or one SalesOrder that matches the filter.
     * @param {SalesOrderFindUniqueArgs} args - Arguments to find a SalesOrder
     * @example
     * // Get one SalesOrder
     * const salesOrder = await prisma.salesOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalesOrderFindUniqueArgs>(args: SelectSubset<T, SalesOrderFindUniqueArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SalesOrder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SalesOrderFindUniqueOrThrowArgs} args - Arguments to find a SalesOrder
     * @example
     * // Get one SalesOrder
     * const salesOrder = await prisma.salesOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalesOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, SalesOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SalesOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderFindFirstArgs} args - Arguments to find a SalesOrder
     * @example
     * // Get one SalesOrder
     * const salesOrder = await prisma.salesOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalesOrderFindFirstArgs>(args?: SelectSubset<T, SalesOrderFindFirstArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SalesOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderFindFirstOrThrowArgs} args - Arguments to find a SalesOrder
     * @example
     * // Get one SalesOrder
     * const salesOrder = await prisma.salesOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalesOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, SalesOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SalesOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SalesOrders
     * const salesOrders = await prisma.salesOrder.findMany()
     * 
     * // Get first 10 SalesOrders
     * const salesOrders = await prisma.salesOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salesOrderWithIdOnly = await prisma.salesOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalesOrderFindManyArgs>(args?: SelectSubset<T, SalesOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SalesOrder.
     * @param {SalesOrderCreateArgs} args - Arguments to create a SalesOrder.
     * @example
     * // Create one SalesOrder
     * const SalesOrder = await prisma.salesOrder.create({
     *   data: {
     *     // ... data to create a SalesOrder
     *   }
     * })
     * 
     */
    create<T extends SalesOrderCreateArgs>(args: SelectSubset<T, SalesOrderCreateArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SalesOrders.
     * @param {SalesOrderCreateManyArgs} args - Arguments to create many SalesOrders.
     * @example
     * // Create many SalesOrders
     * const salesOrder = await prisma.salesOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalesOrderCreateManyArgs>(args?: SelectSubset<T, SalesOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SalesOrders and returns the data saved in the database.
     * @param {SalesOrderCreateManyAndReturnArgs} args - Arguments to create many SalesOrders.
     * @example
     * // Create many SalesOrders
     * const salesOrder = await prisma.salesOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SalesOrders and only return the `id`
     * const salesOrderWithIdOnly = await prisma.salesOrder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalesOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, SalesOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SalesOrder.
     * @param {SalesOrderDeleteArgs} args - Arguments to delete one SalesOrder.
     * @example
     * // Delete one SalesOrder
     * const SalesOrder = await prisma.salesOrder.delete({
     *   where: {
     *     // ... filter to delete one SalesOrder
     *   }
     * })
     * 
     */
    delete<T extends SalesOrderDeleteArgs>(args: SelectSubset<T, SalesOrderDeleteArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SalesOrder.
     * @param {SalesOrderUpdateArgs} args - Arguments to update one SalesOrder.
     * @example
     * // Update one SalesOrder
     * const salesOrder = await prisma.salesOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalesOrderUpdateArgs>(args: SelectSubset<T, SalesOrderUpdateArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SalesOrders.
     * @param {SalesOrderDeleteManyArgs} args - Arguments to filter SalesOrders to delete.
     * @example
     * // Delete a few SalesOrders
     * const { count } = await prisma.salesOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalesOrderDeleteManyArgs>(args?: SelectSubset<T, SalesOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SalesOrders
     * const salesOrder = await prisma.salesOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalesOrderUpdateManyArgs>(args: SelectSubset<T, SalesOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SalesOrder.
     * @param {SalesOrderUpsertArgs} args - Arguments to update or create a SalesOrder.
     * @example
     * // Update or create a SalesOrder
     * const salesOrder = await prisma.salesOrder.upsert({
     *   create: {
     *     // ... data to create a SalesOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SalesOrder we want to update
     *   }
     * })
     */
    upsert<T extends SalesOrderUpsertArgs>(args: SelectSubset<T, SalesOrderUpsertArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SalesOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderCountArgs} args - Arguments to filter SalesOrders to count.
     * @example
     * // Count the number of SalesOrders
     * const count = await prisma.salesOrder.count({
     *   where: {
     *     // ... the filter for the SalesOrders we want to count
     *   }
     * })
    **/
    count<T extends SalesOrderCountArgs>(
      args?: Subset<T, SalesOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalesOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SalesOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalesOrderAggregateArgs>(args: Subset<T, SalesOrderAggregateArgs>): Prisma.PrismaPromise<GetSalesOrderAggregateType<T>>

    /**
     * Group by SalesOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalesOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalesOrderGroupByArgs['orderBy'] }
        : { orderBy?: SalesOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalesOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SalesOrder model
   */
  readonly fields: SalesOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SalesOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalesOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    lines<T extends SalesOrder$linesArgs<ExtArgs> = {}>(args?: Subset<T, SalesOrder$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findMany"> | Null>
    writebackLogs<T extends SalesOrder$writebackLogsArgs<ExtArgs> = {}>(args?: Subset<T, SalesOrder$writebackLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "findMany"> | Null>
    deliveries<T extends SalesOrder$deliveriesArgs<ExtArgs> = {}>(args?: Subset<T, SalesOrder$deliveriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SalesOrder model
   */ 
  interface SalesOrderFieldRefs {
    readonly id: FieldRef<"SalesOrder", 'String'>
    readonly orderNo: FieldRef<"SalesOrder", 'String'>
    readonly customerId: FieldRef<"SalesOrder", 'String'>
    readonly status: FieldRef<"SalesOrder", 'String'>
    readonly settlementMode: FieldRef<"SalesOrder", 'String'>
    readonly currency: FieldRef<"SalesOrder", 'String'>
    readonly totalAmount: FieldRef<"SalesOrder", 'Float'>
    readonly remark: FieldRef<"SalesOrder", 'String'>
    readonly idempotencyKey: FieldRef<"SalesOrder", 'String'>
    readonly kingdeeOrderId: FieldRef<"SalesOrder", 'String'>
    readonly kingdeeOrderNumber: FieldRef<"SalesOrder", 'String'>
    readonly writebackError: FieldRef<"SalesOrder", 'String'>
    readonly canceledAt: FieldRef<"SalesOrder", 'DateTime'>
    readonly createdAt: FieldRef<"SalesOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"SalesOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SalesOrder findUnique
   */
  export type SalesOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrder to fetch.
     */
    where: SalesOrderWhereUniqueInput
  }

  /**
   * SalesOrder findUniqueOrThrow
   */
  export type SalesOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrder to fetch.
     */
    where: SalesOrderWhereUniqueInput
  }

  /**
   * SalesOrder findFirst
   */
  export type SalesOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrder to fetch.
     */
    where?: SalesOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrders to fetch.
     */
    orderBy?: SalesOrderOrderByWithRelationInput | SalesOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesOrders.
     */
    cursor?: SalesOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesOrders.
     */
    distinct?: SalesOrderScalarFieldEnum | SalesOrderScalarFieldEnum[]
  }

  /**
   * SalesOrder findFirstOrThrow
   */
  export type SalesOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrder to fetch.
     */
    where?: SalesOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrders to fetch.
     */
    orderBy?: SalesOrderOrderByWithRelationInput | SalesOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesOrders.
     */
    cursor?: SalesOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesOrders.
     */
    distinct?: SalesOrderScalarFieldEnum | SalesOrderScalarFieldEnum[]
  }

  /**
   * SalesOrder findMany
   */
  export type SalesOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrders to fetch.
     */
    where?: SalesOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrders to fetch.
     */
    orderBy?: SalesOrderOrderByWithRelationInput | SalesOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SalesOrders.
     */
    cursor?: SalesOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrders.
     */
    skip?: number
    distinct?: SalesOrderScalarFieldEnum | SalesOrderScalarFieldEnum[]
  }

  /**
   * SalesOrder create
   */
  export type SalesOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a SalesOrder.
     */
    data: XOR<SalesOrderCreateInput, SalesOrderUncheckedCreateInput>
  }

  /**
   * SalesOrder createMany
   */
  export type SalesOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SalesOrders.
     */
    data: SalesOrderCreateManyInput | SalesOrderCreateManyInput[]
  }

  /**
   * SalesOrder createManyAndReturn
   */
  export type SalesOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SalesOrders.
     */
    data: SalesOrderCreateManyInput | SalesOrderCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesOrder update
   */
  export type SalesOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a SalesOrder.
     */
    data: XOR<SalesOrderUpdateInput, SalesOrderUncheckedUpdateInput>
    /**
     * Choose, which SalesOrder to update.
     */
    where: SalesOrderWhereUniqueInput
  }

  /**
   * SalesOrder updateMany
   */
  export type SalesOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SalesOrders.
     */
    data: XOR<SalesOrderUpdateManyMutationInput, SalesOrderUncheckedUpdateManyInput>
    /**
     * Filter which SalesOrders to update
     */
    where?: SalesOrderWhereInput
  }

  /**
   * SalesOrder upsert
   */
  export type SalesOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the SalesOrder to update in case it exists.
     */
    where: SalesOrderWhereUniqueInput
    /**
     * In case the SalesOrder found by the `where` argument doesn't exist, create a new SalesOrder with this data.
     */
    create: XOR<SalesOrderCreateInput, SalesOrderUncheckedCreateInput>
    /**
     * In case the SalesOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalesOrderUpdateInput, SalesOrderUncheckedUpdateInput>
  }

  /**
   * SalesOrder delete
   */
  export type SalesOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
    /**
     * Filter which SalesOrder to delete.
     */
    where: SalesOrderWhereUniqueInput
  }

  /**
   * SalesOrder deleteMany
   */
  export type SalesOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesOrders to delete
     */
    where?: SalesOrderWhereInput
  }

  /**
   * SalesOrder.lines
   */
  export type SalesOrder$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    where?: SalesOrderLineWhereInput
    orderBy?: SalesOrderLineOrderByWithRelationInput | SalesOrderLineOrderByWithRelationInput[]
    cursor?: SalesOrderLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesOrderLineScalarFieldEnum | SalesOrderLineScalarFieldEnum[]
  }

  /**
   * SalesOrder.writebackLogs
   */
  export type SalesOrder$writebackLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    where?: OrderWritebackLogWhereInput
    orderBy?: OrderWritebackLogOrderByWithRelationInput | OrderWritebackLogOrderByWithRelationInput[]
    cursor?: OrderWritebackLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderWritebackLogScalarFieldEnum | OrderWritebackLogScalarFieldEnum[]
  }

  /**
   * SalesOrder.deliveries
   */
  export type SalesOrder$deliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    where?: DeliveryWhereInput
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    cursor?: DeliveryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * SalesOrder without action
   */
  export type SalesOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrder
     */
    select?: SalesOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderInclude<ExtArgs> | null
  }


  /**
   * Model SalesOrderLine
   */

  export type AggregateSalesOrderLine = {
    _count: SalesOrderLineCountAggregateOutputType | null
    _avg: SalesOrderLineAvgAggregateOutputType | null
    _sum: SalesOrderLineSumAggregateOutputType | null
    _min: SalesOrderLineMinAggregateOutputType | null
    _max: SalesOrderLineMaxAggregateOutputType | null
  }

  export type SalesOrderLineAvgAggregateOutputType = {
    qty: number | null
    unitPrice: number | null
    lineAmount: number | null
  }

  export type SalesOrderLineSumAggregateOutputType = {
    qty: number | null
    unitPrice: number | null
    lineAmount: number | null
  }

  export type SalesOrderLineMinAggregateOutputType = {
    id: string | null
    salesOrderId: string | null
    productId: string | null
    skuId: string | null
    productName: string | null
    skuName: string | null
    skuCode: string | null
    qty: number | null
    unitPrice: number | null
    lineAmount: number | null
    rawJson: string | null
    createdAt: Date | null
  }

  export type SalesOrderLineMaxAggregateOutputType = {
    id: string | null
    salesOrderId: string | null
    productId: string | null
    skuId: string | null
    productName: string | null
    skuName: string | null
    skuCode: string | null
    qty: number | null
    unitPrice: number | null
    lineAmount: number | null
    rawJson: string | null
    createdAt: Date | null
  }

  export type SalesOrderLineCountAggregateOutputType = {
    id: number
    salesOrderId: number
    productId: number
    skuId: number
    productName: number
    skuName: number
    skuCode: number
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson: number
    createdAt: number
    _all: number
  }


  export type SalesOrderLineAvgAggregateInputType = {
    qty?: true
    unitPrice?: true
    lineAmount?: true
  }

  export type SalesOrderLineSumAggregateInputType = {
    qty?: true
    unitPrice?: true
    lineAmount?: true
  }

  export type SalesOrderLineMinAggregateInputType = {
    id?: true
    salesOrderId?: true
    productId?: true
    skuId?: true
    productName?: true
    skuName?: true
    skuCode?: true
    qty?: true
    unitPrice?: true
    lineAmount?: true
    rawJson?: true
    createdAt?: true
  }

  export type SalesOrderLineMaxAggregateInputType = {
    id?: true
    salesOrderId?: true
    productId?: true
    skuId?: true
    productName?: true
    skuName?: true
    skuCode?: true
    qty?: true
    unitPrice?: true
    lineAmount?: true
    rawJson?: true
    createdAt?: true
  }

  export type SalesOrderLineCountAggregateInputType = {
    id?: true
    salesOrderId?: true
    productId?: true
    skuId?: true
    productName?: true
    skuName?: true
    skuCode?: true
    qty?: true
    unitPrice?: true
    lineAmount?: true
    rawJson?: true
    createdAt?: true
    _all?: true
  }

  export type SalesOrderLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesOrderLine to aggregate.
     */
    where?: SalesOrderLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrderLines to fetch.
     */
    orderBy?: SalesOrderLineOrderByWithRelationInput | SalesOrderLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalesOrderLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrderLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrderLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SalesOrderLines
    **/
    _count?: true | SalesOrderLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SalesOrderLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SalesOrderLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalesOrderLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalesOrderLineMaxAggregateInputType
  }

  export type GetSalesOrderLineAggregateType<T extends SalesOrderLineAggregateArgs> = {
        [P in keyof T & keyof AggregateSalesOrderLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSalesOrderLine[P]>
      : GetScalarType<T[P], AggregateSalesOrderLine[P]>
  }




  export type SalesOrderLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesOrderLineWhereInput
    orderBy?: SalesOrderLineOrderByWithAggregationInput | SalesOrderLineOrderByWithAggregationInput[]
    by: SalesOrderLineScalarFieldEnum[] | SalesOrderLineScalarFieldEnum
    having?: SalesOrderLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalesOrderLineCountAggregateInputType | true
    _avg?: SalesOrderLineAvgAggregateInputType
    _sum?: SalesOrderLineSumAggregateInputType
    _min?: SalesOrderLineMinAggregateInputType
    _max?: SalesOrderLineMaxAggregateInputType
  }

  export type SalesOrderLineGroupByOutputType = {
    id: string
    salesOrderId: string
    productId: string
    skuId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson: string | null
    createdAt: Date
    _count: SalesOrderLineCountAggregateOutputType | null
    _avg: SalesOrderLineAvgAggregateOutputType | null
    _sum: SalesOrderLineSumAggregateOutputType | null
    _min: SalesOrderLineMinAggregateOutputType | null
    _max: SalesOrderLineMaxAggregateOutputType | null
  }

  type GetSalesOrderLineGroupByPayload<T extends SalesOrderLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalesOrderLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalesOrderLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalesOrderLineGroupByOutputType[P]>
            : GetScalarType<T[P], SalesOrderLineGroupByOutputType[P]>
        }
      >
    >


  export type SalesOrderLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    salesOrderId?: boolean
    productId?: boolean
    skuId?: boolean
    productName?: boolean
    skuName?: boolean
    skuCode?: boolean
    qty?: boolean
    unitPrice?: boolean
    lineAmount?: boolean
    rawJson?: boolean
    createdAt?: boolean
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesOrderLine"]>

  export type SalesOrderLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    salesOrderId?: boolean
    productId?: boolean
    skuId?: boolean
    productName?: boolean
    skuName?: boolean
    skuCode?: boolean
    qty?: boolean
    unitPrice?: boolean
    lineAmount?: boolean
    rawJson?: boolean
    createdAt?: boolean
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesOrderLine"]>

  export type SalesOrderLineSelectScalar = {
    id?: boolean
    salesOrderId?: boolean
    productId?: boolean
    skuId?: boolean
    productName?: boolean
    skuName?: boolean
    skuCode?: boolean
    qty?: boolean
    unitPrice?: boolean
    lineAmount?: boolean
    rawJson?: boolean
    createdAt?: boolean
  }

  export type SalesOrderLineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }
  export type SalesOrderLineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
    sku?: boolean | ProductSkuDefaultArgs<ExtArgs>
  }

  export type $SalesOrderLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SalesOrderLine"
    objects: {
      salesOrder: Prisma.$SalesOrderPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
      sku: Prisma.$ProductSkuPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      salesOrderId: string
      productId: string
      skuId: string
      productName: string
      skuName: string
      skuCode: string
      qty: number
      unitPrice: number
      lineAmount: number
      rawJson: string | null
      createdAt: Date
    }, ExtArgs["result"]["salesOrderLine"]>
    composites: {}
  }

  type SalesOrderLineGetPayload<S extends boolean | null | undefined | SalesOrderLineDefaultArgs> = $Result.GetResult<Prisma.$SalesOrderLinePayload, S>

  type SalesOrderLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SalesOrderLineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SalesOrderLineCountAggregateInputType | true
    }

  export interface SalesOrderLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SalesOrderLine'], meta: { name: 'SalesOrderLine' } }
    /**
     * Find zero or one SalesOrderLine that matches the filter.
     * @param {SalesOrderLineFindUniqueArgs} args - Arguments to find a SalesOrderLine
     * @example
     * // Get one SalesOrderLine
     * const salesOrderLine = await prisma.salesOrderLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalesOrderLineFindUniqueArgs>(args: SelectSubset<T, SalesOrderLineFindUniqueArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SalesOrderLine that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SalesOrderLineFindUniqueOrThrowArgs} args - Arguments to find a SalesOrderLine
     * @example
     * // Get one SalesOrderLine
     * const salesOrderLine = await prisma.salesOrderLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalesOrderLineFindUniqueOrThrowArgs>(args: SelectSubset<T, SalesOrderLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SalesOrderLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderLineFindFirstArgs} args - Arguments to find a SalesOrderLine
     * @example
     * // Get one SalesOrderLine
     * const salesOrderLine = await prisma.salesOrderLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalesOrderLineFindFirstArgs>(args?: SelectSubset<T, SalesOrderLineFindFirstArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SalesOrderLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderLineFindFirstOrThrowArgs} args - Arguments to find a SalesOrderLine
     * @example
     * // Get one SalesOrderLine
     * const salesOrderLine = await prisma.salesOrderLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalesOrderLineFindFirstOrThrowArgs>(args?: SelectSubset<T, SalesOrderLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SalesOrderLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SalesOrderLines
     * const salesOrderLines = await prisma.salesOrderLine.findMany()
     * 
     * // Get first 10 SalesOrderLines
     * const salesOrderLines = await prisma.salesOrderLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salesOrderLineWithIdOnly = await prisma.salesOrderLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalesOrderLineFindManyArgs>(args?: SelectSubset<T, SalesOrderLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SalesOrderLine.
     * @param {SalesOrderLineCreateArgs} args - Arguments to create a SalesOrderLine.
     * @example
     * // Create one SalesOrderLine
     * const SalesOrderLine = await prisma.salesOrderLine.create({
     *   data: {
     *     // ... data to create a SalesOrderLine
     *   }
     * })
     * 
     */
    create<T extends SalesOrderLineCreateArgs>(args: SelectSubset<T, SalesOrderLineCreateArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SalesOrderLines.
     * @param {SalesOrderLineCreateManyArgs} args - Arguments to create many SalesOrderLines.
     * @example
     * // Create many SalesOrderLines
     * const salesOrderLine = await prisma.salesOrderLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalesOrderLineCreateManyArgs>(args?: SelectSubset<T, SalesOrderLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SalesOrderLines and returns the data saved in the database.
     * @param {SalesOrderLineCreateManyAndReturnArgs} args - Arguments to create many SalesOrderLines.
     * @example
     * // Create many SalesOrderLines
     * const salesOrderLine = await prisma.salesOrderLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SalesOrderLines and only return the `id`
     * const salesOrderLineWithIdOnly = await prisma.salesOrderLine.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalesOrderLineCreateManyAndReturnArgs>(args?: SelectSubset<T, SalesOrderLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SalesOrderLine.
     * @param {SalesOrderLineDeleteArgs} args - Arguments to delete one SalesOrderLine.
     * @example
     * // Delete one SalesOrderLine
     * const SalesOrderLine = await prisma.salesOrderLine.delete({
     *   where: {
     *     // ... filter to delete one SalesOrderLine
     *   }
     * })
     * 
     */
    delete<T extends SalesOrderLineDeleteArgs>(args: SelectSubset<T, SalesOrderLineDeleteArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SalesOrderLine.
     * @param {SalesOrderLineUpdateArgs} args - Arguments to update one SalesOrderLine.
     * @example
     * // Update one SalesOrderLine
     * const salesOrderLine = await prisma.salesOrderLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalesOrderLineUpdateArgs>(args: SelectSubset<T, SalesOrderLineUpdateArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SalesOrderLines.
     * @param {SalesOrderLineDeleteManyArgs} args - Arguments to filter SalesOrderLines to delete.
     * @example
     * // Delete a few SalesOrderLines
     * const { count } = await prisma.salesOrderLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalesOrderLineDeleteManyArgs>(args?: SelectSubset<T, SalesOrderLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesOrderLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SalesOrderLines
     * const salesOrderLine = await prisma.salesOrderLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalesOrderLineUpdateManyArgs>(args: SelectSubset<T, SalesOrderLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SalesOrderLine.
     * @param {SalesOrderLineUpsertArgs} args - Arguments to update or create a SalesOrderLine.
     * @example
     * // Update or create a SalesOrderLine
     * const salesOrderLine = await prisma.salesOrderLine.upsert({
     *   create: {
     *     // ... data to create a SalesOrderLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SalesOrderLine we want to update
     *   }
     * })
     */
    upsert<T extends SalesOrderLineUpsertArgs>(args: SelectSubset<T, SalesOrderLineUpsertArgs<ExtArgs>>): Prisma__SalesOrderLineClient<$Result.GetResult<Prisma.$SalesOrderLinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SalesOrderLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderLineCountArgs} args - Arguments to filter SalesOrderLines to count.
     * @example
     * // Count the number of SalesOrderLines
     * const count = await prisma.salesOrderLine.count({
     *   where: {
     *     // ... the filter for the SalesOrderLines we want to count
     *   }
     * })
    **/
    count<T extends SalesOrderLineCountArgs>(
      args?: Subset<T, SalesOrderLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalesOrderLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SalesOrderLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalesOrderLineAggregateArgs>(args: Subset<T, SalesOrderLineAggregateArgs>): Prisma.PrismaPromise<GetSalesOrderLineAggregateType<T>>

    /**
     * Group by SalesOrderLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesOrderLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalesOrderLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalesOrderLineGroupByArgs['orderBy'] }
        : { orderBy?: SalesOrderLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalesOrderLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesOrderLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SalesOrderLine model
   */
  readonly fields: SalesOrderLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SalesOrderLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalesOrderLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    salesOrder<T extends SalesOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SalesOrderDefaultArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sku<T extends ProductSkuDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductSkuDefaultArgs<ExtArgs>>): Prisma__ProductSkuClient<$Result.GetResult<Prisma.$ProductSkuPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SalesOrderLine model
   */ 
  interface SalesOrderLineFieldRefs {
    readonly id: FieldRef<"SalesOrderLine", 'String'>
    readonly salesOrderId: FieldRef<"SalesOrderLine", 'String'>
    readonly productId: FieldRef<"SalesOrderLine", 'String'>
    readonly skuId: FieldRef<"SalesOrderLine", 'String'>
    readonly productName: FieldRef<"SalesOrderLine", 'String'>
    readonly skuName: FieldRef<"SalesOrderLine", 'String'>
    readonly skuCode: FieldRef<"SalesOrderLine", 'String'>
    readonly qty: FieldRef<"SalesOrderLine", 'Int'>
    readonly unitPrice: FieldRef<"SalesOrderLine", 'Float'>
    readonly lineAmount: FieldRef<"SalesOrderLine", 'Float'>
    readonly rawJson: FieldRef<"SalesOrderLine", 'String'>
    readonly createdAt: FieldRef<"SalesOrderLine", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SalesOrderLine findUnique
   */
  export type SalesOrderLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrderLine to fetch.
     */
    where: SalesOrderLineWhereUniqueInput
  }

  /**
   * SalesOrderLine findUniqueOrThrow
   */
  export type SalesOrderLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrderLine to fetch.
     */
    where: SalesOrderLineWhereUniqueInput
  }

  /**
   * SalesOrderLine findFirst
   */
  export type SalesOrderLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrderLine to fetch.
     */
    where?: SalesOrderLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrderLines to fetch.
     */
    orderBy?: SalesOrderLineOrderByWithRelationInput | SalesOrderLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesOrderLines.
     */
    cursor?: SalesOrderLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrderLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrderLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesOrderLines.
     */
    distinct?: SalesOrderLineScalarFieldEnum | SalesOrderLineScalarFieldEnum[]
  }

  /**
   * SalesOrderLine findFirstOrThrow
   */
  export type SalesOrderLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrderLine to fetch.
     */
    where?: SalesOrderLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrderLines to fetch.
     */
    orderBy?: SalesOrderLineOrderByWithRelationInput | SalesOrderLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesOrderLines.
     */
    cursor?: SalesOrderLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrderLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrderLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesOrderLines.
     */
    distinct?: SalesOrderLineScalarFieldEnum | SalesOrderLineScalarFieldEnum[]
  }

  /**
   * SalesOrderLine findMany
   */
  export type SalesOrderLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * Filter, which SalesOrderLines to fetch.
     */
    where?: SalesOrderLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesOrderLines to fetch.
     */
    orderBy?: SalesOrderLineOrderByWithRelationInput | SalesOrderLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SalesOrderLines.
     */
    cursor?: SalesOrderLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesOrderLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesOrderLines.
     */
    skip?: number
    distinct?: SalesOrderLineScalarFieldEnum | SalesOrderLineScalarFieldEnum[]
  }

  /**
   * SalesOrderLine create
   */
  export type SalesOrderLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * The data needed to create a SalesOrderLine.
     */
    data: XOR<SalesOrderLineCreateInput, SalesOrderLineUncheckedCreateInput>
  }

  /**
   * SalesOrderLine createMany
   */
  export type SalesOrderLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SalesOrderLines.
     */
    data: SalesOrderLineCreateManyInput | SalesOrderLineCreateManyInput[]
  }

  /**
   * SalesOrderLine createManyAndReturn
   */
  export type SalesOrderLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SalesOrderLines.
     */
    data: SalesOrderLineCreateManyInput | SalesOrderLineCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesOrderLine update
   */
  export type SalesOrderLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * The data needed to update a SalesOrderLine.
     */
    data: XOR<SalesOrderLineUpdateInput, SalesOrderLineUncheckedUpdateInput>
    /**
     * Choose, which SalesOrderLine to update.
     */
    where: SalesOrderLineWhereUniqueInput
  }

  /**
   * SalesOrderLine updateMany
   */
  export type SalesOrderLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SalesOrderLines.
     */
    data: XOR<SalesOrderLineUpdateManyMutationInput, SalesOrderLineUncheckedUpdateManyInput>
    /**
     * Filter which SalesOrderLines to update
     */
    where?: SalesOrderLineWhereInput
  }

  /**
   * SalesOrderLine upsert
   */
  export type SalesOrderLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * The filter to search for the SalesOrderLine to update in case it exists.
     */
    where: SalesOrderLineWhereUniqueInput
    /**
     * In case the SalesOrderLine found by the `where` argument doesn't exist, create a new SalesOrderLine with this data.
     */
    create: XOR<SalesOrderLineCreateInput, SalesOrderLineUncheckedCreateInput>
    /**
     * In case the SalesOrderLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalesOrderLineUpdateInput, SalesOrderLineUncheckedUpdateInput>
  }

  /**
   * SalesOrderLine delete
   */
  export type SalesOrderLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
    /**
     * Filter which SalesOrderLine to delete.
     */
    where: SalesOrderLineWhereUniqueInput
  }

  /**
   * SalesOrderLine deleteMany
   */
  export type SalesOrderLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesOrderLines to delete
     */
    where?: SalesOrderLineWhereInput
  }

  /**
   * SalesOrderLine without action
   */
  export type SalesOrderLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesOrderLine
     */
    select?: SalesOrderLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesOrderLineInclude<ExtArgs> | null
  }


  /**
   * Model OrderWritebackLog
   */

  export type AggregateOrderWritebackLog = {
    _count: OrderWritebackLogCountAggregateOutputType | null
    _min: OrderWritebackLogMinAggregateOutputType | null
    _max: OrderWritebackLogMaxAggregateOutputType | null
  }

  export type OrderWritebackLogMinAggregateOutputType = {
    id: string | null
    salesOrderId: string | null
    success: boolean | null
    requestId: string | null
    traceId: string | null
    summary: string | null
    requestJson: string | null
    responseJson: string | null
    errorCode: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type OrderWritebackLogMaxAggregateOutputType = {
    id: string | null
    salesOrderId: string | null
    success: boolean | null
    requestId: string | null
    traceId: string | null
    summary: string | null
    requestJson: string | null
    responseJson: string | null
    errorCode: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type OrderWritebackLogCountAggregateOutputType = {
    id: number
    salesOrderId: number
    success: number
    requestId: number
    traceId: number
    summary: number
    requestJson: number
    responseJson: number
    errorCode: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type OrderWritebackLogMinAggregateInputType = {
    id?: true
    salesOrderId?: true
    success?: true
    requestId?: true
    traceId?: true
    summary?: true
    requestJson?: true
    responseJson?: true
    errorCode?: true
    errorMessage?: true
    createdAt?: true
  }

  export type OrderWritebackLogMaxAggregateInputType = {
    id?: true
    salesOrderId?: true
    success?: true
    requestId?: true
    traceId?: true
    summary?: true
    requestJson?: true
    responseJson?: true
    errorCode?: true
    errorMessage?: true
    createdAt?: true
  }

  export type OrderWritebackLogCountAggregateInputType = {
    id?: true
    salesOrderId?: true
    success?: true
    requestId?: true
    traceId?: true
    summary?: true
    requestJson?: true
    responseJson?: true
    errorCode?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type OrderWritebackLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderWritebackLog to aggregate.
     */
    where?: OrderWritebackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderWritebackLogs to fetch.
     */
    orderBy?: OrderWritebackLogOrderByWithRelationInput | OrderWritebackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWritebackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderWritebackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderWritebackLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderWritebackLogs
    **/
    _count?: true | OrderWritebackLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderWritebackLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderWritebackLogMaxAggregateInputType
  }

  export type GetOrderWritebackLogAggregateType<T extends OrderWritebackLogAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderWritebackLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderWritebackLog[P]>
      : GetScalarType<T[P], AggregateOrderWritebackLog[P]>
  }




  export type OrderWritebackLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWritebackLogWhereInput
    orderBy?: OrderWritebackLogOrderByWithAggregationInput | OrderWritebackLogOrderByWithAggregationInput[]
    by: OrderWritebackLogScalarFieldEnum[] | OrderWritebackLogScalarFieldEnum
    having?: OrderWritebackLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderWritebackLogCountAggregateInputType | true
    _min?: OrderWritebackLogMinAggregateInputType
    _max?: OrderWritebackLogMaxAggregateInputType
  }

  export type OrderWritebackLogGroupByOutputType = {
    id: string
    salesOrderId: string
    success: boolean
    requestId: string | null
    traceId: string | null
    summary: string | null
    requestJson: string
    responseJson: string | null
    errorCode: string | null
    errorMessage: string | null
    createdAt: Date
    _count: OrderWritebackLogCountAggregateOutputType | null
    _min: OrderWritebackLogMinAggregateOutputType | null
    _max: OrderWritebackLogMaxAggregateOutputType | null
  }

  type GetOrderWritebackLogGroupByPayload<T extends OrderWritebackLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderWritebackLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderWritebackLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderWritebackLogGroupByOutputType[P]>
            : GetScalarType<T[P], OrderWritebackLogGroupByOutputType[P]>
        }
      >
    >


  export type OrderWritebackLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    salesOrderId?: boolean
    success?: boolean
    requestId?: boolean
    traceId?: boolean
    summary?: boolean
    requestJson?: boolean
    responseJson?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderWritebackLog"]>

  export type OrderWritebackLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    salesOrderId?: boolean
    success?: boolean
    requestId?: boolean
    traceId?: boolean
    summary?: boolean
    requestJson?: boolean
    responseJson?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderWritebackLog"]>

  export type OrderWritebackLogSelectScalar = {
    id?: boolean
    salesOrderId?: boolean
    success?: boolean
    requestId?: boolean
    traceId?: boolean
    summary?: boolean
    requestJson?: boolean
    responseJson?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }

  export type OrderWritebackLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
  }
  export type OrderWritebackLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    salesOrder?: boolean | SalesOrderDefaultArgs<ExtArgs>
  }

  export type $OrderWritebackLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderWritebackLog"
    objects: {
      salesOrder: Prisma.$SalesOrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      salesOrderId: string
      success: boolean
      requestId: string | null
      traceId: string | null
      summary: string | null
      requestJson: string
      responseJson: string | null
      errorCode: string | null
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["orderWritebackLog"]>
    composites: {}
  }

  type OrderWritebackLogGetPayload<S extends boolean | null | undefined | OrderWritebackLogDefaultArgs> = $Result.GetResult<Prisma.$OrderWritebackLogPayload, S>

  type OrderWritebackLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrderWritebackLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrderWritebackLogCountAggregateInputType | true
    }

  export interface OrderWritebackLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderWritebackLog'], meta: { name: 'OrderWritebackLog' } }
    /**
     * Find zero or one OrderWritebackLog that matches the filter.
     * @param {OrderWritebackLogFindUniqueArgs} args - Arguments to find a OrderWritebackLog
     * @example
     * // Get one OrderWritebackLog
     * const orderWritebackLog = await prisma.orderWritebackLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderWritebackLogFindUniqueArgs>(args: SelectSubset<T, OrderWritebackLogFindUniqueArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OrderWritebackLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrderWritebackLogFindUniqueOrThrowArgs} args - Arguments to find a OrderWritebackLog
     * @example
     * // Get one OrderWritebackLog
     * const orderWritebackLog = await prisma.orderWritebackLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderWritebackLogFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderWritebackLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OrderWritebackLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderWritebackLogFindFirstArgs} args - Arguments to find a OrderWritebackLog
     * @example
     * // Get one OrderWritebackLog
     * const orderWritebackLog = await prisma.orderWritebackLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderWritebackLogFindFirstArgs>(args?: SelectSubset<T, OrderWritebackLogFindFirstArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OrderWritebackLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderWritebackLogFindFirstOrThrowArgs} args - Arguments to find a OrderWritebackLog
     * @example
     * // Get one OrderWritebackLog
     * const orderWritebackLog = await prisma.orderWritebackLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderWritebackLogFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderWritebackLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OrderWritebackLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderWritebackLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderWritebackLogs
     * const orderWritebackLogs = await prisma.orderWritebackLog.findMany()
     * 
     * // Get first 10 OrderWritebackLogs
     * const orderWritebackLogs = await prisma.orderWritebackLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWritebackLogWithIdOnly = await prisma.orderWritebackLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderWritebackLogFindManyArgs>(args?: SelectSubset<T, OrderWritebackLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OrderWritebackLog.
     * @param {OrderWritebackLogCreateArgs} args - Arguments to create a OrderWritebackLog.
     * @example
     * // Create one OrderWritebackLog
     * const OrderWritebackLog = await prisma.orderWritebackLog.create({
     *   data: {
     *     // ... data to create a OrderWritebackLog
     *   }
     * })
     * 
     */
    create<T extends OrderWritebackLogCreateArgs>(args: SelectSubset<T, OrderWritebackLogCreateArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OrderWritebackLogs.
     * @param {OrderWritebackLogCreateManyArgs} args - Arguments to create many OrderWritebackLogs.
     * @example
     * // Create many OrderWritebackLogs
     * const orderWritebackLog = await prisma.orderWritebackLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderWritebackLogCreateManyArgs>(args?: SelectSubset<T, OrderWritebackLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderWritebackLogs and returns the data saved in the database.
     * @param {OrderWritebackLogCreateManyAndReturnArgs} args - Arguments to create many OrderWritebackLogs.
     * @example
     * // Create many OrderWritebackLogs
     * const orderWritebackLog = await prisma.orderWritebackLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderWritebackLogs and only return the `id`
     * const orderWritebackLogWithIdOnly = await prisma.orderWritebackLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderWritebackLogCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderWritebackLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OrderWritebackLog.
     * @param {OrderWritebackLogDeleteArgs} args - Arguments to delete one OrderWritebackLog.
     * @example
     * // Delete one OrderWritebackLog
     * const OrderWritebackLog = await prisma.orderWritebackLog.delete({
     *   where: {
     *     // ... filter to delete one OrderWritebackLog
     *   }
     * })
     * 
     */
    delete<T extends OrderWritebackLogDeleteArgs>(args: SelectSubset<T, OrderWritebackLogDeleteArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OrderWritebackLog.
     * @param {OrderWritebackLogUpdateArgs} args - Arguments to update one OrderWritebackLog.
     * @example
     * // Update one OrderWritebackLog
     * const orderWritebackLog = await prisma.orderWritebackLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderWritebackLogUpdateArgs>(args: SelectSubset<T, OrderWritebackLogUpdateArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OrderWritebackLogs.
     * @param {OrderWritebackLogDeleteManyArgs} args - Arguments to filter OrderWritebackLogs to delete.
     * @example
     * // Delete a few OrderWritebackLogs
     * const { count } = await prisma.orderWritebackLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderWritebackLogDeleteManyArgs>(args?: SelectSubset<T, OrderWritebackLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderWritebackLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderWritebackLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderWritebackLogs
     * const orderWritebackLog = await prisma.orderWritebackLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderWritebackLogUpdateManyArgs>(args: SelectSubset<T, OrderWritebackLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OrderWritebackLog.
     * @param {OrderWritebackLogUpsertArgs} args - Arguments to update or create a OrderWritebackLog.
     * @example
     * // Update or create a OrderWritebackLog
     * const orderWritebackLog = await prisma.orderWritebackLog.upsert({
     *   create: {
     *     // ... data to create a OrderWritebackLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderWritebackLog we want to update
     *   }
     * })
     */
    upsert<T extends OrderWritebackLogUpsertArgs>(args: SelectSubset<T, OrderWritebackLogUpsertArgs<ExtArgs>>): Prisma__OrderWritebackLogClient<$Result.GetResult<Prisma.$OrderWritebackLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OrderWritebackLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderWritebackLogCountArgs} args - Arguments to filter OrderWritebackLogs to count.
     * @example
     * // Count the number of OrderWritebackLogs
     * const count = await prisma.orderWritebackLog.count({
     *   where: {
     *     // ... the filter for the OrderWritebackLogs we want to count
     *   }
     * })
    **/
    count<T extends OrderWritebackLogCountArgs>(
      args?: Subset<T, OrderWritebackLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderWritebackLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderWritebackLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderWritebackLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderWritebackLogAggregateArgs>(args: Subset<T, OrderWritebackLogAggregateArgs>): Prisma.PrismaPromise<GetOrderWritebackLogAggregateType<T>>

    /**
     * Group by OrderWritebackLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderWritebackLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderWritebackLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderWritebackLogGroupByArgs['orderBy'] }
        : { orderBy?: OrderWritebackLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderWritebackLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderWritebackLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderWritebackLog model
   */
  readonly fields: OrderWritebackLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderWritebackLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderWritebackLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    salesOrder<T extends SalesOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SalesOrderDefaultArgs<ExtArgs>>): Prisma__SalesOrderClient<$Result.GetResult<Prisma.$SalesOrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderWritebackLog model
   */ 
  interface OrderWritebackLogFieldRefs {
    readonly id: FieldRef<"OrderWritebackLog", 'String'>
    readonly salesOrderId: FieldRef<"OrderWritebackLog", 'String'>
    readonly success: FieldRef<"OrderWritebackLog", 'Boolean'>
    readonly requestId: FieldRef<"OrderWritebackLog", 'String'>
    readonly traceId: FieldRef<"OrderWritebackLog", 'String'>
    readonly summary: FieldRef<"OrderWritebackLog", 'String'>
    readonly requestJson: FieldRef<"OrderWritebackLog", 'String'>
    readonly responseJson: FieldRef<"OrderWritebackLog", 'String'>
    readonly errorCode: FieldRef<"OrderWritebackLog", 'String'>
    readonly errorMessage: FieldRef<"OrderWritebackLog", 'String'>
    readonly createdAt: FieldRef<"OrderWritebackLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrderWritebackLog findUnique
   */
  export type OrderWritebackLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * Filter, which OrderWritebackLog to fetch.
     */
    where: OrderWritebackLogWhereUniqueInput
  }

  /**
   * OrderWritebackLog findUniqueOrThrow
   */
  export type OrderWritebackLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * Filter, which OrderWritebackLog to fetch.
     */
    where: OrderWritebackLogWhereUniqueInput
  }

  /**
   * OrderWritebackLog findFirst
   */
  export type OrderWritebackLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * Filter, which OrderWritebackLog to fetch.
     */
    where?: OrderWritebackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderWritebackLogs to fetch.
     */
    orderBy?: OrderWritebackLogOrderByWithRelationInput | OrderWritebackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderWritebackLogs.
     */
    cursor?: OrderWritebackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderWritebackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderWritebackLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderWritebackLogs.
     */
    distinct?: OrderWritebackLogScalarFieldEnum | OrderWritebackLogScalarFieldEnum[]
  }

  /**
   * OrderWritebackLog findFirstOrThrow
   */
  export type OrderWritebackLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * Filter, which OrderWritebackLog to fetch.
     */
    where?: OrderWritebackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderWritebackLogs to fetch.
     */
    orderBy?: OrderWritebackLogOrderByWithRelationInput | OrderWritebackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderWritebackLogs.
     */
    cursor?: OrderWritebackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderWritebackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderWritebackLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderWritebackLogs.
     */
    distinct?: OrderWritebackLogScalarFieldEnum | OrderWritebackLogScalarFieldEnum[]
  }

  /**
   * OrderWritebackLog findMany
   */
  export type OrderWritebackLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * Filter, which OrderWritebackLogs to fetch.
     */
    where?: OrderWritebackLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderWritebackLogs to fetch.
     */
    orderBy?: OrderWritebackLogOrderByWithRelationInput | OrderWritebackLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderWritebackLogs.
     */
    cursor?: OrderWritebackLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderWritebackLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderWritebackLogs.
     */
    skip?: number
    distinct?: OrderWritebackLogScalarFieldEnum | OrderWritebackLogScalarFieldEnum[]
  }

  /**
   * OrderWritebackLog create
   */
  export type OrderWritebackLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderWritebackLog.
     */
    data: XOR<OrderWritebackLogCreateInput, OrderWritebackLogUncheckedCreateInput>
  }

  /**
   * OrderWritebackLog createMany
   */
  export type OrderWritebackLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderWritebackLogs.
     */
    data: OrderWritebackLogCreateManyInput | OrderWritebackLogCreateManyInput[]
  }

  /**
   * OrderWritebackLog createManyAndReturn
   */
  export type OrderWritebackLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OrderWritebackLogs.
     */
    data: OrderWritebackLogCreateManyInput | OrderWritebackLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderWritebackLog update
   */
  export type OrderWritebackLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderWritebackLog.
     */
    data: XOR<OrderWritebackLogUpdateInput, OrderWritebackLogUncheckedUpdateInput>
    /**
     * Choose, which OrderWritebackLog to update.
     */
    where: OrderWritebackLogWhereUniqueInput
  }

  /**
   * OrderWritebackLog updateMany
   */
  export type OrderWritebackLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderWritebackLogs.
     */
    data: XOR<OrderWritebackLogUpdateManyMutationInput, OrderWritebackLogUncheckedUpdateManyInput>
    /**
     * Filter which OrderWritebackLogs to update
     */
    where?: OrderWritebackLogWhereInput
  }

  /**
   * OrderWritebackLog upsert
   */
  export type OrderWritebackLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderWritebackLog to update in case it exists.
     */
    where: OrderWritebackLogWhereUniqueInput
    /**
     * In case the OrderWritebackLog found by the `where` argument doesn't exist, create a new OrderWritebackLog with this data.
     */
    create: XOR<OrderWritebackLogCreateInput, OrderWritebackLogUncheckedCreateInput>
    /**
     * In case the OrderWritebackLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderWritebackLogUpdateInput, OrderWritebackLogUncheckedUpdateInput>
  }

  /**
   * OrderWritebackLog delete
   */
  export type OrderWritebackLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
    /**
     * Filter which OrderWritebackLog to delete.
     */
    where: OrderWritebackLogWhereUniqueInput
  }

  /**
   * OrderWritebackLog deleteMany
   */
  export type OrderWritebackLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderWritebackLogs to delete
     */
    where?: OrderWritebackLogWhereInput
  }

  /**
   * OrderWritebackLog without action
   */
  export type OrderWritebackLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderWritebackLog
     */
    select?: OrderWritebackLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderWritebackLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const KingdeeTokenScalarFieldEnum: {
    id: 'id',
    env: 'env',
    appToken: 'appToken',
    expiresAt: 'expiresAt',
    updatedAt: 'updatedAt'
  };

  export type KingdeeTokenScalarFieldEnum = (typeof KingdeeTokenScalarFieldEnum)[keyof typeof KingdeeTokenScalarFieldEnum]


  export const KingdeeRawDocumentScalarFieldEnum: {
    id: 'id',
    docType: 'docType',
    kingdeeId: 'kingdeeId',
    number: 'number',
    payloadJson: 'payloadJson',
    fetchedAt: 'fetchedAt',
    hash: 'hash'
  };

  export type KingdeeRawDocumentScalarFieldEnum = (typeof KingdeeRawDocumentScalarFieldEnum)[keyof typeof KingdeeRawDocumentScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    kingdeeCustomerId: 'kingdeeCustomerId',
    wechatOpenid: 'wechatOpenid',
    accessToken: 'accessToken',
    tokenExpiresAt: 'tokenExpiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const DeliveryScalarFieldEnum: {
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

  export type DeliveryScalarFieldEnum = (typeof DeliveryScalarFieldEnum)[keyof typeof DeliveryScalarFieldEnum]


  export const ReconciliationScalarFieldEnum: {
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

  export type ReconciliationScalarFieldEnum = (typeof ReconciliationScalarFieldEnum)[keyof typeof ReconciliationScalarFieldEnum]


  export const ReconciliationLineScalarFieldEnum: {
    id: 'id',
    reconciliationId: 'reconciliationId',
    docType: 'docType',
    docNo: 'docNo',
    docDate: 'docDate',
    amount: 'amount',
    rawJson: 'rawJson',
    createdAt: 'createdAt'
  };

  export type ReconciliationLineScalarFieldEnum = (typeof ReconciliationLineScalarFieldEnum)[keyof typeof ReconciliationLineScalarFieldEnum]


  export const SyncCheckpointScalarFieldEnum: {
    id: 'id',
    scope: 'scope',
    jobName: 'jobName',
    cursorJson: 'cursorJson',
    status: 'status',
    errorMessage: 'errorMessage',
    lastRunAt: 'lastRunAt',
    updatedAt: 'updatedAt'
  };

  export type SyncCheckpointScalarFieldEnum = (typeof SyncCheckpointScalarFieldEnum)[keyof typeof SyncCheckpointScalarFieldEnum]


  export const ProductScalarFieldEnum: {
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

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProductSkuScalarFieldEnum: {
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

  export type ProductSkuScalarFieldEnum = (typeof ProductSkuScalarFieldEnum)[keyof typeof ProductSkuScalarFieldEnum]


  export const CartScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CartScalarFieldEnum = (typeof CartScalarFieldEnum)[keyof typeof CartScalarFieldEnum]


  export const CartItemScalarFieldEnum: {
    id: 'id',
    cartId: 'cartId',
    customerId: 'customerId',
    productId: 'productId',
    skuId: 'skuId',
    qty: 'qty',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CartItemScalarFieldEnum = (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum]


  export const SalesOrderScalarFieldEnum: {
    id: 'id',
    orderNo: 'orderNo',
    customerId: 'customerId',
    status: 'status',
    settlementMode: 'settlementMode',
    currency: 'currency',
    totalAmount: 'totalAmount',
    remark: 'remark',
    idempotencyKey: 'idempotencyKey',
    kingdeeOrderId: 'kingdeeOrderId',
    kingdeeOrderNumber: 'kingdeeOrderNumber',
    writebackError: 'writebackError',
    canceledAt: 'canceledAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SalesOrderScalarFieldEnum = (typeof SalesOrderScalarFieldEnum)[keyof typeof SalesOrderScalarFieldEnum]


  export const SalesOrderLineScalarFieldEnum: {
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

  export type SalesOrderLineScalarFieldEnum = (typeof SalesOrderLineScalarFieldEnum)[keyof typeof SalesOrderLineScalarFieldEnum]


  export const OrderWritebackLogScalarFieldEnum: {
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

  export type OrderWritebackLogScalarFieldEnum = (typeof OrderWritebackLogScalarFieldEnum)[keyof typeof OrderWritebackLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type KingdeeTokenWhereInput = {
    AND?: KingdeeTokenWhereInput | KingdeeTokenWhereInput[]
    OR?: KingdeeTokenWhereInput[]
    NOT?: KingdeeTokenWhereInput | KingdeeTokenWhereInput[]
    id?: IntFilter<"KingdeeToken"> | number
    env?: StringFilter<"KingdeeToken"> | string
    appToken?: StringFilter<"KingdeeToken"> | string
    expiresAt?: DateTimeFilter<"KingdeeToken"> | Date | string
    updatedAt?: DateTimeFilter<"KingdeeToken"> | Date | string
  }

  export type KingdeeTokenOrderByWithRelationInput = {
    id?: SortOrder
    env?: SortOrder
    appToken?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KingdeeTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    env?: string
    AND?: KingdeeTokenWhereInput | KingdeeTokenWhereInput[]
    OR?: KingdeeTokenWhereInput[]
    NOT?: KingdeeTokenWhereInput | KingdeeTokenWhereInput[]
    appToken?: StringFilter<"KingdeeToken"> | string
    expiresAt?: DateTimeFilter<"KingdeeToken"> | Date | string
    updatedAt?: DateTimeFilter<"KingdeeToken"> | Date | string
  }, "id" | "env">

  export type KingdeeTokenOrderByWithAggregationInput = {
    id?: SortOrder
    env?: SortOrder
    appToken?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KingdeeTokenCountOrderByAggregateInput
    _avg?: KingdeeTokenAvgOrderByAggregateInput
    _max?: KingdeeTokenMaxOrderByAggregateInput
    _min?: KingdeeTokenMinOrderByAggregateInput
    _sum?: KingdeeTokenSumOrderByAggregateInput
  }

  export type KingdeeTokenScalarWhereWithAggregatesInput = {
    AND?: KingdeeTokenScalarWhereWithAggregatesInput | KingdeeTokenScalarWhereWithAggregatesInput[]
    OR?: KingdeeTokenScalarWhereWithAggregatesInput[]
    NOT?: KingdeeTokenScalarWhereWithAggregatesInput | KingdeeTokenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"KingdeeToken"> | number
    env?: StringWithAggregatesFilter<"KingdeeToken"> | string
    appToken?: StringWithAggregatesFilter<"KingdeeToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"KingdeeToken"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KingdeeToken"> | Date | string
  }

  export type KingdeeRawDocumentWhereInput = {
    AND?: KingdeeRawDocumentWhereInput | KingdeeRawDocumentWhereInput[]
    OR?: KingdeeRawDocumentWhereInput[]
    NOT?: KingdeeRawDocumentWhereInput | KingdeeRawDocumentWhereInput[]
    id?: IntFilter<"KingdeeRawDocument"> | number
    docType?: StringFilter<"KingdeeRawDocument"> | string
    kingdeeId?: StringNullableFilter<"KingdeeRawDocument"> | string | null
    number?: StringNullableFilter<"KingdeeRawDocument"> | string | null
    payloadJson?: StringFilter<"KingdeeRawDocument"> | string
    fetchedAt?: DateTimeFilter<"KingdeeRawDocument"> | Date | string
    hash?: StringFilter<"KingdeeRawDocument"> | string
  }

  export type KingdeeRawDocumentOrderByWithRelationInput = {
    id?: SortOrder
    docType?: SortOrder
    kingdeeId?: SortOrderInput | SortOrder
    number?: SortOrderInput | SortOrder
    payloadJson?: SortOrder
    fetchedAt?: SortOrder
    hash?: SortOrder
  }

  export type KingdeeRawDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: KingdeeRawDocumentWhereInput | KingdeeRawDocumentWhereInput[]
    OR?: KingdeeRawDocumentWhereInput[]
    NOT?: KingdeeRawDocumentWhereInput | KingdeeRawDocumentWhereInput[]
    docType?: StringFilter<"KingdeeRawDocument"> | string
    kingdeeId?: StringNullableFilter<"KingdeeRawDocument"> | string | null
    number?: StringNullableFilter<"KingdeeRawDocument"> | string | null
    payloadJson?: StringFilter<"KingdeeRawDocument"> | string
    fetchedAt?: DateTimeFilter<"KingdeeRawDocument"> | Date | string
    hash?: StringFilter<"KingdeeRawDocument"> | string
  }, "id">

  export type KingdeeRawDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    docType?: SortOrder
    kingdeeId?: SortOrderInput | SortOrder
    number?: SortOrderInput | SortOrder
    payloadJson?: SortOrder
    fetchedAt?: SortOrder
    hash?: SortOrder
    _count?: KingdeeRawDocumentCountOrderByAggregateInput
    _avg?: KingdeeRawDocumentAvgOrderByAggregateInput
    _max?: KingdeeRawDocumentMaxOrderByAggregateInput
    _min?: KingdeeRawDocumentMinOrderByAggregateInput
    _sum?: KingdeeRawDocumentSumOrderByAggregateInput
  }

  export type KingdeeRawDocumentScalarWhereWithAggregatesInput = {
    AND?: KingdeeRawDocumentScalarWhereWithAggregatesInput | KingdeeRawDocumentScalarWhereWithAggregatesInput[]
    OR?: KingdeeRawDocumentScalarWhereWithAggregatesInput[]
    NOT?: KingdeeRawDocumentScalarWhereWithAggregatesInput | KingdeeRawDocumentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"KingdeeRawDocument"> | number
    docType?: StringWithAggregatesFilter<"KingdeeRawDocument"> | string
    kingdeeId?: StringNullableWithAggregatesFilter<"KingdeeRawDocument"> | string | null
    number?: StringNullableWithAggregatesFilter<"KingdeeRawDocument"> | string | null
    payloadJson?: StringWithAggregatesFilter<"KingdeeRawDocument"> | string
    fetchedAt?: DateTimeWithAggregatesFilter<"KingdeeRawDocument"> | Date | string
    hash?: StringWithAggregatesFilter<"KingdeeRawDocument"> | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    phone?: StringNullableFilter<"Customer"> | string | null
    kingdeeCustomerId?: StringNullableFilter<"Customer"> | string | null
    wechatOpenid?: StringNullableFilter<"Customer"> | string | null
    accessToken?: StringNullableFilter<"Customer"> | string | null
    tokenExpiresAt?: DateTimeNullableFilter<"Customer"> | Date | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    deliveries?: DeliveryListRelationFilter
    reconciliations?: ReconciliationListRelationFilter
    cart?: XOR<CartNullableRelationFilter, CartWhereInput> | null
    cartItems?: CartItemListRelationFilter
    salesOrders?: SalesOrderListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    kingdeeCustomerId?: SortOrderInput | SortOrder
    wechatOpenid?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    tokenExpiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deliveries?: DeliveryOrderByRelationAggregateInput
    reconciliations?: ReconciliationOrderByRelationAggregateInput
    cart?: CartOrderByWithRelationInput
    cartItems?: CartItemOrderByRelationAggregateInput
    salesOrders?: SalesOrderOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accessToken?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    name?: StringFilter<"Customer"> | string
    phone?: StringNullableFilter<"Customer"> | string | null
    kingdeeCustomerId?: StringNullableFilter<"Customer"> | string | null
    wechatOpenid?: StringNullableFilter<"Customer"> | string | null
    tokenExpiresAt?: DateTimeNullableFilter<"Customer"> | Date | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    deliveries?: DeliveryListRelationFilter
    reconciliations?: ReconciliationListRelationFilter
    cart?: XOR<CartNullableRelationFilter, CartWhereInput> | null
    cartItems?: CartItemListRelationFilter
    salesOrders?: SalesOrderListRelationFilter
  }, "id" | "accessToken">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    kingdeeCustomerId?: SortOrderInput | SortOrder
    wechatOpenid?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    tokenExpiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    name?: StringWithAggregatesFilter<"Customer"> | string
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    kingdeeCustomerId?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    wechatOpenid?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    accessToken?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    tokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Customer"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type DeliveryWhereInput = {
    AND?: DeliveryWhereInput | DeliveryWhereInput[]
    OR?: DeliveryWhereInput[]
    NOT?: DeliveryWhereInput | DeliveryWhereInput[]
    id?: StringFilter<"Delivery"> | string
    customerId?: StringFilter<"Delivery"> | string
    salesOrderId?: StringNullableFilter<"Delivery"> | string | null
    kingdeeBillId?: StringNullableFilter<"Delivery"> | string | null
    kingdeeBillNumber?: StringNullableFilter<"Delivery"> | string | null
    sourceDocNo?: StringNullableFilter<"Delivery"> | string | null
    detailsJson?: StringNullableFilter<"Delivery"> | string | null
    syncedAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    status?: StringFilter<"Delivery"> | string
    signedAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    signedPayloadJson?: StringNullableFilter<"Delivery"> | string | null
    signIdempotencyKey?: StringNullableFilter<"Delivery"> | string | null
    createdAt?: DateTimeFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeFilter<"Delivery"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    salesOrder?: XOR<SalesOrderNullableRelationFilter, SalesOrderWhereInput> | null
  }

  export type DeliveryOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    salesOrderId?: SortOrderInput | SortOrder
    kingdeeBillId?: SortOrderInput | SortOrder
    kingdeeBillNumber?: SortOrderInput | SortOrder
    sourceDocNo?: SortOrderInput | SortOrder
    detailsJson?: SortOrderInput | SortOrder
    syncedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    signedPayloadJson?: SortOrderInput | SortOrder
    signIdempotencyKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    salesOrder?: SalesOrderOrderByWithRelationInput
  }

  export type DeliveryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeliveryWhereInput | DeliveryWhereInput[]
    OR?: DeliveryWhereInput[]
    NOT?: DeliveryWhereInput | DeliveryWhereInput[]
    customerId?: StringFilter<"Delivery"> | string
    salesOrderId?: StringNullableFilter<"Delivery"> | string | null
    kingdeeBillId?: StringNullableFilter<"Delivery"> | string | null
    kingdeeBillNumber?: StringNullableFilter<"Delivery"> | string | null
    sourceDocNo?: StringNullableFilter<"Delivery"> | string | null
    detailsJson?: StringNullableFilter<"Delivery"> | string | null
    syncedAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    status?: StringFilter<"Delivery"> | string
    signedAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    signedPayloadJson?: StringNullableFilter<"Delivery"> | string | null
    signIdempotencyKey?: StringNullableFilter<"Delivery"> | string | null
    createdAt?: DateTimeFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeFilter<"Delivery"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    salesOrder?: XOR<SalesOrderNullableRelationFilter, SalesOrderWhereInput> | null
  }, "id">

  export type DeliveryOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    salesOrderId?: SortOrderInput | SortOrder
    kingdeeBillId?: SortOrderInput | SortOrder
    kingdeeBillNumber?: SortOrderInput | SortOrder
    sourceDocNo?: SortOrderInput | SortOrder
    detailsJson?: SortOrderInput | SortOrder
    syncedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    signedPayloadJson?: SortOrderInput | SortOrder
    signIdempotencyKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeliveryCountOrderByAggregateInput
    _max?: DeliveryMaxOrderByAggregateInput
    _min?: DeliveryMinOrderByAggregateInput
  }

  export type DeliveryScalarWhereWithAggregatesInput = {
    AND?: DeliveryScalarWhereWithAggregatesInput | DeliveryScalarWhereWithAggregatesInput[]
    OR?: DeliveryScalarWhereWithAggregatesInput[]
    NOT?: DeliveryScalarWhereWithAggregatesInput | DeliveryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Delivery"> | string
    customerId?: StringWithAggregatesFilter<"Delivery"> | string
    salesOrderId?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    kingdeeBillId?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    kingdeeBillNumber?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    sourceDocNo?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    detailsJson?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    syncedAt?: DateTimeNullableWithAggregatesFilter<"Delivery"> | Date | string | null
    status?: StringWithAggregatesFilter<"Delivery"> | string
    signedAt?: DateTimeNullableWithAggregatesFilter<"Delivery"> | Date | string | null
    signedPayloadJson?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    signIdempotencyKey?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Delivery"> | Date | string
  }

  export type ReconciliationWhereInput = {
    AND?: ReconciliationWhereInput | ReconciliationWhereInput[]
    OR?: ReconciliationWhereInput[]
    NOT?: ReconciliationWhereInput | ReconciliationWhereInput[]
    id?: StringFilter<"Reconciliation"> | string
    customerId?: StringFilter<"Reconciliation"> | string
    periodStart?: DateTimeFilter<"Reconciliation"> | Date | string
    periodEnd?: DateTimeFilter<"Reconciliation"> | Date | string
    statementJson?: StringFilter<"Reconciliation"> | string
    status?: StringFilter<"Reconciliation"> | string
    confirmedAt?: DateTimeNullableFilter<"Reconciliation"> | Date | string | null
    confirmRemark?: StringNullableFilter<"Reconciliation"> | string | null
    createdAt?: DateTimeFilter<"Reconciliation"> | Date | string
    updatedAt?: DateTimeFilter<"Reconciliation"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    lines?: ReconciliationLineListRelationFilter
  }

  export type ReconciliationOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    statementJson?: SortOrder
    status?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    confirmRemark?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    lines?: ReconciliationLineOrderByRelationAggregateInput
  }

  export type ReconciliationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReconciliationWhereInput | ReconciliationWhereInput[]
    OR?: ReconciliationWhereInput[]
    NOT?: ReconciliationWhereInput | ReconciliationWhereInput[]
    customerId?: StringFilter<"Reconciliation"> | string
    periodStart?: DateTimeFilter<"Reconciliation"> | Date | string
    periodEnd?: DateTimeFilter<"Reconciliation"> | Date | string
    statementJson?: StringFilter<"Reconciliation"> | string
    status?: StringFilter<"Reconciliation"> | string
    confirmedAt?: DateTimeNullableFilter<"Reconciliation"> | Date | string | null
    confirmRemark?: StringNullableFilter<"Reconciliation"> | string | null
    createdAt?: DateTimeFilter<"Reconciliation"> | Date | string
    updatedAt?: DateTimeFilter<"Reconciliation"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    lines?: ReconciliationLineListRelationFilter
  }, "id">

  export type ReconciliationOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    statementJson?: SortOrder
    status?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    confirmRemark?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReconciliationCountOrderByAggregateInput
    _max?: ReconciliationMaxOrderByAggregateInput
    _min?: ReconciliationMinOrderByAggregateInput
  }

  export type ReconciliationScalarWhereWithAggregatesInput = {
    AND?: ReconciliationScalarWhereWithAggregatesInput | ReconciliationScalarWhereWithAggregatesInput[]
    OR?: ReconciliationScalarWhereWithAggregatesInput[]
    NOT?: ReconciliationScalarWhereWithAggregatesInput | ReconciliationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reconciliation"> | string
    customerId?: StringWithAggregatesFilter<"Reconciliation"> | string
    periodStart?: DateTimeWithAggregatesFilter<"Reconciliation"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"Reconciliation"> | Date | string
    statementJson?: StringWithAggregatesFilter<"Reconciliation"> | string
    status?: StringWithAggregatesFilter<"Reconciliation"> | string
    confirmedAt?: DateTimeNullableWithAggregatesFilter<"Reconciliation"> | Date | string | null
    confirmRemark?: StringNullableWithAggregatesFilter<"Reconciliation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Reconciliation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reconciliation"> | Date | string
  }

  export type ReconciliationLineWhereInput = {
    AND?: ReconciliationLineWhereInput | ReconciliationLineWhereInput[]
    OR?: ReconciliationLineWhereInput[]
    NOT?: ReconciliationLineWhereInput | ReconciliationLineWhereInput[]
    id?: IntFilter<"ReconciliationLine"> | number
    reconciliationId?: StringFilter<"ReconciliationLine"> | string
    docType?: StringFilter<"ReconciliationLine"> | string
    docNo?: StringNullableFilter<"ReconciliationLine"> | string | null
    docDate?: DateTimeNullableFilter<"ReconciliationLine"> | Date | string | null
    amount?: FloatFilter<"ReconciliationLine"> | number
    rawJson?: StringFilter<"ReconciliationLine"> | string
    createdAt?: DateTimeFilter<"ReconciliationLine"> | Date | string
    reconciliation?: XOR<ReconciliationRelationFilter, ReconciliationWhereInput>
  }

  export type ReconciliationLineOrderByWithRelationInput = {
    id?: SortOrder
    reconciliationId?: SortOrder
    docType?: SortOrder
    docNo?: SortOrderInput | SortOrder
    docDate?: SortOrderInput | SortOrder
    amount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
    reconciliation?: ReconciliationOrderByWithRelationInput
  }

  export type ReconciliationLineWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ReconciliationLineWhereInput | ReconciliationLineWhereInput[]
    OR?: ReconciliationLineWhereInput[]
    NOT?: ReconciliationLineWhereInput | ReconciliationLineWhereInput[]
    reconciliationId?: StringFilter<"ReconciliationLine"> | string
    docType?: StringFilter<"ReconciliationLine"> | string
    docNo?: StringNullableFilter<"ReconciliationLine"> | string | null
    docDate?: DateTimeNullableFilter<"ReconciliationLine"> | Date | string | null
    amount?: FloatFilter<"ReconciliationLine"> | number
    rawJson?: StringFilter<"ReconciliationLine"> | string
    createdAt?: DateTimeFilter<"ReconciliationLine"> | Date | string
    reconciliation?: XOR<ReconciliationRelationFilter, ReconciliationWhereInput>
  }, "id">

  export type ReconciliationLineOrderByWithAggregationInput = {
    id?: SortOrder
    reconciliationId?: SortOrder
    docType?: SortOrder
    docNo?: SortOrderInput | SortOrder
    docDate?: SortOrderInput | SortOrder
    amount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
    _count?: ReconciliationLineCountOrderByAggregateInput
    _avg?: ReconciliationLineAvgOrderByAggregateInput
    _max?: ReconciliationLineMaxOrderByAggregateInput
    _min?: ReconciliationLineMinOrderByAggregateInput
    _sum?: ReconciliationLineSumOrderByAggregateInput
  }

  export type ReconciliationLineScalarWhereWithAggregatesInput = {
    AND?: ReconciliationLineScalarWhereWithAggregatesInput | ReconciliationLineScalarWhereWithAggregatesInput[]
    OR?: ReconciliationLineScalarWhereWithAggregatesInput[]
    NOT?: ReconciliationLineScalarWhereWithAggregatesInput | ReconciliationLineScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ReconciliationLine"> | number
    reconciliationId?: StringWithAggregatesFilter<"ReconciliationLine"> | string
    docType?: StringWithAggregatesFilter<"ReconciliationLine"> | string
    docNo?: StringNullableWithAggregatesFilter<"ReconciliationLine"> | string | null
    docDate?: DateTimeNullableWithAggregatesFilter<"ReconciliationLine"> | Date | string | null
    amount?: FloatWithAggregatesFilter<"ReconciliationLine"> | number
    rawJson?: StringWithAggregatesFilter<"ReconciliationLine"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ReconciliationLine"> | Date | string
  }

  export type SyncCheckpointWhereInput = {
    AND?: SyncCheckpointWhereInput | SyncCheckpointWhereInput[]
    OR?: SyncCheckpointWhereInput[]
    NOT?: SyncCheckpointWhereInput | SyncCheckpointWhereInput[]
    id?: IntFilter<"SyncCheckpoint"> | number
    scope?: StringFilter<"SyncCheckpoint"> | string
    jobName?: StringFilter<"SyncCheckpoint"> | string
    cursorJson?: StringFilter<"SyncCheckpoint"> | string
    status?: StringFilter<"SyncCheckpoint"> | string
    errorMessage?: StringNullableFilter<"SyncCheckpoint"> | string | null
    lastRunAt?: DateTimeFilter<"SyncCheckpoint"> | Date | string
    updatedAt?: DateTimeFilter<"SyncCheckpoint"> | Date | string
  }

  export type SyncCheckpointOrderByWithRelationInput = {
    id?: SortOrder
    scope?: SortOrder
    jobName?: SortOrder
    cursorJson?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    lastRunAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncCheckpointWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    scope?: string
    AND?: SyncCheckpointWhereInput | SyncCheckpointWhereInput[]
    OR?: SyncCheckpointWhereInput[]
    NOT?: SyncCheckpointWhereInput | SyncCheckpointWhereInput[]
    jobName?: StringFilter<"SyncCheckpoint"> | string
    cursorJson?: StringFilter<"SyncCheckpoint"> | string
    status?: StringFilter<"SyncCheckpoint"> | string
    errorMessage?: StringNullableFilter<"SyncCheckpoint"> | string | null
    lastRunAt?: DateTimeFilter<"SyncCheckpoint"> | Date | string
    updatedAt?: DateTimeFilter<"SyncCheckpoint"> | Date | string
  }, "id" | "scope">

  export type SyncCheckpointOrderByWithAggregationInput = {
    id?: SortOrder
    scope?: SortOrder
    jobName?: SortOrder
    cursorJson?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    lastRunAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SyncCheckpointCountOrderByAggregateInput
    _avg?: SyncCheckpointAvgOrderByAggregateInput
    _max?: SyncCheckpointMaxOrderByAggregateInput
    _min?: SyncCheckpointMinOrderByAggregateInput
    _sum?: SyncCheckpointSumOrderByAggregateInput
  }

  export type SyncCheckpointScalarWhereWithAggregatesInput = {
    AND?: SyncCheckpointScalarWhereWithAggregatesInput | SyncCheckpointScalarWhereWithAggregatesInput[]
    OR?: SyncCheckpointScalarWhereWithAggregatesInput[]
    NOT?: SyncCheckpointScalarWhereWithAggregatesInput | SyncCheckpointScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SyncCheckpoint"> | number
    scope?: StringWithAggregatesFilter<"SyncCheckpoint"> | string
    jobName?: StringWithAggregatesFilter<"SyncCheckpoint"> | string
    cursorJson?: StringWithAggregatesFilter<"SyncCheckpoint"> | string
    status?: StringWithAggregatesFilter<"SyncCheckpoint"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"SyncCheckpoint"> | string | null
    lastRunAt?: DateTimeWithAggregatesFilter<"SyncCheckpoint"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SyncCheckpoint"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    code?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    coverImageUrl?: StringNullableFilter<"Product"> | string | null
    status?: StringFilter<"Product"> | string
    defaultUnitId?: StringNullableFilter<"Product"> | string | null
    kingdeeMaterialId?: StringNullableFilter<"Product"> | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    skus?: ProductSkuListRelationFilter
    cartItems?: CartItemListRelationFilter
    orderLines?: SalesOrderLineListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    coverImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    defaultUnitId?: SortOrderInput | SortOrder
    kingdeeMaterialId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    skus?: ProductSkuOrderByRelationAggregateInput
    cartItems?: CartItemOrderByRelationAggregateInput
    orderLines?: SalesOrderLineOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    coverImageUrl?: StringNullableFilter<"Product"> | string | null
    status?: StringFilter<"Product"> | string
    defaultUnitId?: StringNullableFilter<"Product"> | string | null
    kingdeeMaterialId?: StringNullableFilter<"Product"> | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    skus?: ProductSkuListRelationFilter
    cartItems?: CartItemListRelationFilter
    orderLines?: SalesOrderLineListRelationFilter
  }, "id" | "code">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    coverImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    defaultUnitId?: SortOrderInput | SortOrder
    kingdeeMaterialId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    code?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    coverImageUrl?: StringNullableWithAggregatesFilter<"Product"> | string | null
    status?: StringWithAggregatesFilter<"Product"> | string
    defaultUnitId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    kingdeeMaterialId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type ProductSkuWhereInput = {
    AND?: ProductSkuWhereInput | ProductSkuWhereInput[]
    OR?: ProductSkuWhereInput[]
    NOT?: ProductSkuWhereInput | ProductSkuWhereInput[]
    id?: StringFilter<"ProductSku"> | string
    productId?: StringFilter<"ProductSku"> | string
    skuCode?: StringFilter<"ProductSku"> | string
    skuName?: StringFilter<"ProductSku"> | string
    specsJson?: StringNullableFilter<"ProductSku"> | string | null
    price?: FloatFilter<"ProductSku"> | number
    stock?: IntFilter<"ProductSku"> | number
    status?: StringFilter<"ProductSku"> | string
    unitId?: StringNullableFilter<"ProductSku"> | string | null
    kingdeeMaterialId?: StringNullableFilter<"ProductSku"> | string | null
    createdAt?: DateTimeFilter<"ProductSku"> | Date | string
    updatedAt?: DateTimeFilter<"ProductSku"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    cartItems?: CartItemListRelationFilter
    orderLines?: SalesOrderLineListRelationFilter
  }

  export type ProductSkuOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    skuCode?: SortOrder
    skuName?: SortOrder
    specsJson?: SortOrderInput | SortOrder
    price?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    unitId?: SortOrderInput | SortOrder
    kingdeeMaterialId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: ProductOrderByWithRelationInput
    cartItems?: CartItemOrderByRelationAggregateInput
    orderLines?: SalesOrderLineOrderByRelationAggregateInput
  }

  export type ProductSkuWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    skuCode?: string
    AND?: ProductSkuWhereInput | ProductSkuWhereInput[]
    OR?: ProductSkuWhereInput[]
    NOT?: ProductSkuWhereInput | ProductSkuWhereInput[]
    productId?: StringFilter<"ProductSku"> | string
    skuName?: StringFilter<"ProductSku"> | string
    specsJson?: StringNullableFilter<"ProductSku"> | string | null
    price?: FloatFilter<"ProductSku"> | number
    stock?: IntFilter<"ProductSku"> | number
    status?: StringFilter<"ProductSku"> | string
    unitId?: StringNullableFilter<"ProductSku"> | string | null
    kingdeeMaterialId?: StringNullableFilter<"ProductSku"> | string | null
    createdAt?: DateTimeFilter<"ProductSku"> | Date | string
    updatedAt?: DateTimeFilter<"ProductSku"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    cartItems?: CartItemListRelationFilter
    orderLines?: SalesOrderLineListRelationFilter
  }, "id" | "skuCode">

  export type ProductSkuOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    skuCode?: SortOrder
    skuName?: SortOrder
    specsJson?: SortOrderInput | SortOrder
    price?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    unitId?: SortOrderInput | SortOrder
    kingdeeMaterialId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductSkuCountOrderByAggregateInput
    _avg?: ProductSkuAvgOrderByAggregateInput
    _max?: ProductSkuMaxOrderByAggregateInput
    _min?: ProductSkuMinOrderByAggregateInput
    _sum?: ProductSkuSumOrderByAggregateInput
  }

  export type ProductSkuScalarWhereWithAggregatesInput = {
    AND?: ProductSkuScalarWhereWithAggregatesInput | ProductSkuScalarWhereWithAggregatesInput[]
    OR?: ProductSkuScalarWhereWithAggregatesInput[]
    NOT?: ProductSkuScalarWhereWithAggregatesInput | ProductSkuScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductSku"> | string
    productId?: StringWithAggregatesFilter<"ProductSku"> | string
    skuCode?: StringWithAggregatesFilter<"ProductSku"> | string
    skuName?: StringWithAggregatesFilter<"ProductSku"> | string
    specsJson?: StringNullableWithAggregatesFilter<"ProductSku"> | string | null
    price?: FloatWithAggregatesFilter<"ProductSku"> | number
    stock?: IntWithAggregatesFilter<"ProductSku"> | number
    status?: StringWithAggregatesFilter<"ProductSku"> | string
    unitId?: StringNullableWithAggregatesFilter<"ProductSku"> | string | null
    kingdeeMaterialId?: StringNullableWithAggregatesFilter<"ProductSku"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProductSku"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductSku"> | Date | string
  }

  export type CartWhereInput = {
    AND?: CartWhereInput | CartWhereInput[]
    OR?: CartWhereInput[]
    NOT?: CartWhereInput | CartWhereInput[]
    id?: StringFilter<"Cart"> | string
    customerId?: StringFilter<"Cart"> | string
    createdAt?: DateTimeFilter<"Cart"> | Date | string
    updatedAt?: DateTimeFilter<"Cart"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    items?: CartItemListRelationFilter
  }

  export type CartOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    items?: CartItemOrderByRelationAggregateInput
  }

  export type CartWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    customerId?: string
    AND?: CartWhereInput | CartWhereInput[]
    OR?: CartWhereInput[]
    NOT?: CartWhereInput | CartWhereInput[]
    createdAt?: DateTimeFilter<"Cart"> | Date | string
    updatedAt?: DateTimeFilter<"Cart"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    items?: CartItemListRelationFilter
  }, "id" | "customerId">

  export type CartOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CartCountOrderByAggregateInput
    _max?: CartMaxOrderByAggregateInput
    _min?: CartMinOrderByAggregateInput
  }

  export type CartScalarWhereWithAggregatesInput = {
    AND?: CartScalarWhereWithAggregatesInput | CartScalarWhereWithAggregatesInput[]
    OR?: CartScalarWhereWithAggregatesInput[]
    NOT?: CartScalarWhereWithAggregatesInput | CartScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cart"> | string
    customerId?: StringWithAggregatesFilter<"Cart"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Cart"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Cart"> | Date | string
  }

  export type CartItemWhereInput = {
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    id?: StringFilter<"CartItem"> | string
    cartId?: StringFilter<"CartItem"> | string
    customerId?: StringFilter<"CartItem"> | string
    productId?: StringFilter<"CartItem"> | string
    skuId?: StringFilter<"CartItem"> | string
    qty?: IntFilter<"CartItem"> | number
    createdAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
    cart?: XOR<CartRelationFilter, CartWhereInput>
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    sku?: XOR<ProductSkuRelationFilter, ProductSkuWhereInput>
  }

  export type CartItemOrderByWithRelationInput = {
    id?: SortOrder
    cartId?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    qty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cart?: CartOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
    sku?: ProductSkuOrderByWithRelationInput
  }

  export type CartItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cartId_skuId?: CartItemCartIdSkuIdCompoundUniqueInput
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    cartId?: StringFilter<"CartItem"> | string
    customerId?: StringFilter<"CartItem"> | string
    productId?: StringFilter<"CartItem"> | string
    skuId?: StringFilter<"CartItem"> | string
    qty?: IntFilter<"CartItem"> | number
    createdAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
    cart?: XOR<CartRelationFilter, CartWhereInput>
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    sku?: XOR<ProductSkuRelationFilter, ProductSkuWhereInput>
  }, "id" | "cartId_skuId">

  export type CartItemOrderByWithAggregationInput = {
    id?: SortOrder
    cartId?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    qty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CartItemCountOrderByAggregateInput
    _avg?: CartItemAvgOrderByAggregateInput
    _max?: CartItemMaxOrderByAggregateInput
    _min?: CartItemMinOrderByAggregateInput
    _sum?: CartItemSumOrderByAggregateInput
  }

  export type CartItemScalarWhereWithAggregatesInput = {
    AND?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    OR?: CartItemScalarWhereWithAggregatesInput[]
    NOT?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CartItem"> | string
    cartId?: StringWithAggregatesFilter<"CartItem"> | string
    customerId?: StringWithAggregatesFilter<"CartItem"> | string
    productId?: StringWithAggregatesFilter<"CartItem"> | string
    skuId?: StringWithAggregatesFilter<"CartItem"> | string
    qty?: IntWithAggregatesFilter<"CartItem"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CartItem"> | Date | string
  }

  export type SalesOrderWhereInput = {
    AND?: SalesOrderWhereInput | SalesOrderWhereInput[]
    OR?: SalesOrderWhereInput[]
    NOT?: SalesOrderWhereInput | SalesOrderWhereInput[]
    id?: StringFilter<"SalesOrder"> | string
    orderNo?: StringFilter<"SalesOrder"> | string
    customerId?: StringFilter<"SalesOrder"> | string
    status?: StringFilter<"SalesOrder"> | string
    settlementMode?: StringFilter<"SalesOrder"> | string
    currency?: StringFilter<"SalesOrder"> | string
    totalAmount?: FloatFilter<"SalesOrder"> | number
    remark?: StringNullableFilter<"SalesOrder"> | string | null
    idempotencyKey?: StringNullableFilter<"SalesOrder"> | string | null
    kingdeeOrderId?: StringNullableFilter<"SalesOrder"> | string | null
    kingdeeOrderNumber?: StringNullableFilter<"SalesOrder"> | string | null
    writebackError?: StringNullableFilter<"SalesOrder"> | string | null
    canceledAt?: DateTimeNullableFilter<"SalesOrder"> | Date | string | null
    createdAt?: DateTimeFilter<"SalesOrder"> | Date | string
    updatedAt?: DateTimeFilter<"SalesOrder"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    lines?: SalesOrderLineListRelationFilter
    writebackLogs?: OrderWritebackLogListRelationFilter
    deliveries?: DeliveryListRelationFilter
  }

  export type SalesOrderOrderByWithRelationInput = {
    id?: SortOrder
    orderNo?: SortOrder
    customerId?: SortOrder
    status?: SortOrder
    settlementMode?: SortOrder
    currency?: SortOrder
    totalAmount?: SortOrder
    remark?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    kingdeeOrderId?: SortOrderInput | SortOrder
    kingdeeOrderNumber?: SortOrderInput | SortOrder
    writebackError?: SortOrderInput | SortOrder
    canceledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    lines?: SalesOrderLineOrderByRelationAggregateInput
    writebackLogs?: OrderWritebackLogOrderByRelationAggregateInput
    deliveries?: DeliveryOrderByRelationAggregateInput
  }

  export type SalesOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderNo?: string
    AND?: SalesOrderWhereInput | SalesOrderWhereInput[]
    OR?: SalesOrderWhereInput[]
    NOT?: SalesOrderWhereInput | SalesOrderWhereInput[]
    customerId?: StringFilter<"SalesOrder"> | string
    status?: StringFilter<"SalesOrder"> | string
    settlementMode?: StringFilter<"SalesOrder"> | string
    currency?: StringFilter<"SalesOrder"> | string
    totalAmount?: FloatFilter<"SalesOrder"> | number
    remark?: StringNullableFilter<"SalesOrder"> | string | null
    idempotencyKey?: StringNullableFilter<"SalesOrder"> | string | null
    kingdeeOrderId?: StringNullableFilter<"SalesOrder"> | string | null
    kingdeeOrderNumber?: StringNullableFilter<"SalesOrder"> | string | null
    writebackError?: StringNullableFilter<"SalesOrder"> | string | null
    canceledAt?: DateTimeNullableFilter<"SalesOrder"> | Date | string | null
    createdAt?: DateTimeFilter<"SalesOrder"> | Date | string
    updatedAt?: DateTimeFilter<"SalesOrder"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    lines?: SalesOrderLineListRelationFilter
    writebackLogs?: OrderWritebackLogListRelationFilter
    deliveries?: DeliveryListRelationFilter
  }, "id" | "orderNo">

  export type SalesOrderOrderByWithAggregationInput = {
    id?: SortOrder
    orderNo?: SortOrder
    customerId?: SortOrder
    status?: SortOrder
    settlementMode?: SortOrder
    currency?: SortOrder
    totalAmount?: SortOrder
    remark?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrderInput | SortOrder
    kingdeeOrderId?: SortOrderInput | SortOrder
    kingdeeOrderNumber?: SortOrderInput | SortOrder
    writebackError?: SortOrderInput | SortOrder
    canceledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SalesOrderCountOrderByAggregateInput
    _avg?: SalesOrderAvgOrderByAggregateInput
    _max?: SalesOrderMaxOrderByAggregateInput
    _min?: SalesOrderMinOrderByAggregateInput
    _sum?: SalesOrderSumOrderByAggregateInput
  }

  export type SalesOrderScalarWhereWithAggregatesInput = {
    AND?: SalesOrderScalarWhereWithAggregatesInput | SalesOrderScalarWhereWithAggregatesInput[]
    OR?: SalesOrderScalarWhereWithAggregatesInput[]
    NOT?: SalesOrderScalarWhereWithAggregatesInput | SalesOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SalesOrder"> | string
    orderNo?: StringWithAggregatesFilter<"SalesOrder"> | string
    customerId?: StringWithAggregatesFilter<"SalesOrder"> | string
    status?: StringWithAggregatesFilter<"SalesOrder"> | string
    settlementMode?: StringWithAggregatesFilter<"SalesOrder"> | string
    currency?: StringWithAggregatesFilter<"SalesOrder"> | string
    totalAmount?: FloatWithAggregatesFilter<"SalesOrder"> | number
    remark?: StringNullableWithAggregatesFilter<"SalesOrder"> | string | null
    idempotencyKey?: StringNullableWithAggregatesFilter<"SalesOrder"> | string | null
    kingdeeOrderId?: StringNullableWithAggregatesFilter<"SalesOrder"> | string | null
    kingdeeOrderNumber?: StringNullableWithAggregatesFilter<"SalesOrder"> | string | null
    writebackError?: StringNullableWithAggregatesFilter<"SalesOrder"> | string | null
    canceledAt?: DateTimeNullableWithAggregatesFilter<"SalesOrder"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SalesOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SalesOrder"> | Date | string
  }

  export type SalesOrderLineWhereInput = {
    AND?: SalesOrderLineWhereInput | SalesOrderLineWhereInput[]
    OR?: SalesOrderLineWhereInput[]
    NOT?: SalesOrderLineWhereInput | SalesOrderLineWhereInput[]
    id?: StringFilter<"SalesOrderLine"> | string
    salesOrderId?: StringFilter<"SalesOrderLine"> | string
    productId?: StringFilter<"SalesOrderLine"> | string
    skuId?: StringFilter<"SalesOrderLine"> | string
    productName?: StringFilter<"SalesOrderLine"> | string
    skuName?: StringFilter<"SalesOrderLine"> | string
    skuCode?: StringFilter<"SalesOrderLine"> | string
    qty?: IntFilter<"SalesOrderLine"> | number
    unitPrice?: FloatFilter<"SalesOrderLine"> | number
    lineAmount?: FloatFilter<"SalesOrderLine"> | number
    rawJson?: StringNullableFilter<"SalesOrderLine"> | string | null
    createdAt?: DateTimeFilter<"SalesOrderLine"> | Date | string
    salesOrder?: XOR<SalesOrderRelationFilter, SalesOrderWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    sku?: XOR<ProductSkuRelationFilter, ProductSkuWhereInput>
  }

  export type SalesOrderLineOrderByWithRelationInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    skuName?: SortOrder
    skuCode?: SortOrder
    qty?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    rawJson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    salesOrder?: SalesOrderOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
    sku?: ProductSkuOrderByWithRelationInput
  }

  export type SalesOrderLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SalesOrderLineWhereInput | SalesOrderLineWhereInput[]
    OR?: SalesOrderLineWhereInput[]
    NOT?: SalesOrderLineWhereInput | SalesOrderLineWhereInput[]
    salesOrderId?: StringFilter<"SalesOrderLine"> | string
    productId?: StringFilter<"SalesOrderLine"> | string
    skuId?: StringFilter<"SalesOrderLine"> | string
    productName?: StringFilter<"SalesOrderLine"> | string
    skuName?: StringFilter<"SalesOrderLine"> | string
    skuCode?: StringFilter<"SalesOrderLine"> | string
    qty?: IntFilter<"SalesOrderLine"> | number
    unitPrice?: FloatFilter<"SalesOrderLine"> | number
    lineAmount?: FloatFilter<"SalesOrderLine"> | number
    rawJson?: StringNullableFilter<"SalesOrderLine"> | string | null
    createdAt?: DateTimeFilter<"SalesOrderLine"> | Date | string
    salesOrder?: XOR<SalesOrderRelationFilter, SalesOrderWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    sku?: XOR<ProductSkuRelationFilter, ProductSkuWhereInput>
  }, "id">

  export type SalesOrderLineOrderByWithAggregationInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    skuName?: SortOrder
    skuCode?: SortOrder
    qty?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    rawJson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SalesOrderLineCountOrderByAggregateInput
    _avg?: SalesOrderLineAvgOrderByAggregateInput
    _max?: SalesOrderLineMaxOrderByAggregateInput
    _min?: SalesOrderLineMinOrderByAggregateInput
    _sum?: SalesOrderLineSumOrderByAggregateInput
  }

  export type SalesOrderLineScalarWhereWithAggregatesInput = {
    AND?: SalesOrderLineScalarWhereWithAggregatesInput | SalesOrderLineScalarWhereWithAggregatesInput[]
    OR?: SalesOrderLineScalarWhereWithAggregatesInput[]
    NOT?: SalesOrderLineScalarWhereWithAggregatesInput | SalesOrderLineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SalesOrderLine"> | string
    salesOrderId?: StringWithAggregatesFilter<"SalesOrderLine"> | string
    productId?: StringWithAggregatesFilter<"SalesOrderLine"> | string
    skuId?: StringWithAggregatesFilter<"SalesOrderLine"> | string
    productName?: StringWithAggregatesFilter<"SalesOrderLine"> | string
    skuName?: StringWithAggregatesFilter<"SalesOrderLine"> | string
    skuCode?: StringWithAggregatesFilter<"SalesOrderLine"> | string
    qty?: IntWithAggregatesFilter<"SalesOrderLine"> | number
    unitPrice?: FloatWithAggregatesFilter<"SalesOrderLine"> | number
    lineAmount?: FloatWithAggregatesFilter<"SalesOrderLine"> | number
    rawJson?: StringNullableWithAggregatesFilter<"SalesOrderLine"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SalesOrderLine"> | Date | string
  }

  export type OrderWritebackLogWhereInput = {
    AND?: OrderWritebackLogWhereInput | OrderWritebackLogWhereInput[]
    OR?: OrderWritebackLogWhereInput[]
    NOT?: OrderWritebackLogWhereInput | OrderWritebackLogWhereInput[]
    id?: StringFilter<"OrderWritebackLog"> | string
    salesOrderId?: StringFilter<"OrderWritebackLog"> | string
    success?: BoolFilter<"OrderWritebackLog"> | boolean
    requestId?: StringNullableFilter<"OrderWritebackLog"> | string | null
    traceId?: StringNullableFilter<"OrderWritebackLog"> | string | null
    summary?: StringNullableFilter<"OrderWritebackLog"> | string | null
    requestJson?: StringFilter<"OrderWritebackLog"> | string
    responseJson?: StringNullableFilter<"OrderWritebackLog"> | string | null
    errorCode?: StringNullableFilter<"OrderWritebackLog"> | string | null
    errorMessage?: StringNullableFilter<"OrderWritebackLog"> | string | null
    createdAt?: DateTimeFilter<"OrderWritebackLog"> | Date | string
    salesOrder?: XOR<SalesOrderRelationFilter, SalesOrderWhereInput>
  }

  export type OrderWritebackLogOrderByWithRelationInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    success?: SortOrder
    requestId?: SortOrderInput | SortOrder
    traceId?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    requestJson?: SortOrder
    responseJson?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    salesOrder?: SalesOrderOrderByWithRelationInput
  }

  export type OrderWritebackLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderWritebackLogWhereInput | OrderWritebackLogWhereInput[]
    OR?: OrderWritebackLogWhereInput[]
    NOT?: OrderWritebackLogWhereInput | OrderWritebackLogWhereInput[]
    salesOrderId?: StringFilter<"OrderWritebackLog"> | string
    success?: BoolFilter<"OrderWritebackLog"> | boolean
    requestId?: StringNullableFilter<"OrderWritebackLog"> | string | null
    traceId?: StringNullableFilter<"OrderWritebackLog"> | string | null
    summary?: StringNullableFilter<"OrderWritebackLog"> | string | null
    requestJson?: StringFilter<"OrderWritebackLog"> | string
    responseJson?: StringNullableFilter<"OrderWritebackLog"> | string | null
    errorCode?: StringNullableFilter<"OrderWritebackLog"> | string | null
    errorMessage?: StringNullableFilter<"OrderWritebackLog"> | string | null
    createdAt?: DateTimeFilter<"OrderWritebackLog"> | Date | string
    salesOrder?: XOR<SalesOrderRelationFilter, SalesOrderWhereInput>
  }, "id">

  export type OrderWritebackLogOrderByWithAggregationInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    success?: SortOrder
    requestId?: SortOrderInput | SortOrder
    traceId?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    requestJson?: SortOrder
    responseJson?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: OrderWritebackLogCountOrderByAggregateInput
    _max?: OrderWritebackLogMaxOrderByAggregateInput
    _min?: OrderWritebackLogMinOrderByAggregateInput
  }

  export type OrderWritebackLogScalarWhereWithAggregatesInput = {
    AND?: OrderWritebackLogScalarWhereWithAggregatesInput | OrderWritebackLogScalarWhereWithAggregatesInput[]
    OR?: OrderWritebackLogScalarWhereWithAggregatesInput[]
    NOT?: OrderWritebackLogScalarWhereWithAggregatesInput | OrderWritebackLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrderWritebackLog"> | string
    salesOrderId?: StringWithAggregatesFilter<"OrderWritebackLog"> | string
    success?: BoolWithAggregatesFilter<"OrderWritebackLog"> | boolean
    requestId?: StringNullableWithAggregatesFilter<"OrderWritebackLog"> | string | null
    traceId?: StringNullableWithAggregatesFilter<"OrderWritebackLog"> | string | null
    summary?: StringNullableWithAggregatesFilter<"OrderWritebackLog"> | string | null
    requestJson?: StringWithAggregatesFilter<"OrderWritebackLog"> | string
    responseJson?: StringNullableWithAggregatesFilter<"OrderWritebackLog"> | string | null
    errorCode?: StringNullableWithAggregatesFilter<"OrderWritebackLog"> | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"OrderWritebackLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OrderWritebackLog"> | Date | string
  }

  export type KingdeeTokenCreateInput = {
    env: string
    appToken: string
    expiresAt: Date | string
    updatedAt?: Date | string
  }

  export type KingdeeTokenUncheckedCreateInput = {
    id?: number
    env: string
    appToken: string
    expiresAt: Date | string
    updatedAt?: Date | string
  }

  export type KingdeeTokenUpdateInput = {
    env?: StringFieldUpdateOperationsInput | string
    appToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KingdeeTokenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    env?: StringFieldUpdateOperationsInput | string
    appToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KingdeeTokenCreateManyInput = {
    id?: number
    env: string
    appToken: string
    expiresAt: Date | string
    updatedAt?: Date | string
  }

  export type KingdeeTokenUpdateManyMutationInput = {
    env?: StringFieldUpdateOperationsInput | string
    appToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KingdeeTokenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    env?: StringFieldUpdateOperationsInput | string
    appToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KingdeeRawDocumentCreateInput = {
    docType: string
    kingdeeId?: string | null
    number?: string | null
    payloadJson: string
    fetchedAt?: Date | string
    hash: string
  }

  export type KingdeeRawDocumentUncheckedCreateInput = {
    id?: number
    docType: string
    kingdeeId?: string | null
    number?: string | null
    payloadJson: string
    fetchedAt?: Date | string
    hash: string
  }

  export type KingdeeRawDocumentUpdateInput = {
    docType?: StringFieldUpdateOperationsInput | string
    kingdeeId?: NullableStringFieldUpdateOperationsInput | string | null
    number?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type KingdeeRawDocumentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: StringFieldUpdateOperationsInput | string
    kingdeeId?: NullableStringFieldUpdateOperationsInput | string | null
    number?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type KingdeeRawDocumentCreateManyInput = {
    id?: number
    docType: string
    kingdeeId?: string | null
    number?: string | null
    payloadJson: string
    fetchedAt?: Date | string
    hash: string
  }

  export type KingdeeRawDocumentUpdateManyMutationInput = {
    docType?: StringFieldUpdateOperationsInput | string
    kingdeeId?: NullableStringFieldUpdateOperationsInput | string | null
    number?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type KingdeeRawDocumentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: StringFieldUpdateOperationsInput | string
    kingdeeId?: NullableStringFieldUpdateOperationsInput | string | null
    number?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type CustomerCreateInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationCreateNestedManyWithoutCustomerInput
    cart?: CartCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationUncheckedCreateNestedManyWithoutCustomerInput
    cart?: CartUncheckedCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUpdateManyWithoutCustomerNestedInput
    cart?: CartUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUncheckedUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUncheckedUpdateManyWithoutCustomerNestedInput
    cart?: CartUncheckedUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryCreateInput = {
    id?: string
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutDeliveriesInput
    salesOrder?: SalesOrderCreateNestedOneWithoutDeliveriesInput
  }

  export type DeliveryUncheckedCreateInput = {
    id?: string
    customerId: string
    salesOrderId?: string | null
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutDeliveriesNestedInput
    salesOrder?: SalesOrderUpdateOneWithoutDeliveriesNestedInput
  }

  export type DeliveryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    salesOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryCreateManyInput = {
    id?: string
    customerId: string
    salesOrderId?: string | null
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    salesOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationCreateInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutReconciliationsInput
    lines?: ReconciliationLineCreateNestedManyWithoutReconciliationInput
  }

  export type ReconciliationUncheckedCreateInput = {
    id?: string
    customerId: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: ReconciliationLineUncheckedCreateNestedManyWithoutReconciliationInput
  }

  export type ReconciliationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutReconciliationsNestedInput
    lines?: ReconciliationLineUpdateManyWithoutReconciliationNestedInput
  }

  export type ReconciliationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: ReconciliationLineUncheckedUpdateManyWithoutReconciliationNestedInput
  }

  export type ReconciliationCreateManyInput = {
    id?: string
    customerId: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReconciliationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationLineCreateInput = {
    docType: string
    docNo?: string | null
    docDate?: Date | string | null
    amount?: number
    rawJson: string
    createdAt?: Date | string
    reconciliation: ReconciliationCreateNestedOneWithoutLinesInput
  }

  export type ReconciliationLineUncheckedCreateInput = {
    id?: number
    reconciliationId: string
    docType: string
    docNo?: string | null
    docDate?: Date | string | null
    amount?: number
    rawJson: string
    createdAt?: Date | string
  }

  export type ReconciliationLineUpdateInput = {
    docType?: StringFieldUpdateOperationsInput | string
    docNo?: NullableStringFieldUpdateOperationsInput | string | null
    docDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    rawJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliation?: ReconciliationUpdateOneRequiredWithoutLinesNestedInput
  }

  export type ReconciliationLineUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    reconciliationId?: StringFieldUpdateOperationsInput | string
    docType?: StringFieldUpdateOperationsInput | string
    docNo?: NullableStringFieldUpdateOperationsInput | string | null
    docDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    rawJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationLineCreateManyInput = {
    id?: number
    reconciliationId: string
    docType: string
    docNo?: string | null
    docDate?: Date | string | null
    amount?: number
    rawJson: string
    createdAt?: Date | string
  }

  export type ReconciliationLineUpdateManyMutationInput = {
    docType?: StringFieldUpdateOperationsInput | string
    docNo?: NullableStringFieldUpdateOperationsInput | string | null
    docDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    rawJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationLineUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    reconciliationId?: StringFieldUpdateOperationsInput | string
    docType?: StringFieldUpdateOperationsInput | string
    docNo?: NullableStringFieldUpdateOperationsInput | string | null
    docDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    rawJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncCheckpointCreateInput = {
    scope: string
    jobName: string
    cursorJson: string
    status: string
    errorMessage?: string | null
    lastRunAt: Date | string
    updatedAt?: Date | string
  }

  export type SyncCheckpointUncheckedCreateInput = {
    id?: number
    scope: string
    jobName: string
    cursorJson: string
    status: string
    errorMessage?: string | null
    lastRunAt: Date | string
    updatedAt?: Date | string
  }

  export type SyncCheckpointUpdateInput = {
    scope?: StringFieldUpdateOperationsInput | string
    jobName?: StringFieldUpdateOperationsInput | string
    cursorJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncCheckpointUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    jobName?: StringFieldUpdateOperationsInput | string
    cursorJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncCheckpointCreateManyInput = {
    id?: number
    scope: string
    jobName: string
    cursorJson: string
    status: string
    errorMessage?: string | null
    lastRunAt: Date | string
    updatedAt?: Date | string
  }

  export type SyncCheckpointUpdateManyMutationInput = {
    scope?: StringFieldUpdateOperationsInput | string
    jobName?: StringFieldUpdateOperationsInput | string
    cursorJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SyncCheckpointUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    jobName?: StringFieldUpdateOperationsInput | string
    cursorJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skus?: ProductSkuCreateNestedManyWithoutProductInput
    cartItems?: CartItemCreateNestedManyWithoutProductInput
    orderLines?: SalesOrderLineCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skus?: ProductSkuUncheckedCreateNestedManyWithoutProductInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput
    orderLines?: SalesOrderLineUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: ProductSkuUpdateManyWithoutProductNestedInput
    cartItems?: CartItemUpdateManyWithoutProductNestedInput
    orderLines?: SalesOrderLineUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: ProductSkuUncheckedUpdateManyWithoutProductNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput
    orderLines?: SalesOrderLineUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductSkuCreateInput = {
    id?: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutSkusInput
    cartItems?: CartItemCreateNestedManyWithoutSkuInput
    orderLines?: SalesOrderLineCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuUncheckedCreateInput = {
    id?: string
    productId: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutSkuInput
    orderLines?: SalesOrderLineUncheckedCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutSkusNestedInput
    cartItems?: CartItemUpdateManyWithoutSkuNestedInput
    orderLines?: SalesOrderLineUpdateManyWithoutSkuNestedInput
  }

  export type ProductSkuUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutSkuNestedInput
    orderLines?: SalesOrderLineUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type ProductSkuCreateManyInput = {
    id?: string
    productId: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductSkuUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductSkuUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutCartInput
    items?: CartItemCreateNestedManyWithoutCartInput
  }

  export type CartUncheckedCreateInput = {
    id?: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CartItemUncheckedCreateNestedManyWithoutCartInput
  }

  export type CartUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutCartNestedInput
    items?: CartItemUpdateManyWithoutCartNestedInput
  }

  export type CartUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CartItemUncheckedUpdateManyWithoutCartNestedInput
  }

  export type CartCreateManyInput = {
    id?: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateInput = {
    id?: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cart: CartCreateNestedOneWithoutItemsInput
    customer: CustomerCreateNestedOneWithoutCartItemsInput
    product: ProductCreateNestedOneWithoutCartItemsInput
    sku: ProductSkuCreateNestedOneWithoutCartItemsInput
  }

  export type CartItemUncheckedCreateInput = {
    id?: string
    cartId: string
    customerId: string
    productId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cart?: CartUpdateOneRequiredWithoutItemsNestedInput
    customer?: CustomerUpdateOneRequiredWithoutCartItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutCartItemsNestedInput
    sku?: ProductSkuUpdateOneRequiredWithoutCartItemsNestedInput
  }

  export type CartItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateManyInput = {
    id?: string
    cartId: string
    customerId: string
    productId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderCreateInput = {
    id?: string
    orderNo: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutSalesOrdersInput
    lines?: SalesOrderLineCreateNestedManyWithoutSalesOrderInput
    writebackLogs?: OrderWritebackLogCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderUncheckedCreateInput = {
    id?: string
    orderNo: string
    customerId: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: SalesOrderLineUncheckedCreateNestedManyWithoutSalesOrderInput
    writebackLogs?: OrderWritebackLogUncheckedCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutSalesOrdersNestedInput
    lines?: SalesOrderLineUpdateManyWithoutSalesOrderNestedInput
    writebackLogs?: OrderWritebackLogUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUpdateManyWithoutSalesOrderNestedInput
  }

  export type SalesOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: SalesOrderLineUncheckedUpdateManyWithoutSalesOrderNestedInput
    writebackLogs?: OrderWritebackLogUncheckedUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutSalesOrderNestedInput
  }

  export type SalesOrderCreateManyInput = {
    id?: string
    orderNo: string
    customerId: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineCreateInput = {
    id?: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
    salesOrder: SalesOrderCreateNestedOneWithoutLinesInput
    product: ProductCreateNestedOneWithoutOrderLinesInput
    sku: ProductSkuCreateNestedOneWithoutOrderLinesInput
  }

  export type SalesOrderLineUncheckedCreateInput = {
    id?: string
    salesOrderId: string
    productId: string
    skuId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type SalesOrderLineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    salesOrder?: SalesOrderUpdateOneRequiredWithoutLinesNestedInput
    product?: ProductUpdateOneRequiredWithoutOrderLinesNestedInput
    sku?: ProductSkuUpdateOneRequiredWithoutOrderLinesNestedInput
  }

  export type SalesOrderLineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineCreateManyInput = {
    id?: string
    salesOrderId: string
    productId: string
    skuId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type SalesOrderLineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderWritebackLogCreateInput = {
    id?: string
    success: boolean
    requestId?: string | null
    traceId?: string | null
    summary?: string | null
    requestJson: string
    responseJson?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
    salesOrder: SalesOrderCreateNestedOneWithoutWritebackLogsInput
  }

  export type OrderWritebackLogUncheckedCreateInput = {
    id?: string
    salesOrderId: string
    success: boolean
    requestId?: string | null
    traceId?: string | null
    summary?: string | null
    requestJson: string
    responseJson?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type OrderWritebackLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    traceId?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    requestJson?: StringFieldUpdateOperationsInput | string
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    salesOrder?: SalesOrderUpdateOneRequiredWithoutWritebackLogsNestedInput
  }

  export type OrderWritebackLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    traceId?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    requestJson?: StringFieldUpdateOperationsInput | string
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderWritebackLogCreateManyInput = {
    id?: string
    salesOrderId: string
    success: boolean
    requestId?: string | null
    traceId?: string | null
    summary?: string | null
    requestJson: string
    responseJson?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type OrderWritebackLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    traceId?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    requestJson?: StringFieldUpdateOperationsInput | string
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderWritebackLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    traceId?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    requestJson?: StringFieldUpdateOperationsInput | string
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type KingdeeTokenCountOrderByAggregateInput = {
    id?: SortOrder
    env?: SortOrder
    appToken?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KingdeeTokenAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type KingdeeTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    env?: SortOrder
    appToken?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KingdeeTokenMinOrderByAggregateInput = {
    id?: SortOrder
    env?: SortOrder
    appToken?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KingdeeTokenSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type KingdeeRawDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    docType?: SortOrder
    kingdeeId?: SortOrder
    number?: SortOrder
    payloadJson?: SortOrder
    fetchedAt?: SortOrder
    hash?: SortOrder
  }

  export type KingdeeRawDocumentAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type KingdeeRawDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    docType?: SortOrder
    kingdeeId?: SortOrder
    number?: SortOrder
    payloadJson?: SortOrder
    fetchedAt?: SortOrder
    hash?: SortOrder
  }

  export type KingdeeRawDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    docType?: SortOrder
    kingdeeId?: SortOrder
    number?: SortOrder
    payloadJson?: SortOrder
    fetchedAt?: SortOrder
    hash?: SortOrder
  }

  export type KingdeeRawDocumentSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DeliveryListRelationFilter = {
    every?: DeliveryWhereInput
    some?: DeliveryWhereInput
    none?: DeliveryWhereInput
  }

  export type ReconciliationListRelationFilter = {
    every?: ReconciliationWhereInput
    some?: ReconciliationWhereInput
    none?: ReconciliationWhereInput
  }

  export type CartNullableRelationFilter = {
    is?: CartWhereInput | null
    isNot?: CartWhereInput | null
  }

  export type CartItemListRelationFilter = {
    every?: CartItemWhereInput
    some?: CartItemWhereInput
    none?: CartItemWhereInput
  }

  export type SalesOrderListRelationFilter = {
    every?: SalesOrderWhereInput
    some?: SalesOrderWhereInput
    none?: SalesOrderWhereInput
  }

  export type DeliveryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReconciliationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CartItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SalesOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    kingdeeCustomerId?: SortOrder
    wechatOpenid?: SortOrder
    accessToken?: SortOrder
    tokenExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    kingdeeCustomerId?: SortOrder
    wechatOpenid?: SortOrder
    accessToken?: SortOrder
    tokenExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    kingdeeCustomerId?: SortOrder
    wechatOpenid?: SortOrder
    accessToken?: SortOrder
    tokenExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type CustomerRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type SalesOrderNullableRelationFilter = {
    is?: SalesOrderWhereInput | null
    isNot?: SalesOrderWhereInput | null
  }

  export type DeliveryCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    salesOrderId?: SortOrder
    kingdeeBillId?: SortOrder
    kingdeeBillNumber?: SortOrder
    sourceDocNo?: SortOrder
    detailsJson?: SortOrder
    syncedAt?: SortOrder
    status?: SortOrder
    signedAt?: SortOrder
    signedPayloadJson?: SortOrder
    signIdempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeliveryMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    salesOrderId?: SortOrder
    kingdeeBillId?: SortOrder
    kingdeeBillNumber?: SortOrder
    sourceDocNo?: SortOrder
    detailsJson?: SortOrder
    syncedAt?: SortOrder
    status?: SortOrder
    signedAt?: SortOrder
    signedPayloadJson?: SortOrder
    signIdempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeliveryMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    salesOrderId?: SortOrder
    kingdeeBillId?: SortOrder
    kingdeeBillNumber?: SortOrder
    sourceDocNo?: SortOrder
    detailsJson?: SortOrder
    syncedAt?: SortOrder
    status?: SortOrder
    signedAt?: SortOrder
    signedPayloadJson?: SortOrder
    signIdempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReconciliationLineListRelationFilter = {
    every?: ReconciliationLineWhereInput
    some?: ReconciliationLineWhereInput
    none?: ReconciliationLineWhereInput
  }

  export type ReconciliationLineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReconciliationCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    statementJson?: SortOrder
    status?: SortOrder
    confirmedAt?: SortOrder
    confirmRemark?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReconciliationMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    statementJson?: SortOrder
    status?: SortOrder
    confirmedAt?: SortOrder
    confirmRemark?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReconciliationMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    statementJson?: SortOrder
    status?: SortOrder
    confirmedAt?: SortOrder
    confirmRemark?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ReconciliationRelationFilter = {
    is?: ReconciliationWhereInput
    isNot?: ReconciliationWhereInput
  }

  export type ReconciliationLineCountOrderByAggregateInput = {
    id?: SortOrder
    reconciliationId?: SortOrder
    docType?: SortOrder
    docNo?: SortOrder
    docDate?: SortOrder
    amount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
  }

  export type ReconciliationLineAvgOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
  }

  export type ReconciliationLineMaxOrderByAggregateInput = {
    id?: SortOrder
    reconciliationId?: SortOrder
    docType?: SortOrder
    docNo?: SortOrder
    docDate?: SortOrder
    amount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
  }

  export type ReconciliationLineMinOrderByAggregateInput = {
    id?: SortOrder
    reconciliationId?: SortOrder
    docType?: SortOrder
    docNo?: SortOrder
    docDate?: SortOrder
    amount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
  }

  export type ReconciliationLineSumOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SyncCheckpointCountOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    jobName?: SortOrder
    cursorJson?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    lastRunAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncCheckpointAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SyncCheckpointMaxOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    jobName?: SortOrder
    cursorJson?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    lastRunAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncCheckpointMinOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    jobName?: SortOrder
    cursorJson?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    lastRunAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SyncCheckpointSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProductSkuListRelationFilter = {
    every?: ProductSkuWhereInput
    some?: ProductSkuWhereInput
    none?: ProductSkuWhereInput
  }

  export type SalesOrderLineListRelationFilter = {
    every?: SalesOrderLineWhereInput
    some?: SalesOrderLineWhereInput
    none?: SalesOrderLineWhereInput
  }

  export type ProductSkuOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SalesOrderLineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    coverImageUrl?: SortOrder
    status?: SortOrder
    defaultUnitId?: SortOrder
    kingdeeMaterialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    coverImageUrl?: SortOrder
    status?: SortOrder
    defaultUnitId?: SortOrder
    kingdeeMaterialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    coverImageUrl?: SortOrder
    status?: SortOrder
    defaultUnitId?: SortOrder
    kingdeeMaterialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductSkuCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    skuCode?: SortOrder
    skuName?: SortOrder
    specsJson?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    unitId?: SortOrder
    kingdeeMaterialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSkuAvgOrderByAggregateInput = {
    price?: SortOrder
    stock?: SortOrder
  }

  export type ProductSkuMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    skuCode?: SortOrder
    skuName?: SortOrder
    specsJson?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    unitId?: SortOrder
    kingdeeMaterialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSkuMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    skuCode?: SortOrder
    skuName?: SortOrder
    specsJson?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    status?: SortOrder
    unitId?: SortOrder
    kingdeeMaterialId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSkuSumOrderByAggregateInput = {
    price?: SortOrder
    stock?: SortOrder
  }

  export type CartCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartRelationFilter = {
    is?: CartWhereInput
    isNot?: CartWhereInput
  }

  export type ProductSkuRelationFilter = {
    is?: ProductSkuWhereInput
    isNot?: ProductSkuWhereInput
  }

  export type CartItemCartIdSkuIdCompoundUniqueInput = {
    cartId: string
    skuId: string
  }

  export type CartItemCountOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    qty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemAvgOrderByAggregateInput = {
    qty?: SortOrder
  }

  export type CartItemMaxOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    qty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemMinOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    qty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemSumOrderByAggregateInput = {
    qty?: SortOrder
  }

  export type OrderWritebackLogListRelationFilter = {
    every?: OrderWritebackLogWhereInput
    some?: OrderWritebackLogWhereInput
    none?: OrderWritebackLogWhereInput
  }

  export type OrderWritebackLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SalesOrderCountOrderByAggregateInput = {
    id?: SortOrder
    orderNo?: SortOrder
    customerId?: SortOrder
    status?: SortOrder
    settlementMode?: SortOrder
    currency?: SortOrder
    totalAmount?: SortOrder
    remark?: SortOrder
    idempotencyKey?: SortOrder
    kingdeeOrderId?: SortOrder
    kingdeeOrderNumber?: SortOrder
    writebackError?: SortOrder
    canceledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesOrderAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type SalesOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    orderNo?: SortOrder
    customerId?: SortOrder
    status?: SortOrder
    settlementMode?: SortOrder
    currency?: SortOrder
    totalAmount?: SortOrder
    remark?: SortOrder
    idempotencyKey?: SortOrder
    kingdeeOrderId?: SortOrder
    kingdeeOrderNumber?: SortOrder
    writebackError?: SortOrder
    canceledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesOrderMinOrderByAggregateInput = {
    id?: SortOrder
    orderNo?: SortOrder
    customerId?: SortOrder
    status?: SortOrder
    settlementMode?: SortOrder
    currency?: SortOrder
    totalAmount?: SortOrder
    remark?: SortOrder
    idempotencyKey?: SortOrder
    kingdeeOrderId?: SortOrder
    kingdeeOrderNumber?: SortOrder
    writebackError?: SortOrder
    canceledAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesOrderSumOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type SalesOrderRelationFilter = {
    is?: SalesOrderWhereInput
    isNot?: SalesOrderWhereInput
  }

  export type SalesOrderLineCountOrderByAggregateInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    skuName?: SortOrder
    skuCode?: SortOrder
    qty?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
  }

  export type SalesOrderLineAvgOrderByAggregateInput = {
    qty?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
  }

  export type SalesOrderLineMaxOrderByAggregateInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    skuName?: SortOrder
    skuCode?: SortOrder
    qty?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
  }

  export type SalesOrderLineMinOrderByAggregateInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    productId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    skuName?: SortOrder
    skuCode?: SortOrder
    qty?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    rawJson?: SortOrder
    createdAt?: SortOrder
  }

  export type SalesOrderLineSumOrderByAggregateInput = {
    qty?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type OrderWritebackLogCountOrderByAggregateInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    success?: SortOrder
    requestId?: SortOrder
    traceId?: SortOrder
    summary?: SortOrder
    requestJson?: SortOrder
    responseJson?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderWritebackLogMaxOrderByAggregateInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    success?: SortOrder
    requestId?: SortOrder
    traceId?: SortOrder
    summary?: SortOrder
    requestJson?: SortOrder
    responseJson?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderWritebackLogMinOrderByAggregateInput = {
    id?: SortOrder
    salesOrderId?: SortOrder
    success?: SortOrder
    requestId?: SortOrder
    traceId?: SortOrder
    summary?: SortOrder
    requestJson?: SortOrder
    responseJson?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DeliveryCreateNestedManyWithoutCustomerInput = {
    create?: XOR<DeliveryCreateWithoutCustomerInput, DeliveryUncheckedCreateWithoutCustomerInput> | DeliveryCreateWithoutCustomerInput[] | DeliveryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutCustomerInput | DeliveryCreateOrConnectWithoutCustomerInput[]
    createMany?: DeliveryCreateManyCustomerInputEnvelope
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
  }

  export type ReconciliationCreateNestedManyWithoutCustomerInput = {
    create?: XOR<ReconciliationCreateWithoutCustomerInput, ReconciliationUncheckedCreateWithoutCustomerInput> | ReconciliationCreateWithoutCustomerInput[] | ReconciliationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ReconciliationCreateOrConnectWithoutCustomerInput | ReconciliationCreateOrConnectWithoutCustomerInput[]
    createMany?: ReconciliationCreateManyCustomerInputEnvelope
    connect?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
  }

  export type CartCreateNestedOneWithoutCustomerInput = {
    create?: XOR<CartCreateWithoutCustomerInput, CartUncheckedCreateWithoutCustomerInput>
    connectOrCreate?: CartCreateOrConnectWithoutCustomerInput
    connect?: CartWhereUniqueInput
  }

  export type CartItemCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CartItemCreateWithoutCustomerInput, CartItemUncheckedCreateWithoutCustomerInput> | CartItemCreateWithoutCustomerInput[] | CartItemUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCustomerInput | CartItemCreateOrConnectWithoutCustomerInput[]
    createMany?: CartItemCreateManyCustomerInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type SalesOrderCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SalesOrderCreateWithoutCustomerInput, SalesOrderUncheckedCreateWithoutCustomerInput> | SalesOrderCreateWithoutCustomerInput[] | SalesOrderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesOrderCreateOrConnectWithoutCustomerInput | SalesOrderCreateOrConnectWithoutCustomerInput[]
    createMany?: SalesOrderCreateManyCustomerInputEnvelope
    connect?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
  }

  export type DeliveryUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<DeliveryCreateWithoutCustomerInput, DeliveryUncheckedCreateWithoutCustomerInput> | DeliveryCreateWithoutCustomerInput[] | DeliveryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutCustomerInput | DeliveryCreateOrConnectWithoutCustomerInput[]
    createMany?: DeliveryCreateManyCustomerInputEnvelope
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
  }

  export type ReconciliationUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<ReconciliationCreateWithoutCustomerInput, ReconciliationUncheckedCreateWithoutCustomerInput> | ReconciliationCreateWithoutCustomerInput[] | ReconciliationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ReconciliationCreateOrConnectWithoutCustomerInput | ReconciliationCreateOrConnectWithoutCustomerInput[]
    createMany?: ReconciliationCreateManyCustomerInputEnvelope
    connect?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
  }

  export type CartUncheckedCreateNestedOneWithoutCustomerInput = {
    create?: XOR<CartCreateWithoutCustomerInput, CartUncheckedCreateWithoutCustomerInput>
    connectOrCreate?: CartCreateOrConnectWithoutCustomerInput
    connect?: CartWhereUniqueInput
  }

  export type CartItemUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CartItemCreateWithoutCustomerInput, CartItemUncheckedCreateWithoutCustomerInput> | CartItemCreateWithoutCustomerInput[] | CartItemUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCustomerInput | CartItemCreateOrConnectWithoutCustomerInput[]
    createMany?: CartItemCreateManyCustomerInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type SalesOrderUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SalesOrderCreateWithoutCustomerInput, SalesOrderUncheckedCreateWithoutCustomerInput> | SalesOrderCreateWithoutCustomerInput[] | SalesOrderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesOrderCreateOrConnectWithoutCustomerInput | SalesOrderCreateOrConnectWithoutCustomerInput[]
    createMany?: SalesOrderCreateManyCustomerInputEnvelope
    connect?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DeliveryUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<DeliveryCreateWithoutCustomerInput, DeliveryUncheckedCreateWithoutCustomerInput> | DeliveryCreateWithoutCustomerInput[] | DeliveryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutCustomerInput | DeliveryCreateOrConnectWithoutCustomerInput[]
    upsert?: DeliveryUpsertWithWhereUniqueWithoutCustomerInput | DeliveryUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: DeliveryCreateManyCustomerInputEnvelope
    set?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    disconnect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    delete?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    update?: DeliveryUpdateWithWhereUniqueWithoutCustomerInput | DeliveryUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: DeliveryUpdateManyWithWhereWithoutCustomerInput | DeliveryUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
  }

  export type ReconciliationUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<ReconciliationCreateWithoutCustomerInput, ReconciliationUncheckedCreateWithoutCustomerInput> | ReconciliationCreateWithoutCustomerInput[] | ReconciliationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ReconciliationCreateOrConnectWithoutCustomerInput | ReconciliationCreateOrConnectWithoutCustomerInput[]
    upsert?: ReconciliationUpsertWithWhereUniqueWithoutCustomerInput | ReconciliationUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: ReconciliationCreateManyCustomerInputEnvelope
    set?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    disconnect?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    delete?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    connect?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    update?: ReconciliationUpdateWithWhereUniqueWithoutCustomerInput | ReconciliationUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: ReconciliationUpdateManyWithWhereWithoutCustomerInput | ReconciliationUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: ReconciliationScalarWhereInput | ReconciliationScalarWhereInput[]
  }

  export type CartUpdateOneWithoutCustomerNestedInput = {
    create?: XOR<CartCreateWithoutCustomerInput, CartUncheckedCreateWithoutCustomerInput>
    connectOrCreate?: CartCreateOrConnectWithoutCustomerInput
    upsert?: CartUpsertWithoutCustomerInput
    disconnect?: CartWhereInput | boolean
    delete?: CartWhereInput | boolean
    connect?: CartWhereUniqueInput
    update?: XOR<XOR<CartUpdateToOneWithWhereWithoutCustomerInput, CartUpdateWithoutCustomerInput>, CartUncheckedUpdateWithoutCustomerInput>
  }

  export type CartItemUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CartItemCreateWithoutCustomerInput, CartItemUncheckedCreateWithoutCustomerInput> | CartItemCreateWithoutCustomerInput[] | CartItemUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCustomerInput | CartItemCreateOrConnectWithoutCustomerInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutCustomerInput | CartItemUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CartItemCreateManyCustomerInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutCustomerInput | CartItemUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutCustomerInput | CartItemUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type SalesOrderUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SalesOrderCreateWithoutCustomerInput, SalesOrderUncheckedCreateWithoutCustomerInput> | SalesOrderCreateWithoutCustomerInput[] | SalesOrderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesOrderCreateOrConnectWithoutCustomerInput | SalesOrderCreateOrConnectWithoutCustomerInput[]
    upsert?: SalesOrderUpsertWithWhereUniqueWithoutCustomerInput | SalesOrderUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SalesOrderCreateManyCustomerInputEnvelope
    set?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    disconnect?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    delete?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    connect?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    update?: SalesOrderUpdateWithWhereUniqueWithoutCustomerInput | SalesOrderUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SalesOrderUpdateManyWithWhereWithoutCustomerInput | SalesOrderUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SalesOrderScalarWhereInput | SalesOrderScalarWhereInput[]
  }

  export type DeliveryUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<DeliveryCreateWithoutCustomerInput, DeliveryUncheckedCreateWithoutCustomerInput> | DeliveryCreateWithoutCustomerInput[] | DeliveryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutCustomerInput | DeliveryCreateOrConnectWithoutCustomerInput[]
    upsert?: DeliveryUpsertWithWhereUniqueWithoutCustomerInput | DeliveryUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: DeliveryCreateManyCustomerInputEnvelope
    set?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    disconnect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    delete?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    update?: DeliveryUpdateWithWhereUniqueWithoutCustomerInput | DeliveryUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: DeliveryUpdateManyWithWhereWithoutCustomerInput | DeliveryUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
  }

  export type ReconciliationUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<ReconciliationCreateWithoutCustomerInput, ReconciliationUncheckedCreateWithoutCustomerInput> | ReconciliationCreateWithoutCustomerInput[] | ReconciliationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ReconciliationCreateOrConnectWithoutCustomerInput | ReconciliationCreateOrConnectWithoutCustomerInput[]
    upsert?: ReconciliationUpsertWithWhereUniqueWithoutCustomerInput | ReconciliationUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: ReconciliationCreateManyCustomerInputEnvelope
    set?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    disconnect?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    delete?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    connect?: ReconciliationWhereUniqueInput | ReconciliationWhereUniqueInput[]
    update?: ReconciliationUpdateWithWhereUniqueWithoutCustomerInput | ReconciliationUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: ReconciliationUpdateManyWithWhereWithoutCustomerInput | ReconciliationUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: ReconciliationScalarWhereInput | ReconciliationScalarWhereInput[]
  }

  export type CartUncheckedUpdateOneWithoutCustomerNestedInput = {
    create?: XOR<CartCreateWithoutCustomerInput, CartUncheckedCreateWithoutCustomerInput>
    connectOrCreate?: CartCreateOrConnectWithoutCustomerInput
    upsert?: CartUpsertWithoutCustomerInput
    disconnect?: CartWhereInput | boolean
    delete?: CartWhereInput | boolean
    connect?: CartWhereUniqueInput
    update?: XOR<XOR<CartUpdateToOneWithWhereWithoutCustomerInput, CartUpdateWithoutCustomerInput>, CartUncheckedUpdateWithoutCustomerInput>
  }

  export type CartItemUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CartItemCreateWithoutCustomerInput, CartItemUncheckedCreateWithoutCustomerInput> | CartItemCreateWithoutCustomerInput[] | CartItemUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCustomerInput | CartItemCreateOrConnectWithoutCustomerInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutCustomerInput | CartItemUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CartItemCreateManyCustomerInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutCustomerInput | CartItemUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutCustomerInput | CartItemUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type SalesOrderUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SalesOrderCreateWithoutCustomerInput, SalesOrderUncheckedCreateWithoutCustomerInput> | SalesOrderCreateWithoutCustomerInput[] | SalesOrderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SalesOrderCreateOrConnectWithoutCustomerInput | SalesOrderCreateOrConnectWithoutCustomerInput[]
    upsert?: SalesOrderUpsertWithWhereUniqueWithoutCustomerInput | SalesOrderUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SalesOrderCreateManyCustomerInputEnvelope
    set?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    disconnect?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    delete?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    connect?: SalesOrderWhereUniqueInput | SalesOrderWhereUniqueInput[]
    update?: SalesOrderUpdateWithWhereUniqueWithoutCustomerInput | SalesOrderUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SalesOrderUpdateManyWithWhereWithoutCustomerInput | SalesOrderUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SalesOrderScalarWhereInput | SalesOrderScalarWhereInput[]
  }

  export type CustomerCreateNestedOneWithoutDeliveriesInput = {
    create?: XOR<CustomerCreateWithoutDeliveriesInput, CustomerUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutDeliveriesInput
    connect?: CustomerWhereUniqueInput
  }

  export type SalesOrderCreateNestedOneWithoutDeliveriesInput = {
    create?: XOR<SalesOrderCreateWithoutDeliveriesInput, SalesOrderUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: SalesOrderCreateOrConnectWithoutDeliveriesInput
    connect?: SalesOrderWhereUniqueInput
  }

  export type CustomerUpdateOneRequiredWithoutDeliveriesNestedInput = {
    create?: XOR<CustomerCreateWithoutDeliveriesInput, CustomerUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutDeliveriesInput
    upsert?: CustomerUpsertWithoutDeliveriesInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutDeliveriesInput, CustomerUpdateWithoutDeliveriesInput>, CustomerUncheckedUpdateWithoutDeliveriesInput>
  }

  export type SalesOrderUpdateOneWithoutDeliveriesNestedInput = {
    create?: XOR<SalesOrderCreateWithoutDeliveriesInput, SalesOrderUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: SalesOrderCreateOrConnectWithoutDeliveriesInput
    upsert?: SalesOrderUpsertWithoutDeliveriesInput
    disconnect?: SalesOrderWhereInput | boolean
    delete?: SalesOrderWhereInput | boolean
    connect?: SalesOrderWhereUniqueInput
    update?: XOR<XOR<SalesOrderUpdateToOneWithWhereWithoutDeliveriesInput, SalesOrderUpdateWithoutDeliveriesInput>, SalesOrderUncheckedUpdateWithoutDeliveriesInput>
  }

  export type CustomerCreateNestedOneWithoutReconciliationsInput = {
    create?: XOR<CustomerCreateWithoutReconciliationsInput, CustomerUncheckedCreateWithoutReconciliationsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutReconciliationsInput
    connect?: CustomerWhereUniqueInput
  }

  export type ReconciliationLineCreateNestedManyWithoutReconciliationInput = {
    create?: XOR<ReconciliationLineCreateWithoutReconciliationInput, ReconciliationLineUncheckedCreateWithoutReconciliationInput> | ReconciliationLineCreateWithoutReconciliationInput[] | ReconciliationLineUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: ReconciliationLineCreateOrConnectWithoutReconciliationInput | ReconciliationLineCreateOrConnectWithoutReconciliationInput[]
    createMany?: ReconciliationLineCreateManyReconciliationInputEnvelope
    connect?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
  }

  export type ReconciliationLineUncheckedCreateNestedManyWithoutReconciliationInput = {
    create?: XOR<ReconciliationLineCreateWithoutReconciliationInput, ReconciliationLineUncheckedCreateWithoutReconciliationInput> | ReconciliationLineCreateWithoutReconciliationInput[] | ReconciliationLineUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: ReconciliationLineCreateOrConnectWithoutReconciliationInput | ReconciliationLineCreateOrConnectWithoutReconciliationInput[]
    createMany?: ReconciliationLineCreateManyReconciliationInputEnvelope
    connect?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
  }

  export type CustomerUpdateOneRequiredWithoutReconciliationsNestedInput = {
    create?: XOR<CustomerCreateWithoutReconciliationsInput, CustomerUncheckedCreateWithoutReconciliationsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutReconciliationsInput
    upsert?: CustomerUpsertWithoutReconciliationsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutReconciliationsInput, CustomerUpdateWithoutReconciliationsInput>, CustomerUncheckedUpdateWithoutReconciliationsInput>
  }

  export type ReconciliationLineUpdateManyWithoutReconciliationNestedInput = {
    create?: XOR<ReconciliationLineCreateWithoutReconciliationInput, ReconciliationLineUncheckedCreateWithoutReconciliationInput> | ReconciliationLineCreateWithoutReconciliationInput[] | ReconciliationLineUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: ReconciliationLineCreateOrConnectWithoutReconciliationInput | ReconciliationLineCreateOrConnectWithoutReconciliationInput[]
    upsert?: ReconciliationLineUpsertWithWhereUniqueWithoutReconciliationInput | ReconciliationLineUpsertWithWhereUniqueWithoutReconciliationInput[]
    createMany?: ReconciliationLineCreateManyReconciliationInputEnvelope
    set?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    disconnect?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    delete?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    connect?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    update?: ReconciliationLineUpdateWithWhereUniqueWithoutReconciliationInput | ReconciliationLineUpdateWithWhereUniqueWithoutReconciliationInput[]
    updateMany?: ReconciliationLineUpdateManyWithWhereWithoutReconciliationInput | ReconciliationLineUpdateManyWithWhereWithoutReconciliationInput[]
    deleteMany?: ReconciliationLineScalarWhereInput | ReconciliationLineScalarWhereInput[]
  }

  export type ReconciliationLineUncheckedUpdateManyWithoutReconciliationNestedInput = {
    create?: XOR<ReconciliationLineCreateWithoutReconciliationInput, ReconciliationLineUncheckedCreateWithoutReconciliationInput> | ReconciliationLineCreateWithoutReconciliationInput[] | ReconciliationLineUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: ReconciliationLineCreateOrConnectWithoutReconciliationInput | ReconciliationLineCreateOrConnectWithoutReconciliationInput[]
    upsert?: ReconciliationLineUpsertWithWhereUniqueWithoutReconciliationInput | ReconciliationLineUpsertWithWhereUniqueWithoutReconciliationInput[]
    createMany?: ReconciliationLineCreateManyReconciliationInputEnvelope
    set?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    disconnect?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    delete?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    connect?: ReconciliationLineWhereUniqueInput | ReconciliationLineWhereUniqueInput[]
    update?: ReconciliationLineUpdateWithWhereUniqueWithoutReconciliationInput | ReconciliationLineUpdateWithWhereUniqueWithoutReconciliationInput[]
    updateMany?: ReconciliationLineUpdateManyWithWhereWithoutReconciliationInput | ReconciliationLineUpdateManyWithWhereWithoutReconciliationInput[]
    deleteMany?: ReconciliationLineScalarWhereInput | ReconciliationLineScalarWhereInput[]
  }

  export type ReconciliationCreateNestedOneWithoutLinesInput = {
    create?: XOR<ReconciliationCreateWithoutLinesInput, ReconciliationUncheckedCreateWithoutLinesInput>
    connectOrCreate?: ReconciliationCreateOrConnectWithoutLinesInput
    connect?: ReconciliationWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ReconciliationUpdateOneRequiredWithoutLinesNestedInput = {
    create?: XOR<ReconciliationCreateWithoutLinesInput, ReconciliationUncheckedCreateWithoutLinesInput>
    connectOrCreate?: ReconciliationCreateOrConnectWithoutLinesInput
    upsert?: ReconciliationUpsertWithoutLinesInput
    connect?: ReconciliationWhereUniqueInput
    update?: XOR<XOR<ReconciliationUpdateToOneWithWhereWithoutLinesInput, ReconciliationUpdateWithoutLinesInput>, ReconciliationUncheckedUpdateWithoutLinesInput>
  }

  export type ProductSkuCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductSkuCreateWithoutProductInput, ProductSkuUncheckedCreateWithoutProductInput> | ProductSkuCreateWithoutProductInput[] | ProductSkuUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSkuCreateOrConnectWithoutProductInput | ProductSkuCreateOrConnectWithoutProductInput[]
    createMany?: ProductSkuCreateManyProductInputEnvelope
    connect?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
  }

  export type CartItemCreateNestedManyWithoutProductInput = {
    create?: XOR<CartItemCreateWithoutProductInput, CartItemUncheckedCreateWithoutProductInput> | CartItemCreateWithoutProductInput[] | CartItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutProductInput | CartItemCreateOrConnectWithoutProductInput[]
    createMany?: CartItemCreateManyProductInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type SalesOrderLineCreateNestedManyWithoutProductInput = {
    create?: XOR<SalesOrderLineCreateWithoutProductInput, SalesOrderLineUncheckedCreateWithoutProductInput> | SalesOrderLineCreateWithoutProductInput[] | SalesOrderLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutProductInput | SalesOrderLineCreateOrConnectWithoutProductInput[]
    createMany?: SalesOrderLineCreateManyProductInputEnvelope
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
  }

  export type ProductSkuUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductSkuCreateWithoutProductInput, ProductSkuUncheckedCreateWithoutProductInput> | ProductSkuCreateWithoutProductInput[] | ProductSkuUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSkuCreateOrConnectWithoutProductInput | ProductSkuCreateOrConnectWithoutProductInput[]
    createMany?: ProductSkuCreateManyProductInputEnvelope
    connect?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
  }

  export type CartItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<CartItemCreateWithoutProductInput, CartItemUncheckedCreateWithoutProductInput> | CartItemCreateWithoutProductInput[] | CartItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutProductInput | CartItemCreateOrConnectWithoutProductInput[]
    createMany?: CartItemCreateManyProductInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type SalesOrderLineUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<SalesOrderLineCreateWithoutProductInput, SalesOrderLineUncheckedCreateWithoutProductInput> | SalesOrderLineCreateWithoutProductInput[] | SalesOrderLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutProductInput | SalesOrderLineCreateOrConnectWithoutProductInput[]
    createMany?: SalesOrderLineCreateManyProductInputEnvelope
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
  }

  export type ProductSkuUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductSkuCreateWithoutProductInput, ProductSkuUncheckedCreateWithoutProductInput> | ProductSkuCreateWithoutProductInput[] | ProductSkuUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSkuCreateOrConnectWithoutProductInput | ProductSkuCreateOrConnectWithoutProductInput[]
    upsert?: ProductSkuUpsertWithWhereUniqueWithoutProductInput | ProductSkuUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductSkuCreateManyProductInputEnvelope
    set?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    disconnect?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    delete?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    connect?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    update?: ProductSkuUpdateWithWhereUniqueWithoutProductInput | ProductSkuUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductSkuUpdateManyWithWhereWithoutProductInput | ProductSkuUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductSkuScalarWhereInput | ProductSkuScalarWhereInput[]
  }

  export type CartItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<CartItemCreateWithoutProductInput, CartItemUncheckedCreateWithoutProductInput> | CartItemCreateWithoutProductInput[] | CartItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutProductInput | CartItemCreateOrConnectWithoutProductInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutProductInput | CartItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: CartItemCreateManyProductInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutProductInput | CartItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutProductInput | CartItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type SalesOrderLineUpdateManyWithoutProductNestedInput = {
    create?: XOR<SalesOrderLineCreateWithoutProductInput, SalesOrderLineUncheckedCreateWithoutProductInput> | SalesOrderLineCreateWithoutProductInput[] | SalesOrderLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutProductInput | SalesOrderLineCreateOrConnectWithoutProductInput[]
    upsert?: SalesOrderLineUpsertWithWhereUniqueWithoutProductInput | SalesOrderLineUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SalesOrderLineCreateManyProductInputEnvelope
    set?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    disconnect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    delete?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    update?: SalesOrderLineUpdateWithWhereUniqueWithoutProductInput | SalesOrderLineUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SalesOrderLineUpdateManyWithWhereWithoutProductInput | SalesOrderLineUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
  }

  export type ProductSkuUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductSkuCreateWithoutProductInput, ProductSkuUncheckedCreateWithoutProductInput> | ProductSkuCreateWithoutProductInput[] | ProductSkuUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSkuCreateOrConnectWithoutProductInput | ProductSkuCreateOrConnectWithoutProductInput[]
    upsert?: ProductSkuUpsertWithWhereUniqueWithoutProductInput | ProductSkuUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductSkuCreateManyProductInputEnvelope
    set?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    disconnect?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    delete?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    connect?: ProductSkuWhereUniqueInput | ProductSkuWhereUniqueInput[]
    update?: ProductSkuUpdateWithWhereUniqueWithoutProductInput | ProductSkuUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductSkuUpdateManyWithWhereWithoutProductInput | ProductSkuUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductSkuScalarWhereInput | ProductSkuScalarWhereInput[]
  }

  export type CartItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<CartItemCreateWithoutProductInput, CartItemUncheckedCreateWithoutProductInput> | CartItemCreateWithoutProductInput[] | CartItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutProductInput | CartItemCreateOrConnectWithoutProductInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutProductInput | CartItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: CartItemCreateManyProductInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutProductInput | CartItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutProductInput | CartItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type SalesOrderLineUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<SalesOrderLineCreateWithoutProductInput, SalesOrderLineUncheckedCreateWithoutProductInput> | SalesOrderLineCreateWithoutProductInput[] | SalesOrderLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutProductInput | SalesOrderLineCreateOrConnectWithoutProductInput[]
    upsert?: SalesOrderLineUpsertWithWhereUniqueWithoutProductInput | SalesOrderLineUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SalesOrderLineCreateManyProductInputEnvelope
    set?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    disconnect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    delete?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    update?: SalesOrderLineUpdateWithWhereUniqueWithoutProductInput | SalesOrderLineUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SalesOrderLineUpdateManyWithWhereWithoutProductInput | SalesOrderLineUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutSkusInput = {
    create?: XOR<ProductCreateWithoutSkusInput, ProductUncheckedCreateWithoutSkusInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSkusInput
    connect?: ProductWhereUniqueInput
  }

  export type CartItemCreateNestedManyWithoutSkuInput = {
    create?: XOR<CartItemCreateWithoutSkuInput, CartItemUncheckedCreateWithoutSkuInput> | CartItemCreateWithoutSkuInput[] | CartItemUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutSkuInput | CartItemCreateOrConnectWithoutSkuInput[]
    createMany?: CartItemCreateManySkuInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type SalesOrderLineCreateNestedManyWithoutSkuInput = {
    create?: XOR<SalesOrderLineCreateWithoutSkuInput, SalesOrderLineUncheckedCreateWithoutSkuInput> | SalesOrderLineCreateWithoutSkuInput[] | SalesOrderLineUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSkuInput | SalesOrderLineCreateOrConnectWithoutSkuInput[]
    createMany?: SalesOrderLineCreateManySkuInputEnvelope
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
  }

  export type CartItemUncheckedCreateNestedManyWithoutSkuInput = {
    create?: XOR<CartItemCreateWithoutSkuInput, CartItemUncheckedCreateWithoutSkuInput> | CartItemCreateWithoutSkuInput[] | CartItemUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutSkuInput | CartItemCreateOrConnectWithoutSkuInput[]
    createMany?: CartItemCreateManySkuInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type SalesOrderLineUncheckedCreateNestedManyWithoutSkuInput = {
    create?: XOR<SalesOrderLineCreateWithoutSkuInput, SalesOrderLineUncheckedCreateWithoutSkuInput> | SalesOrderLineCreateWithoutSkuInput[] | SalesOrderLineUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSkuInput | SalesOrderLineCreateOrConnectWithoutSkuInput[]
    createMany?: SalesOrderLineCreateManySkuInputEnvelope
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
  }

  export type ProductUpdateOneRequiredWithoutSkusNestedInput = {
    create?: XOR<ProductCreateWithoutSkusInput, ProductUncheckedCreateWithoutSkusInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSkusInput
    upsert?: ProductUpsertWithoutSkusInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutSkusInput, ProductUpdateWithoutSkusInput>, ProductUncheckedUpdateWithoutSkusInput>
  }

  export type CartItemUpdateManyWithoutSkuNestedInput = {
    create?: XOR<CartItemCreateWithoutSkuInput, CartItemUncheckedCreateWithoutSkuInput> | CartItemCreateWithoutSkuInput[] | CartItemUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutSkuInput | CartItemCreateOrConnectWithoutSkuInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutSkuInput | CartItemUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: CartItemCreateManySkuInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutSkuInput | CartItemUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutSkuInput | CartItemUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type SalesOrderLineUpdateManyWithoutSkuNestedInput = {
    create?: XOR<SalesOrderLineCreateWithoutSkuInput, SalesOrderLineUncheckedCreateWithoutSkuInput> | SalesOrderLineCreateWithoutSkuInput[] | SalesOrderLineUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSkuInput | SalesOrderLineCreateOrConnectWithoutSkuInput[]
    upsert?: SalesOrderLineUpsertWithWhereUniqueWithoutSkuInput | SalesOrderLineUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: SalesOrderLineCreateManySkuInputEnvelope
    set?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    disconnect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    delete?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    update?: SalesOrderLineUpdateWithWhereUniqueWithoutSkuInput | SalesOrderLineUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: SalesOrderLineUpdateManyWithWhereWithoutSkuInput | SalesOrderLineUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
  }

  export type CartItemUncheckedUpdateManyWithoutSkuNestedInput = {
    create?: XOR<CartItemCreateWithoutSkuInput, CartItemUncheckedCreateWithoutSkuInput> | CartItemCreateWithoutSkuInput[] | CartItemUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutSkuInput | CartItemCreateOrConnectWithoutSkuInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutSkuInput | CartItemUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: CartItemCreateManySkuInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutSkuInput | CartItemUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutSkuInput | CartItemUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type SalesOrderLineUncheckedUpdateManyWithoutSkuNestedInput = {
    create?: XOR<SalesOrderLineCreateWithoutSkuInput, SalesOrderLineUncheckedCreateWithoutSkuInput> | SalesOrderLineCreateWithoutSkuInput[] | SalesOrderLineUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSkuInput | SalesOrderLineCreateOrConnectWithoutSkuInput[]
    upsert?: SalesOrderLineUpsertWithWhereUniqueWithoutSkuInput | SalesOrderLineUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: SalesOrderLineCreateManySkuInputEnvelope
    set?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    disconnect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    delete?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    update?: SalesOrderLineUpdateWithWhereUniqueWithoutSkuInput | SalesOrderLineUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: SalesOrderLineUpdateManyWithWhereWithoutSkuInput | SalesOrderLineUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
  }

  export type CustomerCreateNestedOneWithoutCartInput = {
    create?: XOR<CustomerCreateWithoutCartInput, CustomerUncheckedCreateWithoutCartInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCartInput
    connect?: CustomerWhereUniqueInput
  }

  export type CartItemCreateNestedManyWithoutCartInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type CartItemUncheckedCreateNestedManyWithoutCartInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type CustomerUpdateOneRequiredWithoutCartNestedInput = {
    create?: XOR<CustomerCreateWithoutCartInput, CustomerUncheckedCreateWithoutCartInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCartInput
    upsert?: CustomerUpsertWithoutCartInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutCartInput, CustomerUpdateWithoutCartInput>, CustomerUncheckedUpdateWithoutCartInput>
  }

  export type CartItemUpdateManyWithoutCartNestedInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutCartInput | CartItemUpsertWithWhereUniqueWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutCartInput | CartItemUpdateWithWhereUniqueWithoutCartInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutCartInput | CartItemUpdateManyWithWhereWithoutCartInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type CartItemUncheckedUpdateManyWithoutCartNestedInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutCartInput | CartItemUpsertWithWhereUniqueWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutCartInput | CartItemUpdateWithWhereUniqueWithoutCartInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutCartInput | CartItemUpdateManyWithWhereWithoutCartInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type CartCreateNestedOneWithoutItemsInput = {
    create?: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CartCreateOrConnectWithoutItemsInput
    connect?: CartWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutCartItemsInput = {
    create?: XOR<CustomerCreateWithoutCartItemsInput, CustomerUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCartItemsInput
    connect?: CustomerWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutCartItemsInput = {
    create?: XOR<ProductCreateWithoutCartItemsInput, ProductUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutCartItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductSkuCreateNestedOneWithoutCartItemsInput = {
    create?: XOR<ProductSkuCreateWithoutCartItemsInput, ProductSkuUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: ProductSkuCreateOrConnectWithoutCartItemsInput
    connect?: ProductSkuWhereUniqueInput
  }

  export type CartUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CartCreateOrConnectWithoutItemsInput
    upsert?: CartUpsertWithoutItemsInput
    connect?: CartWhereUniqueInput
    update?: XOR<XOR<CartUpdateToOneWithWhereWithoutItemsInput, CartUpdateWithoutItemsInput>, CartUncheckedUpdateWithoutItemsInput>
  }

  export type CustomerUpdateOneRequiredWithoutCartItemsNestedInput = {
    create?: XOR<CustomerCreateWithoutCartItemsInput, CustomerUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCartItemsInput
    upsert?: CustomerUpsertWithoutCartItemsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutCartItemsInput, CustomerUpdateWithoutCartItemsInput>, CustomerUncheckedUpdateWithoutCartItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutCartItemsNestedInput = {
    create?: XOR<ProductCreateWithoutCartItemsInput, ProductUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutCartItemsInput
    upsert?: ProductUpsertWithoutCartItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutCartItemsInput, ProductUpdateWithoutCartItemsInput>, ProductUncheckedUpdateWithoutCartItemsInput>
  }

  export type ProductSkuUpdateOneRequiredWithoutCartItemsNestedInput = {
    create?: XOR<ProductSkuCreateWithoutCartItemsInput, ProductSkuUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: ProductSkuCreateOrConnectWithoutCartItemsInput
    upsert?: ProductSkuUpsertWithoutCartItemsInput
    connect?: ProductSkuWhereUniqueInput
    update?: XOR<XOR<ProductSkuUpdateToOneWithWhereWithoutCartItemsInput, ProductSkuUpdateWithoutCartItemsInput>, ProductSkuUncheckedUpdateWithoutCartItemsInput>
  }

  export type CustomerCreateNestedOneWithoutSalesOrdersInput = {
    create?: XOR<CustomerCreateWithoutSalesOrdersInput, CustomerUncheckedCreateWithoutSalesOrdersInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutSalesOrdersInput
    connect?: CustomerWhereUniqueInput
  }

  export type SalesOrderLineCreateNestedManyWithoutSalesOrderInput = {
    create?: XOR<SalesOrderLineCreateWithoutSalesOrderInput, SalesOrderLineUncheckedCreateWithoutSalesOrderInput> | SalesOrderLineCreateWithoutSalesOrderInput[] | SalesOrderLineUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSalesOrderInput | SalesOrderLineCreateOrConnectWithoutSalesOrderInput[]
    createMany?: SalesOrderLineCreateManySalesOrderInputEnvelope
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
  }

  export type OrderWritebackLogCreateNestedManyWithoutSalesOrderInput = {
    create?: XOR<OrderWritebackLogCreateWithoutSalesOrderInput, OrderWritebackLogUncheckedCreateWithoutSalesOrderInput> | OrderWritebackLogCreateWithoutSalesOrderInput[] | OrderWritebackLogUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: OrderWritebackLogCreateOrConnectWithoutSalesOrderInput | OrderWritebackLogCreateOrConnectWithoutSalesOrderInput[]
    createMany?: OrderWritebackLogCreateManySalesOrderInputEnvelope
    connect?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
  }

  export type DeliveryCreateNestedManyWithoutSalesOrderInput = {
    create?: XOR<DeliveryCreateWithoutSalesOrderInput, DeliveryUncheckedCreateWithoutSalesOrderInput> | DeliveryCreateWithoutSalesOrderInput[] | DeliveryUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutSalesOrderInput | DeliveryCreateOrConnectWithoutSalesOrderInput[]
    createMany?: DeliveryCreateManySalesOrderInputEnvelope
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
  }

  export type SalesOrderLineUncheckedCreateNestedManyWithoutSalesOrderInput = {
    create?: XOR<SalesOrderLineCreateWithoutSalesOrderInput, SalesOrderLineUncheckedCreateWithoutSalesOrderInput> | SalesOrderLineCreateWithoutSalesOrderInput[] | SalesOrderLineUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSalesOrderInput | SalesOrderLineCreateOrConnectWithoutSalesOrderInput[]
    createMany?: SalesOrderLineCreateManySalesOrderInputEnvelope
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
  }

  export type OrderWritebackLogUncheckedCreateNestedManyWithoutSalesOrderInput = {
    create?: XOR<OrderWritebackLogCreateWithoutSalesOrderInput, OrderWritebackLogUncheckedCreateWithoutSalesOrderInput> | OrderWritebackLogCreateWithoutSalesOrderInput[] | OrderWritebackLogUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: OrderWritebackLogCreateOrConnectWithoutSalesOrderInput | OrderWritebackLogCreateOrConnectWithoutSalesOrderInput[]
    createMany?: OrderWritebackLogCreateManySalesOrderInputEnvelope
    connect?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
  }

  export type DeliveryUncheckedCreateNestedManyWithoutSalesOrderInput = {
    create?: XOR<DeliveryCreateWithoutSalesOrderInput, DeliveryUncheckedCreateWithoutSalesOrderInput> | DeliveryCreateWithoutSalesOrderInput[] | DeliveryUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutSalesOrderInput | DeliveryCreateOrConnectWithoutSalesOrderInput[]
    createMany?: DeliveryCreateManySalesOrderInputEnvelope
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
  }

  export type CustomerUpdateOneRequiredWithoutSalesOrdersNestedInput = {
    create?: XOR<CustomerCreateWithoutSalesOrdersInput, CustomerUncheckedCreateWithoutSalesOrdersInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutSalesOrdersInput
    upsert?: CustomerUpsertWithoutSalesOrdersInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutSalesOrdersInput, CustomerUpdateWithoutSalesOrdersInput>, CustomerUncheckedUpdateWithoutSalesOrdersInput>
  }

  export type SalesOrderLineUpdateManyWithoutSalesOrderNestedInput = {
    create?: XOR<SalesOrderLineCreateWithoutSalesOrderInput, SalesOrderLineUncheckedCreateWithoutSalesOrderInput> | SalesOrderLineCreateWithoutSalesOrderInput[] | SalesOrderLineUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSalesOrderInput | SalesOrderLineCreateOrConnectWithoutSalesOrderInput[]
    upsert?: SalesOrderLineUpsertWithWhereUniqueWithoutSalesOrderInput | SalesOrderLineUpsertWithWhereUniqueWithoutSalesOrderInput[]
    createMany?: SalesOrderLineCreateManySalesOrderInputEnvelope
    set?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    disconnect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    delete?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    update?: SalesOrderLineUpdateWithWhereUniqueWithoutSalesOrderInput | SalesOrderLineUpdateWithWhereUniqueWithoutSalesOrderInput[]
    updateMany?: SalesOrderLineUpdateManyWithWhereWithoutSalesOrderInput | SalesOrderLineUpdateManyWithWhereWithoutSalesOrderInput[]
    deleteMany?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
  }

  export type OrderWritebackLogUpdateManyWithoutSalesOrderNestedInput = {
    create?: XOR<OrderWritebackLogCreateWithoutSalesOrderInput, OrderWritebackLogUncheckedCreateWithoutSalesOrderInput> | OrderWritebackLogCreateWithoutSalesOrderInput[] | OrderWritebackLogUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: OrderWritebackLogCreateOrConnectWithoutSalesOrderInput | OrderWritebackLogCreateOrConnectWithoutSalesOrderInput[]
    upsert?: OrderWritebackLogUpsertWithWhereUniqueWithoutSalesOrderInput | OrderWritebackLogUpsertWithWhereUniqueWithoutSalesOrderInput[]
    createMany?: OrderWritebackLogCreateManySalesOrderInputEnvelope
    set?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    disconnect?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    delete?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    connect?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    update?: OrderWritebackLogUpdateWithWhereUniqueWithoutSalesOrderInput | OrderWritebackLogUpdateWithWhereUniqueWithoutSalesOrderInput[]
    updateMany?: OrderWritebackLogUpdateManyWithWhereWithoutSalesOrderInput | OrderWritebackLogUpdateManyWithWhereWithoutSalesOrderInput[]
    deleteMany?: OrderWritebackLogScalarWhereInput | OrderWritebackLogScalarWhereInput[]
  }

  export type DeliveryUpdateManyWithoutSalesOrderNestedInput = {
    create?: XOR<DeliveryCreateWithoutSalesOrderInput, DeliveryUncheckedCreateWithoutSalesOrderInput> | DeliveryCreateWithoutSalesOrderInput[] | DeliveryUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutSalesOrderInput | DeliveryCreateOrConnectWithoutSalesOrderInput[]
    upsert?: DeliveryUpsertWithWhereUniqueWithoutSalesOrderInput | DeliveryUpsertWithWhereUniqueWithoutSalesOrderInput[]
    createMany?: DeliveryCreateManySalesOrderInputEnvelope
    set?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    disconnect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    delete?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    update?: DeliveryUpdateWithWhereUniqueWithoutSalesOrderInput | DeliveryUpdateWithWhereUniqueWithoutSalesOrderInput[]
    updateMany?: DeliveryUpdateManyWithWhereWithoutSalesOrderInput | DeliveryUpdateManyWithWhereWithoutSalesOrderInput[]
    deleteMany?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
  }

  export type SalesOrderLineUncheckedUpdateManyWithoutSalesOrderNestedInput = {
    create?: XOR<SalesOrderLineCreateWithoutSalesOrderInput, SalesOrderLineUncheckedCreateWithoutSalesOrderInput> | SalesOrderLineCreateWithoutSalesOrderInput[] | SalesOrderLineUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: SalesOrderLineCreateOrConnectWithoutSalesOrderInput | SalesOrderLineCreateOrConnectWithoutSalesOrderInput[]
    upsert?: SalesOrderLineUpsertWithWhereUniqueWithoutSalesOrderInput | SalesOrderLineUpsertWithWhereUniqueWithoutSalesOrderInput[]
    createMany?: SalesOrderLineCreateManySalesOrderInputEnvelope
    set?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    disconnect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    delete?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    connect?: SalesOrderLineWhereUniqueInput | SalesOrderLineWhereUniqueInput[]
    update?: SalesOrderLineUpdateWithWhereUniqueWithoutSalesOrderInput | SalesOrderLineUpdateWithWhereUniqueWithoutSalesOrderInput[]
    updateMany?: SalesOrderLineUpdateManyWithWhereWithoutSalesOrderInput | SalesOrderLineUpdateManyWithWhereWithoutSalesOrderInput[]
    deleteMany?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
  }

  export type OrderWritebackLogUncheckedUpdateManyWithoutSalesOrderNestedInput = {
    create?: XOR<OrderWritebackLogCreateWithoutSalesOrderInput, OrderWritebackLogUncheckedCreateWithoutSalesOrderInput> | OrderWritebackLogCreateWithoutSalesOrderInput[] | OrderWritebackLogUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: OrderWritebackLogCreateOrConnectWithoutSalesOrderInput | OrderWritebackLogCreateOrConnectWithoutSalesOrderInput[]
    upsert?: OrderWritebackLogUpsertWithWhereUniqueWithoutSalesOrderInput | OrderWritebackLogUpsertWithWhereUniqueWithoutSalesOrderInput[]
    createMany?: OrderWritebackLogCreateManySalesOrderInputEnvelope
    set?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    disconnect?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    delete?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    connect?: OrderWritebackLogWhereUniqueInput | OrderWritebackLogWhereUniqueInput[]
    update?: OrderWritebackLogUpdateWithWhereUniqueWithoutSalesOrderInput | OrderWritebackLogUpdateWithWhereUniqueWithoutSalesOrderInput[]
    updateMany?: OrderWritebackLogUpdateManyWithWhereWithoutSalesOrderInput | OrderWritebackLogUpdateManyWithWhereWithoutSalesOrderInput[]
    deleteMany?: OrderWritebackLogScalarWhereInput | OrderWritebackLogScalarWhereInput[]
  }

  export type DeliveryUncheckedUpdateManyWithoutSalesOrderNestedInput = {
    create?: XOR<DeliveryCreateWithoutSalesOrderInput, DeliveryUncheckedCreateWithoutSalesOrderInput> | DeliveryCreateWithoutSalesOrderInput[] | DeliveryUncheckedCreateWithoutSalesOrderInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutSalesOrderInput | DeliveryCreateOrConnectWithoutSalesOrderInput[]
    upsert?: DeliveryUpsertWithWhereUniqueWithoutSalesOrderInput | DeliveryUpsertWithWhereUniqueWithoutSalesOrderInput[]
    createMany?: DeliveryCreateManySalesOrderInputEnvelope
    set?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    disconnect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    delete?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    update?: DeliveryUpdateWithWhereUniqueWithoutSalesOrderInput | DeliveryUpdateWithWhereUniqueWithoutSalesOrderInput[]
    updateMany?: DeliveryUpdateManyWithWhereWithoutSalesOrderInput | DeliveryUpdateManyWithWhereWithoutSalesOrderInput[]
    deleteMany?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
  }

  export type SalesOrderCreateNestedOneWithoutLinesInput = {
    create?: XOR<SalesOrderCreateWithoutLinesInput, SalesOrderUncheckedCreateWithoutLinesInput>
    connectOrCreate?: SalesOrderCreateOrConnectWithoutLinesInput
    connect?: SalesOrderWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutOrderLinesInput = {
    create?: XOR<ProductCreateWithoutOrderLinesInput, ProductUncheckedCreateWithoutOrderLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutOrderLinesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductSkuCreateNestedOneWithoutOrderLinesInput = {
    create?: XOR<ProductSkuCreateWithoutOrderLinesInput, ProductSkuUncheckedCreateWithoutOrderLinesInput>
    connectOrCreate?: ProductSkuCreateOrConnectWithoutOrderLinesInput
    connect?: ProductSkuWhereUniqueInput
  }

  export type SalesOrderUpdateOneRequiredWithoutLinesNestedInput = {
    create?: XOR<SalesOrderCreateWithoutLinesInput, SalesOrderUncheckedCreateWithoutLinesInput>
    connectOrCreate?: SalesOrderCreateOrConnectWithoutLinesInput
    upsert?: SalesOrderUpsertWithoutLinesInput
    connect?: SalesOrderWhereUniqueInput
    update?: XOR<XOR<SalesOrderUpdateToOneWithWhereWithoutLinesInput, SalesOrderUpdateWithoutLinesInput>, SalesOrderUncheckedUpdateWithoutLinesInput>
  }

  export type ProductUpdateOneRequiredWithoutOrderLinesNestedInput = {
    create?: XOR<ProductCreateWithoutOrderLinesInput, ProductUncheckedCreateWithoutOrderLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutOrderLinesInput
    upsert?: ProductUpsertWithoutOrderLinesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutOrderLinesInput, ProductUpdateWithoutOrderLinesInput>, ProductUncheckedUpdateWithoutOrderLinesInput>
  }

  export type ProductSkuUpdateOneRequiredWithoutOrderLinesNestedInput = {
    create?: XOR<ProductSkuCreateWithoutOrderLinesInput, ProductSkuUncheckedCreateWithoutOrderLinesInput>
    connectOrCreate?: ProductSkuCreateOrConnectWithoutOrderLinesInput
    upsert?: ProductSkuUpsertWithoutOrderLinesInput
    connect?: ProductSkuWhereUniqueInput
    update?: XOR<XOR<ProductSkuUpdateToOneWithWhereWithoutOrderLinesInput, ProductSkuUpdateWithoutOrderLinesInput>, ProductSkuUncheckedUpdateWithoutOrderLinesInput>
  }

  export type SalesOrderCreateNestedOneWithoutWritebackLogsInput = {
    create?: XOR<SalesOrderCreateWithoutWritebackLogsInput, SalesOrderUncheckedCreateWithoutWritebackLogsInput>
    connectOrCreate?: SalesOrderCreateOrConnectWithoutWritebackLogsInput
    connect?: SalesOrderWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SalesOrderUpdateOneRequiredWithoutWritebackLogsNestedInput = {
    create?: XOR<SalesOrderCreateWithoutWritebackLogsInput, SalesOrderUncheckedCreateWithoutWritebackLogsInput>
    connectOrCreate?: SalesOrderCreateOrConnectWithoutWritebackLogsInput
    upsert?: SalesOrderUpsertWithoutWritebackLogsInput
    connect?: SalesOrderWhereUniqueInput
    update?: XOR<XOR<SalesOrderUpdateToOneWithWhereWithoutWritebackLogsInput, SalesOrderUpdateWithoutWritebackLogsInput>, SalesOrderUncheckedUpdateWithoutWritebackLogsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DeliveryCreateWithoutCustomerInput = {
    id?: string
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    salesOrder?: SalesOrderCreateNestedOneWithoutDeliveriesInput
  }

  export type DeliveryUncheckedCreateWithoutCustomerInput = {
    id?: string
    salesOrderId?: string | null
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryCreateOrConnectWithoutCustomerInput = {
    where: DeliveryWhereUniqueInput
    create: XOR<DeliveryCreateWithoutCustomerInput, DeliveryUncheckedCreateWithoutCustomerInput>
  }

  export type DeliveryCreateManyCustomerInputEnvelope = {
    data: DeliveryCreateManyCustomerInput | DeliveryCreateManyCustomerInput[]
  }

  export type ReconciliationCreateWithoutCustomerInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: ReconciliationLineCreateNestedManyWithoutReconciliationInput
  }

  export type ReconciliationUncheckedCreateWithoutCustomerInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: ReconciliationLineUncheckedCreateNestedManyWithoutReconciliationInput
  }

  export type ReconciliationCreateOrConnectWithoutCustomerInput = {
    where: ReconciliationWhereUniqueInput
    create: XOR<ReconciliationCreateWithoutCustomerInput, ReconciliationUncheckedCreateWithoutCustomerInput>
  }

  export type ReconciliationCreateManyCustomerInputEnvelope = {
    data: ReconciliationCreateManyCustomerInput | ReconciliationCreateManyCustomerInput[]
  }

  export type CartCreateWithoutCustomerInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CartItemCreateNestedManyWithoutCartInput
  }

  export type CartUncheckedCreateWithoutCustomerInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CartItemUncheckedCreateNestedManyWithoutCartInput
  }

  export type CartCreateOrConnectWithoutCustomerInput = {
    where: CartWhereUniqueInput
    create: XOR<CartCreateWithoutCustomerInput, CartUncheckedCreateWithoutCustomerInput>
  }

  export type CartItemCreateWithoutCustomerInput = {
    id?: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cart: CartCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutCartItemsInput
    sku: ProductSkuCreateNestedOneWithoutCartItemsInput
  }

  export type CartItemUncheckedCreateWithoutCustomerInput = {
    id?: string
    cartId: string
    productId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateOrConnectWithoutCustomerInput = {
    where: CartItemWhereUniqueInput
    create: XOR<CartItemCreateWithoutCustomerInput, CartItemUncheckedCreateWithoutCustomerInput>
  }

  export type CartItemCreateManyCustomerInputEnvelope = {
    data: CartItemCreateManyCustomerInput | CartItemCreateManyCustomerInput[]
  }

  export type SalesOrderCreateWithoutCustomerInput = {
    id?: string
    orderNo: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: SalesOrderLineCreateNestedManyWithoutSalesOrderInput
    writebackLogs?: OrderWritebackLogCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderUncheckedCreateWithoutCustomerInput = {
    id?: string
    orderNo: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: SalesOrderLineUncheckedCreateNestedManyWithoutSalesOrderInput
    writebackLogs?: OrderWritebackLogUncheckedCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderCreateOrConnectWithoutCustomerInput = {
    where: SalesOrderWhereUniqueInput
    create: XOR<SalesOrderCreateWithoutCustomerInput, SalesOrderUncheckedCreateWithoutCustomerInput>
  }

  export type SalesOrderCreateManyCustomerInputEnvelope = {
    data: SalesOrderCreateManyCustomerInput | SalesOrderCreateManyCustomerInput[]
  }

  export type DeliveryUpsertWithWhereUniqueWithoutCustomerInput = {
    where: DeliveryWhereUniqueInput
    update: XOR<DeliveryUpdateWithoutCustomerInput, DeliveryUncheckedUpdateWithoutCustomerInput>
    create: XOR<DeliveryCreateWithoutCustomerInput, DeliveryUncheckedCreateWithoutCustomerInput>
  }

  export type DeliveryUpdateWithWhereUniqueWithoutCustomerInput = {
    where: DeliveryWhereUniqueInput
    data: XOR<DeliveryUpdateWithoutCustomerInput, DeliveryUncheckedUpdateWithoutCustomerInput>
  }

  export type DeliveryUpdateManyWithWhereWithoutCustomerInput = {
    where: DeliveryScalarWhereInput
    data: XOR<DeliveryUpdateManyMutationInput, DeliveryUncheckedUpdateManyWithoutCustomerInput>
  }

  export type DeliveryScalarWhereInput = {
    AND?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
    OR?: DeliveryScalarWhereInput[]
    NOT?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
    id?: StringFilter<"Delivery"> | string
    customerId?: StringFilter<"Delivery"> | string
    salesOrderId?: StringNullableFilter<"Delivery"> | string | null
    kingdeeBillId?: StringNullableFilter<"Delivery"> | string | null
    kingdeeBillNumber?: StringNullableFilter<"Delivery"> | string | null
    sourceDocNo?: StringNullableFilter<"Delivery"> | string | null
    detailsJson?: StringNullableFilter<"Delivery"> | string | null
    syncedAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    status?: StringFilter<"Delivery"> | string
    signedAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    signedPayloadJson?: StringNullableFilter<"Delivery"> | string | null
    signIdempotencyKey?: StringNullableFilter<"Delivery"> | string | null
    createdAt?: DateTimeFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeFilter<"Delivery"> | Date | string
  }

  export type ReconciliationUpsertWithWhereUniqueWithoutCustomerInput = {
    where: ReconciliationWhereUniqueInput
    update: XOR<ReconciliationUpdateWithoutCustomerInput, ReconciliationUncheckedUpdateWithoutCustomerInput>
    create: XOR<ReconciliationCreateWithoutCustomerInput, ReconciliationUncheckedCreateWithoutCustomerInput>
  }

  export type ReconciliationUpdateWithWhereUniqueWithoutCustomerInput = {
    where: ReconciliationWhereUniqueInput
    data: XOR<ReconciliationUpdateWithoutCustomerInput, ReconciliationUncheckedUpdateWithoutCustomerInput>
  }

  export type ReconciliationUpdateManyWithWhereWithoutCustomerInput = {
    where: ReconciliationScalarWhereInput
    data: XOR<ReconciliationUpdateManyMutationInput, ReconciliationUncheckedUpdateManyWithoutCustomerInput>
  }

  export type ReconciliationScalarWhereInput = {
    AND?: ReconciliationScalarWhereInput | ReconciliationScalarWhereInput[]
    OR?: ReconciliationScalarWhereInput[]
    NOT?: ReconciliationScalarWhereInput | ReconciliationScalarWhereInput[]
    id?: StringFilter<"Reconciliation"> | string
    customerId?: StringFilter<"Reconciliation"> | string
    periodStart?: DateTimeFilter<"Reconciliation"> | Date | string
    periodEnd?: DateTimeFilter<"Reconciliation"> | Date | string
    statementJson?: StringFilter<"Reconciliation"> | string
    status?: StringFilter<"Reconciliation"> | string
    confirmedAt?: DateTimeNullableFilter<"Reconciliation"> | Date | string | null
    confirmRemark?: StringNullableFilter<"Reconciliation"> | string | null
    createdAt?: DateTimeFilter<"Reconciliation"> | Date | string
    updatedAt?: DateTimeFilter<"Reconciliation"> | Date | string
  }

  export type CartUpsertWithoutCustomerInput = {
    update: XOR<CartUpdateWithoutCustomerInput, CartUncheckedUpdateWithoutCustomerInput>
    create: XOR<CartCreateWithoutCustomerInput, CartUncheckedCreateWithoutCustomerInput>
    where?: CartWhereInput
  }

  export type CartUpdateToOneWithWhereWithoutCustomerInput = {
    where?: CartWhereInput
    data: XOR<CartUpdateWithoutCustomerInput, CartUncheckedUpdateWithoutCustomerInput>
  }

  export type CartUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CartItemUpdateManyWithoutCartNestedInput
  }

  export type CartUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CartItemUncheckedUpdateManyWithoutCartNestedInput
  }

  export type CartItemUpsertWithWhereUniqueWithoutCustomerInput = {
    where: CartItemWhereUniqueInput
    update: XOR<CartItemUpdateWithoutCustomerInput, CartItemUncheckedUpdateWithoutCustomerInput>
    create: XOR<CartItemCreateWithoutCustomerInput, CartItemUncheckedCreateWithoutCustomerInput>
  }

  export type CartItemUpdateWithWhereUniqueWithoutCustomerInput = {
    where: CartItemWhereUniqueInput
    data: XOR<CartItemUpdateWithoutCustomerInput, CartItemUncheckedUpdateWithoutCustomerInput>
  }

  export type CartItemUpdateManyWithWhereWithoutCustomerInput = {
    where: CartItemScalarWhereInput
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CartItemScalarWhereInput = {
    AND?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
    OR?: CartItemScalarWhereInput[]
    NOT?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
    id?: StringFilter<"CartItem"> | string
    cartId?: StringFilter<"CartItem"> | string
    customerId?: StringFilter<"CartItem"> | string
    productId?: StringFilter<"CartItem"> | string
    skuId?: StringFilter<"CartItem"> | string
    qty?: IntFilter<"CartItem"> | number
    createdAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
  }

  export type SalesOrderUpsertWithWhereUniqueWithoutCustomerInput = {
    where: SalesOrderWhereUniqueInput
    update: XOR<SalesOrderUpdateWithoutCustomerInput, SalesOrderUncheckedUpdateWithoutCustomerInput>
    create: XOR<SalesOrderCreateWithoutCustomerInput, SalesOrderUncheckedCreateWithoutCustomerInput>
  }

  export type SalesOrderUpdateWithWhereUniqueWithoutCustomerInput = {
    where: SalesOrderWhereUniqueInput
    data: XOR<SalesOrderUpdateWithoutCustomerInput, SalesOrderUncheckedUpdateWithoutCustomerInput>
  }

  export type SalesOrderUpdateManyWithWhereWithoutCustomerInput = {
    where: SalesOrderScalarWhereInput
    data: XOR<SalesOrderUpdateManyMutationInput, SalesOrderUncheckedUpdateManyWithoutCustomerInput>
  }

  export type SalesOrderScalarWhereInput = {
    AND?: SalesOrderScalarWhereInput | SalesOrderScalarWhereInput[]
    OR?: SalesOrderScalarWhereInput[]
    NOT?: SalesOrderScalarWhereInput | SalesOrderScalarWhereInput[]
    id?: StringFilter<"SalesOrder"> | string
    orderNo?: StringFilter<"SalesOrder"> | string
    customerId?: StringFilter<"SalesOrder"> | string
    status?: StringFilter<"SalesOrder"> | string
    settlementMode?: StringFilter<"SalesOrder"> | string
    currency?: StringFilter<"SalesOrder"> | string
    totalAmount?: FloatFilter<"SalesOrder"> | number
    remark?: StringNullableFilter<"SalesOrder"> | string | null
    idempotencyKey?: StringNullableFilter<"SalesOrder"> | string | null
    kingdeeOrderId?: StringNullableFilter<"SalesOrder"> | string | null
    kingdeeOrderNumber?: StringNullableFilter<"SalesOrder"> | string | null
    writebackError?: StringNullableFilter<"SalesOrder"> | string | null
    canceledAt?: DateTimeNullableFilter<"SalesOrder"> | Date | string | null
    createdAt?: DateTimeFilter<"SalesOrder"> | Date | string
    updatedAt?: DateTimeFilter<"SalesOrder"> | Date | string
  }

  export type CustomerCreateWithoutDeliveriesInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reconciliations?: ReconciliationCreateNestedManyWithoutCustomerInput
    cart?: CartCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutDeliveriesInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reconciliations?: ReconciliationUncheckedCreateNestedManyWithoutCustomerInput
    cart?: CartUncheckedCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutDeliveriesInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutDeliveriesInput, CustomerUncheckedCreateWithoutDeliveriesInput>
  }

  export type SalesOrderCreateWithoutDeliveriesInput = {
    id?: string
    orderNo: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutSalesOrdersInput
    lines?: SalesOrderLineCreateNestedManyWithoutSalesOrderInput
    writebackLogs?: OrderWritebackLogCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderUncheckedCreateWithoutDeliveriesInput = {
    id?: string
    orderNo: string
    customerId: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: SalesOrderLineUncheckedCreateNestedManyWithoutSalesOrderInput
    writebackLogs?: OrderWritebackLogUncheckedCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderCreateOrConnectWithoutDeliveriesInput = {
    where: SalesOrderWhereUniqueInput
    create: XOR<SalesOrderCreateWithoutDeliveriesInput, SalesOrderUncheckedCreateWithoutDeliveriesInput>
  }

  export type CustomerUpsertWithoutDeliveriesInput = {
    update: XOR<CustomerUpdateWithoutDeliveriesInput, CustomerUncheckedUpdateWithoutDeliveriesInput>
    create: XOR<CustomerCreateWithoutDeliveriesInput, CustomerUncheckedCreateWithoutDeliveriesInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutDeliveriesInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutDeliveriesInput, CustomerUncheckedUpdateWithoutDeliveriesInput>
  }

  export type CustomerUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliations?: ReconciliationUpdateManyWithoutCustomerNestedInput
    cart?: CartUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliations?: ReconciliationUncheckedUpdateManyWithoutCustomerNestedInput
    cart?: CartUncheckedUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type SalesOrderUpsertWithoutDeliveriesInput = {
    update: XOR<SalesOrderUpdateWithoutDeliveriesInput, SalesOrderUncheckedUpdateWithoutDeliveriesInput>
    create: XOR<SalesOrderCreateWithoutDeliveriesInput, SalesOrderUncheckedCreateWithoutDeliveriesInput>
    where?: SalesOrderWhereInput
  }

  export type SalesOrderUpdateToOneWithWhereWithoutDeliveriesInput = {
    where?: SalesOrderWhereInput
    data: XOR<SalesOrderUpdateWithoutDeliveriesInput, SalesOrderUncheckedUpdateWithoutDeliveriesInput>
  }

  export type SalesOrderUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutSalesOrdersNestedInput
    lines?: SalesOrderLineUpdateManyWithoutSalesOrderNestedInput
    writebackLogs?: OrderWritebackLogUpdateManyWithoutSalesOrderNestedInput
  }

  export type SalesOrderUncheckedUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: SalesOrderLineUncheckedUpdateManyWithoutSalesOrderNestedInput
    writebackLogs?: OrderWritebackLogUncheckedUpdateManyWithoutSalesOrderNestedInput
  }

  export type CustomerCreateWithoutReconciliationsInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryCreateNestedManyWithoutCustomerInput
    cart?: CartCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutReconciliationsInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutCustomerInput
    cart?: CartUncheckedCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutReconciliationsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutReconciliationsInput, CustomerUncheckedCreateWithoutReconciliationsInput>
  }

  export type ReconciliationLineCreateWithoutReconciliationInput = {
    docType: string
    docNo?: string | null
    docDate?: Date | string | null
    amount?: number
    rawJson: string
    createdAt?: Date | string
  }

  export type ReconciliationLineUncheckedCreateWithoutReconciliationInput = {
    id?: number
    docType: string
    docNo?: string | null
    docDate?: Date | string | null
    amount?: number
    rawJson: string
    createdAt?: Date | string
  }

  export type ReconciliationLineCreateOrConnectWithoutReconciliationInput = {
    where: ReconciliationLineWhereUniqueInput
    create: XOR<ReconciliationLineCreateWithoutReconciliationInput, ReconciliationLineUncheckedCreateWithoutReconciliationInput>
  }

  export type ReconciliationLineCreateManyReconciliationInputEnvelope = {
    data: ReconciliationLineCreateManyReconciliationInput | ReconciliationLineCreateManyReconciliationInput[]
  }

  export type CustomerUpsertWithoutReconciliationsInput = {
    update: XOR<CustomerUpdateWithoutReconciliationsInput, CustomerUncheckedUpdateWithoutReconciliationsInput>
    create: XOR<CustomerCreateWithoutReconciliationsInput, CustomerUncheckedCreateWithoutReconciliationsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutReconciliationsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutReconciliationsInput, CustomerUncheckedUpdateWithoutReconciliationsInput>
  }

  export type CustomerUpdateWithoutReconciliationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUpdateManyWithoutCustomerNestedInput
    cart?: CartUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutReconciliationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUncheckedUpdateManyWithoutCustomerNestedInput
    cart?: CartUncheckedUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type ReconciliationLineUpsertWithWhereUniqueWithoutReconciliationInput = {
    where: ReconciliationLineWhereUniqueInput
    update: XOR<ReconciliationLineUpdateWithoutReconciliationInput, ReconciliationLineUncheckedUpdateWithoutReconciliationInput>
    create: XOR<ReconciliationLineCreateWithoutReconciliationInput, ReconciliationLineUncheckedCreateWithoutReconciliationInput>
  }

  export type ReconciliationLineUpdateWithWhereUniqueWithoutReconciliationInput = {
    where: ReconciliationLineWhereUniqueInput
    data: XOR<ReconciliationLineUpdateWithoutReconciliationInput, ReconciliationLineUncheckedUpdateWithoutReconciliationInput>
  }

  export type ReconciliationLineUpdateManyWithWhereWithoutReconciliationInput = {
    where: ReconciliationLineScalarWhereInput
    data: XOR<ReconciliationLineUpdateManyMutationInput, ReconciliationLineUncheckedUpdateManyWithoutReconciliationInput>
  }

  export type ReconciliationLineScalarWhereInput = {
    AND?: ReconciliationLineScalarWhereInput | ReconciliationLineScalarWhereInput[]
    OR?: ReconciliationLineScalarWhereInput[]
    NOT?: ReconciliationLineScalarWhereInput | ReconciliationLineScalarWhereInput[]
    id?: IntFilter<"ReconciliationLine"> | number
    reconciliationId?: StringFilter<"ReconciliationLine"> | string
    docType?: StringFilter<"ReconciliationLine"> | string
    docNo?: StringNullableFilter<"ReconciliationLine"> | string | null
    docDate?: DateTimeNullableFilter<"ReconciliationLine"> | Date | string | null
    amount?: FloatFilter<"ReconciliationLine"> | number
    rawJson?: StringFilter<"ReconciliationLine"> | string
    createdAt?: DateTimeFilter<"ReconciliationLine"> | Date | string
  }

  export type ReconciliationCreateWithoutLinesInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutReconciliationsInput
  }

  export type ReconciliationUncheckedCreateWithoutLinesInput = {
    id?: string
    customerId: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReconciliationCreateOrConnectWithoutLinesInput = {
    where: ReconciliationWhereUniqueInput
    create: XOR<ReconciliationCreateWithoutLinesInput, ReconciliationUncheckedCreateWithoutLinesInput>
  }

  export type ReconciliationUpsertWithoutLinesInput = {
    update: XOR<ReconciliationUpdateWithoutLinesInput, ReconciliationUncheckedUpdateWithoutLinesInput>
    create: XOR<ReconciliationCreateWithoutLinesInput, ReconciliationUncheckedCreateWithoutLinesInput>
    where?: ReconciliationWhereInput
  }

  export type ReconciliationUpdateToOneWithWhereWithoutLinesInput = {
    where?: ReconciliationWhereInput
    data: XOR<ReconciliationUpdateWithoutLinesInput, ReconciliationUncheckedUpdateWithoutLinesInput>
  }

  export type ReconciliationUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutReconciliationsNestedInput
  }

  export type ReconciliationUncheckedUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductSkuCreateWithoutProductInput = {
    id?: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemCreateNestedManyWithoutSkuInput
    orderLines?: SalesOrderLineCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuUncheckedCreateWithoutProductInput = {
    id?: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutSkuInput
    orderLines?: SalesOrderLineUncheckedCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuCreateOrConnectWithoutProductInput = {
    where: ProductSkuWhereUniqueInput
    create: XOR<ProductSkuCreateWithoutProductInput, ProductSkuUncheckedCreateWithoutProductInput>
  }

  export type ProductSkuCreateManyProductInputEnvelope = {
    data: ProductSkuCreateManyProductInput | ProductSkuCreateManyProductInput[]
  }

  export type CartItemCreateWithoutProductInput = {
    id?: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cart: CartCreateNestedOneWithoutItemsInput
    customer: CustomerCreateNestedOneWithoutCartItemsInput
    sku: ProductSkuCreateNestedOneWithoutCartItemsInput
  }

  export type CartItemUncheckedCreateWithoutProductInput = {
    id?: string
    cartId: string
    customerId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateOrConnectWithoutProductInput = {
    where: CartItemWhereUniqueInput
    create: XOR<CartItemCreateWithoutProductInput, CartItemUncheckedCreateWithoutProductInput>
  }

  export type CartItemCreateManyProductInputEnvelope = {
    data: CartItemCreateManyProductInput | CartItemCreateManyProductInput[]
  }

  export type SalesOrderLineCreateWithoutProductInput = {
    id?: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
    salesOrder: SalesOrderCreateNestedOneWithoutLinesInput
    sku: ProductSkuCreateNestedOneWithoutOrderLinesInput
  }

  export type SalesOrderLineUncheckedCreateWithoutProductInput = {
    id?: string
    salesOrderId: string
    skuId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type SalesOrderLineCreateOrConnectWithoutProductInput = {
    where: SalesOrderLineWhereUniqueInput
    create: XOR<SalesOrderLineCreateWithoutProductInput, SalesOrderLineUncheckedCreateWithoutProductInput>
  }

  export type SalesOrderLineCreateManyProductInputEnvelope = {
    data: SalesOrderLineCreateManyProductInput | SalesOrderLineCreateManyProductInput[]
  }

  export type ProductSkuUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductSkuWhereUniqueInput
    update: XOR<ProductSkuUpdateWithoutProductInput, ProductSkuUncheckedUpdateWithoutProductInput>
    create: XOR<ProductSkuCreateWithoutProductInput, ProductSkuUncheckedCreateWithoutProductInput>
  }

  export type ProductSkuUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductSkuWhereUniqueInput
    data: XOR<ProductSkuUpdateWithoutProductInput, ProductSkuUncheckedUpdateWithoutProductInput>
  }

  export type ProductSkuUpdateManyWithWhereWithoutProductInput = {
    where: ProductSkuScalarWhereInput
    data: XOR<ProductSkuUpdateManyMutationInput, ProductSkuUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductSkuScalarWhereInput = {
    AND?: ProductSkuScalarWhereInput | ProductSkuScalarWhereInput[]
    OR?: ProductSkuScalarWhereInput[]
    NOT?: ProductSkuScalarWhereInput | ProductSkuScalarWhereInput[]
    id?: StringFilter<"ProductSku"> | string
    productId?: StringFilter<"ProductSku"> | string
    skuCode?: StringFilter<"ProductSku"> | string
    skuName?: StringFilter<"ProductSku"> | string
    specsJson?: StringNullableFilter<"ProductSku"> | string | null
    price?: FloatFilter<"ProductSku"> | number
    stock?: IntFilter<"ProductSku"> | number
    status?: StringFilter<"ProductSku"> | string
    unitId?: StringNullableFilter<"ProductSku"> | string | null
    kingdeeMaterialId?: StringNullableFilter<"ProductSku"> | string | null
    createdAt?: DateTimeFilter<"ProductSku"> | Date | string
    updatedAt?: DateTimeFilter<"ProductSku"> | Date | string
  }

  export type CartItemUpsertWithWhereUniqueWithoutProductInput = {
    where: CartItemWhereUniqueInput
    update: XOR<CartItemUpdateWithoutProductInput, CartItemUncheckedUpdateWithoutProductInput>
    create: XOR<CartItemCreateWithoutProductInput, CartItemUncheckedCreateWithoutProductInput>
  }

  export type CartItemUpdateWithWhereUniqueWithoutProductInput = {
    where: CartItemWhereUniqueInput
    data: XOR<CartItemUpdateWithoutProductInput, CartItemUncheckedUpdateWithoutProductInput>
  }

  export type CartItemUpdateManyWithWhereWithoutProductInput = {
    where: CartItemScalarWhereInput
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyWithoutProductInput>
  }

  export type SalesOrderLineUpsertWithWhereUniqueWithoutProductInput = {
    where: SalesOrderLineWhereUniqueInput
    update: XOR<SalesOrderLineUpdateWithoutProductInput, SalesOrderLineUncheckedUpdateWithoutProductInput>
    create: XOR<SalesOrderLineCreateWithoutProductInput, SalesOrderLineUncheckedCreateWithoutProductInput>
  }

  export type SalesOrderLineUpdateWithWhereUniqueWithoutProductInput = {
    where: SalesOrderLineWhereUniqueInput
    data: XOR<SalesOrderLineUpdateWithoutProductInput, SalesOrderLineUncheckedUpdateWithoutProductInput>
  }

  export type SalesOrderLineUpdateManyWithWhereWithoutProductInput = {
    where: SalesOrderLineScalarWhereInput
    data: XOR<SalesOrderLineUpdateManyMutationInput, SalesOrderLineUncheckedUpdateManyWithoutProductInput>
  }

  export type SalesOrderLineScalarWhereInput = {
    AND?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
    OR?: SalesOrderLineScalarWhereInput[]
    NOT?: SalesOrderLineScalarWhereInput | SalesOrderLineScalarWhereInput[]
    id?: StringFilter<"SalesOrderLine"> | string
    salesOrderId?: StringFilter<"SalesOrderLine"> | string
    productId?: StringFilter<"SalesOrderLine"> | string
    skuId?: StringFilter<"SalesOrderLine"> | string
    productName?: StringFilter<"SalesOrderLine"> | string
    skuName?: StringFilter<"SalesOrderLine"> | string
    skuCode?: StringFilter<"SalesOrderLine"> | string
    qty?: IntFilter<"SalesOrderLine"> | number
    unitPrice?: FloatFilter<"SalesOrderLine"> | number
    lineAmount?: FloatFilter<"SalesOrderLine"> | number
    rawJson?: StringNullableFilter<"SalesOrderLine"> | string | null
    createdAt?: DateTimeFilter<"SalesOrderLine"> | Date | string
  }

  export type ProductCreateWithoutSkusInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemCreateNestedManyWithoutProductInput
    orderLines?: SalesOrderLineCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutSkusInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput
    orderLines?: SalesOrderLineUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutSkusInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutSkusInput, ProductUncheckedCreateWithoutSkusInput>
  }

  export type CartItemCreateWithoutSkuInput = {
    id?: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cart: CartCreateNestedOneWithoutItemsInput
    customer: CustomerCreateNestedOneWithoutCartItemsInput
    product: ProductCreateNestedOneWithoutCartItemsInput
  }

  export type CartItemUncheckedCreateWithoutSkuInput = {
    id?: string
    cartId: string
    customerId: string
    productId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateOrConnectWithoutSkuInput = {
    where: CartItemWhereUniqueInput
    create: XOR<CartItemCreateWithoutSkuInput, CartItemUncheckedCreateWithoutSkuInput>
  }

  export type CartItemCreateManySkuInputEnvelope = {
    data: CartItemCreateManySkuInput | CartItemCreateManySkuInput[]
  }

  export type SalesOrderLineCreateWithoutSkuInput = {
    id?: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
    salesOrder: SalesOrderCreateNestedOneWithoutLinesInput
    product: ProductCreateNestedOneWithoutOrderLinesInput
  }

  export type SalesOrderLineUncheckedCreateWithoutSkuInput = {
    id?: string
    salesOrderId: string
    productId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type SalesOrderLineCreateOrConnectWithoutSkuInput = {
    where: SalesOrderLineWhereUniqueInput
    create: XOR<SalesOrderLineCreateWithoutSkuInput, SalesOrderLineUncheckedCreateWithoutSkuInput>
  }

  export type SalesOrderLineCreateManySkuInputEnvelope = {
    data: SalesOrderLineCreateManySkuInput | SalesOrderLineCreateManySkuInput[]
  }

  export type ProductUpsertWithoutSkusInput = {
    update: XOR<ProductUpdateWithoutSkusInput, ProductUncheckedUpdateWithoutSkusInput>
    create: XOR<ProductCreateWithoutSkusInput, ProductUncheckedCreateWithoutSkusInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutSkusInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutSkusInput, ProductUncheckedUpdateWithoutSkusInput>
  }

  export type ProductUpdateWithoutSkusInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUpdateManyWithoutProductNestedInput
    orderLines?: SalesOrderLineUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutSkusInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput
    orderLines?: SalesOrderLineUncheckedUpdateManyWithoutProductNestedInput
  }

  export type CartItemUpsertWithWhereUniqueWithoutSkuInput = {
    where: CartItemWhereUniqueInput
    update: XOR<CartItemUpdateWithoutSkuInput, CartItemUncheckedUpdateWithoutSkuInput>
    create: XOR<CartItemCreateWithoutSkuInput, CartItemUncheckedCreateWithoutSkuInput>
  }

  export type CartItemUpdateWithWhereUniqueWithoutSkuInput = {
    where: CartItemWhereUniqueInput
    data: XOR<CartItemUpdateWithoutSkuInput, CartItemUncheckedUpdateWithoutSkuInput>
  }

  export type CartItemUpdateManyWithWhereWithoutSkuInput = {
    where: CartItemScalarWhereInput
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyWithoutSkuInput>
  }

  export type SalesOrderLineUpsertWithWhereUniqueWithoutSkuInput = {
    where: SalesOrderLineWhereUniqueInput
    update: XOR<SalesOrderLineUpdateWithoutSkuInput, SalesOrderLineUncheckedUpdateWithoutSkuInput>
    create: XOR<SalesOrderLineCreateWithoutSkuInput, SalesOrderLineUncheckedCreateWithoutSkuInput>
  }

  export type SalesOrderLineUpdateWithWhereUniqueWithoutSkuInput = {
    where: SalesOrderLineWhereUniqueInput
    data: XOR<SalesOrderLineUpdateWithoutSkuInput, SalesOrderLineUncheckedUpdateWithoutSkuInput>
  }

  export type SalesOrderLineUpdateManyWithWhereWithoutSkuInput = {
    where: SalesOrderLineScalarWhereInput
    data: XOR<SalesOrderLineUpdateManyMutationInput, SalesOrderLineUncheckedUpdateManyWithoutSkuInput>
  }

  export type CustomerCreateWithoutCartInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationCreateNestedManyWithoutCustomerInput
    cartItems?: CartItemCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutCartInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationUncheckedCreateNestedManyWithoutCustomerInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutCustomerInput
    salesOrders?: SalesOrderUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutCartInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutCartInput, CustomerUncheckedCreateWithoutCartInput>
  }

  export type CartItemCreateWithoutCartInput = {
    id?: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutCartItemsInput
    product: ProductCreateNestedOneWithoutCartItemsInput
    sku: ProductSkuCreateNestedOneWithoutCartItemsInput
  }

  export type CartItemUncheckedCreateWithoutCartInput = {
    id?: string
    customerId: string
    productId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateOrConnectWithoutCartInput = {
    where: CartItemWhereUniqueInput
    create: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput>
  }

  export type CartItemCreateManyCartInputEnvelope = {
    data: CartItemCreateManyCartInput | CartItemCreateManyCartInput[]
  }

  export type CustomerUpsertWithoutCartInput = {
    update: XOR<CustomerUpdateWithoutCartInput, CustomerUncheckedUpdateWithoutCartInput>
    create: XOR<CustomerCreateWithoutCartInput, CustomerUncheckedCreateWithoutCartInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutCartInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutCartInput, CustomerUncheckedUpdateWithoutCartInput>
  }

  export type CustomerUpdateWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUpdateManyWithoutCustomerNestedInput
    cartItems?: CartItemUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUncheckedUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUncheckedUpdateManyWithoutCustomerNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutCustomerNestedInput
    salesOrders?: SalesOrderUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CartItemUpsertWithWhereUniqueWithoutCartInput = {
    where: CartItemWhereUniqueInput
    update: XOR<CartItemUpdateWithoutCartInput, CartItemUncheckedUpdateWithoutCartInput>
    create: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput>
  }

  export type CartItemUpdateWithWhereUniqueWithoutCartInput = {
    where: CartItemWhereUniqueInput
    data: XOR<CartItemUpdateWithoutCartInput, CartItemUncheckedUpdateWithoutCartInput>
  }

  export type CartItemUpdateManyWithWhereWithoutCartInput = {
    where: CartItemScalarWhereInput
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyWithoutCartInput>
  }

  export type CartCreateWithoutItemsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutCartInput
  }

  export type CartUncheckedCreateWithoutItemsInput = {
    id?: string
    customerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartCreateOrConnectWithoutItemsInput = {
    where: CartWhereUniqueInput
    create: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
  }

  export type CustomerCreateWithoutCartItemsInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationCreateNestedManyWithoutCustomerInput
    cart?: CartCreateNestedOneWithoutCustomerInput
    salesOrders?: SalesOrderCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutCartItemsInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationUncheckedCreateNestedManyWithoutCustomerInput
    cart?: CartUncheckedCreateNestedOneWithoutCustomerInput
    salesOrders?: SalesOrderUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutCartItemsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutCartItemsInput, CustomerUncheckedCreateWithoutCartItemsInput>
  }

  export type ProductCreateWithoutCartItemsInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skus?: ProductSkuCreateNestedManyWithoutProductInput
    orderLines?: SalesOrderLineCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutCartItemsInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skus?: ProductSkuUncheckedCreateNestedManyWithoutProductInput
    orderLines?: SalesOrderLineUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutCartItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutCartItemsInput, ProductUncheckedCreateWithoutCartItemsInput>
  }

  export type ProductSkuCreateWithoutCartItemsInput = {
    id?: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutSkusInput
    orderLines?: SalesOrderLineCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuUncheckedCreateWithoutCartItemsInput = {
    id?: string
    productId: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    orderLines?: SalesOrderLineUncheckedCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuCreateOrConnectWithoutCartItemsInput = {
    where: ProductSkuWhereUniqueInput
    create: XOR<ProductSkuCreateWithoutCartItemsInput, ProductSkuUncheckedCreateWithoutCartItemsInput>
  }

  export type CartUpsertWithoutItemsInput = {
    update: XOR<CartUpdateWithoutItemsInput, CartUncheckedUpdateWithoutItemsInput>
    create: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
    where?: CartWhereInput
  }

  export type CartUpdateToOneWithWhereWithoutItemsInput = {
    where?: CartWhereInput
    data: XOR<CartUpdateWithoutItemsInput, CartUncheckedUpdateWithoutItemsInput>
  }

  export type CartUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutCartNestedInput
  }

  export type CartUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUpsertWithoutCartItemsInput = {
    update: XOR<CustomerUpdateWithoutCartItemsInput, CustomerUncheckedUpdateWithoutCartItemsInput>
    create: XOR<CustomerCreateWithoutCartItemsInput, CustomerUncheckedCreateWithoutCartItemsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutCartItemsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutCartItemsInput, CustomerUncheckedUpdateWithoutCartItemsInput>
  }

  export type CustomerUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUpdateManyWithoutCustomerNestedInput
    cart?: CartUpdateOneWithoutCustomerNestedInput
    salesOrders?: SalesOrderUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUncheckedUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUncheckedUpdateManyWithoutCustomerNestedInput
    cart?: CartUncheckedUpdateOneWithoutCustomerNestedInput
    salesOrders?: SalesOrderUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type ProductUpsertWithoutCartItemsInput = {
    update: XOR<ProductUpdateWithoutCartItemsInput, ProductUncheckedUpdateWithoutCartItemsInput>
    create: XOR<ProductCreateWithoutCartItemsInput, ProductUncheckedCreateWithoutCartItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutCartItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutCartItemsInput, ProductUncheckedUpdateWithoutCartItemsInput>
  }

  export type ProductUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: ProductSkuUpdateManyWithoutProductNestedInput
    orderLines?: SalesOrderLineUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: ProductSkuUncheckedUpdateManyWithoutProductNestedInput
    orderLines?: SalesOrderLineUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductSkuUpsertWithoutCartItemsInput = {
    update: XOR<ProductSkuUpdateWithoutCartItemsInput, ProductSkuUncheckedUpdateWithoutCartItemsInput>
    create: XOR<ProductSkuCreateWithoutCartItemsInput, ProductSkuUncheckedCreateWithoutCartItemsInput>
    where?: ProductSkuWhereInput
  }

  export type ProductSkuUpdateToOneWithWhereWithoutCartItemsInput = {
    where?: ProductSkuWhereInput
    data: XOR<ProductSkuUpdateWithoutCartItemsInput, ProductSkuUncheckedUpdateWithoutCartItemsInput>
  }

  export type ProductSkuUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutSkusNestedInput
    orderLines?: SalesOrderLineUpdateManyWithoutSkuNestedInput
  }

  export type ProductSkuUncheckedUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderLines?: SalesOrderLineUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type CustomerCreateWithoutSalesOrdersInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationCreateNestedManyWithoutCustomerInput
    cart?: CartCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutSalesOrdersInput = {
    id?: string
    name: string
    phone?: string | null
    kingdeeCustomerId?: string | null
    wechatOpenid?: string | null
    accessToken?: string | null
    tokenExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutCustomerInput
    reconciliations?: ReconciliationUncheckedCreateNestedManyWithoutCustomerInput
    cart?: CartUncheckedCreateNestedOneWithoutCustomerInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutSalesOrdersInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutSalesOrdersInput, CustomerUncheckedCreateWithoutSalesOrdersInput>
  }

  export type SalesOrderLineCreateWithoutSalesOrderInput = {
    id?: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutOrderLinesInput
    sku: ProductSkuCreateNestedOneWithoutOrderLinesInput
  }

  export type SalesOrderLineUncheckedCreateWithoutSalesOrderInput = {
    id?: string
    productId: string
    skuId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type SalesOrderLineCreateOrConnectWithoutSalesOrderInput = {
    where: SalesOrderLineWhereUniqueInput
    create: XOR<SalesOrderLineCreateWithoutSalesOrderInput, SalesOrderLineUncheckedCreateWithoutSalesOrderInput>
  }

  export type SalesOrderLineCreateManySalesOrderInputEnvelope = {
    data: SalesOrderLineCreateManySalesOrderInput | SalesOrderLineCreateManySalesOrderInput[]
  }

  export type OrderWritebackLogCreateWithoutSalesOrderInput = {
    id?: string
    success: boolean
    requestId?: string | null
    traceId?: string | null
    summary?: string | null
    requestJson: string
    responseJson?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type OrderWritebackLogUncheckedCreateWithoutSalesOrderInput = {
    id?: string
    success: boolean
    requestId?: string | null
    traceId?: string | null
    summary?: string | null
    requestJson: string
    responseJson?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type OrderWritebackLogCreateOrConnectWithoutSalesOrderInput = {
    where: OrderWritebackLogWhereUniqueInput
    create: XOR<OrderWritebackLogCreateWithoutSalesOrderInput, OrderWritebackLogUncheckedCreateWithoutSalesOrderInput>
  }

  export type OrderWritebackLogCreateManySalesOrderInputEnvelope = {
    data: OrderWritebackLogCreateManySalesOrderInput | OrderWritebackLogCreateManySalesOrderInput[]
  }

  export type DeliveryCreateWithoutSalesOrderInput = {
    id?: string
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutDeliveriesInput
  }

  export type DeliveryUncheckedCreateWithoutSalesOrderInput = {
    id?: string
    customerId: string
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryCreateOrConnectWithoutSalesOrderInput = {
    where: DeliveryWhereUniqueInput
    create: XOR<DeliveryCreateWithoutSalesOrderInput, DeliveryUncheckedCreateWithoutSalesOrderInput>
  }

  export type DeliveryCreateManySalesOrderInputEnvelope = {
    data: DeliveryCreateManySalesOrderInput | DeliveryCreateManySalesOrderInput[]
  }

  export type CustomerUpsertWithoutSalesOrdersInput = {
    update: XOR<CustomerUpdateWithoutSalesOrdersInput, CustomerUncheckedUpdateWithoutSalesOrdersInput>
    create: XOR<CustomerCreateWithoutSalesOrdersInput, CustomerUncheckedCreateWithoutSalesOrdersInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutSalesOrdersInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutSalesOrdersInput, CustomerUncheckedUpdateWithoutSalesOrdersInput>
  }

  export type CustomerUpdateWithoutSalesOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUpdateManyWithoutCustomerNestedInput
    cart?: CartUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutSalesOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    wechatOpenid?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: DeliveryUncheckedUpdateManyWithoutCustomerNestedInput
    reconciliations?: ReconciliationUncheckedUpdateManyWithoutCustomerNestedInput
    cart?: CartUncheckedUpdateOneWithoutCustomerNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type SalesOrderLineUpsertWithWhereUniqueWithoutSalesOrderInput = {
    where: SalesOrderLineWhereUniqueInput
    update: XOR<SalesOrderLineUpdateWithoutSalesOrderInput, SalesOrderLineUncheckedUpdateWithoutSalesOrderInput>
    create: XOR<SalesOrderLineCreateWithoutSalesOrderInput, SalesOrderLineUncheckedCreateWithoutSalesOrderInput>
  }

  export type SalesOrderLineUpdateWithWhereUniqueWithoutSalesOrderInput = {
    where: SalesOrderLineWhereUniqueInput
    data: XOR<SalesOrderLineUpdateWithoutSalesOrderInput, SalesOrderLineUncheckedUpdateWithoutSalesOrderInput>
  }

  export type SalesOrderLineUpdateManyWithWhereWithoutSalesOrderInput = {
    where: SalesOrderLineScalarWhereInput
    data: XOR<SalesOrderLineUpdateManyMutationInput, SalesOrderLineUncheckedUpdateManyWithoutSalesOrderInput>
  }

  export type OrderWritebackLogUpsertWithWhereUniqueWithoutSalesOrderInput = {
    where: OrderWritebackLogWhereUniqueInput
    update: XOR<OrderWritebackLogUpdateWithoutSalesOrderInput, OrderWritebackLogUncheckedUpdateWithoutSalesOrderInput>
    create: XOR<OrderWritebackLogCreateWithoutSalesOrderInput, OrderWritebackLogUncheckedCreateWithoutSalesOrderInput>
  }

  export type OrderWritebackLogUpdateWithWhereUniqueWithoutSalesOrderInput = {
    where: OrderWritebackLogWhereUniqueInput
    data: XOR<OrderWritebackLogUpdateWithoutSalesOrderInput, OrderWritebackLogUncheckedUpdateWithoutSalesOrderInput>
  }

  export type OrderWritebackLogUpdateManyWithWhereWithoutSalesOrderInput = {
    where: OrderWritebackLogScalarWhereInput
    data: XOR<OrderWritebackLogUpdateManyMutationInput, OrderWritebackLogUncheckedUpdateManyWithoutSalesOrderInput>
  }

  export type OrderWritebackLogScalarWhereInput = {
    AND?: OrderWritebackLogScalarWhereInput | OrderWritebackLogScalarWhereInput[]
    OR?: OrderWritebackLogScalarWhereInput[]
    NOT?: OrderWritebackLogScalarWhereInput | OrderWritebackLogScalarWhereInput[]
    id?: StringFilter<"OrderWritebackLog"> | string
    salesOrderId?: StringFilter<"OrderWritebackLog"> | string
    success?: BoolFilter<"OrderWritebackLog"> | boolean
    requestId?: StringNullableFilter<"OrderWritebackLog"> | string | null
    traceId?: StringNullableFilter<"OrderWritebackLog"> | string | null
    summary?: StringNullableFilter<"OrderWritebackLog"> | string | null
    requestJson?: StringFilter<"OrderWritebackLog"> | string
    responseJson?: StringNullableFilter<"OrderWritebackLog"> | string | null
    errorCode?: StringNullableFilter<"OrderWritebackLog"> | string | null
    errorMessage?: StringNullableFilter<"OrderWritebackLog"> | string | null
    createdAt?: DateTimeFilter<"OrderWritebackLog"> | Date | string
  }

  export type DeliveryUpsertWithWhereUniqueWithoutSalesOrderInput = {
    where: DeliveryWhereUniqueInput
    update: XOR<DeliveryUpdateWithoutSalesOrderInput, DeliveryUncheckedUpdateWithoutSalesOrderInput>
    create: XOR<DeliveryCreateWithoutSalesOrderInput, DeliveryUncheckedCreateWithoutSalesOrderInput>
  }

  export type DeliveryUpdateWithWhereUniqueWithoutSalesOrderInput = {
    where: DeliveryWhereUniqueInput
    data: XOR<DeliveryUpdateWithoutSalesOrderInput, DeliveryUncheckedUpdateWithoutSalesOrderInput>
  }

  export type DeliveryUpdateManyWithWhereWithoutSalesOrderInput = {
    where: DeliveryScalarWhereInput
    data: XOR<DeliveryUpdateManyMutationInput, DeliveryUncheckedUpdateManyWithoutSalesOrderInput>
  }

  export type SalesOrderCreateWithoutLinesInput = {
    id?: string
    orderNo: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutSalesOrdersInput
    writebackLogs?: OrderWritebackLogCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderUncheckedCreateWithoutLinesInput = {
    id?: string
    orderNo: string
    customerId: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    writebackLogs?: OrderWritebackLogUncheckedCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderCreateOrConnectWithoutLinesInput = {
    where: SalesOrderWhereUniqueInput
    create: XOR<SalesOrderCreateWithoutLinesInput, SalesOrderUncheckedCreateWithoutLinesInput>
  }

  export type ProductCreateWithoutOrderLinesInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skus?: ProductSkuCreateNestedManyWithoutProductInput
    cartItems?: CartItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutOrderLinesInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    coverImageUrl?: string | null
    status?: string
    defaultUnitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skus?: ProductSkuUncheckedCreateNestedManyWithoutProductInput
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutOrderLinesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutOrderLinesInput, ProductUncheckedCreateWithoutOrderLinesInput>
  }

  export type ProductSkuCreateWithoutOrderLinesInput = {
    id?: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    product: ProductCreateNestedOneWithoutSkusInput
    cartItems?: CartItemCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuUncheckedCreateWithoutOrderLinesInput = {
    id?: string
    productId: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutSkuInput
  }

  export type ProductSkuCreateOrConnectWithoutOrderLinesInput = {
    where: ProductSkuWhereUniqueInput
    create: XOR<ProductSkuCreateWithoutOrderLinesInput, ProductSkuUncheckedCreateWithoutOrderLinesInput>
  }

  export type SalesOrderUpsertWithoutLinesInput = {
    update: XOR<SalesOrderUpdateWithoutLinesInput, SalesOrderUncheckedUpdateWithoutLinesInput>
    create: XOR<SalesOrderCreateWithoutLinesInput, SalesOrderUncheckedCreateWithoutLinesInput>
    where?: SalesOrderWhereInput
  }

  export type SalesOrderUpdateToOneWithWhereWithoutLinesInput = {
    where?: SalesOrderWhereInput
    data: XOR<SalesOrderUpdateWithoutLinesInput, SalesOrderUncheckedUpdateWithoutLinesInput>
  }

  export type SalesOrderUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutSalesOrdersNestedInput
    writebackLogs?: OrderWritebackLogUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUpdateManyWithoutSalesOrderNestedInput
  }

  export type SalesOrderUncheckedUpdateWithoutLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    writebackLogs?: OrderWritebackLogUncheckedUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutSalesOrderNestedInput
  }

  export type ProductUpsertWithoutOrderLinesInput = {
    update: XOR<ProductUpdateWithoutOrderLinesInput, ProductUncheckedUpdateWithoutOrderLinesInput>
    create: XOR<ProductCreateWithoutOrderLinesInput, ProductUncheckedCreateWithoutOrderLinesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutOrderLinesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutOrderLinesInput, ProductUncheckedUpdateWithoutOrderLinesInput>
  }

  export type ProductUpdateWithoutOrderLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: ProductSkuUpdateManyWithoutProductNestedInput
    cartItems?: CartItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutOrderLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    coverImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    defaultUnitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: ProductSkuUncheckedUpdateManyWithoutProductNestedInput
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductSkuUpsertWithoutOrderLinesInput = {
    update: XOR<ProductSkuUpdateWithoutOrderLinesInput, ProductSkuUncheckedUpdateWithoutOrderLinesInput>
    create: XOR<ProductSkuCreateWithoutOrderLinesInput, ProductSkuUncheckedCreateWithoutOrderLinesInput>
    where?: ProductSkuWhereInput
  }

  export type ProductSkuUpdateToOneWithWhereWithoutOrderLinesInput = {
    where?: ProductSkuWhereInput
    data: XOR<ProductSkuUpdateWithoutOrderLinesInput, ProductSkuUncheckedUpdateWithoutOrderLinesInput>
  }

  export type ProductSkuUpdateWithoutOrderLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutSkusNestedInput
    cartItems?: CartItemUpdateManyWithoutSkuNestedInput
  }

  export type ProductSkuUncheckedUpdateWithoutOrderLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type SalesOrderCreateWithoutWritebackLogsInput = {
    id?: string
    orderNo: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutSalesOrdersInput
    lines?: SalesOrderLineCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderUncheckedCreateWithoutWritebackLogsInput = {
    id?: string
    orderNo: string
    customerId: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lines?: SalesOrderLineUncheckedCreateNestedManyWithoutSalesOrderInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutSalesOrderInput
  }

  export type SalesOrderCreateOrConnectWithoutWritebackLogsInput = {
    where: SalesOrderWhereUniqueInput
    create: XOR<SalesOrderCreateWithoutWritebackLogsInput, SalesOrderUncheckedCreateWithoutWritebackLogsInput>
  }

  export type SalesOrderUpsertWithoutWritebackLogsInput = {
    update: XOR<SalesOrderUpdateWithoutWritebackLogsInput, SalesOrderUncheckedUpdateWithoutWritebackLogsInput>
    create: XOR<SalesOrderCreateWithoutWritebackLogsInput, SalesOrderUncheckedCreateWithoutWritebackLogsInput>
    where?: SalesOrderWhereInput
  }

  export type SalesOrderUpdateToOneWithWhereWithoutWritebackLogsInput = {
    where?: SalesOrderWhereInput
    data: XOR<SalesOrderUpdateWithoutWritebackLogsInput, SalesOrderUncheckedUpdateWithoutWritebackLogsInput>
  }

  export type SalesOrderUpdateWithoutWritebackLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutSalesOrdersNestedInput
    lines?: SalesOrderLineUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUpdateManyWithoutSalesOrderNestedInput
  }

  export type SalesOrderUncheckedUpdateWithoutWritebackLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: SalesOrderLineUncheckedUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutSalesOrderNestedInput
  }

  export type DeliveryCreateManyCustomerInput = {
    id?: string
    salesOrderId?: string | null
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReconciliationCreateManyCustomerInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    statementJson: string
    status?: string
    confirmedAt?: Date | string | null
    confirmRemark?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateManyCustomerInput = {
    id?: string
    cartId: string
    productId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesOrderCreateManyCustomerInput = {
    id?: string
    orderNo: string
    status?: string
    settlementMode?: string
    currency?: string
    totalAmount?: number
    remark?: string | null
    idempotencyKey?: string | null
    kingdeeOrderId?: string | null
    kingdeeOrderNumber?: string | null
    writebackError?: string | null
    canceledAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    salesOrder?: SalesOrderUpdateOneWithoutDeliveriesNestedInput
  }

  export type DeliveryUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: ReconciliationLineUpdateManyWithoutReconciliationNestedInput
  }

  export type ReconciliationUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: ReconciliationLineUncheckedUpdateManyWithoutReconciliationNestedInput
  }

  export type ReconciliationUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    statementJson?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmRemark?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cart?: CartUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutCartItemsNestedInput
    sku?: ProductSkuUpdateOneRequiredWithoutCartItemsNestedInput
  }

  export type CartItemUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: SalesOrderLineUpdateManyWithoutSalesOrderNestedInput
    writebackLogs?: OrderWritebackLogUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUpdateManyWithoutSalesOrderNestedInput
  }

  export type SalesOrderUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: SalesOrderLineUncheckedUpdateManyWithoutSalesOrderNestedInput
    writebackLogs?: OrderWritebackLogUncheckedUpdateManyWithoutSalesOrderNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutSalesOrderNestedInput
  }

  export type SalesOrderUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    settlementMode?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    writebackError?: NullableStringFieldUpdateOperationsInput | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationLineCreateManyReconciliationInput = {
    id?: number
    docType: string
    docNo?: string | null
    docDate?: Date | string | null
    amount?: number
    rawJson: string
    createdAt?: Date | string
  }

  export type ReconciliationLineUpdateWithoutReconciliationInput = {
    docType?: StringFieldUpdateOperationsInput | string
    docNo?: NullableStringFieldUpdateOperationsInput | string | null
    docDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    rawJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationLineUncheckedUpdateWithoutReconciliationInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: StringFieldUpdateOperationsInput | string
    docNo?: NullableStringFieldUpdateOperationsInput | string | null
    docDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    rawJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReconciliationLineUncheckedUpdateManyWithoutReconciliationInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: StringFieldUpdateOperationsInput | string
    docNo?: NullableStringFieldUpdateOperationsInput | string | null
    docDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    rawJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductSkuCreateManyProductInput = {
    id?: string
    skuCode: string
    skuName: string
    specsJson?: string | null
    price: number
    stock?: number
    status?: string
    unitId?: string | null
    kingdeeMaterialId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateManyProductInput = {
    id?: string
    cartId: string
    customerId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesOrderLineCreateManyProductInput = {
    id?: string
    salesOrderId: string
    skuId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type ProductSkuUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUpdateManyWithoutSkuNestedInput
    orderLines?: SalesOrderLineUpdateManyWithoutSkuNestedInput
  }

  export type ProductSkuUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutSkuNestedInput
    orderLines?: SalesOrderLineUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type ProductSkuUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    specsJson?: NullableStringFieldUpdateOperationsInput | string | null
    price?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeMaterialId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cart?: CartUpdateOneRequiredWithoutItemsNestedInput
    customer?: CustomerUpdateOneRequiredWithoutCartItemsNestedInput
    sku?: ProductSkuUpdateOneRequiredWithoutCartItemsNestedInput
  }

  export type CartItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    salesOrder?: SalesOrderUpdateOneRequiredWithoutLinesNestedInput
    sku?: ProductSkuUpdateOneRequiredWithoutOrderLinesNestedInput
  }

  export type SalesOrderLineUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateManySkuInput = {
    id?: string
    cartId: string
    customerId: string
    productId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesOrderLineCreateManySkuInput = {
    id?: string
    salesOrderId: string
    productId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type CartItemUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cart?: CartUpdateOneRequiredWithoutItemsNestedInput
    customer?: CustomerUpdateOneRequiredWithoutCartItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutCartItemsNestedInput
  }

  export type CartItemUncheckedUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    cartId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    salesOrder?: SalesOrderUpdateOneRequiredWithoutLinesNestedInput
    product?: ProductUpdateOneRequiredWithoutOrderLinesNestedInput
  }

  export type SalesOrderLineUncheckedUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineUncheckedUpdateManyWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    salesOrderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateManyCartInput = {
    id?: string
    customerId: string
    productId: string
    skuId: string
    qty: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutCartItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutCartItemsNestedInput
    sku?: ProductSkuUpdateOneRequiredWithoutCartItemsNestedInput
  }

  export type CartItemUncheckedUpdateWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineCreateManySalesOrderInput = {
    id?: string
    productId: string
    skuId: string
    productName: string
    skuName: string
    skuCode: string
    qty: number
    unitPrice: number
    lineAmount: number
    rawJson?: string | null
    createdAt?: Date | string
  }

  export type OrderWritebackLogCreateManySalesOrderInput = {
    id?: string
    success: boolean
    requestId?: string | null
    traceId?: string | null
    summary?: string | null
    requestJson: string
    responseJson?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type DeliveryCreateManySalesOrderInput = {
    id?: string
    customerId: string
    kingdeeBillId?: string | null
    kingdeeBillNumber?: string | null
    sourceDocNo?: string | null
    detailsJson?: string | null
    syncedAt?: Date | string | null
    status?: string
    signedAt?: Date | string | null
    signedPayloadJson?: string | null
    signIdempotencyKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesOrderLineUpdateWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutOrderLinesNestedInput
    sku?: ProductSkuUpdateOneRequiredWithoutOrderLinesNestedInput
  }

  export type SalesOrderLineUncheckedUpdateWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesOrderLineUncheckedUpdateManyWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    skuName?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    qty?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineAmount?: FloatFieldUpdateOperationsInput | number
    rawJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderWritebackLogUpdateWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    traceId?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    requestJson?: StringFieldUpdateOperationsInput | string
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderWritebackLogUncheckedUpdateWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    traceId?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    requestJson?: StringFieldUpdateOperationsInput | string
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderWritebackLogUncheckedUpdateManyWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    traceId?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    requestJson?: StringFieldUpdateOperationsInput | string
    responseJson?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryUpdateWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutDeliveriesNestedInput
  }

  export type DeliveryUncheckedUpdateWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryUncheckedUpdateManyWithoutSalesOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    kingdeeBillId?: NullableStringFieldUpdateOperationsInput | string | null
    kingdeeBillNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sourceDocNo?: NullableStringFieldUpdateOperationsInput | string | null
    detailsJson?: NullableStringFieldUpdateOperationsInput | string | null
    syncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signedPayloadJson?: NullableStringFieldUpdateOperationsInput | string | null
    signIdempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CustomerCountOutputTypeDefaultArgs instead
     */
    export type CustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReconciliationCountOutputTypeDefaultArgs instead
     */
    export type ReconciliationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReconciliationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductCountOutputTypeDefaultArgs instead
     */
    export type ProductCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductSkuCountOutputTypeDefaultArgs instead
     */
    export type ProductSkuCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductSkuCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CartCountOutputTypeDefaultArgs instead
     */
    export type CartCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CartCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SalesOrderCountOutputTypeDefaultArgs instead
     */
    export type SalesOrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SalesOrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use KingdeeTokenDefaultArgs instead
     */
    export type KingdeeTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = KingdeeTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use KingdeeRawDocumentDefaultArgs instead
     */
    export type KingdeeRawDocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = KingdeeRawDocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerDefaultArgs instead
     */
    export type CustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeliveryDefaultArgs instead
     */
    export type DeliveryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeliveryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReconciliationDefaultArgs instead
     */
    export type ReconciliationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReconciliationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReconciliationLineDefaultArgs instead
     */
    export type ReconciliationLineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReconciliationLineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SyncCheckpointDefaultArgs instead
     */
    export type SyncCheckpointArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SyncCheckpointDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductDefaultArgs instead
     */
    export type ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductSkuDefaultArgs instead
     */
    export type ProductSkuArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductSkuDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CartDefaultArgs instead
     */
    export type CartArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CartDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CartItemDefaultArgs instead
     */
    export type CartItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CartItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SalesOrderDefaultArgs instead
     */
    export type SalesOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SalesOrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SalesOrderLineDefaultArgs instead
     */
    export type SalesOrderLineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SalesOrderLineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderWritebackLogDefaultArgs instead
     */
    export type OrderWritebackLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderWritebackLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}