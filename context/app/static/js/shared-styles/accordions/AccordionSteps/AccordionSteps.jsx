import React, { useState } from 'react';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';

function AccordionSteps({ steps }) {
  const [openedAccordionIndex, setOpenedAccordionIndex] = useState(false);
  const [completedStepIndex, setCompletedStepIndex] = useState(-1);

  const handleExpand = (index) => (event, isExpanded) => {
    setOpenedAccordionIndex(isExpanded ? index : false);
  };

  function handleCompleteStep(index) {
    setCompletedStepIndex(index);
    if (index !== steps.length - 1) {
      setOpenedAccordionIndex(index + 1);
    }
  }
  return steps.map(({ heading, content }, i) => (
    <StepAccordion
      summaryHeading={heading}
      content={content}
      handleExpand={handleExpand}
      openedAccordionIndex={openedAccordionIndex}
      index={i}
      disabled={i > completedStepIndex + 1}
      handleCompleteStep={handleCompleteStep}
    />
  ));
}

export default AccordionSteps;
