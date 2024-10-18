/*
  Warnings:

  - You are about to drop the column `subregion` on the `Country` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Country` DROP COLUMN `subregion`,
    ADD COLUMN `subRegion` VARCHAR(191) NULL;
