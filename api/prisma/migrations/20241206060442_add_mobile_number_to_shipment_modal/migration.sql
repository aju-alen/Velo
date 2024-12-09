/*
  Warnings:

  - Added the required column `senderEmail` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderMobileNumber` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `senderEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderMobileNumber` VARCHAR(191) NOT NULL;
