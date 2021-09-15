import React, { useState } from 'react';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';

function AccordionSteps({ steps }) {
  const [openedAccordionIndex, setOpenedAccordionIndex] = useState(false);
  const [completedStepIndex, setCompletedStepIndex] = useState(-1);

  const handleExpand = (index) => (event, isExpanded) => {
    setOpenedAccordionIndex(isExpanded ? index : false);
  };

  return steps.map(({ heading, content }, i) => (
    <StepAccordion
      summaryHeading={heading}
      content={content}
      handleExpand={handleExpand}
      openedAccordionIndex={openedAccordionIndex}
      index={i}
      disabled={i > completedStepIndex + 1}
      setCompletedStepIndex={setCompletedStepIndex}
    />
  ));
}

export default AccordionSteps;
