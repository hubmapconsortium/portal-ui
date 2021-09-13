import React, { useState } from 'react';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AccordionSummaryHeading, AccordionSummaryText, StyledAccordionSummary } from './style';

function StepAccordion({ summaryHeading, summaryText, content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleExpand(event, expanded) {
    setIsExpanded(expanded);
  }
  return (
    <Accordion onChange={handleExpand}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} $isExpanded={isExpanded}>
        <AccordionSummaryHeading variant="subtitle2" $isExpanded={isExpanded}>
          {summaryHeading}
        </AccordionSummaryHeading>
        <AccordionSummaryText variant="body2" $isExpanded={isExpanded}>
          {summaryText}
        </AccordionSummaryText>
      </StyledAccordionSummary>
      <AccordionDetails>
        <Typography>{content}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default StepAccordion;
