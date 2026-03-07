import React from 'react';

import { ButtonProps } from '@mui/material/Button';
import { StyledButton } from './style';

// Buttons that are disabled during their lifecycle are not updating their font color correctly.
// https://github.com/hubmapconsortium/portal-ui/issues/1790
function OptDisabledButton({ disabled, ...props }: ButtonProps) {
  return <StyledButton disabled={disabled} {...props} />;
}

export default OptDisabledButton;
