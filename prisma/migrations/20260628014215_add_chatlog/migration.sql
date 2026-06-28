-- CreateTable
CREATE TABLE `ChatLog` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'id',
    `source` VARCHAR(191) NOT NULL DEFAULT 'rule',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ChatLog_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
