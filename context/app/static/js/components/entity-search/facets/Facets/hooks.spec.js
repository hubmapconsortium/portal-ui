import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import SearchConfigProvider from 'js/components/entity-search/SearchWrapper/provider';
import { useGroupedFacets } from './hooks';

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
  const wrapper = ({ children }) => (
    <SearchConfigProvider initialConfig={{ facets, fields: {}, entityType: 'dataset' }}>
      {children}
    </SearchConfigProvider>
  );

  const { result } = renderHook(() => useGroupedFacets(resultsFacets), {
    wrapper,
  });

  expect(result.current).toStrictEqual({
    'Dataset Metadata': [{ identifier: 'mapped_data_types' }, { identifier: 'mapped_status' }],
    Affiliation: [{ identifier: 'group_name' }],
  });
});
