CREATE TABLE "kingdee_raw" (
    "id" UUID NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "biz_type" TEXT NOT NULL,
    "biz_id" TEXT,
    "data" JSONB NOT NULL,
    "hash" TEXT NOT NULL,
    "pulled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kingdee_raw_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "kingdee_raw_tenant_biz_bizid_hash_key" ON "kingdee_raw"("tenant_id", "biz_type", "biz_id", "hash");
CREATE INDEX "kingdee_raw_tenant_biz_bizid_pulled_idx" ON "kingdee_raw"("tenant_id", "biz_type", "biz_id", "pulled_at" DESC);

CREATE TABLE "sync_job" (
    "id" UUID NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "job_name" TEXT NOT NULL,
    "last_success_at" TIMESTAMP(3),
    "last_cursor" JSONB,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_job_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sync_job_tenant_job_name_key" ON "sync_job"("tenant_id", "job_name");
CREATE INDEX "sync_job_tenant_status_idx" ON "sync_job"("tenant_id", "status");
