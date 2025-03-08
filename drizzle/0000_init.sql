-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the table
CREATE TABLE IF NOT EXISTS "open_ai_embeddings" (
    "id" varchar(191) PRIMARY KEY,
    "content" text NOT NULL,
    "embedding" vector(1024) NOT NULL
);

-- Create the HNSW index
CREATE INDEX IF NOT EXISTS "openai_embedding_index" ON "open_ai_embeddings" 
USING hnsw ("embedding" vector_cosine_ops); 