import { db } from './index';
import { openAiEmbeddings } from './schema';
import { nanoid } from 'nanoid';

type EmbeddingInput = {
  embedding: number[];
  content: string;
};

export async function createEmbeddings(embeddings: EmbeddingInput[]) {
  try {
    const embeddingsWithId = embeddings.map((embedding) => ({
      id: nanoid(),
      content: embedding.content,
      embedding: embedding.embedding,
    }));

    await db.insert(openAiEmbeddings).values(embeddingsWithId);
    
    return '数据向量化完成！';
  } catch (error) {
    console.error('Error creating embeddings:', error);
    return '数据向量化失败！';
  }
}
