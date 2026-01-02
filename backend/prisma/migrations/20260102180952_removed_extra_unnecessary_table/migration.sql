/*
  Warnings:

  - You are about to drop the `book_author_name` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `author_first_name` to the `book_author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_last_name` to the `book_author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_middle_name` to the `book_author` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "book_author_name" DROP CONSTRAINT "book_author_name_book_author_id_fkey";

-- AlterTable
ALTER TABLE "book_author" ADD COLUMN     "author_first_name" TEXT NOT NULL,
ADD COLUMN     "author_last_name" TEXT NOT NULL,
ADD COLUMN     "author_middle_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "book_author_name";
