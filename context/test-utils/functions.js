/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
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
    }
  }
}));

export function AllTheProviders({
  children,
  flaskData = {
    entity: {
      hubmap_id: 'HBM123.ABC',
      entity_type: 'Entity',
    },
  },
}) {
  return (
    <Providers
      endpoints={appProviderEndpoints}
      groupsToken={appProviderToken}
      isWorkspacesUser={isWorkspacesUser}
      flaskData={flaskData}
    >
      {children}
    </Providers>
  );
}

const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => <AllTheProviders flaskData={options?.flaskData}>{children}</AllTheProviders>,
    ...options,
  });

const customRenderHook = (callback, options) =>
  renderHook(callback, {
    wrapper: ({ children }) => <AllTheProviders flaskData={options?.flaskData}>{children}</AllTheProviders>,
    ...options,
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, customRenderHook as renderHook, appProviderEndpoints, appProviderToken };
