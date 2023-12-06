import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import React from 'react';
import Description from 'js/shared-styles/sections/Description';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
import { DetailPageSection } from '../detailPage/style';
import { useCellTypeSamples, useCellTypeDatasets } from './hooks';

export default function CellTypesEntitiesTables() {
  const { data: datasets } = useCellTypeDatasets();
  const { data: samples } = useCellTypeSamples();

  const { openTabIndex, handleTabChange } = useTabs();
  return (
    <DetailPageSection id="organs">
      <SectionHeader>Organs</SectionHeader>
      <Description>
        This is the list of organs and its associated data that is dependent on the data available within HuBMAP. To
        filter the list of data in the table below by organ, select organ(s) from the list below. Multiple organs can be
        selected.
      </Description>

      <Tabs value={openTabIndex} onChange={handleTabChange}>
        <Tab index={0} label={`Samples (${samples?.length ?? 0})`} />
        <Tab index={1} label={`Datasets (${datasets?.length ?? 0})`} />
      </Tabs>
      <TabPanel index={0} value={openTabIndex}>
        <div>TODO: Samples Table</div>
        {samples?.map((sample) => JSON.stringify(sample))}
      </TabPanel>
      <TabPanel index={1} value={openTabIndex}>
        <div>TODO: Datasets Table</div>
        {datasets?.map((dataset) => JSON.stringify(dataset))}
      </TabPanel>
    </DetailPageSection>
  );
}
