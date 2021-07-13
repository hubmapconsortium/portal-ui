import React from 'react';

import Providers from '../app/static/js/components/Providers';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
}

const mockEndpoints = {};
const mockNexusToken=""

export const decorators = [
  (Story) => (
    <Providers endpoints={mockEndpoints} nexusToken={mockNexusToken}>
      <Story />
    </Providers>
  ),
];

