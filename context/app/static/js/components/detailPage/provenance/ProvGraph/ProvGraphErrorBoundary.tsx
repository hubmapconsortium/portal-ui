import React from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <Stack p={4}>
      <Typography variant="subtitle1">An error occurred while attempting to display the provenance graph.</Typography>
      <DetailsAccordion summary="Click to expand error details">
        <Typography variant="body2">{(error as Error | null)?.message}</Typography>
      </DetailsAccordion>
    </Stack>
  );
}

export default function ProvGraphErrorBoundary({ children }: ErrorBoundaryProps) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
}
