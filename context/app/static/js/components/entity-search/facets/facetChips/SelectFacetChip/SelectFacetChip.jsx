import React from 'react';
import FacetChip from 'js/components/entity-search/facets/facetChips/FacetChip';

import useFilterOnClick from 'js/components/entity-search/searchkit-modifications/useFilterOnClick';

function SelectFacetChip({ filter: { identifier, value, label } }) {
  const handleDelete = useFilterOnClick({ identifier, value });

  return <FacetChip label={label} value={value} onDelete={handleDelete} />;
}

export default SelectFacetChip;
