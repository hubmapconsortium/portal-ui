import React, { ReactNode } from 'react';
import Button from '@mui/material/Button';
import { AlertProps } from '@mui/material/Alert';

import { trackEvent } from 'js/helpers/trackers';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { EventInfo } from 'js/components/types';
import { Alert } from './Alert';

interface LoginAlertBaseProps {
  trackingInfo?: EventInfo;
  alertProps?: Partial<AlertProps>;
}

interface LoginAlertMessageProps extends LoginAlertBaseProps {
  message: ReactNode;
  featureName?: never;
}

interface LoginAlertDefaultMessageProps extends LoginAlertBaseProps {
  featureName: string;
  message?: never;
}

type LoginAlertProps = LoginAlertMessageProps | LoginAlertDefaultMessageProps;

function buildDefaultMessage({ featureName }: { featureName?: string }) {
  if (!featureName) {
    return <>You must be loggeded in to access this feature.</>;
  }
  return (
    <>
      You must be logged in to access {featureName}.
      {featureName === 'workspaces' ? (
        <>
          {' '}
          You can request access to workspaces by contacting the <ContactUsLink>HuBMAP Help Desk.</ContactUsLink>
        </>
      ) : (
        ` Access to ${featureName} is restricted to HuBMAP members at present.`
      )}
    </>
  );
}
export default function LoginAlert({ message, featureName, trackingInfo, alertProps }: LoginAlertProps) {
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
      {...alertProps}
    >
      {message ?? buildDefaultMessage({ featureName })}
    </Alert>
  );
}
