import React, { memo } from 'react';
import { Avatar, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { Markdown } from '../Markdown';
import { isEqual } from 'lodash';
import { AssistantMessageProps } from './interface';
import { RAGDocsShow } from '../RAGDocsShow';

const AssistantMessage = memo(
  ({ message, isLoading, onRetry, ragDocs }: AssistantMessageProps) => {
    return (
      <div className="grid grid-cols-[auto,1fr,auto] px-2 py-4 mb-4 gap-4">
        <div className="flex flex-col items-center">
          <Avatar className="!bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm" size={32}>
            AI
          </Avatar>
        </div>
        <div className="flex flex-col min-w-0 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 hover:from-blue-300 hover:via-indigo-300 hover:to-purple-300 rounded-lg transition-colors p-4">
          <div className="flex-1">
            <Markdown 
              source={message} 
              isChatting={isLoading} 
              isStream={true} 
              className="!text-gray-800 [&_pre]:!text-gray-800 [&_code]:!text-gray-800" 
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            {ragDocs && (
              <RAGDocsShow
                documents={ragDocs}
                trigger={
                  <div className="text-sm font-medium text-blue-600 hover:text-white cursor-pointer transition-all border border-blue-300 hover:border-blue-600 hover:bg-blue-600 rounded-md px-2 py-1 inline-block">
                    查看相关文档
                  </div>
                }
              />
            )}
            <div className="flex-1" />
            {onRetry && (
              <Button
                type="default"
                size="small"
                className="flex items-center gap-1 !text-emerald-700 !border-emerald-300 !bg-emerald-50 hover:!bg-red-50 hover:!border-red-300 hover:!text-red-700 !shadow-none !outline-none !border-none"
                icon={<RedoOutlined rev={undefined} />}
                onClick={onRetry}
              >
                重试
              </Button>
            )}
          </div>
        </div>
        <div className="w-8" />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading && isEqual(prevProps.message, nextProps.message)
    );
  }
);

AssistantMessage.displayName = 'AssistantMessage';

export default AssistantMessage;
