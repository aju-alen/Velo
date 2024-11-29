/*
  Warnings:

  - You are about to alter the column `packagePieces` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Shipment` MODIFY `packagePieces` INTEGER NOT NULL;
