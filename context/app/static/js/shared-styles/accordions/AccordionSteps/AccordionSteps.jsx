import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';

export function getSpecificObjectEntries(keys, object) {
  return keys.map((key) => [key, object[key]]);
}

function AccordionSteps({ steps, isFirstStepOpen }) {
  const [openedAccordionIndex, setOpenedAccordionIndex] = useState(isFirstStepOpen && 0);
  const [completedStepsText, setCompletedStepsText] = useState({});

  const getHandleExpandFunction = (index) => (event, isExpanded) => {
    setOpenedAccordionIndex(isExpanded ? index : null);
  };

  // without the useCallback the prevState causes a loop if the function it returns is later used in a useEffect
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
      key={heading}
      index={i}
      summaryHeading={heading}
      content={content}
      isExpanded={openedAccordionIndex === i}
      disabled={i > Object.keys(completedStepsText).length}
      getHandleExpandFunction={getHandleExpandFunction}
      getCompleteStepFunction={getCompleteStepFunction}
      stepCompletedText={completedStepsText?.[i]}
    />
  ));
}

AccordionSteps.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      content: PropTypes.element,
    }),
  ).isRequired,
  openFirstStep: PropTypes.bool,
};

AccordionSteps.defaultProps = {
  openFirstStep: false,
};

export default AccordionSteps;
