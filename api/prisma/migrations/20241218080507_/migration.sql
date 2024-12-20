-- AlterTable
ALTER TABLE `Organisation` ADD COLUMN `documentPricePerKg` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `packagePricePerKg` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `packagePricePerPiece` DOUBLE NULL DEFAULT 0;
