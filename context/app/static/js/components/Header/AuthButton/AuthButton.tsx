import React from 'react';
import Button from '@mui/material/Button';

interface AuthButtonProps {
  isAuthenticated: boolean;
}

export function AuthButton({ isAuthenticated }: AuthButtonProps) {
  if (isAuthenticated) {
    return (
      <Button data-testid="auth-button" variant="contained" color="warning" href="/logout">
        Log Out
      </Button>
    );
  }
  return (
    <Button data-testid="auth-button" variant="contained" color="primary" href="/login">
      Log In
    </Button>
  );
}
