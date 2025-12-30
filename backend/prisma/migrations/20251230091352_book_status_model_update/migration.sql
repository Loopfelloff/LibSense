/*
  Warnings:

  - You are about to drop the `BookStatusVal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookStatusVal" DROP CONSTRAINT "BookStatusVal_book_status_id_fkey";

-- DropForeignKey
ALTER TABLE "BookStatusVal" DROP CONSTRAINT "BookStatusVal_user_id_fkey";

-- DropTable
DROP TABLE "BookStatusVal";

-- DropTable
DROP TABLE "book_status";

-- CreateTable
CREATE TABLE "book_status_val" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "book_status_val_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_status_val_book_id_user_id_key" ON "book_status_val"("book_id", "user_id");

-- AddForeignKey
ALTER TABLE "book_status_val" ADD CONSTRAINT "book_status_val_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_status_val" ADD CONSTRAINT "book_status_val_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
