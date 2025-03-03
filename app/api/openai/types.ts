export type CustomChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenAIRequest = {
  message: CustomChatMessage[];
};
  
