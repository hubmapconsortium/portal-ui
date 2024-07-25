import React from 'react';
import Box from '@mui/material/Box';

import { Alert } from 'js/shared-styles/alerts';

interface AlertMessagesProps {
  errorMessages?: string[];
  warningMessages?: string[];
}

function AlertMessages({ errorMessages = [], warningMessages = [] }: AlertMessagesProps) {
  if (errorMessages.length > 0 || warningMessages.length > 0) {
    return (
      <Box sx={{ display: 'grid', gap: 1, marginBottom: 3 }}>
        {/* If there are error messages, do not display warning messages */}
        {errorMessages.length > 0
          ? errorMessages.map((message) => {
              return (
                <div key={message}>
                  <Alert key={message} severity="error">
                    {message}
                  </Alert>
                </div>
              );
            })
          : warningMessages.map((message) => {
              return (
                <div key={message}>
                  <Alert key={message} severity="warning">
                    {message}
                  </Alert>
                </div>
              );
            })}
      </Box>
    );
  }

  return null;
}

export default AlertMessages;
