import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import React from 'react';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { useDatasetsOverview } from './hooks';
import DatasetsOverviewTable from './DatasetsOverviewTable';
import DatasetsOverviewChart from './DatasetsOverviewChart';

interface DatasetsOverviewProps {
  datasets: string[];
}

export default function DatasetsOverview({ datasets }: DatasetsOverviewProps) {
  const { data: indexedDatasets, isLoading, error } = useIndexedDatasets();
  const indexed = useDatasetsOverview(indexedDatasets?.datasets ?? []);
  const all = useDatasetsOverview();
  const matched = useDatasetsOverview(datasets);

  const { openTabIndex, handleTabChange } = useTabs();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        <Tab label="Visualization" index={0} icon={<VisualizationIcon />} iconPosition="start" />
        <Tab label="Table" index={1} />
      </Tabs>
      <TabPanel value={openTabIndex} index={0}>
        <DatasetsOverviewChart matched={matched} indexed={indexed} all={all} />
      </TabPanel>
      <TabPanel value={openTabIndex} index={1}>
        <DatasetsOverviewTable indexed={indexed} all={all} matched={matched} />
      </TabPanel>
    </>
  );
}
