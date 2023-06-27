import React from 'react';
import Button from '@material-ui/core/Button';

import StepAccordion from 'js/shared-styles/accordions/StepAccordion';
import { AccordionStepsProvider } from 'js/shared-styles/accordions/AccordionSteps/provider';
import AccordionStepsComponent from 'js/shared-styles/accordions/AccordionSteps';

export default {
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
      control: true,
      description: 'An array of objects with heading and content entries.',
    },
  },
  subcomponents: { StepAccordion },
};

function ExampleContent({ completeStep, stepNumber }) {
  return <Button onClick={() => completeStep(`Step ${stepNumber} Completed!`)}>Complete Step</Button>;
}

const steps = [1, 2, 3].map((stepNumber) => ({
  heading: `Step ${stepNumber}`,
  content: <ExampleContent stepNumber={stepNumber} />,
}));

export function AccordionSteps(args) {
  return (
    <AccordionStepsProvider stepsLength={steps.length}>
      <AccordionStepsComponent {...args} />
    </AccordionStepsProvider>
  );
}

AccordionSteps.args = {
  isFirstStepOpen: false,
  steps,
};

AccordionSteps.storyName = 'AccordionSteps'; // needed for single story hoisting for multi word component names
