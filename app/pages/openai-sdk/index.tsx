'use client';

import ChatMessages from '@/app/components/ChatMessages/ChatMessages';
const Home = () => {
  return <ChatMessages
    messages={[]}
    input={''}
    handleInputChange={() => {}}
    onSubmit={() => {}}
    isLoading={false}
    messageImgUrl={''}
    setMessagesImgUrl={() => {}}
    onRetry={() => {}}
   />;
};

export default Home;
