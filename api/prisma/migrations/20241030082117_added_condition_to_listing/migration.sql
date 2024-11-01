-- AlterTable
ALTER TABLE `Listing` ADD COLUMN `condition` ENUM('NEW', 'USED') NOT NULL DEFAULT 'NEW';
