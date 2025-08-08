import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatasetIcon, OrganIcon } from 'js/shared-styles/icons';
import React, { PropsWithChildren } from 'react';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import { useEventCallback } from '@mui/material/utils';
import { useUUIDsFromHubmapIds } from '../hooks';
import { StyledDetailsAccordion } from './styles';
import ViewIndexedDatasetsButton from './ViewIndexedDatasetsButton';

interface IndexedDatasetsSummaryProps {
  datasets?: string[];
  datasetTypes: { key: string; doc_count: number }[];
  organs?: { key: string; doc_count: number }[];
  isLoadingDatasets?: boolean;
  trackingInfo?: EventInfo;
  context?: string;
}

function IndexedDatasetsSummary({
  datasets = [],
  datasetTypes = [],
  organs = [],
  isLoadingDatasets = false,
  children,
  trackingInfo,
  context = 'Cell Types',
}: PropsWithChildren<IndexedDatasetsSummaryProps>) {
  const { datasetUUIDs, isLoading: isLoadingUUIDs } = useUUIDsFromHubmapIds(datasets);

  const isLoading = isLoadingDatasets || isLoadingUUIDs;

  const trackExpandChange = useEventCallback((_, expanded: boolean) => {
    if (trackingInfo) {
      trackEvent({
        ...trackingInfo,
        action: `${context} / ${expanded ? 'Expand' : 'Collapse'} Indexed Datasets Summary`,
      });
    }
  });

  return (
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
      onChange={trackExpandChange}
      sx={{
        mt: 2,
      }}
    >
      <Typography variant="body2" component="div">
        {children}
      </Typography>
      {organs && organs.length > 0 && (
        <StyledDetailsAccordion
          summary={
            <Stack direction="row" spacing={1} alignItems="center">
              <OrganIcon />
              <Typography variant="subtitle2" component="span">
                Organs
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
            {organs.map(({ key, doc_count }, idx) => (
              <Typography variant="body2" component="span" key={key}>
                {key} ({doc_count}){idx < organs.length - 1 ? ', ' : ''}
              </Typography>
            ))}
          </Stack>
        </StyledDetailsAccordion>
      )}
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
      <ViewIndexedDatasetsButton
        context={context}
        datasetUUIDs={datasetUUIDs}
        isLoading={isLoading}
        trackingInfo={trackingInfo}
        sx={{ mt: 2 }}
      />
    </StyledDetailsAccordion>
  );
}

export default IndexedDatasetsSummary;
