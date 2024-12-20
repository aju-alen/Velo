/*
  Warnings:

  - You are about to drop the `AgentShipment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AgentShipment` DROP FOREIGN KEY `AgentShipment_shipmentAcceptedAssignedAgentId_fkey`;

-- DropForeignKey
ALTER TABLE `AgentShipment` DROP FOREIGN KEY `AgentShipment_shipmentDeliveryAgentId_fkey`;

-- DropForeignKey
ALTER TABLE `AgentShipment` DROP FOREIGN KEY `AgentShipment_shipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `AgentShipment` DROP FOREIGN KEY `AgentShipment_shipmentPickedAgentId_fkey`;

-- DropForeignKey
ALTER TABLE `AgentShipment` DROP FOREIGN KEY `AgentShipment_userId_fkey`;

-- DropTable
DROP TABLE `AgentShipment`;
