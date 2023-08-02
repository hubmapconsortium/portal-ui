import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { render, screen, waitFor } from 'test-utils/functions';
import { fireEvent } from '@testing-library/react';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/provider';

import AccordionSteps from './AccordionSteps';

function AccordionStepsWithProvider({ steps, ...rest }) {
  return (
    <AccordionStepsProvider stepsLength={steps.length}>
      <AccordionSteps steps={steps} {...rest} />
    </AccordionStepsProvider>
  );
}

function getAccordionStepText(stepIndex) {
  return {
    heading: `Step ${stepIndex}`,
    contentButton: `Complete Step ${stepIndex}`,
    completed: `Completed Step ${stepIndex}`,
  };
}

const step0 = getAccordionStepText(0);
const step1 = getAccordionStepText(1);

function ExampleContent({ completeStep, stepIndex }) {
  const { contentButton, completed } = getAccordionStepText(stepIndex);
  return <Button onClick={() => completeStep(completed)}>{contentButton}</Button>;
}

async function clickOpenAccordion(step) {
  fireEvent.click(screen.getByText(step.heading));
  await waitFor(() => {
    expect(screen.getByText(step.contentButton)).toBeVisible();
  });
}

async function clickCompleteStep(step) {
  fireEvent.click(screen.getByText(step.contentButton));
  await waitFor(() => {
    expect(screen.getByText(step.contentButton)).not.toBeVisible();
  });
}

test('accordions are disabled until previous step is completed', async () => {
  render(
    <AccordionStepsWithProvider
      steps={Array(2)
        .fill()
        .map((a, index) => ({
          heading: getAccordionStepText(index).heading,
          content: <ExampleContent stepIndex={index} />,
        }))}
    />,
  );
  expect(screen.getByTestId('accordion-summary-1')).toHaveAttribute('aria-disabled', 'true');

  await clickOpenAccordion(step0);
  await clickCompleteStep(step0);

  expect(screen.getByText(step1.contentButton)).toBeVisible();
  expect(screen.getByTestId('accordion-summary-1')).not.toHaveAttribute('aria-disabled');
});

test("an accordion is closed when step is completed and the next step's accordion is opened", async () => {
  render(
    <AccordionStepsWithProvider
      steps={Array(2)
        .fill()
        .map((a, index) => ({
          heading: getAccordionStepText(index).heading,
          content: <ExampleContent stepIndex={index} />,
        }))}
    />,
  );

  expect(screen.queryByText(step1.contentButton)).not.toBeVisible();

  await clickCompleteStep(step0);

  expect(screen.getByText(step1.contentButton)).toBeVisible();
  expect(screen.queryByText(step0.contentButton)).not.toBeVisible();
});

test('future steps completed text are reset upon completion', async () => {
  render(
    <AccordionStepsWithProvider
      steps={Array(2)
        .fill()
        .map((a, index) => ({
          heading: getAccordionStepText(index).heading,
          content: <ExampleContent stepIndex={index} />,
        }))}
    />,
  );
  await clickOpenAccordion(step0);
  await clickCompleteStep(step0);

  expect(screen.getByText(step1.contentButton)).toBeVisible();
  expect(screen.queryByText(step1.completed)).not.toBeInTheDocument();

  fireEvent.click(screen.getByText(step1.contentButton));
  await screen.findByText(step1.completed);

  await clickOpenAccordion(step0);
  await clickCompleteStep(step0);

  expect(screen.getByText(step0.completed)).toBeInTheDocument();
  expect(screen.queryByText(step1.completed)).not.toBeInTheDocument();
});

function ContentWithUseEffect({ completeStep, spyFunction }) {
  useEffect(() => {
    completeStep('Completed');
    spyFunction();
  }, [completeStep, spyFunction]);
  return <div />;
}

test('children useEffect hooks dependent on completeStep are only called once', async () => {
  const spy = jest.fn();
  render(
    <AccordionStepsWithProvider
      steps={[
        {
          heading: 'Heading',
          content: <ContentWithUseEffect spyFunction={spy} />,
        },
      ]}
    />,
  );
  expect(spy).toHaveBeenCalledTimes(1);
});
