import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AccordionSummaryHeading, AccordionText, Flex, StyledAccordionSummary, SuccessIcon } from './style';

function StepAccordion({ summaryHeading, content }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stepCompletedText, setStepCompletedText] = useState(null);

  function handleExpand(event, expanded) {
    setIsExpanded(expanded);
  }
  return (
    <Accordion onChange={handleExpand}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} $isExpanded={isExpanded}>
        <AccordionSummaryHeading variant="subtitle2" $isExpanded={isExpanded}>
          {summaryHeading}
        </AccordionSummaryHeading>
        <Flex>
          {stepCompletedText && (
            <>
              <AccordionText variant="body2" $isExpanded={isExpanded}>
                {stepCompletedText}
              </AccordionText>
              <SuccessIcon />
            </>
          )}
        </Flex>
      </StyledAccordionSummary>
      <AccordionDetails>
        <Typography>
          {React.cloneElement(content, {
            setStepCompletedText,
          })}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

StepAccordion.propTypes = {
  summaryHeading: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
};
export default StepAccordion;
