import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useCellVariableNames } from './hooks';

export default function SubmitButton() {
  const cellVariableNames = useCellVariableNames();
  return (
    <Box mt={2}>
      <Button
        disabled={cellVariableNames.length === 0}
        variant="contained"
        color="primary"
        id="run-query-button"
        type="submit"
      >
        Run Query
      </Button>
    </Box>
  );
}
