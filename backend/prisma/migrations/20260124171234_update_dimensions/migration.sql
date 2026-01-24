-- This is an empty migration.

ALTER TABLE "user_vector" DROP CONSTRAINT "user_vector_user_id_fkey";

DROP TABLE IF EXISTS "book_vector";

CREATE TABLE "book_vector" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "embedding" vector(384) NOT NULL,  
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "book_vector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_vector_book_id_key" ON "book_vector"("book_id");

-- CreateIndex with HNSW parameters
CREATE INDEX book_vector_hnsw_idx 
ON "book_vector"
USING hnsw (embedding vector_cosine_ops);

-- AddForeignKey
ALTER TABLE "book_vector" ADD CONSTRAINT "book_vector_book_id_fkey" 
FOREIGN KEY ("book_id") REFERENCES "book"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
-- DropTable
DROP TABLE "user_vector";

CREATE TABLE "user_vector" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "embedding" vector(100) NOT NULL,  
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_vector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_vector_user_id_key" ON "user_vector"("user_id");

-- CreateIndex with HNSW parameters
CREATE INDEX user_vector_hnsw_idx 
ON "user_vector"
USING hnsw (embedding vector_cosine_ops);

-- AddForeignKey
ALTER TABLE "user_vector" ADD CONSTRAINT "user_vector_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "user"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
