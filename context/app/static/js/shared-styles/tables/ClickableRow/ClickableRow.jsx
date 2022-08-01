import React from 'react';
import { StyledRow } from './style';

function ClickableRow({ onClick, disabled, children, label, ...rest }) {
  return (
    <StyledRow
      onClick={onClick}
      disabled={disabled}
      role="button"
      aria-label={label}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </StyledRow>
  );
}

export default ClickableRow;
