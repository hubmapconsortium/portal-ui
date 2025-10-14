import { renderHook } from '@testing-library/react';
import { useLineupEntities, UseLineupPageEntitiesProps } from './hooks';

// Mock the dependencies
jest.mock('js/hooks/useSearchData', () => ({
  useSearchHits: jest.fn(),
}));

import { useSearchHits } from 'js/hooks/useSearchData';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Entity } from 'js/components/types';

// Type the mocked function
const mockUseSearchHits = useSearchHits as jest.MockedFunction<typeof useSearchHits>;

// Simplified mock data for testing
const createMockEntity = (sourceOverrides = {}) =>
  ({
    _index: 'test-index',
    _id: 'test-id-123',
    _score: 1.0,
    _source: {
      uuid: 'test-uuid-123',
      hubmap_id: 'HBM123.ABC.456',
      entity_type: 'dataset',
      published_timestamp: 1640995200000,
      last_modified_timestamp: 1640995200000,
      created_timestamp: 1640995200000,
      status: 'Published',
      mapped_status: 'published',
      data_access_level: 'public',
      mapped_consortium: 'HuBMAP',
      group_name: 'Test Group',
      created_by_user_displayname: 'Test User',
      created_by_user_email: 'test@example.com',
      origin_samples_unique_mapped_organs: ['Heart'],
      sample_category: 'primary',
      metadata: {
        assay_type: 'scRNA-seq',
        protocol_url: 'https://example.com/protocol',
      },
      mapped_metadata: {
        data_types: ['RNA sequencing'],
        analyte_class: ['RNA'],
      },
      organ_donor_data: {
        age: 45,
        sex: 'Male',
      },
      living_donor_data: {
        bmi: 25.5,
      },
      donor: {
        hubmap_id: 'HBM123.DONOR.001',
        entity_type: 'donor',
      },
      extra_metadata: {
        custom_field: 'custom_value',
      },
      ...sourceOverrides,
    },
  }) as unknown as Required<SearchHit<Entity>>;

const sourceFields = [
  'uuid',
  'hubmap_id',
  'published_timestamp',
  'last_modified_timestamp',
  'created_timestamp',
  'status',
  'mapped_status',
  'data_access_level',
  'mapped_consortium',
  'group_name',
  'created_by_user_displayname',
  'created_by_user_email',
  'origin_samples_unique_mapped_organs',
  'sample_category',
  'donor',
  'metadata',
  'mapped_metadata',
  'organ_donor_data',
  'extra_metadata',
  'living_donor_data',
];

