-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `awsAgentDeliveredUrl` VARCHAR(191) NULL,
    ADD COLUMN `awsAgentInTransitEndUrl` VARCHAR(191) NULL,
    ADD COLUMN `awsAgentInTransitStartUrl` VARCHAR(191) NULL,
    ADD COLUMN `awsAgentOutForDeliveryUrl` VARCHAR(191) NULL;
