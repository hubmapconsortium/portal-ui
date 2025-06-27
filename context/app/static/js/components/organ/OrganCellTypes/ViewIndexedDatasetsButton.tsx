import Box from '@mui/material/Box';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import { SxProps } from '@mui/material/styles';
import OutlinedButton from 'js/shared-styles/buttons/OutlinedButton';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { getSearchURL } from '../utils';

interface ViewIndexedDatasetsButtonProps {
  datasetUUIDs: string[];
  isLoading: boolean;
  trackingInfo?: EventInfo;
  context?: string;
  sx?: SxProps;
}

export function ViewDatasetsButton({
  datasetUUIDs,
  isLoading,
  trackingInfo,
  context = 'Datasets',
  sx,
}: ViewIndexedDatasetsButtonProps) {
  return (
    <Box sx={sx}>
      {isLoading ? (
        <Skeleton variant="rectangular" width={156} height={36} />
      ) : (
        <OutlinedButton
          color="primary"
          startIcon={<entityIconMap.Dataset />}
          disabled={datasetUUIDs.length === 0}
          href={getSearchURL({
            entityType: 'Dataset',
            datasetUUIDs,
          })}
          onClick={() => {
            if (trackingInfo) {
              trackEvent({
                action: `${context} / View Datasets`,
                ...trackingInfo,
              });
            }
          }}
        >
          View Datasets
        </OutlinedButton>
      )}
    </Box>
  );
}

export default function ViewIndexedDatasetsButton({
  datasetUUIDs,
  isLoading,
  trackingInfo,
  context = 'Datasets',
  sx,
}: ViewIndexedDatasetsButtonProps) {
  return (
    <Box sx={sx}>
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
