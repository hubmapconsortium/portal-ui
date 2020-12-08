import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import useSearchDatasetTutorialStore from 'js/stores/useSearchDatasetTutorialStore';

import { StyledPaper, Flex, WhiteTextButton, FlexEnd, WhiteTypography, WhiteCloseRoundedIcon } from './style';

const searchDatasetTutorialSelector = (state) => ({
  incrementSearchDatasetTutorialStep: state.incrementSearchDatasetTutorialStep,
  decrementSearchDatasetTutorialStep: state.decrementSearchDatasetTutorialStep,
  closeSearchDatasetTutorial: state.closeSearchDatasetTutorial,
});

function TutorialTooltip({ index, isLastStep, size, step, tooltipProps }) {
  const {
    incrementSearchDatasetTutorialStep,
    decrementSearchDatasetTutorialStep,
    closeSearchDatasetTutorial,
  } = useSearchDatasetTutorialStore(searchDatasetTutorialSelector);
  return (
    <StyledPaper {...tooltipProps}>
      <Flex>
        <WhiteTypography variant="subtitle1">{`${step.title} (${index + 1}/${size})`}</WhiteTypography>
        <IconButton aria-label="close" size="small" onClick={() => closeSearchDatasetTutorial()}>
          <WhiteCloseRoundedIcon />
        </IconButton>
      </Flex>
      <WhiteTypography variant="body1">{step.content}</WhiteTypography>
      <FlexEnd>
        {index > 0 && <WhiteTextButton onClick={() => decrementSearchDatasetTutorialStep()}>Back</WhiteTextButton>}
        {!isLastStep && <WhiteTextButton onClick={() => incrementSearchDatasetTutorialStep()}>Next</WhiteTextButton>}
      </FlexEnd>
    </StyledPaper>
  );
}

export default TutorialTooltip;
