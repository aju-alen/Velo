-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `imageStatus` ENUM('APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
    MODIFY `shipmentStatus` ENUM('PAYMENT_PENDING', 'ORDER_IN_MARKET', 'ORDER_PLACED', 'ORDER_CONFIRMED', 'SHIPMENT_PICKED', 'SHIPMENT_DROPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED') NOT NULL;
