/*
  Warnings:

  - You are about to drop the column `documentPricePerKg` on the `Organisation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Organisation` DROP COLUMN `documentPricePerKg`,
    ADD COLUMN `documentPricePerPiece` DOUBLE NOT NULL DEFAULT 0;
