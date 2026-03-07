import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';

import StepAccordion, { useAccordionStep } from 'js/shared-styles/accordions/StepAccordion';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/store';
import AccordionStepsComponent from 'js/shared-styles/accordions/AccordionSteps';

const meta = {
  title: 'Accordions/AccordionSteps',
  component: AccordionStepsComponent,
  parameters: {
    docs: {
      description: {
        component: 'A series of accordions for executing sequentials steps.',
      },
    },
  },
  argTypes: {
    steps: {
      description: 'An array of objects with heading and content entries.',
    },
  },
  subcomponents: { StepAccordion },
} satisfies Meta<typeof AccordionStepsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function ExampleContent({ stepNumber }: { stepNumber: number }) {
  const { completeStep } = useAccordionStep();
  return <Button onClick={() => completeStep(`Step ${stepNumber} Completed!`)}>Complete Step</Button>;
}

const steps = [1, 2, 3].map((stepNumber) => ({
  heading: `Step ${stepNumber}`,
  content: <ExampleContent stepNumber={stepNumber} />,
}));

export const AccordionSteps: Story = {
  args: {
    steps,
    id: 'accordion-steps-story',
  },
  render: (args) => (
    <AccordionStepsProvider stepsLength={steps.length}>
      <AccordionStepsComponent {...args} />
    </AccordionStepsProvider>
  ),
};
