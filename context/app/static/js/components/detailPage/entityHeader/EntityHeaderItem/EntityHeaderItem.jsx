import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

function EntityHeaderItem({ text }) {
  return (
    <>
      <Typography variant="body1">{text}</Typography>
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
