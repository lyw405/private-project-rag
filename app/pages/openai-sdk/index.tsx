'use client';

import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import ChatMessages from '@/app/components/ChatMessages/ChatMessages';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { Message } from '@/app/components/ChatMessages/interface';

const Home = ({selectedProject}:{selectedProject:string}) => {
  const [messages, setMessages] = useState<Array<ChatCompletionMessageParam & { id: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageImgUrl, setMessageImgUrl] = useState('');
  const myRef = useRef(selectedProject);

  useEffect(() => {
    if (myRef.current !== selectedProject) {
      myRef.current = selectedProject;
      setMessages([]);
    }
  }, [selectedProject]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmitMessage = async (newMessages: Message[]) => {
    setMessages(newMessages as Array<ChatCompletionMessageParam & { id: string }>);
    setIsLoading(true);

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessages,
          project: myRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }
      setInput('');
      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let assistantMessage = {
        role: 'assistant' as const,
        content: '',
        id: nanoid(),
        ragDocs: [],
      };
      
      // 先将空的 assistant 消息添加到列表中
      setMessages(prev => [...prev, assistantMessage]);

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
              const { content, references: ragDocs } = JSON.parse(data);
              assistantMessage = {
                ...assistantMessage,
                content: assistantMessage.content + content,
                ragDocs,
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
    const index = messages.findIndex((message) => message.id === messageId);
    if (index > 0) {
      const previousMessages = messages.slice(0, index);
      handleSubmitMessage(previousMessages as Message[]);
    }
  };

  const handleSubmit = () => {
    handleSubmitMessage([...messages, {
      id: nanoid(),
      role: 'user',
      content: messageImgUrl
        ? [
            { type: 'image_url', image_url: { url: messageImgUrl } },
            { type: 'text', text: input }
          ]
        : input }] as Message[]);
  };

  return (
    <ChatMessages
      messages={messages as Message[]}
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
