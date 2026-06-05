-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "miles" INTEGER,
ADD COLUMN     "nmfc" TEXT,
ALTER COLUMN "status" SET DEFAULT 'QUOTED';

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "miles" INTEGER,
ADD COLUMN     "nmfc" TEXT;
