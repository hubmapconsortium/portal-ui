import React from 'react';
import { StyledButton } from 'js/shared-styles/buttons/OutlinedButton/style';
import { ButtonProps } from '@mui/material/Button';

interface OutlinedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

function OutlinedButton({ children, ...rest }: OutlinedButtonProps) {
  return (
    <StyledButton variant="outlined" {...rest}>
      {children}
    </StyledButton>
  );
}

export default OutlinedButton;
