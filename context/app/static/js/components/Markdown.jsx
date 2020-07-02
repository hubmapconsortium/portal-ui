import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

function Markdown(props) {
  const { markdown } = props;

  return <ReactMarkdown source={markdown} />;
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
