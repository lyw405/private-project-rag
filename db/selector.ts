import { sql } from 'drizzle-orm';
import { db } from '.';
import { openAiEmbeddings } from './schema';
// import { readFileSync } from 'fs';

export interface SimilarContentResult {
  id: string;
  content: string;
  similarity: number;
}

export async function findSimilarContent(
  embedding: number[]
): Promise<SimilarContentResult[]> {
  // console.log('embedding', embedding);
  const embeddingStr = `[${embedding.join(',')}]`;
  const similarityExpr = sql<number>`(1 - ('${sql.raw(embeddingStr)}'::vector <=> ${openAiEmbeddings.embedding}))::float`;
  const results = await db
    .select({
      id: openAiEmbeddings.id,
      content: openAiEmbeddings.content,
      similarity: similarityExpr
    })
    .from(openAiEmbeddings)
    .where(sql`${similarityExpr} >= 0.5`)
    .orderBy(sql`${similarityExpr} DESC`)
    .limit(4);

  return results.map(row => ({
    id: row.id,
    content: row.content,
    similarity: row.similarity
  }));
}


// const embeddings = readFileSync('./db/embedding_test.json', 'utf-8');
// const embeddingArray = JSON.parse(embeddings);

// findSimilarContent(embeddingArray);