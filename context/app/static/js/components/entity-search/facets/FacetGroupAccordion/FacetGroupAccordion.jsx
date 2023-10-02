import React from 'react';
import Typography from '@mui/material/Typography';

import { StyledExpandMoreIcon } from 'js/components/searchPage/filters/style';
import { OuterAccordion, OuterAccordionSummary, OuterAccordionDetails } from './style';

function FacetGroupAccordion({ label, defaultExpanded, children }) {
  return (
    <OuterAccordion defaultExpanded={defaultExpanded} variant="unstyled" disableGutters>
      <OuterAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
        <Typography variant="subtitle2" color="secondary">
          {label}
        </Typography>
      </OuterAccordionSummary>
      <OuterAccordionDetails>{children}</OuterAccordionDetails>
    </OuterAccordion>
  );
}

export default FacetGroupAccordion;
