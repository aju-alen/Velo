/*
  Warnings:

  - The values [IN_TRANSIT] on the enum `Shipment_shipmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `awsAgentShipmentDroppedUrl` VARCHAR(191) NULL,
    MODIFY `shipmentStatus` ENUM('PAYMENT_PENDING', 'ORDER_IN_MARKET', 'ORDER_PLACED', 'ORDER_CONFIRMED', 'SHIPMENT_PICKED', 'SHIPMENT_DROPPED', 'IN_TRANSIT_START', 'IN_TRANSIT_END', 'OUT_FOR_DELIVERY', 'DELIVERED') NOT NULL;
