import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useTabs } from 'js/shared-styles/tabs';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import { useDatasetsPublicationsTabs } from 'js/hooks/useDatasetsPublications';
import PublicationPanel from 'js/components/publications/PublicationsPanelItem';
import { ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';

export interface PublicationHit {
  _source: {
    uuid: string;
    title: string;
    publication_date: string;
    publication_venue: string;
    contributors?: ContributorAPIResponse[];
  };
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
  return (
    <TabPanel value={value} index={index}>
      <Box width="100%">
        {publications.map(({ _source: { uuid, title, contributors, publication_date, publication_venue } }) => (
          <Stack component={Paper} key={uuid} padding={1} paddingRight={2}>
            <PublicationPanel.Item
              title={title}
              href={`/browse/publication/${uuid}`}
              contributors={contributors}
              publicationVenue={publication_venue}
              publishedDate={publication_date}
            />
          </Stack>
        ))}
      </Box>
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
      <Stack maxHeight={400}>
        {datasetPublicationsTabs.map(({ uuid, publications }, index) => (
          <PublicationsPanel key={uuid} index={index} value={openTabIndex} publications={publications} />
        ))}
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(PublicationsSection);
