-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `verificationToken` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `verificationToken` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Shipment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `senderName` VARCHAR(191) NOT NULL,
    `senderAddressOne` VARCHAR(191) NOT NULL,
    `senderAddressTwo` VARCHAR(191) NOT NULL,
    `senderCity` VARCHAR(191) NOT NULL,
    `senderState` VARCHAR(191) NOT NULL,
    `shipmentDate` DATETIME(3) NOT NULL,
    `receiverName` VARCHAR(191) NOT NULL,
    `receiverAddressOne` VARCHAR(191) NOT NULL,
    `receiverAddressTwo` VARCHAR(191) NOT NULL,
    `receiverCity` VARCHAR(191) NOT NULL,
    `receiverState` VARCHAR(191) NOT NULL,
    `receiverEmail` VARCHAR(191) NOT NULL,
    `receiverMobileNumber` VARCHAR(191) NOT NULL,
    `receiverCountryId` INTEGER NOT NULL,
    `receiverCountryCode` VARCHAR(191) NOT NULL,
    `receiverResidentAddress` BOOLEAN NOT NULL,
    `receiverZipCode` VARCHAR(191) NOT NULL,
    `packageLength` DOUBLE NOT NULL,
    `packageWidth` DOUBLE NOT NULL,
    `packageHeight` DOUBLE NOT NULL,
    `packageWeight` DOUBLE NOT NULL,
    `packagePieces` INTEGER NOT NULL,
    `verbalNotificationService` BOOLEAN NOT NULL,
    `adultSignatureService` BOOLEAN NOT NULL,
    `directSignatureService` BOOLEAN NOT NULL,
    `pickupTimeDrom` VARCHAR(191) NOT NULL,
    `pickupTimeTo` VARCHAR(191) NOT NULL,
    `pickupInstructions` VARCHAR(191) NOT NULL,
    `pickupSpecialInstructions` VARCHAR(191) NOT NULL,
    `packageDescription` VARCHAR(191) NOT NULL,
    `packageDeliveryDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_receiverCountryId_fkey` FOREIGN KEY (`receiverCountryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
