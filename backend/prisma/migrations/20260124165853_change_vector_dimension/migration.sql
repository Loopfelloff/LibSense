-- CreateTable
CREATE TABLE "user_vector" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_vector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_vector_user_id_key" ON "user_vector"("user_id");

-- CreateIndex
CREATE INDEX "user_vector_hnsw_idx" ON "user_vector"("embedding");

-- AddForeignKey
ALTER TABLE "user_vector" ADD CONSTRAINT "user_vector_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
