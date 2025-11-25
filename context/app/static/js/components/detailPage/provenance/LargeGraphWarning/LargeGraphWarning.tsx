import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Alert } from 'js/shared-styles/alerts';

interface LargeGraphWarningProps {
  entityCount: number;
  onConfirm: () => void;
}

function LargeGraphWarning({ entityCount, onConfirm }: LargeGraphWarningProps) {
  return (
    <Alert severity="warning">
      <Stack spacing={2}>
        <Typography variant="body1">
          This provenance graph contains <strong>{entityCount} entities</strong>, which may take a moment to render and
          could impact browser performance.
        </Typography>
        <Typography variant="body2">Do you want to proceed with viewing the graph?</Typography>
        <div>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Yes, Show Graph
          </Button>
        </div>
      </Stack>
    </Alert>
  );
}

export default LargeGraphWarning;
