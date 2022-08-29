import React from 'react';
import PropTypes from 'prop-types';
import { ColoredStatusIcon } from './style';

function getColor(status) {
  if (['NEW', 'REOPENED', 'QA', 'LOCKED', 'PROCESSING', 'HOLD'].includes(status)) {
    return 'info';
  }

  if (['INVALID', 'ERROR'].includes(status)) {
    return 'error';
  }

  if (['UNPUBLISHED', 'DEPRECATED', 'Retracted' /* sub_status gets title caps. */].includes(status)) {
    return 'warning';
  }

  if (status === 'PUBLISHED') {
    return 'success';
  }

  console.warn('Invalid status', status);
  return 'error';
}

function StatusIcon({ status: irregularCaseStatus }) {
  const status = irregularCaseStatus.toUpperCase();
  const color = getColor(status);

  return <ColoredStatusIcon $iconColor={color} data-testid="status-svg-icon" />;
}

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusIcon;
