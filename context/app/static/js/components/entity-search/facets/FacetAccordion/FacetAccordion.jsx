import React from 'react';

import Accordion from '@mui/material/Accordion';
import { StyledExpandMoreIcon } from 'js/components/searchPage/filters/style';
import { InnerAccordionDetails, InnerAccordionSummary, StyledTypography } from './style';

function FacetAccordion({ label, identifier, children }) {
  return (
    <Accordion key={identifier} defaultExpanded disableGutters variant="unstyled">
      <InnerAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
        <StyledTypography variant="subtitle2" color="textPrimary">
          {label}
        </StyledTypography>
      </InnerAccordionSummary>
      <InnerAccordionDetails id={identifier}>{children}</InnerAccordionDetails>
    </Accordion>
  );
}

export default FacetAccordion;
