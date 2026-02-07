CREATE TABLE "kingdee_tenant" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,
    "app_key" TEXT NOT NULL,
    "app_secret" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "app_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kingdee_tenant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "kingdee_tenant_app_key_key" ON "kingdee_tenant"("app_key");
