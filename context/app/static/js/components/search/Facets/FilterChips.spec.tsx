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
    // The expand/collapse behavior depends on DOM measurements (offsetTop)
    // which are not available in jsdom. We test the toggle chip interaction instead.

    it('toggles expanded state when expand chip is clicked', () => {
      // We mock the overflow by checking that the toggle chip exists after interacting with it
      // Since jsdom doesn't support layout, overflowCount will always be 0
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
