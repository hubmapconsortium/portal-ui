import React from 'react';

import Providers from '../app/static/js/components/Providers';
import { mswLoader } from 'msw-storybook-addon/csf3';
import { http, HttpResponse } from 'msw';
import { enableMapSet } from 'immer';
import { SCFIND_BASE_STORYBOOK } from '../app/static/js/api/scfind/utils';

import '@fontsource-variable/inter/files/inter-latin-standard-normal.woff2';

enableMapSet();

// msw-storybook-addon 3 dropped `initialize()` and starts the worker itself, so the
// `updateViaCache` option this project has always set now has to come in through a
// custom setup. `bypass` replaces the addon's default onUnhandledRequest warning,
// which would otherwise fire for Storybook's own asset requests.
const startWorker = async () => {
  const { setupWorker } = await import('msw/browser');
  const worker = setupWorker();
  await worker.start({
    quiet: true,
    onUnhandledRequest: 'bypass',
    serviceWorker: { options: { updateViaCache: 'none' } },
  });
  return worker;
};

export const loaders = [mswLoader(startWorker)];

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
  // Stories that mock entity-api requests build their msw handler paths from this prefix.
  entityEndpoint: '/entity-endpoint',
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
