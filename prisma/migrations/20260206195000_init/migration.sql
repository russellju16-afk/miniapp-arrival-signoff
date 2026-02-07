CREATE TABLE "DeliverySignoff" (
    "id" TEXT NOT NULL,
    "deliveryNo" TEXT NOT NULL,
    "signer" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT,
    "kingdeeRequestId" TEXT,
    "kingdeeResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliverySignoff_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeliverySignoff_deliveryNo_key" ON "DeliverySignoff"("deliveryNo");
