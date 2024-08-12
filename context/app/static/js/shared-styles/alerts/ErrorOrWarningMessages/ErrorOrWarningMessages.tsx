import React from 'react';
import Stack from '@mui/system/Stack';
import { Alert } from 'js/shared-styles/alerts';

interface ErrorOrWarningMessagesProps {
  errorMessages?: string[];
  warningMessages?: string[];
}

function ErrorOrWarningMessages({ errorMessages = [], warningMessages = [] }: ErrorOrWarningMessagesProps) {
  if (errorMessages.length <= 0 && warningMessages.length <= 0) {
    return null;
  }

  const content: {
    messages: string[];
    severity: 'error' | 'warning';
  } =
    /* If there are error messages, do not display warning messages */
    errorMessages.length > 0
      ? {
          messages: errorMessages,
          severity: 'error',
        }
      : {
          messages: warningMessages,
          severity: 'warning',
        };

  return (
    <Stack spacing={2} marginBottom={2}>
      {content.messages.map((message) => {
        return (
          <Alert key={message} severity={content.severity}>
            {message}
          </Alert>
        );
      })}
    </Stack>
  );
}

export default ErrorOrWarningMessages;
