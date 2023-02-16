import React from 'react';
import PropTypes from 'prop-types';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';

function AccordionSteps({ steps, id }) {
  return steps.map(({ heading, content, ref }, i) => (
    <StepAccordion id={`${id}-${i}`} key={heading} index={i} summaryHeading={heading} content={content} ref={ref} />
  ));
}

AccordionSteps.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      content: PropTypes.element,
    }),
  ).isRequired,
};

export default AccordionSteps;
