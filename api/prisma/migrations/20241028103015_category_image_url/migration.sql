/*
  Warnings:

  - Added the required column `categoryImgUrl` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `categoryImgUrl` VARCHAR(191) NOT NULL;
