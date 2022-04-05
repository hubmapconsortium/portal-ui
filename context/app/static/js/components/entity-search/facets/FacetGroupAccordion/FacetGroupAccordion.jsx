import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledExpandMoreIcon } from 'js/components/searchPage/filters/style';
import { OuterAccordion, OuterAccordionSummary, OuterAccordionDetails } from './style';

function FacetGroupAccordion({ label, isFirst, children }) {
  return (
    <OuterAccordion defaultExpanded={isFirst}>
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
