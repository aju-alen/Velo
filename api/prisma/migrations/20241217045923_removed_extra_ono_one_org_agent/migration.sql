/*
  Warnings:

  - You are about to drop the column `worksForOrganisationId` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `organisationLeaderId` on the `Organisation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agentId]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Agent` DROP FOREIGN KEY `Agent_worksForOrganisationId_fkey`;

-- DropForeignKey
ALTER TABLE `Organisation` DROP FOREIGN KEY `Organisation_organisationLeaderId_fkey`;

-- DropIndex
DROP INDEX `Organisation_organisationLeaderId_key` ON `Organisation`;

-- AlterTable
ALTER TABLE `Agent` DROP COLUMN `worksForOrganisationId`;

-- AlterTable
ALTER TABLE `Organisation` DROP COLUMN `organisationLeaderId`,
    ADD COLUMN `agentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Organisation_agentId_key` ON `Organisation`(`agentId`);

-- AddForeignKey
ALTER TABLE `Organisation` ADD CONSTRAINT `Organisation_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
