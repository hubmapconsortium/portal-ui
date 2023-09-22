import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Typography from '@mui/material/Typography';

import { StyledPaper } from './style';

function Markdown({ markdown }) {
  return (
    <StyledPaper>
      <Typography variant="body1" component="div">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </Typography>
    </StyledPaper>
  );
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
