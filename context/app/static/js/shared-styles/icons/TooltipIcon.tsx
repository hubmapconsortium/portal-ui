import React from 'react';
import { styled } from '@mui/material/styles';
import { shouldForwardProp } from 'js/helpers/styled';
import { InfoIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from '../tooltips';

interface StyledInfoIconProps {
  $noMargin?: boolean;
}

const StyledInfoIcon = styled(InfoIcon, { shouldForwardProp })<StyledInfoIconProps>(({ theme, $noMargin }) => ({
  marginLeft: $noMargin ? 0 : theme.spacing(0.5),
  fontSize: '1rem',
  verticalAlign: 'middle',
}));

interface TooltipIconProps {
  iconTooltipText?: string;
  noMargin?: boolean;
}

export default function InfoTooltipIcon({ iconTooltipText, noMargin }: TooltipIconProps) {
  if (!iconTooltipText) {
    return null;
  }
  return (
    <SecondaryBackgroundTooltip title={iconTooltipText}>
      <StyledInfoIcon color="primary" $noMargin={noMargin} />
    </SecondaryBackgroundTooltip>
  );
}
