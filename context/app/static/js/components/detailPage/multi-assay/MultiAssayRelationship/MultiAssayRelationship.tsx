import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import RelatedMultiAssayLinks from '../RelatedMultiAssayLinks';
import { useIsMultiAssay } from '../hooks';

function MultiAssayRelationship() {
  const { isMultiAssay } = useIsMultiAssay();

  if (!isMultiAssay) {
    return null;
  }
  return (
    <Paper sx={(theme) => ({ p: 2, borderTop: `1px solid ${theme.palette.divider}` })}>
      <Stack justifyContent="space-between" alignItems="start" pb={2} spacing={2}>
        <Typography component="h3" variant="h4">
          Multi-Assay Relationship
        </Typography>
        <Typography>
          This dataset is a component of a multi-assay dataset and the relationships between datasets are displayed
          below. The current dataset will be highlighted by a green line.
        </Typography>
        <RelatedMultiAssayLinks />
      </Stack>
    </Paper>
  );
}

export default MultiAssayRelationship;
