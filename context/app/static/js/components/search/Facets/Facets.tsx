import React from 'react';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import Stack from '@mui/material/Stack';

import { TermFacet, HierarchicalTermFacet } from './TermFacet';
import RangeFacet from './RangeFacet';
import { FacetGroups } from '../Search';
import { isDateFacet, isHierarchicalFacet, isRangeFacet, isTermFacet } from '../store';
import FacetAccordion from './FacetAccordion';
import DateRangeFacet from './DateRangeFacet';

export function Facets({ facetGroups }: { facetGroups: FacetGroups }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

                if (isDateFacet(f)) {
                  return <DateRangeFacet {...f} key={f.field} />;
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
    </LocalizationProvider>
  );
}

export default Facets;
