import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';

import Providers from 'js/components/Providers';
import { SAVED_ENTITIES_LOCAL_STORAGE_KEY } from './constants';
import useSavedLists from './hooks';

vi.mock('@grafana/faro-web-sdk', () => ({
  faro: {
    api: {
      pushError: vi.fn(),
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

const localLists = JSON.stringify({
  state: { savedLists: {}, savedEntities: { abc: { dateSaved: 1 } } },
});

let putCount = 0;

const server = setupServer(
  http.get(`${ukvEndpoint}/user/keys`, () => HttpResponse.json([])),
  http.put(`${ukvEndpoint}/user/keys/savedEntities`, () => {
    putCount += 1;
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
beforeEach(() => {
  localStorage.setItem(SAVED_ENTITIES_LOCAL_STORAGE_KEY, localLists);
  putCount = 0;
});
afterAll(() => {
  server.close();
});

function wrapperFor(isHubmapUser: boolean) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
        <Providers
          endpoints={endpoints}
          groupsToken={isHubmapUser ? 'fakeGroupsToken' : ''}
          isWorkspacesUser={false}
          isHubmapUser={isHubmapUser}
          isAuthenticated={isHubmapUser}
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
  };
}

describe('moving saved lists from local storage to UKV', () => {
  test('leaves local lists alone for a user without UKV access', async () => {
    renderHook(() => useSavedLists(), { wrapper: wrapperFor(false) });

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(putCount).toBe(0);
    expect(localStorage.getItem(SAVED_ENTITIES_LOCAL_STORAGE_KEY)).toBe(localLists);
  });

  test('keeps local lists when the upload fails', async () => {
    renderHook(() => useSavedLists(), { wrapper: wrapperFor(true) });

    await waitFor(() => expect(putCount).toBeGreaterThan(0));
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(localStorage.getItem(SAVED_ENTITIES_LOCAL_STORAGE_KEY)).toBe(localLists);
  });
});
