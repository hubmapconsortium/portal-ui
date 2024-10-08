import React, { forwardRef } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import Box from '@mui/material/Box';
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
  tooltip?: boolean;
}

const StatusIcon = forwardRef(function StatusIcon(
  { status: irregularCaseStatus, noColor, tooltip, ...props }: StatusIconProps,
  ref: React.Ref<SVGSVGElement>,
) {
  const status = irregularCaseStatus.toUpperCase();
  const color = getColor(status);

  const content = (
    <ColoredStatusIcon ref={ref} status={color} noColor={noColor} data-testid="status-svg-icon" {...props} />
  );

  if (tooltip) {
    return (
      <SecondaryBackgroundTooltip title={irregularCaseStatus}>
        {/* The wrapper is required for the tooltip to work */}
        <Box display="flex">{content}</Box>
      </SecondaryBackgroundTooltip>
    );
  }

  return content;
});

export default StatusIcon;
