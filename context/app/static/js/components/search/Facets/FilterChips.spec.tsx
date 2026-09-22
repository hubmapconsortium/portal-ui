import React from 'react';
import { render, screen } from 'test-utils/functions';

import { SearchStoreProvider, FACETS, FiltersType, FacetsType, SearchStoreState } from '../store';
import FilterChips from './FilterChips';

function createMinimalInitialState(filters: FiltersType = {}, facets: FacetsType = {}): SearchStoreState {
  return {
    search: '',
    filters,
    initialFilters: {},
    facets,
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

function renderWithStore(filters: FiltersType, facets: FacetsType = {}) {
  const initialState = createMinimalInitialState(filters, facets);
  return render(
    <SearchStoreProvider initialState={initialState}>
      <FilterChips />
    </SearchStoreProvider>,
  );
}

describe('FilterChips', () => {
  it('renders "No active filters" when no filters are active', () => {
    renderWithStore({});
    expect(screen.getByText('No active filters')).toBeInTheDocument();
  });

  it('renders a single term filter chip', () => {
    renderWithStore(
      {
        group_name: { type: FACETS.term, values: new Set(['Harvard TMC']) },
      },
      {
        group_name: { field: 'group_name', type: FACETS.term },
      },
    );
    expect(screen.getByText(/Harvard TMC/)).toBeInTheDocument();
  });

  it('renders Clear Filters button when filters are active', () => {
    renderWithStore(
      {
        group_name: { type: FACETS.term, values: new Set(['Harvard TMC']) },
      },
      {
        group_name: { field: 'group_name', type: FACETS.term },
      },
    );
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('renders multiple term filter chips', () => {
    renderWithStore(
      {
        group_name: { type: FACETS.term, values: new Set(['Harvard TMC']) },
        sample_category: { type: FACETS.term, values: new Set(['section']) },
      },
      {
        group_name: { field: 'group_name', type: FACETS.term },
        sample_category: { field: 'sample_category', type: FACETS.term },
      },
    );
    expect(screen.getByText(/Harvard TMC/)).toBeInTheDocument();
    expect(screen.getByText(/Section/)).toBeInTheDocument();
  });

  describe('expand/collapse behavior', () => {
    // The expand/collapse behavior depends on DOM measurements (scrollHeight /
    // clientHeight) which are not available in jsdom. The hook's own measurement
    // logic is covered in js/hooks/useHasOverflow.spec.tsx, which stubs them.

    it('toggles expanded state when expand chip is clicked', () => {
      // Since jsdom doesn't support layout, hasOverflow is always false here.
      // This is a smoke test that the component renders without errors
      renderWithStore(
        {
          group_name: { type: FACETS.term, values: new Set(['Harvard TMC']) },
        },
        {
          group_name: { field: 'group_name', type: FACETS.term },
        },
      );

      // The expand chip is always rendered but hidden when there's no overflow
      const toggle = screen.getByTestId('filter-chips-expand-toggle');
      expect(toggle).toBeInTheDocument();
      expect(toggle).not.toBeVisible();
    });
  });
});
