import React from 'react';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import Typography from '@material-ui/core/Typography';

import { CenteredFlex, StyledPaper, StyledIconButton, FlexButtonsWrapper } from './style';

function PDFViewerControlButtons({ numPages, currentPageNum, setPageNum }) {
  const atMaxPageNum = currentPageNum === numPages;
  const atMinPageNum = currentPageNum === 1;

  function incrementPageNum() {
    if (!atMaxPageNum) {
      setPageNum(currentPageNum + 1);
    }
  }

  function decrementPageNum() {
    if (!atMinPageNum) {
      setPageNum(currentPageNum - 1);
    }
  }
  return (
    <CenteredFlex>
      <StyledPaper>
        <FlexButtonsWrapper>
          <StyledIconButton color="primary" onClick={decrementPageNum} disabled={atMinPageNum}>
            <ChevronLeftRoundedIcon />
          </StyledIconButton>
          <Typography>{`${currentPageNum} of ${numPages}`}</Typography>
          <StyledIconButton color="primary" onClick={incrementPageNum} disabled={atMaxPageNum}>
            <ChevronRightRoundedIcon />
          </StyledIconButton>
        </FlexButtonsWrapper>
      </StyledPaper>
    </CenteredFlex>
  );
}

export default PDFViewerControlButtons;
