/*
  Warnings:

  - Added the required column `shipmentType` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `shipmentType` ENUM('DOCUMENT', 'PACKAGE') NOT NULL;
