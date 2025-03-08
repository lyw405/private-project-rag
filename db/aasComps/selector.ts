import { sql } from 'drizzle-orm';
import { db } from '..';
import { aasCompsEmbeddings } from './schema';

export interface SimilarContentResult {
  id: string;
  content: string;
  similarity: number;
}

export interface SearchConfig {
  threshold?: number;  // 相似度阈值
  limit?: number;      // 召回数量
}

export async function findSimilarContent(
  embedding: number[],
  config?: SearchConfig
): Promise<SimilarContentResult[]> {
  const { threshold = 0, limit = 10 } = config || {};
  
  const embeddingStr = `[${embedding.join(',')}]`;
  const similarityExpr = sql<number>`(1 - ('${sql.raw(embeddingStr)}'::vector <=> ${aasCompsEmbeddings.embedding}))::float`;
  const results = await db
    .select({
      id: aasCompsEmbeddings.id,
      content: aasCompsEmbeddings.content,
      similarity: similarityExpr
    })
    .from(aasCompsEmbeddings)
    .where(sql`${similarityExpr} >= ${threshold}`)
    .orderBy(sql`${similarityExpr} DESC`)
    .limit(limit);

  return results.map(row => ({
    id: row.id,
    content: row.content,
    similarity: row.similarity
  }));
}