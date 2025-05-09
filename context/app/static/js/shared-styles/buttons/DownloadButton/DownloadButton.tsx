import React from 'react';
import { Download } from '@mui/icons-material';
import SvgIcon from '@mui/material/SvgIcon';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';

function DownloadButton({ disabled, ...rest }: TooltipButtonProps) {
  return (
    <WhiteBackgroundIconTooltipButton disabled={disabled} {...rest}>
      <SvgIcon color={disabled ? 'disabled' : 'primary'} component={Download} />
    </WhiteBackgroundIconTooltipButton>
  );
}

export default DownloadButton;
