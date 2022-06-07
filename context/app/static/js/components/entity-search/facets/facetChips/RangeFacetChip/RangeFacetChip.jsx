import React from 'react';
import { useSearchkit } from '@searchkit/client';

import FacetChip from 'js/components/entity-search/facets/facetChips/FacetChip';

function RangeFacetChip({ filter }) {
  const api = useSearchkit();

  return (
    <FacetChip
      label={filter.label}
      value={`${filter.min} - ${filter.max}`}
      onDelete={() => {
        api.removeFilter(filter);
        api.search();
      }}
    />
  );
}

export default RangeFacetChip;
