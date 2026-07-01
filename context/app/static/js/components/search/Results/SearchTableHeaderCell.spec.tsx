import { getColumnFacetInfo } from './SearchTableHeaderCell';
import { FACETS } from '../store';
import type { FacetsType } from '../store';

// Unit tests for the exported getColumnFacetInfo helper from SearchTableHeaderCell.
describe('SearchTableHeaderCell', () => {
  describe('getColumnFacetInfo logic', () => {
    const facets: FacetsType = {
      group_name: { field: 'group_name', type: FACETS.term },
      origin_samples_unique_mapped_organs: { field: 'origin_samples_unique_mapped_organs', type: FACETS.term },
      raw_dataset_type: { field: 'raw_dataset_type', childField: 'assay_display_name', type: FACETS.hierarchical },
      mapped_status: {
        field: 'mapped_status',
        childField: 'mapped_data_access_level',
        type: FACETS.hierarchical,
      },
      published_timestamp: { field: 'published_timestamp', type: FACETS.date },
      'mapped_metadata.sex': { field: 'mapped_metadata.sex', type: FACETS.term },
      'mapped_metadata.age_value': { field: 'mapped_metadata.age_value', type: FACETS.range },
    };

    it('returns term info for exact match term facet', () => {
      const result = getColumnFacetInfo('group_name', facets);
      expect(result).toEqual({ filterType: 'term', facetField: 'group_name' });
    });

    it('returns hierarchical_parent info for hierarchical facet', () => {
      const result = getColumnFacetInfo('mapped_status', facets);
      expect(result).toEqual({
        filterType: 'hierarchical_parent',
        facetField: 'mapped_status',
        childField: 'mapped_data_access_level',
      });
    });

    it('returns hierarchical_child info for child field', () => {
      const result = getColumnFacetInfo('assay_display_name', facets);
      expect(result).toEqual({
        filterType: 'hierarchical_child',
        facetField: 'raw_dataset_type',
        childField: 'assay_display_name',
      });
    });

    it('returns null for date facets', () => {
      const result = getColumnFacetInfo('published_timestamp', facets);
      // Date facets return null because they're not term or hierarchical
      expect(result).toBeNull();
    });

    it('returns null for range facets', () => {
      const result = getColumnFacetInfo('mapped_metadata.age_value', facets);
      expect(result).toBeNull();
    });

    it('returns null for unknown fields', () => {
      const result = getColumnFacetInfo('unknown_field', facets);
      expect(result).toBeNull();
    });

    it('finds term facet by stem match', () => {
      const result = getColumnFacetInfo('mapped_metadata.sex', facets);
      expect(result).toEqual({ filterType: 'term', facetField: 'mapped_metadata.sex' });
    });
  });
});
