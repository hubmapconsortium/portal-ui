import React, { ComponentProps, useEffect } from 'react';
import Button from '@mui/material/Button';
import { render, screen, waitFor, fireEvent } from 'test-utils/functions';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';

import AccordionSteps from './AccordionSteps';
import { useAccordionStep } from '../StepAccordion';

function AccordionStepsWithProvider({ steps, ...rest }: ComponentProps<typeof AccordionSteps>) {
  return (
    <AccordionStepsProvider stepsLength={steps.length}>
      <AccordionSteps steps={steps} {...rest} />
    </AccordionStepsProvider>
  );
}

interface Step {
  heading: string;
  contentButton: string;
  completed: string;
}

function getAccordionStepText(stepIndex: number): Step {
  return {
    heading: `Step ${stepIndex}`,
    contentButton: `Complete ${stepIndex}!`,
    completed: `Completed ${stepIndex}!`,
  };
}

const step0 = getAccordionStepText(0);
const step1 = getAccordionStepText(1);

function ExampleContent({ stepIndex }: { stepIndex: number }) {
  const { contentButton, completed } = getAccordionStepText(stepIndex);
  const { completeStep } = useAccordionStep();
  return (
    <Button
      onClick={() => {
        completeStep(completed);
      }}
    >
      {contentButton}
    </Button>
  );
}

async function clickOpenAccordion(step: Step) {
  fireEvent.click(screen.getByText(step.heading));
  await waitFor(() => {
    expect(screen.getByText(step.contentButton)).toBeVisible();
  });
}

async function clickCompleteStep(step: Step) {
  fireEvent.click(screen.getByText(step.contentButton));
  await waitFor(() => {
    expect(screen.getByText(step.completed)).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText(step.contentButton)).not.toBeVisible();
  });
}

test('accordions are disabled until previous step is completed', async () => {
  render(
    <AccordionStepsWithProvider
      steps={Array(2)
        .fill(0)
        .map((a, index) => ({
          heading: getAccordionStepText(index).heading,
          content: <ExampleContent stepIndex={index} />,
        }))}
      id="test-accordion-steps"
    />,
  );

  expect(screen.getByTestId('accordion-summary-1')).toHaveClass('Mui-disabled');

  await clickOpenAccordion(step0);
  await clickCompleteStep(step0);

  expect(screen.getByText(step1.contentButton)).toBeVisible();
  expect(screen.getByTestId('accordion-summary-1')).not.toHaveClass('Mui-disabled');
});

test("an accordion is closed when step is completed and the next step's accordion is opened", async () => {
  render(
    <AccordionStepsWithProvider
      id="test-accordion-steps"
      steps={Array(2)
        .fill(0)
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
      id="test-accordion-steps"
      steps={Array(3)
        .fill(0)
        .map((a, index) => ({
          heading: getAccordionStepText(index).heading,
          content: <ExampleContent stepIndex={index} />,
        }))}
    />,
  );
  await clickOpenAccordion(step0);

  await clickCompleteStep(step0);

  // Verify that step1's content button is visible
  expect(screen.getByText(step1.contentButton)).toBeVisible();

  // Verify that step1's completed text is not present
  expect(screen.queryByText(step1.completed)).not.toBeInTheDocument();

  await clickCompleteStep(step1);

  // Verify that step1's completed text is now visible
  await screen.findByText(step1.completed);

  await clickOpenAccordion(step0);

  await clickCompleteStep(step0);

  // Verify that step0's completed text is visible
  expect(screen.getByText(step0.completed)).toBeInTheDocument();

  // Verify that step1's completed text is not visible
  expect(screen.queryByText(step1.completed)).not.toBeInTheDocument();
});

function ContentWithUseEffect({ spyFunction }: { spyFunction: () => void }) {
  const { completeStep } = useAccordionStep();
  useEffect(() => {
    completeStep('Completed');
    spyFunction();
  }, [completeStep, spyFunction]);
  return <div />;
}

test('children useEffect hooks dependent on completeStep are only called once', () => {
  const spy = jest.fn();
  render(
    <AccordionStepsWithProvider
      steps={[
        {
          heading: 'Heading',
          content: <ContentWithUseEffect spyFunction={spy} />,
        },
      ]}
      id="test-accordion-steps"
    />,
  );
  expect(spy).toHaveBeenCalledTimes(1);
});
