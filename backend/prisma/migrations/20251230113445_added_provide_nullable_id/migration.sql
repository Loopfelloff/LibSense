-- AlterTable
ALTER TABLE "user" ADD COLUMN     "provider_id" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
