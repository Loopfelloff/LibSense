-- AlterTable
ALTER TABLE "book" ADD COLUMN     "avg_book_rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "book_rating_count" INTEGER NOT NULL DEFAULT 0;
