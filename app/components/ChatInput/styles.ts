import styled, { css, keyframes } from 'styled-components';

const gradient = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100em 0;
  }
`;

interface StyledChatInputProps {
  $loading?: boolean;
  $notActions?: boolean;
}

const loadingBackground = css`
  background: repeating-linear-gradient(
      101.79deg,
      rgba(79, 70, 229, 0.1) 0%,
      rgba(147, 51, 234, 0.1) 33%,
      rgba(79, 70, 229, 0.1) 66%,
      rgba(147, 51, 234, 0.1) 100%
    )
    0% 0% / 200% 200%;
  animation: ${gradient} 6s linear infinite;
`;

export const StyledChatInput = styled.div<StyledChatInputProps>`
  position: relative;
  width: 100%;
  background: ${({ $loading }) => ($loading ? 'none' : '#ffffff')};
  ${({ $loading }) => $loading && loadingBackground};
  background-size: 200% 200%;
  border-radius: 8px;
  padding: 2px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  textarea {
    position: relative;
    transition: 0.3s;
    padding-right: 50px;
    padding-top: ${({ $notActions }) => ($notActions ? '10px' : '48px')};
    padding-bottom: 10px;
    background: #ffffff;
    color: #374151;
    border: 1px solid #e5e7eb;

    &::placeholder {
      color: #9ca3af;
    }
    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
    &:focus {
      border-color: #6366f1;
      background: #ffffff;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
    }
  }

  .generate-btn {
    position: absolute;
    right: 12px;
    bottom: 12px;
  }

  .action-wrapper {
    position: absolute;
    top: 3px;
    height: 45px;
    left: 4px;
    right: 4px;
    padding: 0 12px;
    border-radius: 8px 8px 0 0;
    display: ${({ $notActions }) => ($notActions ? 'none' : 'flex')};
    align-items: center;
    background: #ffffff;
    border-bottom: 1px solid #f3f4f6;
  }

  .image-wrapper {
    margin-top: 5px;
  }
`;
