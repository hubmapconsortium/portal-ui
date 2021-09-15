import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import { AccordionSummaryHeading, AccordionText, Flex, StyledAccordionSummary, SuccessIcon } from './style';

function StepAccordion({
  summaryHeading,
  content,
  disabled,
  handleExpand,
  openedAccordionIndex,
  index,
  setCompletedStepIndex,
}) {
  const [stepCompletedText, setStepCompletedText] = useState(null);
  const isExpanded = openedAccordionIndex === index;

  function handleComplete(text) {
    setStepCompletedText(text);
    setCompletedStepIndex(index);
  }

  return (
    <Accordion onChange={handleExpand(index)} disabled={disabled} expanded={isExpanded}>
      <StyledAccordionSummary expandIcon={<ArrowDropUpRoundedIcon />} $isExpanded={isExpanded}>
        <AccordionSummaryHeading variant="subtitle2" $isExpanded={isExpanded}>
          {summaryHeading}
        </AccordionSummaryHeading>
        <Flex>
          {stepCompletedText && (
            <>
              <AccordionText variant="body2" $isExpanded={isExpanded}>
                {stepCompletedText}
              </AccordionText>
              <SuccessIcon data-testid="success-icon" />
            </>
          )}
        </Flex>
      </StyledAccordionSummary>
      {content && (
        <AccordionDetails>
          {React.cloneElement(content, {
            setStepCompletedText: handleComplete,
          })}
        </AccordionDetails>
      )}
    </Accordion>
  );
}

StepAccordion.propTypes = {
  summaryHeading: PropTypes.string.isRequired,
  content: PropTypes.element,
  disabled: PropTypes.bool,
  handleExpand: PropTypes.func.isRequired,
  openedAccordionIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

StepAccordion.defaultProps = {
  content: undefined,
  disabled: false,
};

export default StepAccordion;
