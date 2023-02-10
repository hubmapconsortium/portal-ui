import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

import { useStore } from 'js/shared-styles/tutorials/TutorialProvider/store';

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
  const [isOpen, setIsOpen] = useState(true);
  const { runTutorial } = useStore();

  return (
    isOpen && (
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
          <IconButton aria-label="close" onClick={() => setIsOpen(false)}>
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

export default Prompt;
