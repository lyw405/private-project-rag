import React, { useState } from 'react';
import { List, Card, Typography, Tag, Modal } from 'antd';
import type { RAGDocsShowProps } from './interface';

const { Paragraph } = Typography;

const RAGDocsShow: React.FC<RAGDocsShowProps> = ({ documents, trigger }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>{trigger}</div>
      <Modal
        title={<span className="text-gray-700 font-medium">相关文档</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        className="[&_.ant-modal-close-x]:!text-gray-800"
        styles={{
          content: {
            background: '#fafafa',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          },
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '12px',
            marginBottom: '12px',
            background: '#fafafa'
          }
        }}
      >
        <List
          className="w-full"
          dataSource={documents}
          renderItem={(doc) => (
            <List.Item key={doc.id} className="!border-none !py-2">
              <Card 
                className="w-full hover:shadow-md transition-shadow !border-gray-50" 
                styles={{ 
                  body: { 
                    background: 'linear-gradient(to right, #dbeafe, #ede9fe)'  // 从 blue-100 到 purple-100
                  } 
                }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Paragraph
                      className="mb-0 text-gray-800 !text-gray-800 [&_*]:!text-gray-800"
                      ellipsis={{ 
                        rows: 3, 
                        expandable: true, 
                        symbol: <span className="!text-blue-600 hover:!text-blue-700 cursor-pointer">展开</span>
                      }}
                    >
                      {doc.content}
                    </Paragraph>
                    {doc.score && (
                      <Tag
                        color="blue"
                        className="ml-4 !h-[24px] !leading-[22px] flex items-center !bg-blue-50 !text-blue-700 !border-blue-100"
                      >
                        {(doc.score * 100).toFixed(2)}%
                      </Tag>
                    )}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default RAGDocsShow;
