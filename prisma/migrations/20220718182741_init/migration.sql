-- CreateEnum
CREATE TYPE "userRoles" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "logPrivacy" AS ENUM ('public', 'guild', 'mods', 'private');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discordUserId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "apiToken" TEXT NOT NULL,
    "role" "userRoles" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordUser" (
    "id" BIGINT NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatar" TEXT,
    "flags" INTEGER NOT NULL,
    "guilds" JSONB NOT NULL DEFAULT '[]',
    "bot" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DiscordUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotOwners" (
    "userId" INTEGER NOT NULL,
    "botId" BIGINT NOT NULL,

    CONSTRAINT "BotOwners_pkey" PRIMARY KEY ("userId","botId")
);

-- CreateTable
CREATE TABLE "Logs" (
    "uuid" TEXT NOT NULL,
    "ownerId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "content" TEXT NOT NULL,
    "messageCount" INTEGER NOT NULL,
    "messages" JSONB NOT NULL,
    "users" JSONB NOT NULL,
    "privacy" "logPrivacy" NOT NULL DEFAULT 'public',
    "guild" BIGINT,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordUserId_key" ON "User"("discordUserId");

-- CreateIndex
CREATE INDEX "Logs_ownerId_createdAt_idx" ON "Logs"("ownerId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_discordUserId_fkey" FOREIGN KEY ("discordUserId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotOwners" ADD CONSTRAINT "BotOwners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotOwners" ADD CONSTRAINT "BotOwners_botId_fkey" FOREIGN KEY ("botId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "DiscordUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
