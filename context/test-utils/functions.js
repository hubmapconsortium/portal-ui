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
// eslint-disable-next-line no-undef
jest.mock('js/helpers/trackers');

export function AllTheProviders({ children }) {
  return (
    <Providers endpoints={appProviderEndpoints} groupsToken={appProviderToken} isWorkspacesUser={isWorkspacesUser}>
      {children}
    </Providers>
  );
}

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

const customRenderHook = (callback, options) => renderHook(callback, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, customRenderHook as renderHook, appProviderEndpoints, appProviderToken };
