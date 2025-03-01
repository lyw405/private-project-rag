'use client';

import { useState, FC, useRef } from 'react';
import { Drawer, Button, Tooltip } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { Editor, setUserPreferences } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { getSvgAsImage } from './lib/getSvgAsImage';
import { blobToBase64 } from './lib/blobToBase64';
import { TldrawEditProps } from './interface';
import { useClassName } from './styles';

// 动态导入 Tldraw 组件
const Tldraw = dynamic(() => import('@tldraw/tldraw').then((mod) => mod.Tldraw), {
  ssr: false
});

const TldrawEdit: FC<TldrawEditProps> = ({ onSubmit }) => {
  const [, refresh] = useState({});
  const editorRef = useRef<Editor>();
  const classNames = useClassName();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Tooltip key="Draw UI" title="Draw UI">
        <Button
          className="!bg-gray-100 !border-gray-200 hover:!bg-gray-50 !text-gray-600"
          size="small"
          onClick={showDrawer}
          icon={<PictureOutlined />}
        />
      </Tooltip>
      <Drawer
        title={
          <div className="flex justify-between items-center w-full">
            <span className="text-gray-800">Draw UI</span>
            <ExportButton
              editor={editorRef.current!}
              onSubmit={(dataUrl) => {
                onSubmit(dataUrl);
                setVisible(false);
              }}
            />
          </div>
        }
        placement="right"
        closable={true}
        onClose={handleCancel}
        open={visible}
        width="100%"
        styles={{
          body: { padding: 0, height: '100vh' },
          header: { background: '#fff', borderBottom: '1px solid #f0f0f0' },
          content: { background: '#fff' }
        }}
      >
        <div className={`w-full h-full ${classNames}`}>
          <Tldraw
            onMount={(editor) => {
              editorRef.current = editor;
              setUserPreferences({
                isDarkMode: false,
                id: 'tldraw'
              });
              refresh({});
            }}
            persistenceKey="tldraw"
          />
        </div>
      </Drawer>
    </>
  );
};

function ExportButton({
  onSubmit,
  editor
}: {
  onSubmit: (dataUrl: string) => void;
  editor: Editor;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      type="primary"
      onClick={async (e) => {
        setLoading(true);
        try {
          e.preventDefault();
          console.log('editor', editor);

          const svg = await editor.getSvg(Array.from(editor.currentPageShapeIds));
          if (!svg) {
            return;
          }
          const png = await getSvgAsImage(svg, {
            type: 'png',
            quality: 1,
            scale: 1
          });
          const dataUrl = (await blobToBase64(png!)) as string;
          onSubmit(dataUrl);
        } finally {
          setLoading(false);
        }
      }}
      className="!bg-gradient-to-r from-blue-600 to-purple-600 hover:!opacity-90"
      loading={loading}
    >
      Confirm
    </Button>
  );
}

export default TldrawEdit;
