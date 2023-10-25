import React from 'react';
import Box from '@mui/material/Box';

import { Alert } from 'js/shared-styles/alerts';

interface ErrorMessagesProps {
  errorMessages: string[];
}

function ErrorMessages({ errorMessages }: ErrorMessagesProps) {
  if (errorMessages?.length > 0) {
    return (
      <Box sx={{ display: 'grid', gap: 1, marginBottom: 3 }}>
        {errorMessages.map((errorMessage) => {
          return (
            <div key={errorMessage}>
              <Alert key={errorMessage} severity="error">
                {errorMessage}
              </Alert>
            </div>
          );
        })}
      </Box>
    );
  }

  return null;
}

export default ErrorMessages;
