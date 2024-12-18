-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `organisationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `Agent_organisationId_fkey` FOREIGN KEY (`organisationId`) REFERENCES `Organisation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
