import React from 'react';
import { renderHook, AllTheProviders } from 'test-utils/functions';

import SearchConfigProvider from 'js/components/entity-search/SearchWrapper';
import { useGroupedFacets } from './hooks';

const searchDataFixture = {
  'donor.mapped_metadata.age_value': {
    avg: 44.1220653843975,
    count: 4251,
    max: 78,
    min: 1,
    sum: 187562.8999490738,
  },
  'donor.mapped_metadata.body_mass_index_value': {
    avg: 28.45118761917169,
    count: 3906,
    max: 64.0999984741211,
    min: 15.869999885559082,
    sum: 111130.33884048462,
  },
  'donor.mapped_metadata.height_value': {
    avg: 167.3203374860197,
    count: 3084,
    max: 193,
    min: 63,
    sum: 516015.92080688477,
  },
};

// Mock useSearchData hook for the numeric facet calculation
jest.mock('js/hooks/useSearchData', () =>
  jest.fn(() => ({ searchData: { aggregations: searchDataFixture }, isLoading: false })),
);

test('should group facets', () => {
  const facets = {
    mapped_data_types: { facetGroup: 'Dataset Metadata' },
    mapped_status: { facetGroup: 'Dataset Metadata' },
    group_name: { facetGroup: 'Affiliation' },
  };
  const resultsFacets = [
    { identifier: 'mapped_data_types' },
    { identifier: 'group_name' },
    { identifier: 'mapped_status' },
  ];

  const entityType = 'dataset';
  const wrapper = ({ children }) => (
    <AllTheProviders>
      <SearchConfigProvider uniqueFacets={facets} uniqueFields={{}} entityType={entityType}>
        {children}
      </SearchConfigProvider>
    </AllTheProviders>
  );

  const { result } = renderHook(() => useGroupedFacets(resultsFacets), {
    wrapper,
  });

  expect(result.current).toStrictEqual({
    'Dataset Metadata': [{ identifier: 'mapped_data_types' }, { identifier: 'mapped_status' }],
    Affiliation: [{ identifier: 'group_name' }],
  });
});
