/*
  Warnings:

  - You are about to drop the column `countryCode` on the `User` table. All the data in the column will be lost.
  - Added the required column `mobileCountry` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `countryCode`,
    ADD COLUMN `mobileCountry` VARCHAR(191) NOT NULL;
