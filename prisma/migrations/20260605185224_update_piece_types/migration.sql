-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PieceType" ADD VALUE 'BAGS';
ALTER TYPE "PieceType" ADD VALUE 'BINS';
ALTER TYPE "PieceType" ADD VALUE 'CANS';
ALTER TYPE "PieceType" ADD VALUE 'CARTS';
ALTER TYPE "PieceType" ADD VALUE 'CONTAINERS';
ALTER TYPE "PieceType" ADD VALUE 'GAYLORDS';
ALTER TYPE "PieceType" ADD VALUE 'LOOSE';
ALTER TYPE "PieceType" ADD VALUE 'PACKAGES';
ALTER TYPE "PieceType" ADD VALUE 'PIECES';
ALTER TYPE "PieceType" ADD VALUE 'VEHICLES';
