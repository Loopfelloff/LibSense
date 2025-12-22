/*
  Warnings:

  - Added the required column `user_role_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPERADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('READING', 'READ', 'WILLREAD');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_role_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_role" (
    "id" TEXT NOT NULL,
    "role" "Roles" NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "book_title" TEXT NOT NULL,
    "book_cover_image" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_author" (
    "id" TEXT NOT NULL,

    CONSTRAINT "book_author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookWrittenBy" (
    "id" TEXT NOT NULL,
    "book_author_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "BookWrittenBy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_author_name" (
    "id" TEXT NOT NULL,
    "book_author_id" TEXT NOT NULL,
    "author_first_name" TEXT NOT NULL,
    "author_middle_name" TEXT,
    "author_last_name" TEXT NOT NULL,

    CONSTRAINT "book_author_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_status" (
    "id" TEXT NOT NULL,

    CONSTRAINT "book_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookStatusVal" (
    "id" TEXT NOT NULL,
    "book_status_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "BookStatusVal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "BookWrittenBy_book_author_id_book_id_key" ON "BookWrittenBy"("book_author_id", "book_id");

-- CreateIndex
CREATE UNIQUE INDEX "BookStatusVal_book_status_id_user_id_key" ON "BookStatusVal"("book_status_id", "user_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookWrittenBy" ADD CONSTRAINT "BookWrittenBy_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookWrittenBy" ADD CONSTRAINT "BookWrittenBy_book_author_id_fkey" FOREIGN KEY ("book_author_id") REFERENCES "book_author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_author_name" ADD CONSTRAINT "book_author_name_book_author_id_fkey" FOREIGN KEY ("book_author_id") REFERENCES "book_author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStatusVal" ADD CONSTRAINT "BookStatusVal_book_status_id_fkey" FOREIGN KEY ("book_status_id") REFERENCES "book_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStatusVal" ADD CONSTRAINT "BookStatusVal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
