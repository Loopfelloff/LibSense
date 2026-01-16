/*
  Warnings:

  - You are about to drop the column `embedding` on the `book` table. All the data in the column will be lost.
  - You are about to drop the `BookVector` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookVector" DROP CONSTRAINT "fk_book";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "embedding";

-- DropTable
DROP TABLE "BookVector";

-- CreateTable
CREATE TABLE "book_vector" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_vector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_vector_book_id_key" ON "book_vector"("book_id");

-- CreateIndex
CREATE INDEX "book_vector_hnsw_idx" ON "book_vector"("embedding");

-- AddForeignKey
ALTER TABLE "book_vector" ADD CONSTRAINT "book_vector_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
