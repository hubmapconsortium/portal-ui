import React from 'react';
import { render, screen } from 'test-utils/functions';

import StepAccordion from './StepAccordion';
import { AccordionStepsProvider } from '../AccordionSteps/provider';

test('should show success icon when step completed text is provided', async () => {
  render(
    <AccordionStepsProvider stepsLength={1} initialState={{ completedStepsText: { 0: 'Completed Step 0' } }}>
      <StepAccordion index={0} summaryHeading="Step 0" content={<div />} />
    </AccordionStepsProvider>,
  );

  expect(screen.getByTestId('accordion-success-icon-0')).toBeInTheDocument();
  expect(screen.getByText('Completed Step 0')).toBeInTheDocument();
});
