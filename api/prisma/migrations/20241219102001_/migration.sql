-- AddForeignKey
ALTER TABLE `AgentShipment` ADD CONSTRAINT `AgentShipment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
