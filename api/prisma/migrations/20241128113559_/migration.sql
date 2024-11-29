/*
  Warnings:

  - You are about to alter the column `paymentAmount` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `paymentCurrency` VARCHAR(191) NULL,
    ADD COLUMN `stripeId` VARCHAR(191) NULL,
    MODIFY `paymentAmount` DOUBLE NOT NULL DEFAULT 0;
