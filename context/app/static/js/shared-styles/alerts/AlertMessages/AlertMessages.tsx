import React from 'react';
import Box from '@mui/material/Box';

import { Alert } from 'js/shared-styles/alerts';

interface AlertMessagesProps {
  messages: string[];
  severity: 'error' | 'warning';
}

function AlertMessages({ messages, severity }: AlertMessagesProps) {
  if (messages?.length > 0) {
    return (
      <Box sx={{ display: 'grid', gap: 1, marginBottom: 3 }}>
        {messages.map((message) => {
          return (
            <div key={message}>
              <Alert key={message} severity={severity}>
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
