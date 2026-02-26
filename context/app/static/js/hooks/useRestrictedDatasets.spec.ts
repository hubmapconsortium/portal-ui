import { renderHook } from 'test-utils/functions';
import { useGetRestrictedDatasets, useRestrictedDatasetsForm } from './useRestrictedDatasets';
import { useDatasetsAccess, DatasetSwap, DatasetPermissionsResponse } from './useDatasetPermissions';
import useHubmapIds from './useHubmapIds';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

jest.mock('js/hooks/useDatasetPermissions');
jest.mock('js/hooks/useHubmapIds');
jest.mock('js/components/workspaces/toastHooks');

const mockUseDatasetsAccess = jest.mocked(useDatasetsAccess);
const mockUseHubmapIds = jest.mocked(useHubmapIds);
const mockUseWorkspaceToasts = jest.mocked(useWorkspaceToasts);

const mockToastSuccess = jest.fn();

beforeEach(() => {
  mockUseHubmapIds.mockReturnValue({ hubmapIds: [], isLoading: false });
  mockUseWorkspaceToasts.mockReturnValue({
    toastSuccessRemoveRestrictedDatasets: mockToastSuccess,
  } as unknown as ReturnType<typeof useWorkspaceToasts>);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useGetRestrictedDatasets', () => {
  test('returns empty restrictedRows when all datasets are accessible', () => {
    const accessibleDatasets: DatasetPermissionsResponse = {
      'uuid-1': { valid_id: true, access_allowed: true },
      'uuid-2': { valid_id: true, access_allowed: true },
    };
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets,
      isLoading: false,
      swappedDatasets: [],
    });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set(['uuid-1', 'uuid-2'])));

    expect(result.current.restrictedRows).toEqual([]);
    expect(result.current.swappedDatasets).toEqual([]);
  });

  test('returns restricted UUIDs when access_allowed is false', () => {
    const accessibleDatasets: DatasetPermissionsResponse = {
      'uuid-1': { valid_id: true, access_allowed: true },
      'uuid-2': { valid_id: true, access_allowed: false },
      'uuid-3': { valid_id: true, access_allowed: false },
    };
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets,
      isLoading: false,
      swappedDatasets: [],
    });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set(['uuid-1', 'uuid-2', 'uuid-3'])));

    expect(result.current.restrictedRows).toEqual(['uuid-2', 'uuid-3']);
  });

  test('returns empty restrictedRows while loading', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: {},
      isLoading: true,
      swappedDatasets: [],
    });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set(['uuid-1'])));

    expect(result.current.restrictedRows).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  test('passes swappedDatasets through from useDatasetsAccess', () => {
    const swaps: DatasetSwap[] = [{ originalUuid: 'uuid-1', actualUuid: 'uuid-2', actualHubmapId: 'HBM.222' }];
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: true } },
      isLoading: false,
      swappedDatasets: swaps,
    });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set(['uuid-1'])));

    expect(result.current.swappedDatasets).toBe(swaps);
  });

  test('handles empty Set input', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: {},
      isLoading: false,
      swappedDatasets: [],
    });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set()));

    expect(result.current.restrictedRows).toEqual([]);
  });
});

describe('useRestrictedDatasetsForm', () => {
  const restrictedDatasetsErrorMessage = (ids: string[]) => `Restricted: ${ids.join(', ')}`;

  test('returns empty errorMessages and warningMessages when no restrictions or swaps', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: true } },
      isLoading: false,
      swappedDatasets: [],
    });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-1']),
        restrictedDatasetsErrorMessage,
      }),
    );

    expect(result.current.errorMessages).toEqual([]);
    expect(result.current.warningMessages).toEqual([]);
  });

  test('returns errorMessages when restricted datasets exist', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: false } },
      isLoading: false,
      swappedDatasets: [],
    });
    mockUseHubmapIds.mockReturnValue({ hubmapIds: ['HBM.111'], isLoading: false });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-1']),
        restrictedDatasetsErrorMessage,
      }),
    );

    expect(result.current.errorMessages).toEqual(['Restricted: HBM.111']);
  });

  test('returns single-swap warning message', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: true, uuid: 'uuid-2', hubmap_id: 'HBM.222' } },
      isLoading: false,
      swappedDatasets: [{ originalUuid: 'uuid-1', actualUuid: 'uuid-2', actualHubmapId: 'HBM.222' }],
    });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-1']),
        restrictedDatasetsErrorMessage,
      }),
    );

    expect(result.current.warningMessages).toEqual([
      'Dataset uuid-1 has been updated. Its current identifier is HBM.222.',
    ]);
  });

  test('returns multi-swap warning message', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: {
        'uuid-1': { valid_id: true, access_allowed: true, uuid: 'uuid-a', hubmap_id: 'HBM.AAA' },
        'uuid-2': { valid_id: true, access_allowed: true, uuid: 'uuid-b', hubmap_id: 'HBM.BBB' },
      },
      isLoading: false,
      swappedDatasets: [
        { originalUuid: 'uuid-1', actualUuid: 'uuid-a', actualHubmapId: 'HBM.AAA' },
        { originalUuid: 'uuid-2', actualUuid: 'uuid-b', actualHubmapId: 'HBM.BBB' },
      ],
    });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-1', 'uuid-2']),
        restrictedDatasetsErrorMessage,
      }),
    );

    expect(result.current.warningMessages).toEqual([
      '2 datasets have been updated (uuid-1, uuid-2). Their identifiers may have changed.',
    ]);
  });

  test('returns both error and warning messages simultaneously', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: {
        'uuid-ok': { valid_id: true, access_allowed: true, uuid: 'uuid-new', hubmap_id: 'HBM.NEW' },
        'uuid-restricted': { valid_id: true, access_allowed: false },
      },
      isLoading: false,
      swappedDatasets: [{ originalUuid: 'uuid-ok', actualUuid: 'uuid-new', actualHubmapId: 'HBM.NEW' }],
    });
    mockUseHubmapIds.mockReturnValue({ hubmapIds: ['HBM.RESTRICTED'], isLoading: false });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-ok', 'uuid-restricted']),
        restrictedDatasetsErrorMessage,
      }),
    );

    expect(result.current.errorMessages).toEqual(['Restricted: HBM.RESTRICTED']);
    expect(result.current.warningMessages).toHaveLength(1);
  });

  test('removeRestrictedDatasets calls deselectRows and toast', () => {
    const deselectRows = jest.fn();
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: false } },
      isLoading: false,
      swappedDatasets: [],
    });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-1']),
        deselectRows,
        restrictedDatasetsErrorMessage,
      }),
    );

    result.current.removeRestrictedDatasets();

    expect(deselectRows).toHaveBeenCalledWith(['uuid-1']);
    expect(mockToastSuccess).toHaveBeenCalled();
  });

  test('removeRestrictedDatasets does not throw when deselectRows is undefined', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: false } },
      isLoading: false,
      swappedDatasets: [],
    });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-1']),
        restrictedDatasetsErrorMessage,
      }),
    );

    expect(() => result.current.removeRestrictedDatasets()).not.toThrow();
    expect(mockToastSuccess).toHaveBeenCalled();
  });
});
