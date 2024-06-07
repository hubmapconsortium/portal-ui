import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';

import { InnerAccordionDetails, InnerAccordionSummary, StyledExpandMoreIcon } from './style';

function FacetAccordion({
  title,
  position,
  children,
}: PropsWithChildren<{ title: string; position: 'inner' | 'outer' }>) {
  return (
    <Accordion key={title} defaultExpanded disableGutters variant="unstyled">
      <InnerAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
        <Typography variant="subtitle2" color={position === 'inner' ? 'textPrimary' : 'secondary'}>
          {title}
        </Typography>
      </InnerAccordionSummary>
      <InnerAccordionDetails id={title.replace(/\s/g, '-')}>{children}</InnerAccordionDetails>
    </Accordion>
  );
}

export default FacetAccordion;
