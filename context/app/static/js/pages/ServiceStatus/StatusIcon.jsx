import React from 'react';
import PropTypes from 'prop-types';
import { ColoredStatusIcon } from 'js/components/Detail/StatusIcon/style';

function getColor(status) {
  if (['OK'].includes(status)) {
    return 'success';
  }

  console.warn('Invalid status', status);
  return 'error';
}

function StatusIcon(props) {
  const { status } = props;
  const color = getColor(status);

  return <ColoredStatusIcon $iconColor={color} />;
}

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusIcon;
