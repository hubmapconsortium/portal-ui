import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';

import Providers from 'js/components/Providers';
import { useFetchSavedListsAndEntities } from './api';

jest.mock('@grafana/faro-web-sdk', () => ({
  faro: {
    api: {
      pushError: jest.fn(),
    },
  },
}));

const ukvEndpoint = 'http://fakeUkvEndpoint';

const endpoints = {
  elasticsearchEndpoint: 'fakeElasticsearchEndpoint',
  entityEndpoint: 'fakeEntityEndpoint',
  assetsEndpoint: 'fakeAssetsEndpoint',
  softAssayEndpoint: 'fakeSoftAssayEndpoint',
  ukvEndpoint,
};

let requestCount = 0;

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  requestCount = 0;
});
afterAll(() => {
  server.close();
});

function Wrapper({ children }: PropsWithChildren) {
  return (
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      <Providers
        endpoints={endpoints}
        groupsToken="fakeGroupsToken"
        isWorkspacesUser={false}
        isHubmapUser
        isAuthenticated
        flaskData={{ entity: { hubmap_id: 'HBM123', entity_type: 'Entity' } }}
        userEmail="test@example.com"
        workspacesToken={undefined}
        userFirstName={undefined}
        userLastName={undefined}
        userGlobusId={undefined}
        userGlobusAffiliation={undefined}
      >
        {children}
      </Providers>
    </SWRConfig>
  );
}

describe('useFetchSavedListsAndEntities', () => {
  test('resolves to an empty array on 404 (user has no UKV entries yet) without retrying', async () => {
    server.use(
      http.get(`${ukvEndpoint}/user/keys`, () => {
        requestCount += 1;
        return new HttpResponse('Not found', { status: 404 });
      }),
    );

    const { result } = renderHook(() => useFetchSavedListsAndEntities(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.savedListsAndEntities).toEqual([]);
    expect(result.current.error).toBeUndefined();

    // Give SWR a chance to attempt a retry (it shouldn't, because we handle 404
    // as a valid empty response and set shouldRetryOnError: false).
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(requestCount).toBe(1);
  });

  test('still surfaces a 404 as an error when fetching a specific list UUID', async () => {
    const listUUID = 'missing-list-uuid';
    server.use(
      http.get(`${ukvEndpoint}/user/keys/${listUUID}`, () => {
        requestCount += 1;
        return new HttpResponse('Not found', { status: 404 });
      }),
    );

    const { result } = renderHook(() => useFetchSavedListsAndEntities(listUUID), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.error).toBeDefined());

    expect(result.current.savedListsAndEntities).toEqual([]);
    // shouldRetryOnError: false — exactly one request even for the error case.
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(requestCount).toBe(1);
  });
});
