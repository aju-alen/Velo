-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isoCode` VARCHAR(191) NOT NULL,
    `iso3Code` VARCHAR(191) NOT NULL,
    `callingCode` VARCHAR(191) NOT NULL,
    `capital` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NULL,
    `subregion` VARCHAR(191) NULL,
    `currencyCode` VARCHAR(191) NOT NULL,
    `currencyName` VARCHAR(191) NOT NULL,
    `currencySymbol` VARCHAR(191) NOT NULL,
    `flag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Country_isoCode_key`(`isoCode`),
    UNIQUE INDEX `Country_iso3Code_key`(`iso3Code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
