-- AlterTable
ALTER TABLE `Shipment` MODIFY `shipmentStatus` ENUM('PAYMENT_PENDING', 'ORDER_PLACED', 'ORDER_CONFIRMED', 'SHIPMENT_PICKED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED') NOT NULL DEFAULT 'PAYMENT_PENDING';