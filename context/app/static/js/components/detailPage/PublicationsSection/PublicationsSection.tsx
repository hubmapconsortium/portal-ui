import React from 'react';

import PanelList from 'js/shared-styles/panels/PanelList';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { OutlinedAlert } from 'js/shared-styles/alerts/OutlinedAlert.stories';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useTabs } from 'js/shared-styles/tabs';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import Skeleton from '@mui/material/Skeleton';
import { useDatasetsPublicationsTabs } from 'js/hooks/useDatasetsPublications';

export interface PublicationHit {
  _source: {
    uuid: string;
    title: string;
    hubmap_id: string;
  };
}

function buildPublicationsPanelsProps(publications: PublicationHit[]) {
  return publications.map(({ _source: { uuid, title, hubmap_id } }) => ({
    key: uuid,
    href: `/browse/collection/${uuid}`,
    title,
    secondaryText: hubmap_id,
  }));
}

function PublicationsPanel({
  index,
  value,
  publications = [],
}: {
  index: number;
  value: number;
  publications: PublicationHit[];
}) {
  const panelsProps = buildPublicationsPanelsProps(publications);

  if (panelsProps.length === 0) {
    return (
      <TabPanel value={value} index={index} sx={{ '> .MuiPaper-root': { width: '100%' } }}>
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

const publicationsSectionDescription =
  'Publications may contain references to either raw or processed datasets. If a processed dataset is not included in any publication, there will be no corresponding tabs in the table below.';

function PublicationsSection() {
  const datasetPublicationsTabs = useDatasetsPublicationsTabs();

  const { isLoading } = useProcessedDatasets();

  const { openTabIndex, handleTabChange, setOpenTabIndex } = useTabs(0);

  if (isLoading) {
    return (
      <CollapsibleDetailPageSection id="publications" title="Publications" icon={sectionIconMap.collections}>
        <SectionDescription>{publicationsSectionDescription}</SectionDescription>
        <Skeleton variant="rectangular" height={200} />
      </CollapsibleDetailPageSection>
    );
  }

  if (datasetPublicationsTabs.length === 0) {
    return null;
  }

  return (
    <CollapsibleDetailPageSection id="publications" title="Publications" icon={sectionIconMap.publications}>
      <SectionDescription>{publicationsSectionDescription}</SectionDescription>
      <Tabs
        value={openTabIndex}
        onChange={(e, newValue) => {
          handleTabChange(e, newValue as number);
        }}
        aria-label="Dataset publications"
      >
        {datasetPublicationsTabs.map(({ label, uuid, icon: Icon }, index) => (
          <Tab
            key={uuid}
            label={label}
            isSingleTab={datasetPublicationsTabs.length === 1}
            index={index}
            icon={Icon ? <Icon /> : undefined}
            iconPosition="start"
            onClick={() => setOpenTabIndex(index)}
            value={index}
          />
        ))}
      </Tabs>
      {datasetPublicationsTabs.map(({ uuid, publications }, index) => (
        <PublicationsPanel key={uuid} index={index} value={openTabIndex} publications={publications} />
      ))}
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(PublicationsSection);
