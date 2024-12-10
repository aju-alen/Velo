/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AgentShipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AgentShipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AgentShipment` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AgentShipment_userId_key` ON `AgentShipment`(`userId`);

-- AddForeignKey
ALTER TABLE `AgentShipment` ADD CONSTRAINT `AgentShipment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
