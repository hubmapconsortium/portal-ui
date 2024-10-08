import { FaroErrorBoundary } from '@grafana/faro-react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorFallback(error: Error) {
  return (
    <Stack p={4}>
      <Typography variant="subtitle1">An error occurred while attempting to display the provenance graph.</Typography>
      <DetailsAccordion summary="Click to expand error details">
        <Typography variant="body2">{error?.message}</Typography>
      </DetailsAccordion>
    </Stack>
  );
}

export default function ProvGraphErrorBoundary({ children }: ErrorBoundaryProps) {
  return <FaroErrorBoundary fallback={ErrorFallback}>{children}</FaroErrorBoundary>;
}
