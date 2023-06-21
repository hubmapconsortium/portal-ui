import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { VerticalDivider } from './style';

function EntityHeaderItem({ text }) {
  const textTrimmer = (inputText) => {
    if (inputText.length > 100) {
      return `${inputText.slice(0, 100)}...`;
    }
    return inputText;
  };

  const trimmedText = textTrimmer(text);

  return (
    <>
      <Typography variant="body1">{trimmedText}</Typography>
      <VerticalDivider orientation="vertical" flexItem />
    </>
  );
}

EntityHeaderItem.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

EntityHeaderItem.defaultProps = {
  text: undefined,
};

export default EntityHeaderItem;
