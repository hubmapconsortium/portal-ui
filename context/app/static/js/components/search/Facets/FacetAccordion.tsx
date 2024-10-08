import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';

import { FacetAccordionSummary, FacetAccordionDetails, StyledExpandMoreIcon } from './style';

function FacetAccordion({
  title,
  position,
  children,
  isFirst,
  isLast,
}: PropsWithChildren<{ title: string; position: 'inner' | 'outer'; isFirst?: boolean; isLast?: boolean }>) {
  return (
    <Accordion
      key={title}
      defaultExpanded={!(position === 'outer' && !isFirst)}
      disableGutters
      variant="unstyled"
      sx={(theme) => ({
        width: '100%',
        ...(position === 'outer' && !isLast && { borderBottom: `1px solid ${theme.palette.divider}` }),
      })}
    >
      <FacetAccordionSummary expandIcon={<StyledExpandMoreIcon />} $position={position}>
        <Typography variant="subtitle2" color={position === 'inner' ? 'textPrimary' : 'secondary'}>
          {title}
        </Typography>
      </FacetAccordionSummary>
      <FacetAccordionDetails id={title.replace(/\s/g, '-')}>{children}</FacetAccordionDetails>
    </Accordion>
  );
}

export default FacetAccordion;
