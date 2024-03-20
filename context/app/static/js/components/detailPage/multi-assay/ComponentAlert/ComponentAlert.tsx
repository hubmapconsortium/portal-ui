import React from 'react';

import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

import { DetailPageAlert } from 'js/components/detailPage/style';
import { InternalLink } from 'js/shared-styles/Links';
import { Stack } from '@mui/material';
import useRelatedMultiAssayDatasets from '../useRelatedMultiAssayDatasets';

function ComponentAlert() {
  const { datasets, isLoading } = useRelatedMultiAssayDatasets();

  const primary = datasets.raw[0] ?? {};

  if (!isLoading && !primary) {
    return null;
  }

  return (
    <DetailPageAlert
      severity="info"
      sx={{
        '.MuiAlert-message': {
          flexGrow: 1,
        },
      }}
    >
      <Stack direction="row">
        <Typography variant="body2">
          {primary ? (
            <>
              You are viewing a component dataset, which is a segment of a multi-assay dataset. Navigate to{' '}
              <InternalLink href={`/browse/dataset/${primary.uuid}`}>{primary.hubmap_id}</InternalLink> for the primary
              multi-assay dataset for comprehensive information.
            </>
          ) : (
            <Skeleton />
          )}
        </Typography>
        <Button href={`/browse/dataset/${primary.uuid}`} sx={{ flexShrink: 0 }} disabled={!primary}>
          Go To Primary Dataset
        </Button>
      </Stack>
    </DetailPageAlert>
  );
}

export default ComponentAlert;
