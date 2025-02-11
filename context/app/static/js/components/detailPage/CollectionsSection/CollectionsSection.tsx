import React from 'react';

import PanelList from 'js/shared-styles/panels/PanelList';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import { useDatasetsCollectionsTabs } from 'js/hooks/useDatasetsCollections';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { OutlinedAlert } from 'js/shared-styles/alerts/OutlinedAlert.stories';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useTabs } from 'js/shared-styles/tabs';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import Skeleton from '@mui/material/Skeleton';
import { CollectionHit } from 'js/pages/Collections/types';

function CollectionPanel({
  index,
  value,
  collections = [],
}: {
  index: number;
  value: number;
  collections: CollectionHit[];
}) {
  const panelsProps = buildCollectionsPanelsProps(collections);
  if (panelsProps.length === 0) {
    return (
      <TabPanel value={value} index={index}>
        <OutlinedAlert severity="info">The raw dataset is not referenced in any existing collections.</OutlinedAlert>
      </TabPanel>
    );
  }
  return (
    <TabPanel value={value} index={index}>
      <PanelList panelsProps={panelsProps} key={index} />
    </TabPanel>
  );
}

const collectionsSectionDescription =
  'Collections may contain references to either raw or processed datasets. If a processed dataset is not included in any collection, there will be no corresponding tabs in the table below.';

function CollectionsSection() {
  const datasetCollectionsTabs = useDatasetsCollectionsTabs();

  const { isLoading } = useProcessedDatasets();

  const { openTabIndex, handleTabChange, setOpenTabIndex } = useTabs(0);

  if (isLoading) {
    return (
      <CollapsibleDetailPageSection id="collections" title="Collections" icon={sectionIconMap.collections}>
        <SectionDescription>{collectionsSectionDescription}</SectionDescription>
        <Skeleton variant="rectangular" height={200} />
      </CollapsibleDetailPageSection>
    );
  }

  if (datasetCollectionsTabs.length === 0) {
    return null;
  }

  return (
    <CollapsibleDetailPageSection id="collections" title="Collections" icon={sectionIconMap.collections}>
      <SectionDescription>{collectionsSectionDescription}</SectionDescription>
      <Tabs
        value={openTabIndex}
        onChange={(e, newValue) => {
          handleTabChange(e, newValue as number);
        }}
        aria-label="Dataset collections"
      >
        {datasetCollectionsTabs.map(({ label, uuid, icon: Icon }, index) => (
          <Tab
            key={uuid}
            label={label}
            isSingleTab={datasetCollectionsTabs.length === 1}
            index={index}
            icon={Icon ? <Icon /> : undefined}
            iconPosition="start"
            onClick={() => setOpenTabIndex(index)}
            value={index}
          />
        ))}
      </Tabs>
      {datasetCollectionsTabs.map(({ uuid, collections }, index) => (
        <CollectionPanel key={uuid} index={index} value={openTabIndex} collections={collections} />
      ))}
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CollectionsSection);
