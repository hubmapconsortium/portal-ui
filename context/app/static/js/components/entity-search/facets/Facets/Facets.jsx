import React from 'react';
import Paper from '@mui/material/Paper';

import FacetGroupAccordion from 'js/components/entity-search/facets/FacetGroupAccordion';
import Facet from 'js/components/entity-search/facets/Facet';
import { useGroupedFacets } from './hooks';

function Facets({ resultsFacets }) {
  const groupedFacets = useGroupedFacets(resultsFacets);

  return (
    <Paper>
      {Object.entries(groupedFacets).map(([groupLabel, facetGroup], i) => (
        <FacetGroupAccordion label={groupLabel} defaultExpanded={i === 0} key={groupLabel}>
          {facetGroup.map((facet) => (
            <Facet key={facet.identifier} facet={facet} />
          ))}
        </FacetGroupAccordion>
      ))}
    </Paper>
  );
}

export default Facets;
