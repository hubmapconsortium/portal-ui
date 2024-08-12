import React from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';
import ColoredStatusIcon from './ColoredStatusIcon';

function getColor(status: string) {
  if (['NEW', 'REOPENED', 'QA', 'LOCKED', 'PROCESSING', 'HOLD', 'SUBMITTED'].includes(status)) {
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

interface StatusIconProps extends SvgIconProps {
  status: string;
  noColor?: boolean;
}

function StatusIcon({ status: irregularCaseStatus, noColor, ...props }: StatusIconProps) {
  const status = irregularCaseStatus.toUpperCase();
  const color = getColor(status);

  return <ColoredStatusIcon $iconStatus={color} $noColor={noColor} data-testid="status-svg-icon" {...props} />;
}

export default StatusIcon;
