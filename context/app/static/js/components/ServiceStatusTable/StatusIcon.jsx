import React from 'react';
import PropTypes from 'prop-types';
import { ColoredStatusIcon } from './style';

function StatusIcon({ isUp }) {
  const color = isUp ? 'success' : 'error';
  const text = isUp ? 'Up' : 'Down';
  return (
    <>
      <ColoredStatusIcon $iconColor={color} />
      {text}
    </>
  );
}

StatusIcon.propTypes = {
  isUp: PropTypes.bool.isRequired,
};

export default StatusIcon;
