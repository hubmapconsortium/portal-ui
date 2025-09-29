import React from 'react';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';

interface AccordionStepsProps {
  steps: {
    heading: string | React.ReactElement;
    content?: React.ReactElement;
    ref?: React.RefObject<HTMLDivElement>;
  }[];
  id: string;
}

function AccordionSteps({ steps, id }: AccordionStepsProps) {
  return steps.map(({ heading, content, ref }, i) => (
    <StepAccordion
      id={`${id}-${i}`}
      key={String(heading)}
      index={i}
      summaryHeading={heading}
      content={content}
      ref={ref}
    />
  ));
}

export default AccordionSteps;
