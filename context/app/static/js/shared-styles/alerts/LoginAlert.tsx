import React from 'react';

import Button from '@mui/material/Button';
import { trackEvent } from 'js/helpers/trackers';
import { Alert } from './Alert';

interface LoginAlertProps {
  featureName: string;
}
export default function LoginAlert({ featureName }: LoginAlertProps) {
  return (
    <Alert
      severity="info"
      action={
        <Button
          onClick={() => {
            if (featureName === 'workspaces') {
              trackEvent({
                category: 'Workspace Landing Page',
                action: 'Log In / From alert',
              });
            }
          }}
          href="/login"
        >
          Log in
        </Button>
      }
    >
      You must be logged in to access {featureName}.
      {featureName === 'workspaces'
        ? ' At present, access to workspaces is restricted to HuBMAP members and invited community members.'
        : ` Access to ${featureName} is restricted to HuBMAP members at present.`}
    </Alert>
  );
}
