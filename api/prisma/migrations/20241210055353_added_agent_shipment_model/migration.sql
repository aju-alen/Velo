/*
  Warnings:

  - You are about to drop the column `orderPlacedAssignedAgentId` on the `AgentShipment` table. All the data in the column will be lost.
  - You are about to drop the column `shipmentId` on the `Shipment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shipmentId]` on the table `AgentShipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shipmentId` to the `AgentShipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AgentShipment` DROP FOREIGN KEY `AgentShipment_orderPlacedAssignedAgentId_fkey`;

-- AlterTable
ALTER TABLE `AgentShipment` DROP COLUMN `orderPlacedAssignedAgentId`,
    ADD COLUMN `shipmentAcceptedAssignedAgentId` VARCHAR(191) NULL,
    ADD COLUMN `shipmentDeliveryAgentId` VARCHAR(191) NULL,
    ADD COLUMN `shipmentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `shipmentPickedAgentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Shipment` DROP COLUMN `shipmentId`;

-- CreateIndex
CREATE UNIQUE INDEX `AgentShipment_shipmentId_key` ON `AgentShipment`(`shipmentId`);

-- AddForeignKey
ALTER TABLE `AgentShipment` ADD CONSTRAINT `AgentShipment_shipmentAcceptedAssignedAgentId_fkey` FOREIGN KEY (`shipmentAcceptedAssignedAgentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentShipment` ADD CONSTRAINT `AgentShipment_shipmentPickedAgentId_fkey` FOREIGN KEY (`shipmentPickedAgentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentShipment` ADD CONSTRAINT `AgentShipment_shipmentDeliveryAgentId_fkey` FOREIGN KEY (`shipmentDeliveryAgentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentShipment` ADD CONSTRAINT `AgentShipment_shipmentId_fkey` FOREIGN KEY (`shipmentId`) REFERENCES `Shipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
