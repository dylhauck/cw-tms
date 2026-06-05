-- CreateTable
CREATE TABLE "Commodity" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "freightClass" TEXT,
    "nmfc" TEXT,
    "pieceType" "PieceType",
    "weightLbs" DECIMAL(65,30),
    "lengthIn" DECIMAL(65,30),
    "widthIn" DECIMAL(65,30),
    "heightIn" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commodity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commodity" ADD CONSTRAINT "Commodity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
