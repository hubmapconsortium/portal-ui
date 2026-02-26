import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';
import Providers from 'js/components/Providers';
import {
  fetchDatasetPermissions,
  useDatasetsAccess,
  useDatasetAccess,
  DatasetPermissionsResponse,
} from './useDatasetPermissions';

const softAssayEndpoint = 'http://fakeSoftAssayEndpoint';
const groupsToken = 'fakeGroupsToken';

const endpoints = {
  elasticsearchEndpoint: 'fakeElasticsearchEndpoint',
  entityEndpoint: 'fakeEntityEndpoint',
  assetsEndpoint: 'fakeAssetsEndpoint',
  softAssayEndpoint,
};

let requestLog: { body: unknown; headers: Record<string, string | null> }[] = [];

const server = setupServer(
  http.post(`${softAssayEndpoint}/entities/accessible-data-directories`, async ({ request }) => {
    const body = await request.json();
    requestLog.push({
      body,
      headers: {
        'content-type': request.headers.get('content-type'),
        authorization: request.headers.get('authorization'),
      },
    });
    // Build response: each uuid gets a permission entry
    const uuids = body as string[];
    const response: DatasetPermissionsResponse = {};
    for (const uuid of uuids) {
      response[uuid] = { valid_id: true, access_allowed: true, uuid, hubmap_id: `HBM-${uuid}` };
    }
    return HttpResponse.json(response);
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  requestLog = [];
});
afterAll(() => {
  server.close();
});

function TestWrapper({ children }: PropsWithChildren) {
  return (
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      <Providers
        endpoints={endpoints}
        groupsToken={groupsToken}
        isWorkspacesUser={false}
        flaskData={{ entity: { hubmap_id: 'HBM123', entity_type: 'Entity' } }}
        isAuthenticated={false}
        userEmail={undefined}
        workspacesToken={undefined}
        isHubmapUser={undefined}
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

describe('fetchDatasetPermissions', () => {
  test('sends correct POST body, Content-Type, and Authorization header', async () => {
    const data = ['uuid-1', 'uuid-2'];
    await fetchDatasetPermissions({ url: softAssayEndpoint, data, groupsToken });

    expect(requestLog).toHaveLength(1);
    expect(requestLog[0].body).toEqual(['uuid-1', 'uuid-2']);
    expect(requestLog[0].headers['content-type']).toBe('application/json');
    expect(requestLog[0].headers.authorization).toBe(`Bearer ${groupsToken}`);
  });

  test('sends no Authorization header when groupsToken is empty', async () => {
    await fetchDatasetPermissions({ url: softAssayEndpoint, data: ['uuid-1'], groupsToken: '' });

    expect(requestLog).toHaveLength(1);
    expect(requestLog[0].headers.authorization).toBeNull();
  });
});

describe('useDatasetsAccess', () => {
  test('returns accessibleDatasets after loading completes', async () => {
    const { result } = renderHook(() => useDatasetsAccess(['uuid-1', 'uuid-2']), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.accessibleDatasets).toEqual({
      'uuid-1': { valid_id: true, access_allowed: true, uuid: 'uuid-1', hubmap_id: 'HBM-uuid-1' },
      'uuid-2': { valid_id: true, access_allowed: true, uuid: 'uuid-2', hubmap_id: 'HBM-uuid-2' },
    });
  });

  test('returns empty swappedDatasets when UUIDs match response', async () => {
    const { result } = renderHook(() => useDatasetsAccess(['uuid-1']), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.swappedDatasets).toEqual([]);
  });

  test('detects swapped datasets when response uuid differs from request key', async () => {
    server.use(
      http.post(`${softAssayEndpoint}/entities/accessible-data-directories`, async ({ request }) => {
        const body = (await request.json()) as string[];
        requestLog.push({
          body,
          headers: {
            'content-type': request.headers.get('content-type'),
            authorization: request.headers.get('authorization'),
          },
        });
        return HttpResponse.json({
          'uuid-old': {
            valid_id: true,
            access_allowed: true,
            uuid: 'uuid-new',
            hubmap_id: 'HBM.NEW',
          },
        });
      }),
    );

    const { result } = renderHook(() => useDatasetsAccess(['uuid-old']), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.swappedDatasets).toEqual([
      { originalUuid: 'uuid-old', actualUuid: 'uuid-new', actualHubmapId: 'HBM.NEW' },
    ]);
  });

  test('does not flag swaps when access_allowed is false', async () => {
    server.use(
      http.post(`${softAssayEndpoint}/entities/accessible-data-directories`, async ({ request }) => {
        const body = (await request.json()) as string[];
        requestLog.push({
          body,
          headers: {
            'content-type': request.headers.get('content-type'),
            authorization: request.headers.get('authorization'),
          },
        });
        return HttpResponse.json({
          'uuid-old': {
            valid_id: true,
            access_allowed: false,
            uuid: 'uuid-new',
            hubmap_id: 'HBM.NEW',
          },
        });
      }),
    );

    const { result } = renderHook(() => useDatasetsAccess(['uuid-old']), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.swappedDatasets).toEqual([]);
  });

  test('does not flag swaps when response uuid is undefined', async () => {
    server.use(
      http.post(`${softAssayEndpoint}/entities/accessible-data-directories`, async ({ request }) => {
        const body = (await request.json()) as string[];
        requestLog.push({
          body,
          headers: {
            'content-type': request.headers.get('content-type'),
            authorization: request.headers.get('authorization'),
          },
        });
        return HttpResponse.json({
          'uuid-1': { valid_id: true, access_allowed: true },
        });
      }),
    );

    const { result } = renderHook(() => useDatasetsAccess(['uuid-1']), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.swappedDatasets).toEqual([]);
  });

  test('returns empty result and makes no HTTP request for empty UUID array', () => {
    const { result } = renderHook(() => useDatasetsAccess([]), { wrapper: TestWrapper });

    // Should not be loading since there's nothing to fetch
    expect(result.current.isLoading).toBe(false);
    expect(result.current.accessibleDatasets).toEqual({});
    expect(result.current.swappedDatasets).toEqual([]);
    expect(requestLog).toHaveLength(0);
  });

  test('batching: with 10,001 UUIDs, makes exactly 2 HTTP requests', async () => {
    const uuids = Array.from({ length: 10_001 }, (_, i) => `uuid-${i}`);

    const { result } = renderHook(() => useDatasetsAccess(uuids), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(requestLog).toHaveLength(2);
    expect((requestLog[0].body as string[]).length).toBe(10_000);
    expect((requestLog[1].body as string[]).length).toBe(1);
  });
});

describe('useDatasetAccess', () => {
  test('returns accessAllowed: true for accessible dataset', async () => {
    const { result } = renderHook(() => useDatasetAccess('uuid-1'), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.accessAllowed).toBe(true);
  });

  test('returns accessAllowed: false for inaccessible dataset', async () => {
    server.use(
      http.post(`${softAssayEndpoint}/entities/accessible-data-directories`, async ({ request }) => {
        const body = (await request.json()) as string[];
        requestLog.push({
          body,
          headers: {
            'content-type': request.headers.get('content-type'),
            authorization: request.headers.get('authorization'),
          },
        });
        return HttpResponse.json({
          'uuid-1': { valid_id: true, access_allowed: false },
        });
      }),
    );

    const { result } = renderHook(() => useDatasetAccess('uuid-1'), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.accessAllowed).toBe(false);
  });

  test('returns accessAllowed: false when dataset is not in response', async () => {
    server.use(
      http.post(`${softAssayEndpoint}/entities/accessible-data-directories`, async ({ request }) => {
        const body = (await request.json()) as string[];
        requestLog.push({
          body,
          headers: {
            'content-type': request.headers.get('content-type'),
            authorization: request.headers.get('authorization'),
          },
        });
        return HttpResponse.json({});
      }),
    );

    const { result } = renderHook(() => useDatasetAccess('uuid-missing'), { wrapper: TestWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.accessAllowed).toBe(false);
  });
});
