import React from 'react';

import Providers from '../app/static/js/components/Providers';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { http, HttpResponse } from 'msw';
import { enableMapSet } from 'immer';
import { SCFIND_BASE_STORYBOOK } from '../app/static/js/api/scfind/utils';

import '@fontsource-variable/inter/files/inter-latin-standard-normal.woff2';

enableMapSet();

initialize({
  serviceWorker: {
    options: {
      updateViaCache: 'none',
    },
  },
});
export const loaders = [mswLoader];

// The scFind hooks now fetch our Flask BFF routes at relative `/scfind/...` URLs rather than the
// upstream scFind API. Storybook (port 6006) doesn't serve Flask, so proxy those requests to the
// webpack/Vite dev server on port 5001 (which proxies on to Flask). Applied at the preview level so
// every scFind hook/component story resolves without per-story handlers.
const proxyScfindToDevServer = async ({ request }: { request: Request }) => {
  const { pathname, search } = new URL(request.url);
  const init: RequestInit = { method: request.method, headers: { 'Content-Type': 'application/json' } };
  if (request.method === 'POST') {
    init.body = await request.text();
  }
  const response = await fetch(`http://localhost:5001${pathname}${search}`, init);
  const data = (await response.json()) as Record<string, unknown> | unknown[];
  return HttpResponse.json(data);
};

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers: [http.get('/scfind/*', proxyScfindToDevServer), http.post('/scfind/*', proxyScfindToDevServer)],
  },
};

export const mockEndpoints = {
  assetsEndpoint: 'https://assets.hubmapconsortium.org',
  softAssayEndpoint: '/soft-assay-endpoint',
  elasticsearchEndpoint: '/search',
  scFindEndpoint: SCFIND_BASE_STORYBOOK,
};
export const mockGroupsToken = '';
export const decorators = [
  (Story: React.FC) => (
    <Providers
      endpoints={mockEndpoints}
      groupsToken={mockGroupsToken}
      isAuthenticated={false}
      userEmail={'undefined'}
      workspacesToken={'undefined'}
      isWorkspacesUser={false}
      isHubmapUser={false}
      flaskData={{}}
      userFirstName={undefined}
      userLastName={undefined}
      userGlobusId={undefined}
      userGlobusAffiliation={undefined}
    >
      <Story />
    </Providers>
  ),
];
export const tags = ['autodocs'];

const preview = {
  parameters,
  loaders,
  decorators,
};

export default preview;
