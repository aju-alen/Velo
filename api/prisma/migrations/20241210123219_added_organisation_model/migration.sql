/*
  Warnings:

  - Added the required column `modeOfWork` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Organisation` ADD COLUMN `modeOfWork` VARCHAR(191) NOT NULL;
