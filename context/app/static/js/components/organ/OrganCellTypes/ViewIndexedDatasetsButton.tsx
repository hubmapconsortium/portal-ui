import Box from '@mui/material/Box';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import { getSearchURL } from '../utils';

interface ViewIndexedDatasetsButtonProps {
  datasetUUIDs: string[];
  isLoading: boolean;
  trackingInfo?: EventInfo;
  context?: string;
}

export default function ViewIndexedDatasetsButton({
  datasetUUIDs,
  isLoading,
  trackingInfo,
  context = 'Datasets',
}: ViewIndexedDatasetsButtonProps) {
  return (
    <Box>
      {isLoading ? (
        <Skeleton variant="rectangular" width={200} height={40} />
      ) : (
        <OutlinedLinkButton
          link={getSearchURL({
            entityType: 'Dataset',
            datasetUUIDs,
          })}
          onClick={() => {
            if (trackingInfo) {
              trackEvent({
                action: `${context} / View Indexed Datasets`,
                ...trackingInfo,
              });
            }
          }}
        >
          View Indexed Datasets
        </OutlinedLinkButton>
      )}
    </Box>
  );
}
