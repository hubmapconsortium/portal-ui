import React from 'react';
import { styled } from '@mui/material/styles';
import { InfoIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from '../tooltips';

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  fontSize: '1rem',
}));

interface TooltipIconProps {
  iconTooltipText?: string;
}

export default function InfoTooltipIcon({ iconTooltipText }: TooltipIconProps) {
  if (!iconTooltipText) {
    return null;
  }
  return (
    <SecondaryBackgroundTooltip title={iconTooltipText}>
      <StyledInfoIcon color="primary" />
    </SecondaryBackgroundTooltip>
  );
}
