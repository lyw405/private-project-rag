import React from 'react';
import { Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { InteractiveTagListProps } from './interface';

const InteractiveTagList: React.FC<InteractiveTagListProps> = ({ tags, onTagClick }) => {
  return (
    <div className="flex flex-wrap">
      {tags.map((tag, index) => (
        <Tag
          key={index}
          className="flex items-center space-x-1 bg-blue-50 text-blue-600 border-blue-100 
            hover:bg-blue-100 hover:border-blue-200 transition-colors cursor-pointer mr-2 mb-2"
          onClick={() => onTagClick && onTagClick(tag)}
        >
          <span>{tag}</span>
          <ArrowRightOutlined className="transform -rotate-45 text-blue-400" />
        </Tag>
      ))}
    </div>
  );
};

export default InteractiveTagList;
