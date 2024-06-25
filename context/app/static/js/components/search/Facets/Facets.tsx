import React from 'react';
import Box from '@mui/material/Box';

import { TermFacet, HierarchicalTermFacet } from './TermFacet';
import RangeFacet from './RangeFacet';
import { FacetGroups } from '../Search';
import { FACETS } from '../store';
import FacetAccordion from './FacetAccordion';

export function Facets({ facetGroups }: { facetGroups: FacetGroups }) {
  return (
    <Box sx={{ maxWidth: 246, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      {Object.entries(facetGroups).map(([k, v]) => (
        <FacetAccordion title={k} position="outer" key={k}>
          {v.map((f) => {
            if (f.type === FACETS.hierarchical) {
              return <HierarchicalTermFacet {...f} key={f.field} />;
            }
            if (f.type === FACETS.range) {
              return <RangeFacet {...f} key={f.field} />;
            }

            return <TermFacet {...f} key={f.field} />;
          })}
        </FacetAccordion>
      ))}
    </Box>
  );
}

export default Facets;
