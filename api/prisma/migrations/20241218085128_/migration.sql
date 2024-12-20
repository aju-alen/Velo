/*
  Warnings:

  - Made the column `organisationEmployeesCount` on table `Organisation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `documentPricePerKg` on table `Organisation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `packagePricePerKg` on table `Organisation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `packagePricePerPiece` on table `Organisation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Organisation` ADD COLUMN `deliveryTimeline` INTEGER NOT NULL DEFAULT 0,
    MODIFY `organisationEmployeesCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `documentPricePerKg` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `packagePricePerKg` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `packagePricePerPiece` DOUBLE NOT NULL DEFAULT 0;
