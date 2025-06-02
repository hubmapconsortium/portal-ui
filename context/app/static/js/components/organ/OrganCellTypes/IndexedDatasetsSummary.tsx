import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useIndexedDatasetsForOrgan } from 'js/pages/Organ/hooks';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import { DatasetIcon } from 'js/shared-styles/icons';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useUUIDsFromHubmapIds } from '../hooks';
import { getSearchURL } from '../utils';
import { StyledDetailsAccordion } from './styles';

function IndexedDatasetsSummary() {
  const { datasets, isLoading: isLoadingSCFind, datasetTypes } = useIndexedDatasetsForOrgan();
  const { datasetUUIDs, isLoading: isLoadingUUIDs } = useUUIDsFromHubmapIds(datasets);

  const isLoading = isLoadingSCFind || isLoadingUUIDs;

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
          These results are derived from RNAseq datasets that were indexed by the scFind method to identify the cell
          types associated with this organ. Not all HuBMAP datasets are currently compatible with this method due to
          differences in data modalities or the availability of cell annotations. This section gives a summary of the
          datasets that are used to compute these results, and only datasets from this organ are included.
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
