import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import { AccordionSummaryHeading, AccordionText, Flex, StyledAccordionSummary, SuccessIcon } from './style';

function StepAccordion({
  index,
  summaryHeading,
  content,
  disabled,
  getHandleExpandFunction,
  isExpanded,
  stepCompletedText,
  getCompleteStepFunction,
}) {
  // memoize to avoid rerenders
  const completeStep = useMemo(() => {
    return getCompleteStepFunction(index);
  }, [getCompleteStepFunction, index]);

  return (
    <Accordion onChange={getHandleExpandFunction(index)} disabled={disabled} expanded={isExpanded}>
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
            completeStep,
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
  isExpanded: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  getHandleExpandFunction: PropTypes.func.isRequired,
  getCompleteStepFunction: PropTypes.func.isRequired,
  stepCompletedText: PropTypes.string,
};

StepAccordion.defaultProps = {
  content: undefined,
  stepCompletedText: undefined,
};

export default StepAccordion;
