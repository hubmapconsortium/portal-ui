import React from 'react';

import Providers from '../app/static/js/components/Providers';
import { initialize, mswDecorator, mswLoader } from 'msw-storybook-addon';
import { enableMapSet } from 'immer';


import InterVariable from '@fontsource-variable/inter/files/inter-latin-standard-normal.woff2';

enableMapSet();

const allowConditions = [(url) => String(url).endsWith('thumbnail.jpg')];
initialize({
  serviceWorker: {
    options: {
      updateViaCache: 'none'
    }
  }
});

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const mockEndpoints = { assetsEndpoint: 'https://assets.hubmapconsortium.org', softAssayEndpoint: '/soft-assay-endpoint' };
export const mockGroupsToken = '';

export const decorators = [
  (Story) => (
    <Providers endpoints={mockEndpoints} groupsToken={mockGroupsToken} isAuthenticated={false} userEmail={'undefined'} workspacesToken={'undefined'} isWorkspacesUser={false} isHubmapUser={false} flaskData={undefined}>
      <Story />
    </Providers>
  ),
  mswDecorator,
];
export const tags = ['autodocs'];

export const loaders = [mswLoader]

const preview = {
  parameters,
  decorators,
  loaders,
}

export default preview