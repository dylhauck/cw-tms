/*
  Warnings:

  - You are about to drop the column `carrierCost` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `customerPrice` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `marginAmount` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StaffPermissionKey" ADD VALUE 'VIEW_BUY_RATES';
ALTER TYPE "StaffPermissionKey" ADD VALUE 'VIEW_SELL_RATES';
ALTER TYPE "StaffPermissionKey" ADD VALUE 'VIEW_MARGINS';
ALTER TYPE "StaffPermissionKey" ADD VALUE 'VIEW_REPORTS';

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "carrierCost",
DROP COLUMN "customerPrice",
DROP COLUMN "marginAmount",
ADD COLUMN     "buyRate" DECIMAL(65,30),
ADD COLUMN     "margin" DECIMAL(65,30),
ADD COLUMN     "sellRate" DECIMAL(65,30);
