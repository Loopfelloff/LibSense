/*
  Warnings:

  - You are about to drop the `user_vector` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_vector" DROP CONSTRAINT "user_vector_user_id_fkey";

-- DropTable
DROP TABLE "user_vector";
