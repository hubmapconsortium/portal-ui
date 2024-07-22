import React from 'react';

import Button from '@mui/material/Button';
import { Alert } from './Alert';

interface LoginAlertProps {
  featureName: string;
}
export default function LoginAlert({ featureName }: LoginAlertProps) {
  return (
    <Alert severity="info" action={<Button href="/login">Log in</Button>}>
      You must be logged in to access {featureName}.
      {featureName === 'workspaces'
        ? ` At present, access to ${featureName} is restricted to HuBMAP members and invited community members.`
        : ` Access to ${featureName} is restricted to HuBMAP members at present.`}
    </Alert>
  );
}
