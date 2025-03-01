import React, { memo } from 'react';
import { Input, Space, Button, Divider, message } from 'antd';
import { ChatInputProps } from './interface';
import { StyledChatInput } from './styles';
import { isEmpty, isEqual } from 'lodash';
import { InteractiveTagList } from '../InteractiveTagList';
import { SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ChatInput: React.FC<ChatInputProps> = memo(
  ({ value, onChange, actions, onSubmit, loading, handleInputChange, prompts }) => {
    return (
      <>
        {isEmpty(prompts) ? null : (
          <div className="w-full">
            <InteractiveTagList
              onTagClick={(tag) => {
                onChange?.(tag, { immediately: true });
              }}
              tags={prompts!}
            />
          </div>
        )}
        <StyledChatInput $loading={loading} $notActions={isEmpty(actions)}>
          <TextArea
            size="large"
            value={value}
            onChange={(event) => {
              onChange?.(event.target.value);
              handleInputChange?.(event);
            }}
            placeholder="输入消息..."
            autoSize={{ minRows: 2, maxRows: 6 }}
            className="!bg-white !text-gray-800 !border-gray-200 hover:!bg-gray-50 focus:!border-blue-500 focus:!shadow-blue-100"
          />
          <Button
            className="generate-btn !bg-gradient-to-r from-blue-600 to-purple-600 hover:!opacity-90"
            type="primary"
            shape="circle"
            size="large"
            loading={loading}
            onClick={() => {
              if (!value) {
                message.warning('请输入消息');
                return;
              }
              onSubmit();
            }}
            icon={<SendOutlined />}
          />
          <div className="action-wrapper !bg-white/95 !border-b !border-gray-100">
            <Space size="small">
              {actions.map((action, index) => (
                <React.Fragment key={index}>
                  {action}
                  {index < actions.length - 1 && <Divider type="vertical" className="!border-gray-200" />}
                </React.Fragment>
              ))}
            </Space>
          </div>
        </StyledChatInput>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.loading === nextProps.loading &&
      isEqual(prevProps.actions, nextProps.actions) &&
      isEqual(prevProps.prompts, nextProps.prompts)
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
