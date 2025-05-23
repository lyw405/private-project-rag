import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';
import RAGDocsShow from './RAGDocsShow';

const meta = {
  title: 'Components/RAGDocsShow',
  component: RAGDocsShow,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light', // 默认背景
      values: [
        { name: 'light', value: '#ffffff' }, // 白色
        { name: 'dark', value: '#333333' },  // 深灰色
        { name: 'blue', value: '#007bff' },  // 蓝色
      ],
    },
  }
} satisfies Meta<typeof RAGDocsShow>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockDocuments = [
  {
    id: '1',
    content: 'This is a sample document with some content that might be relevant to a query.',
    score: 0.89
  },
  {
    id: '2',
    content:
      'Another document with different content and metadata to demonstrate the component. Another document with different content and metadata to demonstrate the component. Another document with different content and metadata to demonstrate the component. Another document with different content and metadata to demonstrate the component. Another document with different content and metadata to demonstrate the component.',
    score: 0.75
  }
];

export const Default: Story = {
  args: {
    documents: mockDocuments,
    trigger: <Button>Show Documents</Button>
  }
};
