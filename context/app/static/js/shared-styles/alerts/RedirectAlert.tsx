import React from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import { Alert } from './Alert';

type RedirectAlertProps = {
  messageTemplate: (redirected_from: string) => string;
  severity?: 'info' | 'warning' | 'error' | 'success';
};

const defaultMessageTemplate = (redirected_from: string) => `You were redirected from ${redirected_from}.`

export function RedirectAlert({ messageTemplate = defaultMessageTemplate, severity = 'info' }: RedirectAlertProps) {
  const { redirected_from } = useFlaskDataContext();
  if (!redirected_from) {
    return null;
  }
  return (
    <Alert severity={severity} $marginBottom={10}>
        {messageTemplate(redirected_from)}
    </Alert>
  );
}
