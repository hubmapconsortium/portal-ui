import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledAccordion, StyledExpandMoreIcon } from 'js/components/searchPage/filters/style';
import { InnerAccordionDetails, InnerAccordionSummary } from './style';

function FacetAccordion({ label, identifier, children }) {
  return (
    <StyledAccordion key={identifier} defaultExpanded>
      <InnerAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
        <Typography variant="subtitle2" color="textPrimary">
          {label}
        </Typography>
      </InnerAccordionSummary>
      <InnerAccordionDetails id={identifier}>{children}</InnerAccordionDetails>
    </StyledAccordion>
  );
}

export default FacetAccordion;
