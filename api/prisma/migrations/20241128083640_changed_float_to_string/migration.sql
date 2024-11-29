/*
  Warnings:

  - You are about to alter the column `packageLength` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `packageWidth` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `packageHeight` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `packageWeight` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Shipment` MODIFY `packageLength` VARCHAR(191) NOT NULL,
    MODIFY `packageWidth` VARCHAR(191) NOT NULL,
    MODIFY `packageHeight` VARCHAR(191) NOT NULL,
    MODIFY `packageWeight` VARCHAR(191) NOT NULL;
