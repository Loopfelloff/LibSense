-- CreateTable
CREATE TABLE "testUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "testUser_pkey" PRIMARY KEY ("id")
);
