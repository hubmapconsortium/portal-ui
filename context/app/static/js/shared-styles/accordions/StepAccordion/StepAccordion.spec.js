/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import StepAccordion from './StepAccordion';

test('should show success icon when step completed text is provided', async () => {
  render(
    <StepAccordion
      index={0}
      summaryHeading="Step 0"
      content={<div />}
      disabled={false}
      getHandleExpandFunction={jest.fn()}
      isExpanded
      stepCompletedText="Completed Step 0"
      getCompleteStepFunction={jest.fn()}
    />,
  );

  expect(screen.getByTestId('accordion-success-icon-0')).toBeInTheDocument();
  expect(screen.getByText('Completed Step 0')).toBeInTheDocument();
});
