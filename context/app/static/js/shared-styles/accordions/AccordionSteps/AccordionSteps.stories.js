import React from 'react';
import Button from '@material-ui/core/Button';

import StepAccordion from 'js/shared-styles/accordions/StepAccordion';
import AccordionStepsComponent from './AccordionSteps';

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

export const AccordionSteps = (args) => <AccordionStepsComponent {...args} />;

AccordionSteps.args = {
  isFirstStepOpen: false,
  steps: [1, 2, 3].map((stepNumber) => ({
    heading: `Step ${stepNumber}`,
    content: <ExampleContent stepNumber={stepNumber} />,
  })),
};

AccordionSteps.storyName = 'AccordionSteps'; // needed for single story hoisting for multi word component names
