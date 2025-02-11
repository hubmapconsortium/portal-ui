import React, { SyntheticEvent, useEffect } from 'react';

import PanelList from 'js/shared-styles/panels/PanelList';
import { useFlaskDataContext } from 'js/components/Contexts';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { OutlinedAlert } from 'js/shared-styles/alerts/OutlinedAlert.stories';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useTabs } from 'js/shared-styles/tabs';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import Skeleton from '@mui/material/Skeleton';
import { useProcessedDatasetTabs } from '../ProcessedData/ProcessedDataset/hooks';
import CollectionsSectionProvider, { useCollectionsSectionContext } from './CollectionsSectionContext';

interface CollectionTabProps {
  label: string;
  uuid: string;
  index: number;
  icon?: React.ComponentType;
  onClick?: (e: SyntheticEvent<Element, Event>) => void;
  value: number;
}

function CollectionTab({ label, uuid, index, icon: Icon, onClick, value }: CollectionTabProps) {
  const collectionsData = useDatasetsCollections([uuid]);
  const {
    entity: { uuid: primaryDatasetId },
  } = useFlaskDataContext();
  const { processedDatasetHasCollections } = useCollectionsSectionContext();

  const isPrimaryDataset = uuid === primaryDatasetId;

  if (!collectionsData || (collectionsData.length === 0 && uuid !== primaryDatasetId)) {
    return null;
  }
  const isSingleTab = !processedDatasetHasCollections && isPrimaryDataset;
  const isSelected = value === index;

  return (
    <Tab
      label={label}
      isSingleTab={isSingleTab}
      index={index}
      icon={Icon ? <Icon /> : undefined}
      iconPosition="start"
      onClick={onClick}
      value={index}
      className={isSelected ? 'Mui-selected' : ''}
      classes={{
        root: isSelected ? 'Mui-selected' : '',
      }}
    />
  );
}

function CollectionPanel({ uuid, index, value }: { uuid: string; index: number; value: number }) {
  const collectionsData = useDatasetsCollections([uuid]);
  const { setProcessedDatasetHasCollections } = useCollectionsSectionContext();
  const {
    entity: { uuid: primaryDatasetId },
  } = useFlaskDataContext();

  useEffect(() => {
    if (uuid !== primaryDatasetId && collectionsData?.length > 0) {
      setProcessedDatasetHasCollections(true);
    }
  }, [collectionsData?.length, primaryDatasetId, setProcessedDatasetHasCollections, uuid]);
  if (!collectionsData) {
    return null;
  }
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  if (panelsProps.length === 0) {
    if (uuid === primaryDatasetId) {
      return (
        <TabPanel value={value} index={index}>
          <OutlinedAlert severity="info">The raw dataset is not referenced in any existing collections.</OutlinedAlert>
        </TabPanel>
      );
    }
    return null;
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
  const processedDatasetTabs = useProcessedDatasetTabs();
  const { isLoading } = useProcessedDatasets();

  const { openTabIndex, handleTabChange } = useTabs();

  if (isLoading) {
    return (
      <CollapsibleDetailPageSection id="collections" title="Collections" icon={sectionIconMap.collections}>
        <SectionDescription>{collectionsSectionDescription}</SectionDescription>
        <Skeleton variant="rectangular" height={200} />
      </CollapsibleDetailPageSection>
    );
  }

  return (
    <CollapsibleDetailPageSection id="collections" title="Collections" icon={sectionIconMap.collections}>
      <CollectionsSectionProvider>
        <SectionDescription>{collectionsSectionDescription}</SectionDescription>
        <Tabs value={openTabIndex} onChange={handleTabChange} aria-label="Dataset collections">
          {processedDatasetTabs.map(({ label, uuid, icon }, index) => (
            <CollectionTab
              key={uuid}
              label={label}
              uuid={uuid}
              index={index}
              icon={icon}
              value={openTabIndex}
              onClick={(e) => handleTabChange(e, index)}
            />
          ))}
        </Tabs>
        {processedDatasetTabs.map(({ uuid }, index) => (
          <CollectionPanel key={uuid} uuid={uuid} index={index} value={openTabIndex} />
        ))}
      </CollectionsSectionProvider>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CollectionsSection);
