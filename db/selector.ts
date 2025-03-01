import { sql } from 'drizzle-orm';
import { db } from '.';

export interface SimilarContentResult {
  id: string;
  content: string;
  similarity: number;
}

export async function findSimilarContent(
  embedding: number[]
): Promise<SimilarContentResult[]> {
  const results = await db.execute(sql`
    SELECT 
      id::text,
      content::text,
      (1 - (${sql.raw(JSON.stringify(embedding))}::vector <=> embedding))::float as similarity
    FROM open_ai_embeddings
    WHERE 1 - (${sql.raw(JSON.stringify(embedding))}::vector <=> embedding) >= 0.5
    ORDER BY similarity DESC
    LIMIT 4
  `);

  return results.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    content: String(row.content),
    similarity: Number(row.similarity),
  }));
}
