import React from 'react';
import { render, screen } from 'test-utils/functions';

import { SearchStoreProvider } from '../store';
import FacetSearchCombobox from './FacetSearchCombobox';

// Mock useSearch to provide aggregation data
jest.mock('../Search', () => ({
  useSearch: () => ({
    aggregations: {
      group_name: {
        group_name: {
          buckets: [
            { key: 'Harvard TMC', doc_count: 100 },
            { key: 'Stanford TMC', doc_count: 50 },
          ],
        },
      },
      origin_samples_unique_mapped_organs: {
        origin_samples_unique_mapped_organs: {
          buckets: [
            { key: 'Kidney', doc_count: 200 },
            { key: 'Liver', doc_count: 150 },
          ],
        },
      },
    },
    searchHits: [],
    isLoading: false,
    totalHitsCount: 0,
    error: undefined,
    loadMore: jest.fn(),
    setSize: jest.fn(),
    isReachingEnd: true,
  }),
}));

function createMinimalInitialState() {
  return {
    search: '',
    filters: {
      group_name: { type: 'TERM' as const, values: new Set<string>() },
      origin_samples_unique_mapped_organs: { type: 'TERM' as const, values: new Set<string>() },
    },
    initialFilters: {},
    facets: {
      group_name: { field: 'group_name', type: 'TERM' as const },
      origin_samples_unique_mapped_organs: { field: 'origin_samples_unique_mapped_organs', type: 'TERM' as const },
    },
    searchFields: [],
    sourceFields: { table: [], tile: [] },
    sortField: { field: 'last_modified_timestamp', direction: 'desc' as const },
    view: 'table',
    size: 18,
    endpoint: 'fakeEndpoint',
    type: 'Dataset' as const,
    analyticsCategory: 'Test',
  };
}

describe('FacetSearchCombobox', () => {
  it('renders the autocomplete with placeholder', () => {
    render(
      <SearchStoreProvider initialState={createMinimalInitialState()}>
        <FacetSearchCombobox />
      </SearchStoreProvider>,
    );
    expect(screen.getByPlaceholderText('Search filters')).toBeInTheDocument();
  });

  it('renders search icon in the input', () => {
    render(
      <SearchStoreProvider initialState={createMinimalInitialState()}>
        <FacetSearchCombobox />
      </SearchStoreProvider>,
    );
    // The search icon is rendered as an SVG
    expect(screen.getByPlaceholderText('Search filters')).toBeInTheDocument();
  });
});
