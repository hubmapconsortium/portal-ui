import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

import {
  CenteredDiv,
  Flex,
  StyledTypography,
  StyledPaper,
  StyledInfoIcon,
  StyledCloseIcon,
  StyledButton,
} from './style';

function Prompt({ headerText, descriptionText, buttonText, buttonOnClick, buttonIsDisabled, closeOnClick }) {
  return (
    <StyledPaper>
      <CenteredDiv>
        <Flex>
          <StyledInfoIcon />
          <Typography variant="subtitle1" color="textPrimary">
            {headerText}
          </Typography>
        </Flex>
        <StyledTypography>{descriptionText}</StyledTypography>
        <StyledButton variant="contained" onClick={buttonOnClick} disabled={buttonIsDisabled}>
          {buttonText}
        </StyledButton>
      </CenteredDiv>
      <div>
        <IconButton aria-label="close" onClick={closeOnClick}>
          <StyledCloseIcon />
        </IconButton>
      </div>
    </StyledPaper>
  );
}

Prompt.propTypes = {
  headerText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonOnClick: PropTypes.func.isRequired,
  buttonIsDisabled: PropTypes.bool.isRequired,
  closeOnClick: PropTypes.func.isRequired,
};

export default Prompt;
