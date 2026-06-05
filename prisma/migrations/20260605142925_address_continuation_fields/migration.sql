-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "billingAddress2" TEXT,
ADD COLUMN     "physicalAddress2" TEXT;

-- AlterTable
ALTER TABLE "CustomerLocation" ADD COLUMN     "address2" TEXT;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "destinationAddress2" TEXT,
ADD COLUMN     "originAddress2" TEXT;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "destinationAddress2" TEXT,
ADD COLUMN     "originAddress2" TEXT;
