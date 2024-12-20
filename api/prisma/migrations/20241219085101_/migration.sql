-- Remove the foreign key constraint (change the constraint name based on your DB schema)
ALTER TABLE `AgentShipment` DROP FOREIGN KEY `AgentShipment_userId_fkey`;

-- Now, you can safely drop the index
DROP INDEX `AgentShipment_userId_key` ON `AgentShipment`;