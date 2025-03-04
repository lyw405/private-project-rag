import { sql } from 'drizzle-orm';
import { db } from '..';
import { dasCompsEmbeddings } from './schema';
// import { readFileSync } from 'fs';

export interface SimilarContentResult {
  id: string;
  content: string;
  similarity: number;
}

export interface SearchConfig {
  threshold?: number;  // 相似度阈值
  limit?: number;      // 召回数量
  project?: string;     // 项目名称
}

export async function findSimilarContent(
  embedding: number[],
  config?: SearchConfig
): Promise<SimilarContentResult[]> {
  const { threshold = 0.7, limit = 10 } = config || {};
  
  const embeddingStr = `[${embedding.join(',')}]`;
  const similarityExpr = sql<number>`(1 - ('${sql.raw(embeddingStr)}'::vector <=> ${dasCompsEmbeddings.embedding}))::float`;
  const results = await db
    .select({
      id: dasCompsEmbeddings.id,
      content: dasCompsEmbeddings.content,
      similarity: similarityExpr
    })
    .from(dasCompsEmbeddings)
    .where(sql`${similarityExpr} >= ${threshold}`)
    .orderBy(sql`${similarityExpr} DESC`)
    .limit(limit);

  return results.map(row => ({
    id: row.id,
    content: row.content,
    similarity: row.similarity
  }));
}


// const embeddings = readFileSync('./db/embedding_test.json', 'utf-8');
// const embeddingArray = JSON.parse(embeddings);

// findSimilarContent(embeddingArray);