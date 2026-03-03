import { renderHook } from 'test-utils/functions';
import { useGetRestrictedDatasets, useRestrictedDatasetsForm } from './useRestrictedDatasets';
import { useDatasetsAccess, DatasetPermissionsResponse } from './useDatasetPermissions';
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
    mockUseDatasetsAccess.mockReturnValue({ accessibleDatasets, isLoading: false });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set(['uuid-1', 'uuid-2'])));

    expect(result.current.restrictedRows).toEqual([]);
  });

  test('returns restricted UUIDs when access_allowed is false', () => {
    const accessibleDatasets: DatasetPermissionsResponse = {
      'uuid-1': { valid_id: true, access_allowed: true },
      'uuid-2': { valid_id: true, access_allowed: false },
      'uuid-3': { valid_id: true, access_allowed: false },
    };
    mockUseDatasetsAccess.mockReturnValue({ accessibleDatasets, isLoading: false });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set(['uuid-1', 'uuid-2', 'uuid-3'])));

    expect(result.current.restrictedRows).toEqual(['uuid-2', 'uuid-3']);
  });

  test('returns empty restrictedRows while loading', () => {
    mockUseDatasetsAccess.mockReturnValue({ accessibleDatasets: {}, isLoading: true });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set(['uuid-1'])));

    expect(result.current.restrictedRows).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  test('handles empty Set input', () => {
    mockUseDatasetsAccess.mockReturnValue({ accessibleDatasets: {}, isLoading: false });

    const { result } = renderHook(() => useGetRestrictedDatasets(new Set()));

    expect(result.current.restrictedRows).toEqual([]);
  });
});

describe('useRestrictedDatasetsForm', () => {
  const restrictedDatasetsErrorMessage = (ids: string[]) => `Restricted: ${ids.join(', ')}`;

  test('returns empty errorMessages when no restrictions', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: true } },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useRestrictedDatasetsForm({
        selectedRows: new Set(['uuid-1']),
        restrictedDatasetsErrorMessage,
      }),
    );

    expect(result.current.errorMessages).toEqual([]);
  });

  test('returns errorMessages when restricted datasets exist', () => {
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: false } },
      isLoading: false,
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

  test('removeRestrictedDatasets calls deselectRows and toast', () => {
    const deselectRows = jest.fn();
    mockUseDatasetsAccess.mockReturnValue({
      accessibleDatasets: { 'uuid-1': { valid_id: true, access_allowed: false } },
      isLoading: false,
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
