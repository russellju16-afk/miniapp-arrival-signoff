CREATE TABLE "customer" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "kingdee_customer_id" TEXT,
    "access_token" TEXT NOT NULL,
    "token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customer_access_token_key" ON "customer"("access_token");
CREATE INDEX "customer_tenant_idx" ON "customer"("tenant_id");
CREATE INDEX "customer_phone_idx" ON "customer"("phone");

CREATE TABLE "delivery" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "kingdee_doc_no" TEXT NOT NULL,
    "kingdee_doc_id" TEXT,
    "ship_date" TIMESTAMP(3),
    "items" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "delivery_tenant_customer_status_idx" ON "delivery"("tenant_id", "customer_id", "status");
CREATE INDEX "delivery_customer_ship_date_idx" ON "delivery"("customer_id", "ship_date" DESC);
CREATE INDEX "delivery_doc_no_idx" ON "delivery"("kingdee_doc_no");

CREATE TABLE "receipt" (
    "id" UUID NOT NULL,
    "delivery_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "signer_name" TEXT NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL,
    "signature_image_url" TEXT NOT NULL,
    "photos" JSONB,
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "receipt_delivery_id_key" ON "receipt"("delivery_id");
CREATE INDEX "receipt_customer_created_idx" ON "receipt"("customer_id", "created_at" DESC);

CREATE TABLE "statement" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "total_amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3),
    "confirm_remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "statement_tenant_customer_period_idx" ON "statement"("tenant_id", "customer_id", "period_start", "period_end");
CREATE INDEX "statement_customer_status_idx" ON "statement"("customer_id", "status");

CREATE TABLE "statement_line" (
    "id" UUID NOT NULL,
    "statement_id" UUID NOT NULL,
    "doc_type" TEXT NOT NULL,
    "doc_no" TEXT NOT NULL,
    "doc_date" TIMESTAMP(3),
    "amount" DECIMAL(18,2) NOT NULL,
    "raw" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "statement_line_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "statement_line_statement_idx" ON "statement_line"("statement_id");
CREATE INDEX "statement_line_doc_idx" ON "statement_line"("doc_type", "doc_no");

ALTER TABLE "customer"
    ADD CONSTRAINT "customer_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "kingdee_tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "delivery"
    ADD CONSTRAINT "delivery_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "kingdee_tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "delivery"
    ADD CONSTRAINT "delivery_customer_id_fkey"
    FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "receipt"
    ADD CONSTRAINT "receipt_delivery_id_fkey"
    FOREIGN KEY ("delivery_id") REFERENCES "delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "receipt"
    ADD CONSTRAINT "receipt_customer_id_fkey"
    FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "statement"
    ADD CONSTRAINT "statement_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "kingdee_tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "statement"
    ADD CONSTRAINT "statement_customer_id_fkey"
    FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "statement_line"
    ADD CONSTRAINT "statement_line_statement_id_fkey"
    FOREIGN KEY ("statement_id") REFERENCES "statement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
