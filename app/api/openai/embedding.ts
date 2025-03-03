import OpenAI from 'openai';
import { env } from '@/lib/env.mjs';
import { SimilarContentResult, findSimilarContent, SearchConfig } from '@/db/selector';

const open_ai_embeddings = new OpenAI({
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
        const response = await open_ai_embeddings.embeddings.create({
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

// 生成单个的embedding
export async function createSingleEmbedding(text: string): Promise<number[]> {
  const response = await open_ai_embeddings.embeddings.create({
    model: env.EMBEDDING,
    input: text,
    encoding_format: 'float',
  });
  return response.data[0].embedding;
}

// 检索召回
export async function retrieveEmbedding(
  text: string,
  config?: SearchConfig
): Promise<SimilarContentResult[]> {
  try {
    // 生成文本的 embedding
    const embedding = await createSingleEmbedding(text);
    
    // 使用 embedding 进行相似度检索
    const results = await findSimilarContent(embedding, config);
    
    return results;
  } catch (error) {
    console.error('Error searching similar content:', error);
    throw new Error('Failed to search similar content');
  }
}
