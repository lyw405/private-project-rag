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

   // 创建 SSE 流
   const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            const data = JSON.stringify({
              content,
              references: reference
            });
            controller.enqueue(`data: ${data}\n\n`);
          }
        }
        controller.enqueue('data: [DONE]\n\n');
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });

    return new Response(
        stream,
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
