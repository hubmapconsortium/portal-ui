import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';

import { FacetAccordionSummary, FacetAccordionDetails, StyledExpandMoreIcon } from './style';

function FacetAccordion({
  title,
  position,
  children,
  isFirst,
}: PropsWithChildren<{ title: string; position: 'inner' | 'outer'; isFirst?: boolean }>) {
  const isInner = position === 'inner';
  return (
    <Accordion
      key={title}
      defaultExpanded={!(position === 'outer' && !isFirst)}
      disableGutters
      variant="unstyled"
      sx={{
        width: '100%',
        '& .MuiAccordionSummary-content': {
          margin: 0,
        },
        paddingLeft: isInner ? 0 : 0.5,
        paddingBottom: 0.25,
      }}
    >
      <FacetAccordionSummary expandIcon={<StyledExpandMoreIcon />} $position={position}>
        <Typography
          variant={isInner ? 'subtitle2' : 'subtitle1'}
          color={isInner ? 'textPrimary' : 'primary'}
          paddingLeft={isInner ? 0 : 1}
        >
          {title}
        </Typography>
      </FacetAccordionSummary>
      <FacetAccordionDetails id={title.replace(/\s/g, '-')}>{children}</FacetAccordionDetails>
    </Accordion>
  );
}

export default FacetAccordion;
