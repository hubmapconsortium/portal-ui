import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import { DatasetIcon } from 'js/shared-styles/icons';
import React, { PropsWithChildren } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useUUIDsFromHubmapIds } from '../hooks';
import { getSearchURL } from '../utils';
import { StyledDetailsAccordion } from './styles';

interface IndexedDatasetsSummaryProps {
  datasets: string[];
  datasetTypes: { key: string; doc_count: number }[];
  isLoadingDatasets?: boolean;
}

function IndexedDatasetsSummary({
  datasets = [],
  datasetTypes = [],
  isLoadingDatasets = false,
  children,
}: PropsWithChildren<IndexedDatasetsSummaryProps>) {
  const { datasetUUIDs, isLoading: isLoadingUUIDs } = useUUIDsFromHubmapIds(datasets);

  const isLoading = isLoadingDatasets || isLoadingUUIDs;

  return (
    <Stack spacing={2} sx={{ marginTop: 2 }}>
      <StyledDetailsAccordion
        summary={
          <Typography variant="subtitle1" component="span">
            Indexed Datasets Summary
          </Typography>
        }
        defaultExpanded
        slotProps={{
          heading: {
            component: 'div',
          },
        }}
      >
        <Typography variant="body2" component="div">
          {children}
        </Typography>
        <StyledDetailsAccordion
          summary={
            <Stack direction="row" spacing={1} alignItems="center">
              <DatasetIcon />
              <Typography variant="subtitle2" component="span">
                Data Types
              </Typography>
            </Stack>
          }
          slotProps={{
            heading: {
              component: 'div',
            },
          }}
          defaultExpanded
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {datasetTypes.map(({ key, doc_count }, idx) => (
              <Typography variant="body2" component="span" key={key}>
                {key} ({doc_count}){idx < datasetTypes.length - 1 ? ', ' : ''}
              </Typography>
            ))}
          </Stack>
        </StyledDetailsAccordion>
      </StyledDetailsAccordion>
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
    </Stack>
  );
}

export default IndexedDatasetsSummary;
