import React from 'react';
import Button from '@mui/material/Button';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventInfo } from 'js/components/workspaces/types';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { Alert } from './Alert';

interface LoginAlertProps {
  featureName: string;
  trackingInfo?: WorkspacesEventInfo;
}
export default function LoginAlert({ featureName, trackingInfo }: LoginAlertProps) {
  return (
    <Alert
      severity="info"
      action={
        <Button
          onClick={() => {
            if (trackingInfo) {
              trackEvent({
                ...trackingInfo,
                action: 'Log In / From alert',
                label: 'alert banner',
              });
            }
          }}
          href="/login"
        >
          Log in
        </Button>
      }
      data-testid="login-alert"
    >
      You must be logged in to access {featureName}.
      {featureName === 'workspaces' ? (
        <>
          {' '}
          You can request access to workspaces by contacting the <ContactUsLink>HuBMAP Help Desk.</ContactUsLink>
        </>
      ) : (
        ` Access to ${featureName} is restricted to HuBMAP members at present.`
      )}
    </Alert>
  );
}
