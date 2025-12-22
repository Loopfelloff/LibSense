/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('FANTASY', 'HIGH_FANTASY', 'LOW_FANTASY', 'SCIENCE_FICTION', 'HORROR', 'THRILLER', 'MYSTERY', 'ROMANCE', 'NONFICTION', 'COMPUTER_SCIENCE', 'ARTIFICIAL_INTELLIGENCE', 'DATA_SCIENCE', 'HISTORY', 'PHILOSOPHY', 'PSYCHOLOGY', 'BUSINESS', 'TRAVEL', 'BIOGRAPHY', 'GRAPHIC_NOVEL', 'MANGA');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "middle_name" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profile_pic_link" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "testUser";

-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PreferencesToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PreferencesToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PreferencesToUser_B_index" ON "_PreferencesToUser"("B");

-- AddForeignKey
ALTER TABLE "_PreferencesToUser" ADD CONSTRAINT "_PreferencesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Preferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreferencesToUser" ADD CONSTRAINT "_PreferencesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
