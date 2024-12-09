-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `assignedAgent` VARCHAR(191) NOT NULL DEFAULT 'nil';

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_assignedAgent_fkey` FOREIGN KEY (`assignedAgent`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
