/*
  Warnings:

  - You are about to drop the column `street` on the `UserAddress` table. All the data in the column will be lost.
  - Added the required column `addressOne` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressTwo` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserAddress` DROP COLUMN `street`,
    ADD COLUMN `addressOne` VARCHAR(191) NOT NULL,
    ADD COLUMN `addressTwo` VARCHAR(191) NOT NULL;
