-- Drop existing table if recreating
DROP TABLE IF EXISTS "book_vector";

-- CreateTable with correct vector dimensions
CREATE TABLE "book_vector" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,  
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "book_vector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_vector_book_id_key" ON "book_vector"("book_id");

-- CreateIndex with HNSW parameters
CREATE INDEX book_vector_hnsw_idx 
ON "book_vector"
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- AddForeignKey
ALTER TABLE "book_vector" ADD CONSTRAINT "book_vector_book_id_fkey" 
FOREIGN KEY ("book_id") REFERENCES "book"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
