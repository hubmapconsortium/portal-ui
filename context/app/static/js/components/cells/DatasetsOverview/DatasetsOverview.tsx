import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import React, { useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Description from 'js/shared-styles/sections/Description';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import { EventInfo } from 'js/components/types';
import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';
import Typography from '@mui/material/Typography';
import { useDatasetsOverview } from './hooks';
import DatasetsOverviewTable from './DatasetsOverviewTable';
import useSCFindResultsStatisticsStore from '../SCFindResults/store';
import DatasetsOverviewChart from './DatasetsOverviewChart';

interface DatasetsOverviewProps extends React.PropsWithChildren {
  datasets: string[];
  belowTheFold?: React.ReactNode;
  trackingInfo?: EventInfo;
  tableTabDescription?: React.ReactNode;
}

export default function DatasetsOverview({
  datasets,
  children,
  belowTheFold,
  trackingInfo,
  tableTabDescription: tableDescription,
}: DatasetsOverviewProps) {
  const { data: indexedDatasets, isLoading, error } = useIndexedDatasets();
  const indexed = useDatasetsOverview(indexedDatasets?.datasets ?? []);
  const all = useDatasetsOverview();
  const matched = useDatasetsOverview(datasets);

  const setDatasetStats = useSCFindResultsStatisticsStore((state) => state.setDatasetStats);
  useEffect(() => {
    if (indexed && all && matched) {
      setDatasetStats({
        datasets: {
          indexed: indexed.totalDatasets,
          total: all.totalDatasets,
          matched: matched.totalDatasets,
        },
        donors: {
          indexed: indexed.totalDonors,
          total: all.totalDonors,
          matched: matched.totalDonors,
        },
      });
    }
  }, [indexed, all, matched, setDatasetStats]);

  const onAccordionChange = useEventCallback((event: React.SyntheticEvent, isExpanded: boolean) => {
    if (trackingInfo && isExpanded) {
      const actionName = 'Datasets Overview / Toggle Accordion';
      trackEvent({
        ...trackingInfo,
        action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
        label: trackingInfo.label ? `${trackingInfo.label} Expand` : 'Expand',
      } as EventInfo);
    }
  });

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} />;
  }
  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <DetailsAccordion
      summary={<Typography variant="subtitle1">Datasets Overview</Typography>}
      onChange={onAccordionChange}
      defaultExpanded
    >
      <Stack spacing={3}>
        <Description belowTheFold={belowTheFold}>{children}</Description>
        <DatasetsOverviewChart matched={matched} indexed={indexed} all={all} trackingInfo={trackingInfo} />
        <DatasetsOverviewTable matched={matched} indexed={indexed} all={all}>
          {tableDescription}
        </DatasetsOverviewTable>
      </Stack>
    </DetailsAccordion>
  );
}
