import { Alert } from 'js/shared-styles/alerts';
import React from 'react';

interface SCFindQueryErrorAlertProps {
  error: unknown;
}

export default function SCFindErrorAlert({ error }: SCFindQueryErrorAlertProps) {
  return (
    <Alert severity="error" sx={{ mt: 1 }}>
      {error instanceof Error ? error.message : 'An error occurred while querying scFind. Please try again.'}
    </Alert>
  );
}
