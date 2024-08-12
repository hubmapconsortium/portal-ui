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

interface StatusIconProps {
  status: string;
}

function StatusIcon({ status: irregularCaseStatus, ...svgIconProps }: StatusIconProps & Partial<SvgIconProps>) {
  const status = irregularCaseStatus.toUpperCase();
  const color = getColor(status);

  return <ColoredStatusIcon $iconStatus={color} data-testid="status-svg-icon" {...svgIconProps} />;
}

export default StatusIcon;
