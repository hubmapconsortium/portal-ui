import React, { useState, useCallback } from 'react';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';

export function getObject(keys, object) {
  return Object.assign({}, ...keys.map((key) => ({ [key]: object[key] })));
}

function AccordionSteps({ steps }) {
  const [openedAccordionIndex, setOpenedAccordionIndex] = useState(false);
  const [completedStepIndex, setCompletedStepIndex] = useState(-1);
  const [completeStepsText, setCompletedStepsText] = useState({});

  const handleExpand = (index) => (event, isExpanded) => {
    setOpenedAccordionIndex(isExpanded ? index : false);
  };

  // without the useCallback the prevState causes a render loop
  const getCompleteStepFunction = useCallback(
    (index) => (text) => {
      setCompletedStepsText((prevState) => {
        const previousStepIndexes = [...Array(index).keys()];
        return { ...getObject(previousStepIndexes, prevState), [index]: text };
      });
      setCompletedStepIndex(index);
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
      disabled={i > completedStepIndex + 1}
      getCompleteStepFunction={getCompleteStepFunction}
      stepCompletedText={completeStepsText[i]}
    />
  ));
}

export default AccordionSteps;
