import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import { CenteredDiv, Flex, StyledTypography, StyledPaper, StyledInfoIcon, StyledButton } from './style';

function DatasetSearchPrompt() {
  return (
    <StyledPaper>
      <CenteredDiv>
        <Flex>
          <StyledInfoIcon color="primary" />
          <Typography variant="subtitle1" color="textPrimary">
            Getting Started
          </Typography>
        </Flex>
        <StyledTypography>
          Welcome to the HuBMAP Data Portal. Get a quick tour of different sections of the dataset search page.
        </StyledTypography>
        <StyledButton color="primary" variant="contained">
          Take The Dataset Search Tutorial
        </StyledButton>
      </CenteredDiv>
      <div>
        <IconButton aria-label="close">
          <CloseRoundedIcon />
        </IconButton>
      </div>
    </StyledPaper>
  );
}

export default DatasetSearchPrompt;
