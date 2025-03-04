import fs from 'fs';
import { env } from '@/lib/env.mjs';
import { createEmbeddings as createEmbeddings_dasComps } from '@/db/dasComps/actions';
import { createEmbeddings as createEmbeddings_aasComps } from '@/db/aasComps/actions';
import { createEmbedding } from './embedding';

console.log('env.EMBEDDING', env.EMBEDDING);

export const createEmbeddingsFromDocs = async () => {
  console.log('读取aasComps文件内容...');
  const docs_aasComps = fs.readFileSync('./ai-docs/aasComps.txt', 'utf8');
  console.log('开始生成aasComps向量化数据');
  const embeddings_aasComps = await createEmbedding(docs_aasComps);
  console.log('开始保存aasComps向量化数据');
  await createEmbeddings_aasComps(embeddings_aasComps);
  console.log('aasComps向量化数据保存成功~~~');

  console.log('读取dasComps文件内容...');
  const docs_dasComps = fs.readFileSync('./ai-docs/dasComps.txt', 'utf8');
  console.log('开始生成dasComps向量化数据');
  const embeddings_dasComps = await createEmbedding(docs_dasComps);
  console.log('开始保存dasComps向量化数据');
  await createEmbeddings_dasComps(embeddings_dasComps);
  console.log('dasComps向量化数据保存成功~~~');


};

createEmbeddingsFromDocs();
