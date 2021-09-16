import React, { useState, useCallback } from 'react';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';

export function getSpecificObjectEntries(keys, object) {
  return keys.map((key) => [key, object[key]]);
}

function AccordionSteps({ steps }) {
  const [openedAccordionIndex, setOpenedAccordionIndex] = useState(false);
  const [completedStepsText, setCompletedStepsText] = useState({});

  const handleExpand = (index) => (event, isExpanded) => {
    setOpenedAccordionIndex(isExpanded ? index : false);
  };

  // without the useCallback the prevState causes a render loop
  const getCompleteStepFunction = useCallback(
    (index) => (text) => {
      setCompletedStepsText((prevState) => {
        const previousStepIndexes = [...Array(index).keys()];
        return Object.fromEntries([...getSpecificObjectEntries(previousStepIndexes, prevState), [index, text]]);
      });
      if (index !== steps.length - 1) {
        setOpenedAccordionIndex(index + 1);
      }
    },
    [steps.length],
  );

  return steps.map(({ heading, content }, i) => (
    <StepAccordion
      summaryHeading={heading}
      content={content}
      handleExpand={handleExpand}
      openedAccordionIndex={openedAccordionIndex}
      index={i}
      key={heading}
      disabled={i > Object.keys(completedStepsText)}
      getCompleteStepFunction={getCompleteStepFunction}
      stepCompletedText={completedStepsText[i]}
    />
  ));
}

export default AccordionSteps;
