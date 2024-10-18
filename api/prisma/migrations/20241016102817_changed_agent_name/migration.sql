/*
  Warnings:

  - You are about to drop the column `countryCode` on the `Agent` table. All the data in the column will be lost.
  - Added the required column `mobileCountry` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Agent` DROP COLUMN `countryCode`,
    ADD COLUMN `mobileCountry` VARCHAR(191) NOT NULL;
