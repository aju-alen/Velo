-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `shipmentId` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `shipmentStatus` ENUM('ORDER_PLACED', 'ORDER_CONFIRMED', 'SHIPMENT_PICKED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED') NOT NULL DEFAULT 'ORDER_PLACED';
