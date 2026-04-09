-- CreateTable
CREATE TABLE `orcamentos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NULL,
    `tipoProjeto` VARCHAR(191) NOT NULL,
    `urgencia` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `visualizado` BOOLEAN NOT NULL DEFAULT false,
    `visualizadoEm` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `orcamentos_visualizado_idx`(`visualizado`),
    INDEX `orcamentos_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
