import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import Providers from 'js/components/Providers';
import { enableMapSet } from 'immer';
import { RenderHookOptions } from '@testing-library/react-hooks/lib/types';

enableMapSet();

const appProviderEndpoints = {
  elasticsearchEndpoint: 'fakeElasticsearchEndpoint',
  entityEndpoint: 'fakeEntityEndpoint',
  assetsEndpoint: 'fakeAssetsEndpoint',
};

const isWorkspacesUser = false;
const appProviderToken = 'fakeGroupsToken';

// Mock tracking helpers
jest.mock('js/helpers/trackers');
jest.mock('@grafana/faro-web-sdk', () => ({
  faro: {
    api: {
      pushError: jest.fn(),
    },
  },
}));

interface AllTheProvidersProps extends PropsWithChildren {
  flaskData?: unknown;
}

export function AllTheProviders({
  children,
  flaskData = {
    entity: {
      hubmap_id: 'HBM123.ABC',
      entity_type: 'Entity',
    },
  },
}: AllTheProvidersProps) {
  return (
    <Providers
      endpoints={appProviderEndpoints}
      groupsToken={appProviderToken}
      isWorkspacesUser={isWorkspacesUser}
      flaskData={flaskData}
      isAuthenticated={false}
      userEmail={undefined}
      workspacesToken={undefined}
      isHubmapUser={undefined}
    >
      {children}
    </Providers>
  );
}

const customRender = (ui: React.ReactNode, options?: Exclude<RenderOptions, 'wrapper'> & { flaskData?: unknown }) =>
  render(ui, {
    wrapper: ({ children }) => <AllTheProviders flaskData={options?.flaskData}>{children}</AllTheProviders>,
    ...options,
  });

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Partial<RenderHookOptions<TProps>> & { flaskData?: unknown },
) =>
  renderHook(callback, {
    // @ts-expect-error - TS is causing issues with the wrapper prop type
    wrapper: ({ children }) => <AllTheProviders flaskData={options?.flaskData}>{children}</AllTheProviders>,
    ...options,
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, customRenderHook as renderHook, appProviderEndpoints, appProviderToken };
