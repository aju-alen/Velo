/*
  Warnings:

  - You are about to drop the column `packageDeliveryDate` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `pickupTimeDrom` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `deliveryDate` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupTimeFrom` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shipment` DROP COLUMN `packageDeliveryDate`,
    DROP COLUMN `pickupTimeDrom`,
    ADD COLUMN `deliveryDate` DATETIME(3) NOT NULL,
    ADD COLUMN `pickupTimeFrom` VARCHAR(191) NOT NULL;
