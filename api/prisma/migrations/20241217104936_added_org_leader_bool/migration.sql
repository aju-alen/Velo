/*
  Warnings:

  - You are about to drop the column `agentId` on the `Organisation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organisationLeaderAgentId]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Organisation` DROP FOREIGN KEY `Organisation_agentId_fkey`;

-- DropIndex
DROP INDEX `Organisation_agentId_key` ON `Organisation`;

-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `organisationLeader` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Organisation` DROP COLUMN `agentId`,
    ADD COLUMN `organisationLeaderAgentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Organisation_organisationLeaderAgentId_key` ON `Organisation`(`organisationLeaderAgentId`);

-- AddForeignKey
ALTER TABLE `Organisation` ADD CONSTRAINT `Organisation_organisationLeaderAgentId_fkey` FOREIGN KEY (`organisationLeaderAgentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
