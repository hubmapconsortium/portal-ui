import React from 'react';
import IconButton from '@material-ui/core/IconButton';

import { StyledPaper, Flex, WhiteTextButton, FlexEnd, WhiteTypography, WhiteCloseRoundedIcon } from './style';

function TutorialTooltip({ continuous, index, size, step, backProps, closeProps, primaryProps, tooltipProps }) {
  return (
    <StyledPaper {...tooltipProps}>
      <Flex>
        <WhiteTypography variant="subtitle1">{`${step.title} (${index + 1}/${size})`}</WhiteTypography>
        <IconButton aria-label="close" size="small" {...closeProps}>
          <WhiteCloseRoundedIcon />
        </IconButton>
      </Flex>
      <WhiteTypography variant="body1">{step.content}</WhiteTypography>
      <FlexEnd>
        {index > 0 && <WhiteTextButton {...backProps}>Back</WhiteTextButton>}
        {continuous && <WhiteTextButton {...primaryProps}>Next</WhiteTextButton>}
      </FlexEnd>
    </StyledPaper>
  );
}

export default TutorialTooltip;
