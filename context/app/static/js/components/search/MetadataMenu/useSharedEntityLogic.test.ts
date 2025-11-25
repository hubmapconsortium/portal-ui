import { renderHook } from '@testing-library/react';
import { useSharedEntityLogic, entitiesToTableData } from './useSharedEntityLogic';

// Mock the dependencies
jest.mock('./hooks', () => ({
  useMetadataMenu: jest.fn(),
}));

jest.mock('js/components/search/store', () => ({
  useSearchStore: jest.fn(),
  filterHasValues: jest.fn(),
}));

jest.mock('js/components/search/utils', () => ({
  buildQuery: jest.fn(),
}));

jest.mock('js/components/search/useEsMapping', () => ({
  __esModule: true,
  default: jest.fn(),
  isESMapping: jest.fn(),
}));

import { useMetadataMenu } from './hooks';
import { useSearchStore, filterHasValues } from 'js/components/search/store';
import { buildQuery } from 'js/components/search/utils';
import useEsMapping, { isESMapping } from 'js/components/search/useEsMapping';

// Type the mocked functions
const mockUseMetadataMenu = useMetadataMenu as jest.MockedFunction<typeof useMetadataMenu>;
const mockUseSearchStore = useSearchStore as jest.MockedFunction<typeof useSearchStore>;
const mockFilterHasValues = filterHasValues as jest.MockedFunction<typeof filterHasValues>;
const mockBuildQuery = buildQuery as jest.MockedFunction<typeof buildQuery>;
const mockUseEsMapping = useEsMapping as jest.MockedFunction<typeof useEsMapping>;
const mockIsESMapping = isESMapping as jest.MockedFunction<typeof isESMapping>;

describe('useSharedEntityLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseMetadataMenu.mockReturnValue({
      selectedHits: new Set(),
      closeMenu: jest.fn(),
    });

    mockUseSearchStore.mockReturnValue({
      filters: {},
      facets: {},
      sortField: { field: 'last_modified_timestamp', direction: 'desc' },
    });

    mockFilterHasValues.mockReturnValue(false);
    mockUseEsMapping.mockReturnValue({});
    mockIsESMapping.mockReturnValue(true);
    mockBuildQuery.mockReturnValue({ post_filter: { bool: { must: [] } } });
  });

  describe('entity type mapping', () => {
    it('should map plural lowercase entity types to singular capitalized ones', () => {
      const { result } = renderHook(() => useSharedEntityLogic('donors'));
      expect(result.current.entityType).toBe('Donor');
    });

    it('should map samples to Sample', () => {
      const { result } = renderHook(() => useSharedEntityLogic('samples'));
      expect(result.current.entityType).toBe('Sample');
    });

    it('should map datasets to Dataset', () => {
      const { result } = renderHook(() => useSharedEntityLogic('datasets'));
      expect(result.current.entityType).toBe('Dataset');
    });

    it('should return undefined for entities', () => {
      const { result } = renderHook(() => useSharedEntityLogic('entities'));
      expect(result.current.entityType).toBeUndefined();
    });

    it('should return undefined for unmapped types', () => {
      const { result } = renderHook(() => useSharedEntityLogic('unknown'));
      expect(result.current.entityType).toBeUndefined();
    });
  });

  describe('query parameters with selected UUIDs', () => {
    it('should return UUIDs when selectedHits has values', () => {
      const selectedUUIDs = new Set(['uuid-1', 'uuid-2', 'uuid-3']);
      mockUseMetadataMenu.mockReturnValue({
        selectedHits: selectedUUIDs,
        closeMenu: jest.fn(),
      });

      const { result } = renderHook(() => useSharedEntityLogic('donors'));

      expect(result.current).toEqual({
        uuids: ['uuid-1', 'uuid-2', 'uuid-3'],
        entityType: 'Donor',
      });
    });
  });

  describe('query parameters with filters', () => {
    it('should return filters when no UUIDs are selected and filters have values', () => {
      const mockFilters = {
        'data_types.keyword': { values: new Set(['RNA sequencing']), type: 'TERM' },
        'origin_samples.mapped_organ.keyword': { values: new Set(['Heart']), type: 'TERM' },
      };

      mockUseSearchStore.mockReturnValue({
        filters: mockFilters,
        facets: {},
        sortField: { field: 'last_modified_timestamp', direction: 'desc' },
      });

      mockFilterHasValues
        .mockReturnValueOnce(true) // for first filter
        .mockReturnValueOnce(true); // for second filter

      const mockPostFilter = { bool: { must: [{ terms: { 'data_types.keyword': ['RNA sequencing'] } }] } };
      mockBuildQuery.mockReturnValue({ post_filter: mockPostFilter });

      const { result } = renderHook(() => useSharedEntityLogic('samples'));

      expect(result.current).toEqual({
        entityType: 'Sample',
        filters: mockPostFilter,
      });
    });

    it('should return undefined filters when no filters have values', () => {
      const mockFilters = {
        'data_types.keyword': { values: new Set(), type: 'TERM' },
      };

      mockUseSearchStore.mockReturnValue({
        filters: mockFilters,
        facets: {},
        sortField: { field: 'last_modified_timestamp', direction: 'desc' },
      });

      mockFilterHasValues.mockReturnValue(false);

      const { result } = renderHook(() => useSharedEntityLogic('datasets'));

      expect(result.current).toEqual({
        entityType: 'Dataset',
        filters: undefined,
      });
    });

    it('should handle invalid ES mapping', () => {
      mockIsESMapping.mockReturnValue(false);

      const { result } = renderHook(() => useSharedEntityLogic('donors'));

      expect(result.current).toEqual({
        entityType: 'Donor',
        filters: undefined,
      });
    });

    it('should prioritize UUIDs over filters to ensure selections are honored', () => {
      const selectedUUIDs = new Set(['uuid-1']);
      const mockFilters = {
        'data_types.keyword': { values: new Set(['RNA sequencing']), type: 'TERM' },
      };

      mockUseMetadataMenu.mockReturnValue({
        selectedHits: selectedUUIDs,
        closeMenu: jest.fn(),
      });

      mockUseSearchStore.mockReturnValue({
        filters: mockFilters,
        facets: {},
        sortField: { field: 'last_modified_timestamp', direction: 'desc' },
      });

      mockFilterHasValues.mockReturnValue(true);

      const { result } = renderHook(() => useSharedEntityLogic('samples'));

      expect(result.current).toEqual({
        uuids: ['uuid-1'],
        entityType: 'Sample',
      });
    });
  });
});

