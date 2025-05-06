import React from 'react';
import Button from '@mui/material/Button';
import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';

interface AuthButtonProps {
  isAuthenticated: boolean;
}

export function AuthButton({ isAuthenticated }: AuthButtonProps) {
  const handleTrack = useEventCallback(() => {
    trackEvent({
      category: 'Header Navigation / Your Profile',
      action: `Log In Action / ${isAuthenticated ? '' : 'Not '}Logged In`,
      label: `Log ${isAuthenticated ? 'Out' : 'In'} Button`,
    });
  });

  if (isAuthenticated) {
    return (
      <Button data-testid="auth-button" variant="contained" color="warning" href="/logout" onClick={handleTrack}>
        Log Out
      </Button>
    );
  }
  return (
    <Button data-testid="auth-button" variant="contained" color="primary" href="/login" onClick={handleTrack}>
      Log In
    </Button>
  );
}
