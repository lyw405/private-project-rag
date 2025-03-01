import React from 'react';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import type { ChatMainLayoutProps } from './interface';
import { useStyles } from './styles';

const ChatMainLayout: React.FC<ChatMainLayoutProps> = ({
  mainContent,
  selectedProject,
  onProjectChange,
  projectItems
}) => {
  const styles = useStyles();

  return (
    <div className="flex flex-col w-full h-screen bg-[#ffffff]/95 bg-gradient-to-br from-blue-100/30 to-purple-100/40 relative">
      <div className="absolute inset-0 flex items-center justify-center -translate-y-10">
        <Image
          src="/logo.png"
          alt="Background Logo"
          width={400}
          height={400}
          className="opacity-[0.04] pointer-events-none select-none"
          priority
        />
      </div>
      <div className="flex justify-between items-center w-full py-3 px-6 border-b border-gray-200 bg-white/80 relative z-10">
        <div className="flex-1" />
        <div className="flex items-center gap-2 italic text-l font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">
          <div className="text-2xl">DAS</div>
          <div className="hidden sm:block">AUTOCODE</div>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <div className="h-[32px] w-[1px] bg-gray-200 mr-2" />
          <Dropdown
            menu={{
              items: projectItems,
              onClick: ({ key }) => {
                const selectedItem = projectItems.find((item) => item.key === key);
                onProjectChange(selectedItem?.key || 'das-component');
              }
            }}
            dropdownRender={(menu) => (
              <div
                className={`${styles.dropdownClassName} bg-white shadow-md rounded-md !text-gray-800`}
              >
                {menu}
              </div>
            )}
          >
            <Button className="!bg-white/90 !text-gray-800 !border-gray-200">
              {projectItems.find((item) => item.key === selectedProject)?.label} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="h-[calc(100%-57px)]">{mainContent}</div>
    </div>
  );
};

ChatMainLayout.displayName = 'ChatMainLayout';

export default ChatMainLayout;
