import React from 'react';
import Stack from '@mui/material/Stack';

import { AccordionText, SuccessIcon } from './style';

interface CompletedStepTextProps {
  completedStepText?: React.ReactNode;
  isExpanded: boolean;
  index: number;
}

export default function CompletedStepText({ completedStepText, isExpanded, index }: CompletedStepTextProps) {
  if (!completedStepText) {
    return null;
  }
  return (
    <Stack
      direction="row"
      sx={{
        flexBasis: '80%',
        justifyContent: 'space-between',
      }}
    >
      <AccordionText variant="body2" $isExpanded={isExpanded}>
        {completedStepText}
      </AccordionText>
      <SuccessIcon data-testid={`accordion-success-icon-${index}`} />
    </Stack>
  );
}
