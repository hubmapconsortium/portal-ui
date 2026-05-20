import React, { PropsWithChildren } from 'react';
import { render, renderHook, RenderHookOptions, RenderOptions, act } from '@testing-library/react';
import Providers from 'js/components/Providers';
import { enableMapSet } from 'immer';

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
  flaskData?: FlaskData;
}

export function AllTheProviders({
  children,
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
      endpoints={appProviderEndpoints}
      groupsToken={appProviderToken}
      isWorkspacesUser={isWorkspacesUser}
      flaskData={flaskData}
      isAuthenticated={false}
    >
      {children}
    </Providers>
  );
}

const customRender = (ui: React.ReactNode, options?: Exclude<RenderOptions, 'wrapper'> & { flaskData?: FlaskData }) =>
  render(ui, {
    wrapper: ({ children }) => <AllTheProviders flaskData={options?.flaskData}>{children}</AllTheProviders>,
    ...options,
  });

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Partial<RenderHookOptions<TProps>> & { flaskData?: FlaskData },
) =>
  renderHook(callback, {
    wrapper: ({ children }) => <AllTheProviders flaskData={options?.flaskData}>{children}</AllTheProviders>,
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
