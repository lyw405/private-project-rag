import React, { memo } from 'react';
import { Avatar, Image } from 'antd';
import { isArray, isEqual } from 'lodash';
import { Markdown } from '../Markdown';

interface MessageContent {
  type: 'image_url' | 'text';
  image_url?: {
    url: string;
  };
  text?: string;
}

interface UserMessageProps {
  message: string | MessageContent[];
}

const UserMessage: React.FC<UserMessageProps> = memo(
  ({ message }) => {
    return (
      <div className="grid grid-cols-[auto,1fr,auto] px-2 py-4 mb-4 gap-4">
        <div className="w-8" />
        <div className="flex flex-col min-w-0 bg-gradient-to-r from-emerald-200 via-teal-200 to-blue-200 hover:from-emerald-300 hover:via-teal-300 hover:to-blue-300 rounded-lg transition-colors p-4">
          <div className="flex flex-1">
            {typeof message === 'string' ? (
              <Markdown source={message}></Markdown>
            ) : isArray(message) ? (
              <div className="flex flex-col">
                {message.map((content, index) => {
                  if (content.type === 'image_url') {
                    return (
                      <div key={index}>
                        <Image
                          className="!max-w-24 rounded-lg shadow-sm"
                          src={content.image_url!.url}
                          alt="user-image"
                        />
                      </div>
                    );
                  }
                  return <Markdown key={index} source={content.text!}></Markdown>;
                })}
              </div>
            ) : (
              message
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Avatar className="!bg-blue-500 shadow-sm" size={32}>
            You
          </Avatar>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.message, nextProps.message);
  }
);

UserMessage.displayName = 'UserMessage';

export default UserMessage;
