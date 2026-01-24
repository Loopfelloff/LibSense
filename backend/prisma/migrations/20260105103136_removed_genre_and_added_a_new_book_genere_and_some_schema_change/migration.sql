/*
  Warnings:

  - You are about to drop the column `preference_id` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the `preferences` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,genre_id]` on the table `UserPreferences` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `genre_id` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPreferences" DROP CONSTRAINT "UserPreferences_preference_id_fkey";

-- DropIndex
DROP INDEX "UserPreferences_user_id_preference_id_key";

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "preference_id",
ADD COLUMN     "genre_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "preferences";

-- DropEnum
DROP TYPE "Genre";

-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL,
    "genre_name" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookGenres" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,

    CONSTRAINT "BookGenres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookGenres_book_id_genre_id_key" ON "BookGenres"("book_id", "genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_user_id_genre_id_key" ON "UserPreferences"("user_id", "genre_id");

-- AddForeignKey
ALTER TABLE "BookGenres" ADD CONSTRAINT "BookGenres_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenres" ADD CONSTRAINT "BookGenres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
