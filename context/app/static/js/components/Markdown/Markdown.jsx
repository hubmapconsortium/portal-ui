import React from 'react';
import PropTypes from 'prop-types';
import { StyledPaper } from '../Detail/Summary/style';

import { StyledMarkdown } from './style';

function Markdown(props) {
  const { markdown } = props;

  return (
    <StyledPaper>
      <StyledMarkdown content={markdown} />
    </StyledPaper>
  );
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
