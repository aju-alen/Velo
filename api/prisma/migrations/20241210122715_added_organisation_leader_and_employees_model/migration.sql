-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `worksForOrganisationId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Organisation` (
    `id` VARCHAR(191) NOT NULL,
    `organisationName` VARCHAR(191) NOT NULL,
    `organisationAddress` VARCHAR(191) NOT NULL,
    `organisationWebsiteUrl` VARCHAR(191) NOT NULL,
    `superAdminApproval` BOOLEAN NOT NULL DEFAULT false,
    `organisationLeaderId` VARCHAR(191) NULL,

    UNIQUE INDEX `Organisation_organisationLeaderId_key`(`organisationLeaderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Organisation` ADD CONSTRAINT `Organisation_organisationLeaderId_fkey` FOREIGN KEY (`organisationLeaderId`) REFERENCES `Agent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `Agent_worksForOrganisationId_fkey` FOREIGN KEY (`worksForOrganisationId`) REFERENCES `Organisation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
