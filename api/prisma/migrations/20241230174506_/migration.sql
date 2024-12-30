-- CreateTable
CREATE TABLE `CompletedShipment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `shipmentId` VARCHAR(191) NULL,
    `senderName` VARCHAR(191) NOT NULL,
    `senderAddressOne` VARCHAR(191) NOT NULL,
    `senderAddressTwo` VARCHAR(191) NOT NULL,
    `senderCity` VARCHAR(191) NOT NULL,
    `senderState` VARCHAR(191) NOT NULL,
    `senderEmail` VARCHAR(191) NOT NULL,
    `senderMobileNumber` VARCHAR(191) NOT NULL,
    `shipmentDate` DATETIME(3) NOT NULL,
    `deliveryDate` DATETIME(3) NOT NULL,
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
    `packageLength` VARCHAR(191) NOT NULL,
    `packageWidth` VARCHAR(191) NOT NULL,
    `packageHeight` VARCHAR(191) NOT NULL,
    `packageWeight` VARCHAR(191) NOT NULL,
    `packagePieces` VARCHAR(191) NOT NULL,
    `openMarketPrice` DOUBLE NOT NULL DEFAULT 0,
    `verbalNotificationService` BOOLEAN NOT NULL,
    `adultSignatureService` BOOLEAN NOT NULL,
    `directSignatureService` BOOLEAN NOT NULL,
    `pickupTimeFrom` VARCHAR(191) NOT NULL,
    `pickupTimeTo` VARCHAR(191) NOT NULL,
    `pickupInstructions` VARCHAR(191) NOT NULL,
    `pickupSpecialInstructions` VARCHAR(191) NOT NULL,
    `packageDescription` VARCHAR(191) NOT NULL,
    `paymentSuccess` BOOLEAN NOT NULL DEFAULT false,
    `paymentAmount` DOUBLE NOT NULL DEFAULT 0,
    `customerId` VARCHAR(191) NULL,
    `recieptUrl` VARCHAR(191) NULL,
    `stripeId` VARCHAR(191) NULL,
    `paymentCurrency` VARCHAR(191) NULL,
    `shipmentStatus` ENUM('PAYMENT_PENDING', 'ORDER_IN_MARKET', 'ORDER_PLACED', 'ORDER_CONFIRMED', 'SHIPMENT_PICKED', 'SHIPMENT_DROPPED', 'IN_TRANSIT_START', 'IN_TRANSIT_END', 'OUT_FOR_DELIVERY', 'DELIVERED') NOT NULL,
    `assignedOrganisationId` VARCHAR(191) NULL,
    `shipmentType` ENUM('DOCUMENT', 'PACKAGE') NOT NULL,
    `shippingMarket` ENUM('OPEN_MARKET', 'CLOSED_MARKET') NOT NULL,
    `customPrice` BOOLEAN NOT NULL DEFAULT false,
    `awsAgentShipmentPickedUrl` VARCHAR(191) NULL,
    `awsAgentShipmentDroppedUrl` VARCHAR(191) NULL,
    `awsAgentInTransitStartUrl` VARCHAR(191) NULL,
    `awsAgentInTransitEndUrl` VARCHAR(191) NULL,
    `awsAgentOutForDeliveryUrl` VARCHAR(191) NULL,
    `awsAgentDeliveredUrl` VARCHAR(191) NULL,
    `pickUpAgentId` VARCHAR(191) NULL,
    `imageStatus` ENUM('APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompletedShipment` ADD CONSTRAINT `CompletedShipment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedShipment` ADD CONSTRAINT `CompletedShipment_receiverCountryId_fkey` FOREIGN KEY (`receiverCountryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedShipment` ADD CONSTRAINT `CompletedShipment_assignedOrganisationId_fkey` FOREIGN KEY (`assignedOrganisationId`) REFERENCES `Organisation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedShipment` ADD CONSTRAINT `CompletedShipment_pickUpAgentId_fkey` FOREIGN KEY (`pickUpAgentId`) REFERENCES `Agent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
