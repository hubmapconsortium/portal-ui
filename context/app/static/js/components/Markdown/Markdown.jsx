import React from 'react';
import PropTypes from 'prop-types';
import MarkedViewer from '@jnbelo/react-marked';
import { StyledPaper } from '../Detail/Summary/style';

import { MarkdownStyle } from './style';

function Markdown(props) {
  const { markdown } = props;

  return (
    <StyledPaper>
      <MarkdownStyle>
        <MarkedViewer content={markdown} />
      </MarkdownStyle>
    </StyledPaper>
  );
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
