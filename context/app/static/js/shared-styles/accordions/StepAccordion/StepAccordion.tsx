import React, { forwardRef, useCallback } from 'react';
import Accordion from '@mui/material/Accordion';
import Stack from '@mui/material/Stack';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import Box from '@mui/material/Box';

import { useAccordionStepsStore } from 'js/shared-styles/accordions/AccordionSteps/store';
import { AccordionSummaryHeading, AccordionText, StyledAccordionSummary, SuccessIcon } from './style';
import AccordionStepProvider from './AccordionStepContext';

interface CompletedStepTextProps {
  completedStepText?: React.ReactNode;
  isExpanded: boolean;
  index: number;
}

function CompletedStepText({ completedStepText, isExpanded, index }: CompletedStepTextProps) {
  if (!completedStepText) {
    return null;
  }
  return (
    <Stack flexBasis="80%" direction="row" justifyContent="space-between">
      <AccordionText variant="body2" $isExpanded={isExpanded}>
        {completedStepText}
      </AccordionText>
      <SuccessIcon data-testid={`accordion-success-icon-${index}`} />
    </Stack>
  );
}

interface StepAccordionProps {
  index: number;
  summaryHeading: string | React.ReactElement;
  content?: React.ReactElement;
  id: string;
}

const StepAccordion = forwardRef(function StepAccordion(
  { index, summaryHeading, content, id }: StepAccordionProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { expandStep, openStepIndex, completedStepsText } = useAccordionStepsStore();

  const onChange = useCallback(() => {
    expandStep(index);
  }, [expandStep, index]);

  const isExpanded = openStepIndex === index;

  // The accordion should be disabled if the previous step has not been completed.
  const disabled = index > Object.keys(completedStepsText).length;

  return (
    <Accordion onChange={onChange} disabled={disabled} expanded={isExpanded} id={id} ref={ref}>
      <StyledAccordionSummary
        expandIcon={<ArrowDropUpRoundedIcon />}
        $isExpanded={isExpanded}
        data-testid={`accordion-summary-${index}`}
        id={`${id}-summary`}
      >
        <AccordionSummaryHeading variant="subtitle2" $isExpanded={isExpanded}>
          {summaryHeading}
        </AccordionSummaryHeading>
        <CompletedStepText completedStepText={completedStepsText[index]} isExpanded={isExpanded} index={index} />
      </StyledAccordionSummary>
      <AccordionStepProvider index={index}>
        <Box pt={1} px={2} pb={2}>
          {content}
        </Box>
      </AccordionStepProvider>
    </Accordion>
  );
});

export default StepAccordion;
