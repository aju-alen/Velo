-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `customerId` VARCHAR(191) NULL,
    ADD COLUMN `paymentAmount` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `paymentSuccess` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `recieptUrl` VARCHAR(191) NULL;
