/*
  Warnings:

  - You are about to drop the column `carrierCost` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `customerPrice` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `marginAmount` on the `Shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "assignedToId" TEXT;

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "carrierCost",
DROP COLUMN "customerPrice",
DROP COLUMN "marginAmount",
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "buyRate" DECIMAL(65,30),
ADD COLUMN     "margin" DECIMAL(65,30),
ADD COLUMN     "sellRate" DECIMAL(65,30);

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
