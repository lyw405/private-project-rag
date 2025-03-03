'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessages from '@/app/components/ChatMessages/ChatMessages';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';

const Home = () => {
  const [messages, setMessages] = useState<Array<ChatCompletionMessageParam & { id: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageImgUrl, setMessageImgUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !messageImgUrl) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      id: uuidv4(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let assistantMessage = {
        role: 'assistant' as const,
        content: '',
        id: uuidv4(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const { content, references } = JSON.parse(data);
              assistantMessage = {
                ...assistantMessage,
                content: assistantMessage.content + content,
                ragDocs: references,
              };

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id ? assistantMessage : msg
                )
              );
            } catch (e) {
              console.error('Error parsing SSE message:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // 在这里可以添加错误处理的UI提示
    } finally {
      setIsLoading(false);
      setMessageImgUrl('');
    }
  };

  const handleRetry = (messageId: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    // 移除从这条消息开始的所有消息
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);

    // 如果是用户消息，重新发送
    const message = messages[messageIndex];
    if (message.role === 'user') {
      setInput(message.content as string);
    }
  };

  return (
    <ChatMessages
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      messageImgUrl={messageImgUrl}
      setMessagesImgUrl={setMessageImgUrl}
      onRetry={handleRetry}
    />
  );
};

export default Home;
