import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';

import { useAccordionStepsStore } from 'js/shared-styles/accordions/AccordionSteps/provider';
import { AccordionSummaryHeading, AccordionText, Flex, StyledAccordionSummary, SuccessIcon } from './style';

function StepAccordion({ index, summaryHeading, content, id }) {
  const { completeStep, expandStep, openStepIndex, completedStepsText } = useAccordionStepsStore();
  // memoize to avoid rerenders
  const handleCompleteStep = useMemo(() => {
    return (text) => completeStep(index, text);
  }, [completeStep, index]);

  const isExpanded = openStepIndex === index;
  const completedStepText = completedStepsText[index];

  return (
    <Accordion
      onChange={() => expandStep(index)}
      // The accordion should be disabled if the previous step has not been completed.
      disabled={index > Object.keys(completedStepsText).length}
      expanded={isExpanded}
      id={id}
    >
      <StyledAccordionSummary
        expandIcon={<ArrowDropUpRoundedIcon />}
        $isExpanded={isExpanded}
        data-testid={`accordion-summary-${index}`}
        id={`${id}-summary`}
      >
        <AccordionSummaryHeading variant="subtitle2" $isExpanded={isExpanded}>
          {summaryHeading}
        </AccordionSummaryHeading>
        <Flex>
          {completedStepText && (
            <>
              <AccordionText variant="body2" $isExpanded={isExpanded}>
                {completedStepText}
              </AccordionText>
              <SuccessIcon data-testid={`accordion-success-icon-${index}`} />
            </>
          )}
        </Flex>
      </StyledAccordionSummary>
      {content && (
        <AccordionDetails>
          {React.cloneElement(content, {
            completeStep: handleCompleteStep,
          })}
        </AccordionDetails>
      )}
    </Accordion>
  );
}

StepAccordion.propTypes = {
  index: PropTypes.number.isRequired,
  summaryHeading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  content: PropTypes.element,
};

StepAccordion.defaultProps = {
  content: undefined,
};

export default StepAccordion;
