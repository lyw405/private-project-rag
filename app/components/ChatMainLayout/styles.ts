import { useEmotionCss } from '@ant-design/use-emotion-css';

export const useStyles = () => {
  const dropdownClassName = useEmotionCss(() => ({
    '.ant-dropdown-menu': {
      backgroundColor: '#ffffff !important',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15) !important'
    },
    '.ant-dropdown-menu-item': {
      color: '#333333 !important',
      '&:hover': {
        backgroundColor: '#f5f5f5 !important'
      }
    }
  }));

  return {
    dropdownClassName
  };
};