describe('useLineupEntities', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockUseSearchHits.mockReturnValue({
      searchHits: [],
      isLoading: false,
    });
  });

  describe('query building', () => {
    it('should build query with UUIDs when provided', () => {
      const uuids = ['uuid-1', 'uuid-2', 'uuid-3'];

      renderHook(() =>
        useLineupEntities({
          uuids,
          entityType: 'Dataset',
        }),
      );

      expect(mockUseSearchHits).toHaveBeenCalledWith(
        {
          size: 10_000,
          query: {
            bool: {
              must: [{ ids: { values: uuids } }, { term: { entity_type: 'dataset' } }],
            },
          },
          _source: expect.arrayContaining(sourceFields) as string[],
        },
        { shouldFetch: true },
      );
    });

    it('should build query with filters when no UUIDs provided', () => {
      const filters = {
        term: { 'data_types.keyword': 'RNA sequencing' },
      };

      renderHook(() =>
        useLineupEntities({
          entityType: 'Sample',
          filters,
        }),
      );

      expect(mockUseSearchHits).toHaveBeenCalledWith(
        {
          size: 10_000,
          query: {
            bool: {
              must: [filters, { term: { entity_type: 'sample' } }],
            },
          },
          _source: expect.arrayContaining(sourceFields) as string[],
        },
        { shouldFetch: true },
      );
    });

    it('should prioritize UUIDs over filters', () => {
      const uuids = ['uuid-1'];
      const filters = { term: { 'data_types.keyword': 'RNA sequencing' } };

      renderHook(() =>
        useLineupEntities({
          uuids,
          entityType: 'Dataset',
          filters,
        }),
      );

      expect(mockUseSearchHits).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            bool: {
              must: [{ ids: { values: uuids } }, { term: { entity_type: 'dataset' } }],
            },
          },
        }),
        { shouldFetch: true },
      );
    });

    it('should build query with only entity type when no UUIDs or filters', () => {
      renderHook(() =>
        useLineupEntities({
          entityType: 'Donor',
        }),
      );

      expect(mockUseSearchHits).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            bool: {
              must: [{ term: { entity_type: 'donor' } }],
            },
          },
        }),
        { shouldFetch: true },
      );
    });

    it('should return empty query when no parameters provided', () => {
      renderHook(() => useLineupEntities({}));

      expect(mockUseSearchHits).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {},
        }),
        { shouldFetch: true },
      );
    });

    it('should respect shouldFetchData parameter', () => {
      renderHook(() =>
        useLineupEntities({
          entityType: 'Dataset',
          shouldFetchData: false,
        }),
      );

      expect(mockUseSearchHits).toHaveBeenCalledWith(expect.any(Object), { shouldFetch: false });
    });
  });

  describe('entity processing', () => {
    it('should process entities and extract keys correctly', () => {
      const mockEntities = [createMockEntity()];

      mockUseSearchHits.mockReturnValue({
        searchHits: mockEntities,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        useLineupEntities({
          entityType: 'Dataset',
        }),
      );

      // Should have entities
      expect(result.current.entities).toHaveLength(1);
      expect(result.current.totalHitsCount).toBe(1);

      // Should extract keys from all nested objects
      expect(result.current.allKeys).toContain('uuid');
      expect(result.current.allKeys).toContain('hubmap_id');
      expect(result.current.allKeys).toContain('assay_type'); // from metadata
      expect(result.current.allKeys).toContain('age'); // from organ_donor_data
      expect(result.current.allKeys).toContain('donor.hubmap_id'); // special case

      // Should not contain nested field names
      expect(result.current.allKeys).not.toContain('metadata');
      expect(result.current.allKeys).not.toContain('organ_donor_data');
    });

    it('should filter entities based on selectedKeys', () => {
      const mockEntities = [createMockEntity()];

      mockUseSearchHits.mockReturnValue({
        searchHits: mockEntities,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        useLineupEntities({
          entityType: 'Dataset',
          selectedKeys: ['hubmap_id', 'assay_type'],
        }),
      );

      const entity = result.current.entities[0];

      // Should include selected fields that exist
      expect(entity.hubmap_id).toBe('HBM123.ABC.456');
      expect(entity.assay_type).toBe('scRNA-seq');
    });

    it('should handle empty entities array', () => {
      mockUseSearchHits.mockReturnValue({
        searchHits: [],
        isLoading: false,
      });

      const { result } = renderHook(() =>
        useLineupEntities({
          entityType: 'Dataset',
        }),
      );

      expect(result.current.allKeys).toEqual([]);
      expect(result.current.entities).toEqual([]);
      expect(result.current.totalHitsCount).toBe(0);
    });

    it('should filter nested fields from final entity objects', () => {
      const mockEntities = [createMockEntity()];

      mockUseSearchHits.mockReturnValue({
        searchHits: mockEntities,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        useLineupEntities({
          entityType: 'Dataset',
        }),
      );

      const entity = result.current.entities[0];

      // Nested field objects should be filtered out
      expect(entity.metadata).toBeUndefined();
      expect(entity.mapped_metadata).toBeUndefined();
      expect(entity.organ_donor_data).toBeUndefined();
      expect(entity.living_donor_data).toBeUndefined();
      expect(entity.donor).toBeUndefined();
      expect(entity.extra_metadata).toBeUndefined();
    });
  });

  describe('return values', () => {
    it('should return correct structure', () => {
      const mockEntities = [createMockEntity()];

      mockUseSearchHits.mockReturnValue({
        searchHits: mockEntities,
        isLoading: true,
      });

      const { result } = renderHook(() =>
        useLineupEntities({
          entityType: 'Dataset',
        }),
      );

      expect(result.current).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        entities: expect.any(Array<object>),
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        allKeys: expect.any(Array<string>),
        hitCount: 1,
      });
    });
  });

  describe('memoization', () => {
    it('should update query when dependencies change', () => {
      const initialProps = {
        uuids: ['uuid-1'],
        entityType: 'Dataset',
      } as UseLineupPageEntitiesProps;
      const { rerender } = renderHook(({ uuids, entityType }) => useLineupEntities({ uuids, entityType }), {
        initialProps,
      });

      expect(mockUseSearchHits).toHaveBeenCalledTimes(1);

      // Rerender with different props
      rerender({
        uuids: ['uuid-2'],
        entityType: 'Donor',
      });

      // Should call useSearchHits again with new query
      expect(mockUseSearchHits).toHaveBeenCalledTimes(2);
    });
  });
});
