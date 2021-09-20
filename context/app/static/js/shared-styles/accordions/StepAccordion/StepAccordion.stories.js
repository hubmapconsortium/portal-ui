import React from 'react';
import Button from '@material-ui/core/Button';
import StepAccordion from './StepAccordion';

export default {
  title: 'Accordions/StepAccordion',
  component: StepAccordion,
  argTypes: {
    content: {
      control: false,
    },
  },
};

function ExampleContent({ setStepCompletedText, stepNumber }) {
  return (
    <>
      <Button onClick={() => setStepCompletedText(`Step ${stepNumber} Completed!`)}>Complete Step</Button>
      <Button onClick={() => setStepCompletedText('')}>Reset</Button>
    </>
  );
}

export const Default = (args) => <StepAccordion {...args} content={<ExampleContent stepNumber={1} />} />;
Default.args = {
  summaryHeading: 'Step 1',
};

export const MultipleSteps = () =>
  [1, 2, 3].map((stepNumber) => (
    <StepAccordion summaryHeading={`Step ${stepNumber}`} content={<ExampleContent stepNumber={stepNumber} />} />
  ));
