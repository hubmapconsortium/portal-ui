import React from 'react';
import RangeFacetChip from 'js/components/entity-search/facets/facetChips/RangeFacetChip';
import SelectFacetChip from 'js/components/entity-search/facets/facetChips/SelectFacetChip';

const filterTypeToComponentMap = {
  ValueSelectedFilter: SelectFacetChip,
  NumericRangeSelectedFilter: RangeFacetChip,
};

function FacetChips({ appliedFilters }) {
  return appliedFilters.map((filter) => {
    const FilterChipComponent = filterTypeToComponentMap[filter.type];
    return <FilterChipComponent filter={filter} key={filter.id} />;
  });
}

export default FacetChips;
