/*
  Warnings:

  - You are about to drop the column `accountCode` on the `Customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Customer_accountCode_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "accountCode",
ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingCountry" TEXT DEFAULT 'US',
ADD COLUMN     "billingState" TEXT,
ADD COLUMN     "billingZip" TEXT,
ADD COLUMN     "physicalAddress" TEXT,
ADD COLUMN     "physicalCity" TEXT,
ADD COLUMN     "physicalCountry" TEXT DEFAULT 'US',
ADD COLUMN     "physicalState" TEXT,
ADD COLUMN     "physicalZip" TEXT;
