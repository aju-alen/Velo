/*
  Warnings:

  - You are about to drop the column `comapnyName` on the `SavedAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SavedAddress` DROP COLUMN `comapnyName`,
    ADD COLUMN `companyName` VARCHAR(191) NULL;
