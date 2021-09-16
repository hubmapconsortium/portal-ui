import React from 'react';
import Button from '@material-ui/core/Button';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';
import AccordionSteps from './AccordionSteps';

export default {
  title: 'AccordionSteps',
  component: AccordionSteps,
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
  return (
    <>
      <Button onClick={() => completeStep(`Step ${stepNumber} Completed!`)}>Complete Step</Button>
    </>
  );
}

const Template = (args) => <AccordionSteps {...args} />;

export const Default = Template.bind({});

Default.args = {
  steps: [1, 2, 3].map((stepNumber) => ({
    heading: `Step ${stepNumber}`,
    content: <ExampleContent stepNumber={stepNumber} />,
  })),
};
