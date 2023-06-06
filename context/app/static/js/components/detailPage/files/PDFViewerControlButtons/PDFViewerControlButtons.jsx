import React, { useCallback } from 'react';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import Typography from '@material-ui/core/Typography';

import { CenteredFlex, StyledPaper, StyledIconButton, FlexButtonsWrapper } from './style';

function PDFViewerControlButtons({ numPages, currentPageNum, setPageNum }) {
  const atMaxPageNum = currentPageNum === numPages;
  const atMinPageNum = currentPageNum === 1;

  const incrementPageNum = useCallback(
    function incrementPageNum() {
      if (!atMaxPageNum) {
        setPageNum(currentPageNum + 1);
      }
    },
    [atMaxPageNum, currentPageNum, setPageNum],
  );

  const decrementPageNum = useCallback(
    function decrementPageNum() {
      if (!atMinPageNum) {
        setPageNum(currentPageNum - 1);
      }
    },
    [atMinPageNum, currentPageNum, setPageNum],
  );
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
