import React from 'react';

import RangeFacetChip from 'js/components/entity-search/facets/facetChips/RangeFacetChip';
import SelectFacetChip from 'js/components/entity-search/facets/facetChips/SelectFacetChip';
import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';

const filterTypeToComponentMap = {
  ValueSelectedFilter: SelectFacetChip,
  NumericRangeSelectedFilter: RangeFacetChip,
};

function FacetChips({ appliedFilters }) {
  const { defaultFilters } = useSearchConfigStore();

  return appliedFilters.reduce((acc, filter) => {
    if (filter.id in defaultFilters) {
      return acc;
    }
    const FilterChipComponent = filterTypeToComponentMap[filter.type];
    acc.push(<FilterChipComponent filter={filter} key={filter.id} />);
    return acc;
  }, []);
}

export default FacetChips;
