import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';

import { useTutorialStore } from 'js/shared-styles/tutorials/TutorialProvider';

import {
  CenteredDiv,
  Flex,
  StyledTypography,
  StyledPaper,
  StyledInfoIcon,
  StyledCloseIcon,
  StyledButton,
} from './style';

function Prompt({ headerText, descriptionText, buttonText, buttonIsDisabled }) {
  const { runTutorial, isTutorialPromptOpen, closePrompt } = useTutorialStore();

  return (
    isTutorialPromptOpen && (
      <StyledPaper>
        <CenteredDiv>
          <Flex>
            <StyledInfoIcon />
            <Typography variant="subtitle1" color="textPrimary">
              {headerText}
            </Typography>
          </Flex>
          <StyledTypography>{descriptionText}</StyledTypography>
          <StyledButton variant="contained" onClick={runTutorial} disabled={buttonIsDisabled}>
            {buttonText}
          </StyledButton>
        </CenteredDiv>
        <div>
          <IconButton aria-label="close" onClick={closePrompt} size="large">
            <StyledCloseIcon />
          </IconButton>
        </div>
      </StyledPaper>
    )
  );
}

function LinkPrompt({ headerText, descriptionText, buttonText, buttonHref }) {
  const [isPromptOpen, setIsPromptOpen] = useState(true);
  return (
    isPromptOpen && (
      <StyledPaper>
        <CenteredDiv>
          <Flex>
            <StyledInfoIcon />
            <Typography variant="subtitle1" color="textPrimary">
              {headerText}
            </Typography>
          </Flex>
          <StyledTypography>{descriptionText}</StyledTypography>
          <StyledButton variant="contained" href={buttonHref} component="a">
            {buttonText}
          </StyledButton>
        </CenteredDiv>
        <div>
          <IconButton aria-label="close" onClick={() => setIsPromptOpen(false)} size="large">
            <StyledCloseIcon />
          </IconButton>
        </div>
      </StyledPaper>
    )
  );
}

Prompt.propTypes = {
  headerText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonIsDisabled: PropTypes.bool.isRequired,
};

export { LinkPrompt };
export default Prompt;
