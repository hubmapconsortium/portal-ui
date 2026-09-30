import React, { PropsWithChildren } from 'react';
import { vi } from 'vitest';
import { render, renderHook, RenderHookOptions, RenderOptions, act } from '@testing-library/react';
import Providers from 'js/components/Providers';
import { enableMapSet } from 'immer';

enableMapSet();

const appProviderEndpoints = {
  elasticsearchEndpoint: 'fakeElasticsearchEndpoint',
  baseElasticsearchEndpoint: 'fakeBaseElasticsearchEndpoint',
  filesElasticsearchEndpoint: 'fakeFilesElasticsearchEndpoint',
  filesFacetsEndpoint: 'fakeFilesFacetsEndpoint',
  entityEndpoint: 'fakeEntityEndpoint',
  assetsEndpoint: 'fakeAssetsEndpoint',
};

const isWorkspacesUser = false;
const appProviderToken = 'fakeGroupsToken';

// Mock tracking helpers
vi.mock('js/helpers/trackers');
vi.mock('@grafana/faro-web-sdk', () => ({
  faro: {
    api: {
      pushError: vi.fn(),
    },
  },
}));

interface AllTheProvidersProps extends PropsWithChildren {
  flaskData?: FlaskData;
  /** Extra or overriding endpoints, for tests that exercise a non-default index. */
  endpoints?: Record<string, string>;
}

export function AllTheProviders({
  children,
  endpoints,
  flaskData = {
    endpoints: {},
    entity: {
      hubmap_id: 'HBM123.ABC',
      entity_type: 'Entity',
    },
  } as FlaskData,
}: AllTheProvidersProps) {
  return (
    <Providers
      endpoints={{ ...appProviderEndpoints, ...endpoints }}
      groupsToken={appProviderToken}
      isWorkspacesUser={isWorkspacesUser}
      flaskData={flaskData}
      isAuthenticated={false}
    >
      {children}
    </Providers>
  );
}

const customRender = (
  ui: React.ReactNode,
  options?: Exclude<RenderOptions, 'wrapper'> & { flaskData?: FlaskData; endpoints?: Record<string, string> },
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders flaskData={options?.flaskData} endpoints={options?.endpoints}>
        {children}
      </AllTheProviders>
    ),
    ...options,
  });

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Partial<RenderHookOptions<TProps>> & { flaskData?: FlaskData; endpoints?: Record<string, string> },
) =>
  renderHook(callback, {
    wrapper: ({ children }) => (
      <AllTheProviders flaskData={options?.flaskData} endpoints={options?.endpoints}>
        {children}
      </AllTheProviders>
    ),
    ...options,
  });

// re-export everything from testing-library
export * from '@testing-library/react';

// Workaround for act warning
const customAct = act as (callback: () => void | Promise<void>) => void;

// override render method
export {
  customRender as render,
  customRenderHook as renderHook,
  appProviderEndpoints,
  appProviderToken,
  customAct as act,
};
