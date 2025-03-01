import fs from 'fs';
import { env } from '@/lib/env.mjs';
import { createEmbeddings } from '@/db/actions';
import { createEmbedding } from './embedding';

console.log('env.EMBEDDING', env.EMBEDDING);

export const createEmbeddingsFromDocs = async () => {
  console.log('读取文件内容...');
  const docs = fs.readFileSync('./ai-docs/basic-components.txt', 'utf8');

  console.log('开始生成向量化数据');
  const embeddings = await createEmbedding(docs);

  console.log('开始保存向量化数据');
  await createEmbeddings(embeddings);

  console.log('向量化数据保存成功~~~');
};

createEmbeddingsFromDocs();
