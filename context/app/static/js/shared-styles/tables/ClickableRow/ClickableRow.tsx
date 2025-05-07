import React from 'react';
import { TableRowProps } from '@mui/material/TableRow';
import { StyledRow } from './style';

export interface ClickableRowProps extends TableRowProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}

function ClickableRow({ onClick, disabled, children, label, ...rest }: ClickableRowProps) {
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
