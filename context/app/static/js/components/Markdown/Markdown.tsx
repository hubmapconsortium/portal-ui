import React from 'react';
import Typography from '@mui/material/Typography';
import MarkdownRenderer from './MarkdownRenderer';

import { StyledPaper } from './style';

interface MarkdownProps {
  markdown: string;
}

function Markdown({ markdown }: MarkdownProps) {
  return (
    <StyledPaper>
      <Typography variant="body1" component="div">
        <MarkdownRenderer>{markdown}</MarkdownRenderer>
      </Typography>
    </StyledPaper>
  );
}

export default Markdown;
