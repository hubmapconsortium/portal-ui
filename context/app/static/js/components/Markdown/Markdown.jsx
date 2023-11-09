import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import MarkdownRenderer from './MarkdownRenderer';

import { StyledPaper } from './style';

function Markdown({ markdown }) {
  return (
    <StyledPaper>
      <Typography variant="body1" component="div">
        <MarkdownRenderer>{markdown}</MarkdownRenderer>
      </Typography>
    </StyledPaper>
  );
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
