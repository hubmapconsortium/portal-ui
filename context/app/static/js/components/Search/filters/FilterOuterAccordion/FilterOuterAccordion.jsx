import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledExpandMoreIcon } from 'js/components/Search/filters/style';
import { OuterAccordion, OuterAccordionSummary, OuterAccordionDetails } from './style';

function FilterOuterAccordion({ title, isFirst, innerAccordions }) {
  return (
    <OuterAccordion defaultExpanded={isFirst}>
      <OuterAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
        <Typography variant="subtitle2" color="secondary">
          {title}
        </Typography>
      </OuterAccordionSummary>
      <OuterAccordionDetails>{innerAccordions}</OuterAccordionDetails>
    </OuterAccordion>
  );
}

export default FilterOuterAccordion;
