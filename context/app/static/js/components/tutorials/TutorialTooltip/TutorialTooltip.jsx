import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import useSearchDatasetTutorialStore from 'js/stores/useSearchDatasetTutorialStore';
import TooltipProgressButton from 'js/components/tutorials/TooltipProgressButton';
import { StyledPaper, Flex, FlexEnd, WhiteTypography, WhiteCloseRoundedIcon } from './style';

const searchDatasetTutorialSelector = (state) => ({
  incrementSearchDatasetTutorialStep: state.incrementSearchDatasetTutorialStep,
  decrementSearchDatasetTutorialStep: state.decrementSearchDatasetTutorialStep,
  closeSearchDatasetTutorial: state.closeSearchDatasetTutorial,
});

function TutorialTooltip({ index, isLastStep, size, step: { title, content, contentIsComponent }, tooltipProps }) {
  const {
    incrementSearchDatasetTutorialStep,
    decrementSearchDatasetTutorialStep,
    closeSearchDatasetTutorial,
  } = useSearchDatasetTutorialStore(searchDatasetTutorialSelector);
  return (
    <StyledPaper {...tooltipProps}>
      <Flex>
        <WhiteTypography variant="subtitle1">{`${title} (${index + 1}/${size})`}</WhiteTypography>
        <IconButton aria-label="close" size="small" onClick={() => closeSearchDatasetTutorial()}>
          <WhiteCloseRoundedIcon />
        </IconButton>
      </Flex>
      {contentIsComponent ? content : <WhiteTypography variant="body1">{content}</WhiteTypography>}
      <FlexEnd>
        {index > 0 && (
          <TooltipProgressButton eventHandler={decrementSearchDatasetTutorialStep} triggerKeyCode={37}>
            Back
          </TooltipProgressButton>
        )}
        {isLastStep ? (
          <TooltipProgressButton eventHandler={closeSearchDatasetTutorial} triggerKeyCode={39}>
            Finish Tutorial
          </TooltipProgressButton>
        ) : (
          <TooltipProgressButton eventHandler={incrementSearchDatasetTutorialStep} triggerKeyCode={39}>
            Next
          </TooltipProgressButton>
        )}
      </FlexEnd>
    </StyledPaper>
  );
}

TutorialTooltip.propTypes = {
  index: PropTypes.number.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
  /* eslint-disable react/forbid-prop-types */
  step: PropTypes.object.isRequired,
  tooltipProps: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default TutorialTooltip;
