import Box from '@mui/material/Box';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { getSearchURL } from '../utils';

interface ViewIndexedDatasetsButtonProps {
  datasetUUIDs: string[];
  isLoading: boolean;
}

export default function ViewIndexedDatasetsButton({ datasetUUIDs, isLoading }: ViewIndexedDatasetsButtonProps) {
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
        >
          View Indexed Datasets
        </OutlinedLinkButton>
      )}
    </Box>
  );
}
