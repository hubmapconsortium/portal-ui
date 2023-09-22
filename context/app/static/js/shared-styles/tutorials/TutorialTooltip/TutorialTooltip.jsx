import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';

import { useStore } from 'js/shared-styles/tutorials/TutorialProvider';
import TooltipProgressButton from 'js/shared-styles/tutorials/TooltipProgressButton';
import { StyledPaper, Flex, FlexEnd, WhiteTypography, WhiteCloseRoundedIcon } from './style';

function TutorialTooltip({ index, isLastStep, size, step: { title, content, contentIsComponent }, tooltipProps }) {
  const { incrementStep, decrementStep, closeTutorial, nextButtonIsDisabled } = useStore();

  return (
    <StyledPaper {...tooltipProps}>
      <Flex>
        <WhiteTypography variant="subtitle1">{`${title} (${index + 1}/${size})`}</WhiteTypography>
        <IconButton aria-label="close" size="small" onClick={closeTutorial}>
          <WhiteCloseRoundedIcon />
        </IconButton>
      </Flex>
      {contentIsComponent ? content : <WhiteTypography variant="body1">{content}</WhiteTypography>}
      <FlexEnd>
        {index > 0 && (
          <TooltipProgressButton eventHandler={decrementStep} triggerKeyCode={37}>
            Back
          </TooltipProgressButton>
        )}
        {isLastStep ? (
          <TooltipProgressButton eventHandler={closeTutorial} triggerKeyCode={39}>
            Finish Tutorial
          </TooltipProgressButton>
        ) : (
          <TooltipProgressButton eventHandler={incrementStep} triggerKeyCode={39} disabled={nextButtonIsDisabled}>
            Next
          </TooltipProgressButton>
        )}
      </FlexEnd>
    </StyledPaper>
  );
}
/* eslint-disable react/forbid-prop-types */
TutorialTooltip.propTypes = {
  index: PropTypes.number.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
  step: PropTypes.object.isRequired,
  /* The root element props (including ref) */
  tooltipProps: PropTypes.object.isRequired,
  decrementStepOnClick: PropTypes.func.isRequired,
  closeOnClick: PropTypes.func.isRequired,
  incrementStepOnClick: PropTypes.func.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default TutorialTooltip;