describe('entitiesToTableData', () => {
  const mockDate = new Date('2025-10-15T10:30:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('empty entities handling', () => {
    it('should return empty structure when entities array is empty', () => {
      const result = entitiesToTableData([], ['uuid', 'hubmap_id'], true, {}, 'donors');

      expect(result).toEqual({
        isReady: false,
        columnNames: [],
        rows: [],
        fileName: 'hubmap-donors-metadata-2025-10-15T10-30-00.tsv',
      });
    });
  });

  describe('field ordering', () => {
    it('should prioritize firstFields (uuid, hubmap_id) and sort remaining fields', () => {
      const entities = [{ uuid: 'test-uuid', hubmap_id: 'HBM123', zebra_field: 'z', alpha_field: 'a' }];
      const allKeys = ['zebra_field', 'uuid', 'alpha_field', 'hubmap_id'];

      const result = entitiesToTableData(entities, allKeys, false);

      expect(result.columnNames).toEqual(['uuid', 'hubmap_id', 'alpha_field', 'zebra_field']);
    });

    it('should only include fields that exist in allKeys', () => {
      const entities = [{ uuid: 'test-uuid', hubmap_id: 'HBM123', extra_field: 'extra' }];
      const allKeys = ['uuid', 'hubmap_id']; // extra_field not in allKeys

      const result = entitiesToTableData(entities, allKeys, false);

      expect(result.columnNames).toEqual(['uuid', 'hubmap_id']);
      expect(result.rows[0]).toEqual(['test-uuid', 'HBM123']);
      expect(result.isReady).toBe(true);
    });
  });

  describe('data normalization', () => {
    it('should convert different data types to strings correctly', () => {
      const entities = [
        {
          uuid: 'test-uuid',
          string_field: 'string_value',
          number_field: 42,
          boolean_field: true,
          array_field: ['item1', 'item2', 'item3'],
          object_field: { nested: 'value' },
          null_field: null,
          undefined_field: undefined,
          empty_string: '',
        },
      ];
      const allKeys = Object.keys(entities[0]);

      const result = entitiesToTableData(entities, allKeys, false);

      const entityRow = result.rows[0];
      const columnNames = result.columnNames;

      expect(entityRow[columnNames.indexOf('string_field')]).toBe('string_value');
      expect(entityRow[columnNames.indexOf('number_field')]).toBe('42');
      expect(entityRow[columnNames.indexOf('boolean_field')]).toBe('true');
      expect(entityRow[columnNames.indexOf('array_field')]).toBe('item1, item2, item3');
      expect(entityRow[columnNames.indexOf('object_field')]).toBe('{"nested":"value"}');
      expect(entityRow[columnNames.indexOf('null_field')]).toBe('N/A');
      expect(entityRow[columnNames.indexOf('undefined_field')]).toBe('N/A');
      expect(entityRow[columnNames.indexOf('empty_string')]).toBe('N/A');
      expect(result.isReady).toBe(true);
    });

    it('should fill missing fields with N/A', () => {
      const entities = [
        { uuid: 'uuid-1', field1: 'value1' },
        { uuid: 'uuid-2', field2: 'value2' },
      ];
      const allKeys = ['uuid', 'field1', 'field2'];

      const result = entitiesToTableData(entities, allKeys, false);

      expect(result.rows).toEqual([
        ['uuid-1', 'value1', 'N/A'],
        ['uuid-2', 'N/A', 'value2'],
      ]);
      expect(result.isReady).toBe(true);
    });
  });

  describe('descriptions handling', () => {
    it('should include descriptions row when withDescriptions is true', () => {
      const entities = [{ uuid: 'test-uuid', hubmap_id: 'HBM123' }];
      const allKeys = ['uuid', 'hubmap_id'];
      const descriptions = {
        uuid: 'Unique identifier',
        hubmap_id: 'HuBMAP identifier',
      };

      const result = entitiesToTableData(entities, allKeys, true, descriptions);

      expect(result.rows).toHaveLength(2); // descriptions + data
      expect(result.rows[0]).toEqual(['Unique identifier', 'HuBMAP identifier']);
      expect(result.rows[1]).toEqual(['test-uuid', 'HBM123']);
      expect(result.isReady).toBe(true);
    });

    it('should not include descriptions row when withDescriptions is false', () => {
      const entities = [{ uuid: 'test-uuid', hubmap_id: 'HBM123' }];
      const allKeys = ['uuid', 'hubmap_id'];
      const descriptions = {
        uuid: 'Unique identifier',
        hubmap_id: 'HuBMAP identifier',
      };

      const result = entitiesToTableData(entities, allKeys, false, descriptions);

      expect(result.rows).toHaveLength(1); // only data
      expect(result.rows[0]).toEqual(['test-uuid', 'HBM123']);
      expect(result.isReady).toBe(true);
    });

    it('should use empty string for missing descriptions', () => {
      const entities = [{ uuid: 'test-uuid', field_without_description: 'value' }];
      const allKeys = ['uuid', 'field_without_description'];
      const descriptions = {
        uuid: 'Unique identifier',
        // field_without_description is missing
      };

      const result = entitiesToTableData(entities, allKeys, true, descriptions);

      expect(result.rows[0]).toEqual(['Unique identifier', '']); // descriptions row
      expect(result.rows[1]).toEqual(['test-uuid', 'value']); // data row
      expect(result.isReady).toBe(true);
    });
  });

  describe('file naming', () => {
    it('should generate filename with timestamp and entity type', () => {
      const result = entitiesToTableData([], [], false, {}, 'samples');

      expect(result.fileName).toBe('hubmap-samples-metadata-2025-10-15T10-30-00.tsv');
      expect(result.isReady).toBe(false);
    });

    it('should default to "entities" for entity type', () => {
      const result = entitiesToTableData([], [], false);

      expect(result.fileName).toBe('hubmap-entities-metadata-2025-10-15T10-30-00.tsv');
      expect(result.isReady).toBe(false);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple entities with mixed data types', () => {
      const entities = [
        {
          uuid: 'uuid-1',
          hubmap_id: 'HBM001',
          data_types: ['RNA-seq', 'scRNA-seq'],
          metadata: { protocol: 'v1' },
          count: 1000,
          active: true,
        },
        {
          uuid: 'uuid-2',
          hubmap_id: 'HBM002',
          data_types: ['ATAC-seq'],
          metadata: null,
          count: 500,
          active: false,
        },
      ];
      const allKeys = ['uuid', 'hubmap_id', 'data_types', 'metadata', 'count', 'active'];

      const result = entitiesToTableData(entities, allKeys, false);

      expect(result.columnNames).toEqual(['uuid', 'hubmap_id', 'active', 'count', 'data_types', 'metadata']);
      expect(result.rows).toEqual([
        ['uuid-1', 'HBM001', 'true', '1000', 'RNA-seq, scRNA-seq', '{"protocol":"v1"}'],
        ['uuid-2', 'HBM002', 'false', '500', 'ATAC-seq', 'N/A'],
      ]);
      expect(result.isReady).toBe(true);
    });
  });
});
