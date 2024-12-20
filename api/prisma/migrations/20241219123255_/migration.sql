/*
  Warnings:

  - Added the required column `shippingMarket` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_assignedOrganisationId_fkey`;

-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `shippingMarket` ENUM('OPEN_MARKET', 'CLOSED_MARKET') NOT NULL,
    MODIFY `assignedOrganisationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_assignedOrganisationId_fkey` FOREIGN KEY (`assignedOrganisationId`) REFERENCES `Organisation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
