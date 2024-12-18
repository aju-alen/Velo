/*
  Warnings:

  - You are about to drop the column `organisationLeader` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Agent` DROP COLUMN `organisationLeader`,
    ADD COLUMN `isOrganisationLeader` BOOLEAN NOT NULL DEFAULT false;
