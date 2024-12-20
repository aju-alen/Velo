/*
  Warnings:

  - Added the required column `assignedOrganisationId` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shipment` ADD COLUMN `assignedOrganisationId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_assignedOrganisationId_fkey` FOREIGN KEY (`assignedOrganisationId`) REFERENCES `Organisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
