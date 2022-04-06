import React from 'react';

import SelectFacet from 'js/components/entity-search/facets/select/SelectFacet';
import FacetGroupAccordion from 'js/components/entity-search/facets/FacetGroupAccordion';
import { useGroupedFacets } from './hooks';

function Facets({ resultsFacets }) {
  const groupedFacets = useGroupedFacets(resultsFacets);

  return Object.entries(groupedFacets).map(([groupLabel, facetGroup], i) => (
    <FacetGroupAccordion label={groupLabel} isFirst={i === 0} key={groupLabel}>
      {facetGroup.map((facet) => (
        <SelectFacet key={facet.identifier} facet={facet} />
      ))}
    </FacetGroupAccordion>
  ));
}

export default Facets;
