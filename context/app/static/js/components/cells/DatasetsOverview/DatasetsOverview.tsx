import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import React, { useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Description from 'js/shared-styles/sections/Description';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { EventInfo } from 'js/components/types';
import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';
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
  tableTabDescription,
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

  const { openTabIndex, handleTabChange } = useTabs();

  const onTabChange = useEventCallback((event: React.SyntheticEvent, newValue: number) => {
    handleTabChange(event, newValue);
    if (trackingInfo) {
      const actionName = 'Datasets Overview / Toggle Tab';
      const actionlabel = newValue === 0 ? 'Visualization' : 'Table';
      trackEvent({
        ...trackingInfo,
        action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
        label: trackingInfo.label ? `${trackingInfo.label} ${actionlabel}` : actionlabel,
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
    <>
      <Description belowTheFold={belowTheFold}>{children}</Description>
      <Tabs value={openTabIndex} onChange={onTabChange} aria-label="Datasets Overview Tabs">
        <Tab label="Visualization" index={0} icon={<VisualizationIcon />} iconPosition="start" />
        <Tab label="Table" index={1} />
      </Tabs>
      <TabPanel value={openTabIndex} index={0}>
        <DatasetsOverviewChart matched={matched} indexed={indexed} all={all} trackingInfo={trackingInfo} />
      </TabPanel>
      <TabPanel value={openTabIndex} index={1}>
        {tableTabDescription && <Description>{tableTabDescription}</Description>}
        <DatasetsOverviewTable matched={matched} indexed={indexed} all={all} />
      </TabPanel>
    </>
  );
}
