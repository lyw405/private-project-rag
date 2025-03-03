import OpenAI from 'openai';
import { env } from '@/lib/env.mjs';
import { getSystemPrompt } from '@/lib/prompt';
import { retrieveEmbedding } from './embedding';
import { OpenAIRequest } from './types';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';

const openai = new OpenAI({
  apiKey: env.AI_KEY,
  baseURL: env.AI_BASE_URL,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as OpenAIRequest;
    
    // 获取最后一条用户消息
    let userMessage = message[message.length - 1];
    if (userMessage?.role !== 'user') {
      // 如果最后一条不是用户消息，尝试获取倒数第二条
      userMessage = message[message.length - 2];
    }
    
    if (!userMessage || userMessage.role !== 'user') {
      return new Response('No valid user message found', { status: 400 });
    }

    // 使用向量检索查找相关内容
    const similarResults = await retrieveEmbedding(userMessage.content as string);
    
    const reference = similarResults
      .map(result => `${result.content}\n相似度：${(result.similarity * 100).toFixed(2)}%`)
      .join('\n\n');

    // 构建系统提示词
    const systemMessage = getSystemPrompt(reference);

    // 创建完整的消息数组
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemMessage },
      ...message,
    ];

    // 创建流式补全
    const response = await openai.chat.completions.create({
      model: env.MODEL,
      messages,
      temperature: 0.7,
      stream: true,
    });

    // 创建 TransformStream 来处理响应
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          controller.enqueue(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
    });

    return new Response(
      response.toReadableStream().pipeThrough(transformStream),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
