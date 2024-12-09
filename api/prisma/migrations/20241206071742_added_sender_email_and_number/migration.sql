/*
  Warnings:

  - You are about to drop the column `assignedAgent` on the `Shipment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_assignedAgent_fkey`;

-- AlterTable
ALTER TABLE `Shipment` DROP COLUMN `assignedAgent`,
    ADD COLUMN `assignedAgentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_assignedAgentId_fkey` FOREIGN KEY (`assignedAgentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
