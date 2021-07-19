import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import PropTypes from 'prop-types';

import { CenteredDiv, Flex, StyledTypography, StyledPaper, StyledInfoIcon, StyledButton } from './style';

function SearchPrompt({ headerText, descriptionText, buttonText, buttonOnClick, buttonIsDisabled, closeOnClick }) {
  return (
    <StyledPaper>
      <CenteredDiv>
        <Flex>
          <StyledInfoIcon color="primary" />
          <Typography variant="subtitle1" color="textPrimary">
            {headerText}
          </Typography>
        </Flex>
        <StyledTypography>{descriptionText}</StyledTypography>
        <StyledButton color="primary" variant="contained" onClick={buttonOnClick} disabled={buttonIsDisabled}>
          {buttonText}
        </StyledButton>
      </CenteredDiv>
      <div>
        <IconButton aria-label="close" onClick={closeOnClick}>
          <CloseRoundedIcon />
        </IconButton>
      </div>
    </StyledPaper>
  );
}

SearchPrompt.propTypes = {
  headerText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonOnClick: PropTypes.func.isRequired,
  buttonIsDisabled: PropTypes.bool.isRequired,
  closeOnClick: PropTypes.func.isRequired,
};

export default SearchPrompt;
