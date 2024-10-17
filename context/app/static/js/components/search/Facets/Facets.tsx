import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { TermFacet, HierarchicalTermFacet } from './TermFacet';
import RangeFacet from './RangeFacet';
import { FacetGroups } from '../Search';
import { isHierarchicalFacet, isRangeFacet, isTermFacet } from '../store';
import FacetAccordion from './FacetAccordion';

export function Facets({ facetGroups }: { facetGroups: FacetGroups }) {
  return (
    <Box sx={{ minWidth: 250, maxWidth: 250 }}>
      <Stack
        sx={(theme) => ({
          alignItems: 'center',
          boxShadow: theme.shadows[1],
          padding: theme.spacing(1),
          backgroundColor: theme.palette.white.main,
        })}
      >
        {Object.entries(facetGroups).map(([k, v], i) => (
          <FacetAccordion
            title={k}
            position="outer"
            key={k}
            isFirst={i === 0}
            isLast={i === Object.keys(facetGroups).length - 1}
          >
            {v.map((f) => {
              if (isHierarchicalFacet(f)) {
                return <HierarchicalTermFacet {...f} key={f.field} />;
              }
              if (isRangeFacet(f)) {
                return <RangeFacet {...f} key={f.field} />;
              }

              if (isTermFacet(f)) {
                return <TermFacet {...f} key={f.field} />;
              }

              return null;
            })}
          </FacetAccordion>
        ))}
      </Stack>
    </Box>
  );
}

export default Facets;
