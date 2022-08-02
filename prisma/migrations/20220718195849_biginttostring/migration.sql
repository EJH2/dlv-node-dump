/*
  Warnings:

  - The primary key for the `BotOwners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DiscordUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BotOwners" DROP CONSTRAINT "BotOwners_botId_fkey";

-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_discordUserId_fkey";

-- AlterTable
ALTER TABLE "BotOwners" DROP CONSTRAINT "BotOwners_pkey",
ALTER COLUMN "botId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BotOwners_pkey" PRIMARY KEY ("userId", "botId");

-- AlterTable
ALTER TABLE "DiscordUser" DROP CONSTRAINT "DiscordUser_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DiscordUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Logs" ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ALTER COLUMN "guild" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "discordUserId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_discordUserId_fkey" FOREIGN KEY ("discordUserId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotOwners" ADD CONSTRAINT "BotOwners_botId_fkey" FOREIGN KEY ("botId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
