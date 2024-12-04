-- DropForeignKey
ALTER TABLE `Listing` DROP FOREIGN KEY `Listing_agentId_fkey`;

-- DropForeignKey
ALTER TABLE `SavedAddress` DROP FOREIGN KEY `SavedAddress_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Listing` ADD CONSTRAINT `Listing_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedAddress` ADD CONSTRAINT `SavedAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
