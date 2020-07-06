import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { StyledPaper } from './style';

function Markdown(props) {
  const { markdown } = props;

  return (
    // Turn off escapeHtml so that <a name="assay"> comes through.
    <StyledPaper>
      <ReactMarkdown source={markdown} escapeHtml={false} />
    </StyledPaper>
  );
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
