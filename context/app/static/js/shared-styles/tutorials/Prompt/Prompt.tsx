import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import {
  CenteredDiv,
  Flex,
  StyledTypography,
  StyledPaper,
  StyledInfoIcon,
  StyledCloseIcon,
  StyledButton,
} from './style';

interface LinkPromptProps {
  headerText: string;
  descriptionText: string;
  buttonText: string;
  buttonHref: string;
}

function LinkPrompt({ headerText, descriptionText, buttonText, buttonHref }: LinkPromptProps) {
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

export { LinkPrompt };
