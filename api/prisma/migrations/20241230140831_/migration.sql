-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `pickUpAgentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_pickUpAgentId_fkey` FOREIGN KEY (`pickUpAgentId`) REFERENCES `Agent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
