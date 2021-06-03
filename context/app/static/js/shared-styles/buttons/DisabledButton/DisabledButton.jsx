import React from 'react';

import { StyledButton } from './style';

function DisabledButton({ disabled, ...props }) {
  return <StyledButton disabled={disabled} {...props} />;
}

export default DisabledButton;
