import React from 'react';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import Stack from '@mui/material/Stack';

import { TermFacet, HierarchicalTermFacet } from './TermFacet';
import RangeFacet from './RangeFacet';
import { FacetGroups } from '../Search';
import {
  isDateFacet,
  isExistsFacet,
  isHierarchicalFacet,
  isRangeFacet,
  isTermFacet,
  isBooleanGroupFacet,
} from '../store';
import FacetAccordion from './FacetAccordion';
import DateRangeFacet from './DateRangeFacet';
import ExistsFacet from './ExistsFacet';
import BooleanGroupFacet from './BooleanGroupFacet';
import FacetSearchCombobox from './FacetSearchCombobox';
import IncludeSupersededFacet from './IncludeSupersededFacet';
import Divider from '@mui/material/Divider';

export function Facets({ facetGroups }: { facetGroups: FacetGroups }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minWidth: 250, maxWidth: '25%' }}>
        <Stack
          sx={(theme) => ({
            alignItems: 'center',
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.white.main,
          })}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          <Box sx={{ width: '100%', p: 1, pb: 0 }}>
            <FacetSearchCombobox />
          </Box>
          {Object.entries(facetGroups).map(([k, v], i) => (
            <FacetAccordion title={k} position="outer" key={k} isFirst={i === 0}>
              {v.flatMap((f) => {
                if ('visible' in f && !f.visible) {
                  return [];
                }
                const rendered: React.ReactNode[] = [];
                if (isHierarchicalFacet(f)) {
                  rendered.push(<HierarchicalTermFacet {...f} key={f.field} />);
                } else if (isRangeFacet(f)) {
                  rendered.push(<RangeFacet {...f} key={f.field} />);
                } else if (isDateFacet(f)) {
                  rendered.push(<DateRangeFacet {...f} key={f.field} />);
                } else if (isTermFacet(f)) {
                  rendered.push(<TermFacet {...f} key={f.field} />);
                } else if (isExistsFacet(f)) {
                  rendered.push(<ExistsFacet {...f} key={f.field} />);
                } else if (isBooleanGroupFacet(f)) {
                  rendered.push(<BooleanGroupFacet {...f} key={f.field} />);
                }

                // Inject the "Include superseded" toggle directly after the Status facet
                if (f.field === 'mapped_status') {
                  rendered.push(<IncludeSupersededFacet key="include-superseded" />);
                }

                return rendered;
              })}
            </FacetAccordion>
          ))}
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

export default Facets;
