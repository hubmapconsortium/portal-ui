import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { InternalLink } from 'js/shared-styles/Links';
import React from 'react';

export default function BiomarkersLandingPageDescription() {
  return (
    <Stack direction="column" spacing={1}>
      <div>
        Gene and protein information are available in HuBMAP data. To look up information about a specific gene or
        protein, use the search bar below. Launch the <InternalLink href="/cells">Molecular Query</InternalLink> to find
        datasets for a specific biomarker.
      </div>
      <Button variant="contained" color="primary" href="/cells" sx={{ width: 'max-content' }}>
        Launch Molecular Query (BETA)
      </Button>
    </Stack>
  );
}
