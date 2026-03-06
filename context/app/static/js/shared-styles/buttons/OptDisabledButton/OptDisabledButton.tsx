import React, { ComponentProps } from 'react';

import { StyledButton } from './style';

// Buttons that are disabled during their lifecycle are not updating their font color correctly.
// https://github.com/hubmapconsortium/portal-ui/issues/1790
function OptDisabledButton({ disabled, ...props }: ComponentProps<typeof StyledButton>) {
  return <StyledButton disabled={disabled} {...props} />;
}

export default OptDisabledButton;
