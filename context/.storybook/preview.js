import React from 'react';

import Providers from '../app/static/js/components/Providers';
import { initialize, mswDecorator } from 'msw-storybook-addon';

const allowConditions = [(url) => String(url).endsWith('thumbnail.jpg')];
initialize({
  onUnhandledRequest: ({ method, url }) => {
    if (!allowConditions.some((conditionFn) => conditionFn(url))) {
      console.error(`Unhandled ${method} request to ${url}.

        This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

        If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
      `);
    }
  },
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const mockEndpoints = { assetsEndpoint: 'https://assets.hubmapconsortium.org' };
const mockGroupsToken = '';

export const decorators = [
  (Story) => (
    <Providers endpoints={mockEndpoints} groupsToken={mockGroupsToken}>
      <Story />
    </Providers>
  ),
  mswDecorator,
];
