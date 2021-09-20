/* eslint-disable import/no-unresolved */
import React from 'react';
import Button from '@material-ui/core/Button';
import { render, screen } from 'test-utils/functions';
import { fireEvent } from '@testing-library/react';

import StepAccordion from './StepAccordion';

const buttonText = 'Complete Step';
const summaryText = 'Step 1 Completed';

function ExampleContent({ setStepCompletedText }) {
  return <Button onClick={() => setStepCompletedText(summaryText)}>{buttonText}</Button>;
}

test('should handle expanding the accordion and completing step', async () => {
  const headingText = 'Step 1';
  const iconTestId = 'success-icon';

  render(<StepAccordion summaryHeading={headingText} content={<ExampleContent />} />);

  expect(screen.getByText(headingText)).toBeInTheDocument();
  expect(screen.queryByText(buttonText)).not.toBeVisible();
  expect(screen.queryByText(summaryText)).not.toBeInTheDocument();
  expect(screen.queryByTestId(iconTestId)).not.toBeInTheDocument();

  fireEvent.click(screen.getByText(headingText)); // onClick applies to entire accordion summary it doesn't matter what is clicked

  await screen.findByText(buttonText);

  fireEvent.click(screen.getByText(buttonText));

  await screen.findByText(summaryText);
  expect(screen.getByTestId(iconTestId)).toBeInTheDocument();
});
