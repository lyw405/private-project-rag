import React from 'react';
import type { Preview } from '@storybook/react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'dark',
          value: '#000000'
        }
      ]
    }
  }
};

export const decorators = [
  (Story) => (
      <Story />
  )
];

export default preview;
