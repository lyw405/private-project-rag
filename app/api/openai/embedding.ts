import OpenAI from 'openai';
import { env } from '@/lib/env.mjs';

const openai = new OpenAI({
  apiKey: env.AI_KEY,
  baseURL: env.AI_BASE_URL,
});

export interface EmbeddingResult {
  content: string;
  embedding: number[];
}

export async function createEmbedding(
  text: string,
  delimiter: string = '-------split line-------'
): Promise<EmbeddingResult[]> {
  try {
    // 分割文本
    const chunks = text
      .split(delimiter)
      .filter(chunk => chunk.trim().length > 0)
      .map(chunk => chunk.trim());

    // 批量处理嵌入
    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const response = await openai.embeddings.create({
          model: env.EMBEDDING,
          input: chunk,
        });

        return {
          content: chunk,
          embedding: response.data[0].embedding,
        };
      })
    );

    return embeddings;
  } catch (error) {
    console.error('Error creating embeddings:', error);
    throw new Error('Failed to create embeddings');
  }
}
