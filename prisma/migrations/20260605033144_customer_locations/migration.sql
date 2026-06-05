-- CreateEnum
CREATE TYPE "PieceType" AS ENUM ('BOXES', 'PAILS', 'DRUMS', 'JERRYCANS', 'CARTONS', 'CASES', 'UNITS', 'BUNDLES', 'BASKETS', 'TOTES', 'PALLETS', 'CRATES', 'ROLLS', 'OTHER');

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "pieceType" "PieceType";

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "pieceType" "PieceType";

-- CreateTable
CREATE TABLE "CustomerLocation" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "nickname" TEXT,
    "companyName" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerLocation" ADD CONSTRAINT "CustomerLocation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
