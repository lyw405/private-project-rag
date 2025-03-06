import fs from 'fs';
import path from 'path';
import { createEmbedding } from './embedding';

// 从 ai-docs 目录读取所有 .txt 文件名并去除扩展名
const components = fs.readdirSync('./ai-docs')
  .filter(file => file.endsWith('.txt'))
  .map(file => path.parse(file).name);

async function initializeEmbeddingsMap() {
  const promises = components.map(async (comp) => {
    const dbAction = await import(`@/db/${comp}/actions`);
    return [comp, dbAction.createEmbeddings];
  });
  
  const results = await Promise.all(promises);
  return Object.fromEntries(results);
}

export const createEmbeddingsFromDocs = async () => {
  const createEmbeddingsMap = await initializeEmbeddingsMap();
  
  for (const comp of components) {
    console.log(`读取${comp}文件内容...`);
    const docs = fs.readFileSync(`./ai-docs/${comp}.txt`, 'utf8');
    console.log(`开始生成${comp}向量化数据`);
    const embeddings = await createEmbedding(docs);
    console.log(`开始保存${comp}向量化数据`);
    await createEmbeddingsMap[comp](embeddings);
    console.log(`${comp}向量化数据保存成功~~~`);
  }
  process.exit(0);
};

createEmbeddingsFromDocs().catch(err => {
  console.error(err);
  process.exit(1);
});