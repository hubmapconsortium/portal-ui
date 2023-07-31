import React from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import Typography from '@mui/material/Typography';

import { DetailPageAlert } from 'js/components/detailPage/style';

function SupportAlert({ uuid }) {
  // There should usually be only one parent, but this is more robust, and we want to keep it simple.
  return (
    <DetailPageAlert severity="warning">
      <Typography variant="body2">
        “Support” entities provide derived, low-level data for visualizations. Navigate to{' '}
        <InternalLink href={`/search?descendant_ids[0]=${uuid}&entity_type[0]=Dataset`}>
          the parent dataset
        </InternalLink>{' '}
        for a view of this information in context.
      </Typography>
    </DetailPageAlert>
  );
}

export default SupportAlert;
