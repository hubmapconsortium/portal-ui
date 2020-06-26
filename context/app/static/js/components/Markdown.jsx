import React from 'react';
import PropTypes from 'prop-types';

function Markdown(props) {
  const { markdown } = props;

  return <pre>{markdown}</pre>;
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
