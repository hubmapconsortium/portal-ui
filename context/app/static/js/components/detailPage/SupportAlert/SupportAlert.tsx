import React from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import Typography from '@mui/material/Typography';

import { DetailPageAlert } from 'js/components/detailPage/style';
import { buildSearchLink } from 'js/components/search/store';

interface SupportAlertProps {
  uuid: string;
  isSupport: boolean;
}

function SupportAlert({ uuid, isSupport }: SupportAlertProps) {
  if (!isSupport) {
    return null;
  }
  // There should usually be only one parent, but this is more robust, and we want to keep it simple.
  return (
    <DetailPageAlert severity="warning">
      <Typography variant="body2">
        “Support” entities provide derived, low-level data for visualizations. Navigate to{' '}
        <InternalLink
          href={buildSearchLink({
            entity_type: 'Dataset',
            filters: {
              descendant_ids: {
                values: [uuid],
                type: 'TERM',
              },
            },
          })}
        >
          the parent dataset
        </InternalLink>{' '}
        for a view of this information in context.
      </Typography>
    </DetailPageAlert>
  );
}

export default SupportAlert;
