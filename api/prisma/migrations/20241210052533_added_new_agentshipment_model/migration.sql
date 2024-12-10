/*
  Warnings:

  - You are about to drop the column `assignedAgentId` on the `Shipment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_assignedAgentId_fkey`;

-- AlterTable
ALTER TABLE `Shipment` DROP COLUMN `assignedAgentId`;

-- CreateTable
CREATE TABLE `AgentShipment` (
    `id` VARCHAR(191) NOT NULL,
    `orderPlacedAssignedAgentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AgentShipment` ADD CONSTRAINT `AgentShipment_orderPlacedAssignedAgentId_fkey` FOREIGN KEY (`orderPlacedAssignedAgentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
