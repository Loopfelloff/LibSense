-- This is an empty migration.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "BookVector" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id TEXT UNIQUE NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_book
    FOREIGN KEY(book_id)
      REFERENCES "book"(id)
      ON DELETE CASCADE
);

-- ANN index for cosine similarity
CREATE INDEX book_vector_hnsw_idx
ON "BookVector"
USING hnsw (embedding vector_cosine_ops);

ALTER TABLE "book"
ADD COLUMN embedding VECTOR(1536);
