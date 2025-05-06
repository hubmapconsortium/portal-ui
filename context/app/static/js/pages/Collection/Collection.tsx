import React, { useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import { SavedListsSuccessAlert } from 'js/components/savedLists/SavedListsAlerts';
import useTrackID from 'js/hooks/useTrackID';
import { Collection, Dataset } from 'js/components/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { useFlaskDataContext } from 'js/components/Contexts';
import DetailPageSection, { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SummaryBody from 'js/components/detailPage/summary/SummaryBody';
import { ContactAPIResponse, ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';
import { useCollectionsDatasets } from 'js/pages/Collection/hooks';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { buildSearchLink } from 'js/components/search/store';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';

const descriptions = {
  contributors: 'This is the list of contributors affiliated with this collection.',
  datasets: 'This is the list of data that is in this collection.',
};

function Summary({ title }: { title: string }) {
  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  return (
    <DetailPageSection id="summary">
      <SummaryData title={title} entity_type={entity_type} />
      <SummaryBody />
    </DetailPageSection>
  );
}

function Datasets({ datasets }: { datasets?: Dataset[] }) {
  const {
    datasets: data,
    columns,
    uuids,
  } = useCollectionsDatasets({
    ids: datasets?.map((d) => d.uuid) ?? [],
  });
  const [openIndex, setOpenIndex] = useState(0);

  const searchPageHref = useMemo(
    () =>
      buildSearchLink({
        entity_type: 'Dataset',
        filters: {
          uuid: {
            type: 'TERM',
            values: Array.from(uuids),
          },
        },
      }),
    [uuids],
  );

  if (!datasets?.length) {
    return null;
  }

  return (
    <CollapsibleDetailPageSection
      title="Datasets"
      id="datasets-table"
      icon={sectionIconMap.datasets}
      buttons={<RelatedEntitiesSectionActions searchPageHref={searchPageHref} uuids={uuids} />}
    >
      <SectionDescription>{descriptions.datasets}</SectionDescription>
      <Paper>
        <RelatedEntitiesTabs
          entities={[
            {
              entityType: 'Dataset' as const,
              tabLabel: 'Datasets',
              data,
              columns,
            },
          ]}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
          ariaLabel="Derived Data Tabs"
          renderWarningMessage={(tableEntityType) => `No ${tableEntityType.toLowerCase()}s for this collection.`}
        />
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

function Contributors({
  contributors,
  contacts,
}: {
  contributors: ContributorAPIResponse[];
  contacts: ContactAPIResponse[];
}) {
  if (!contributors?.length) {
    return null;
  }

  return (
    <ContributorsTable
      iconPanelText={descriptions.contributors}
      contributors={contributors}
      contacts={contacts}
      title="Contributors"
    />
  );
}

function CollectionDetail({ collection: collectionData }: { collection: Collection }) {
  const { entity_type, hubmap_id, datasets, contributors, contacts, title } = collectionData;
  useTrackID({ entity_type, hubmap_id });

  const shouldDisplaySection = {
    summary: true,
    datasets: datasets.length > 0,
    contributors: true,
  };

  if (!collectionData) {
    return null;
  }

  return (
    <DetailLayout sections={shouldDisplaySection}>
      <Stack gap={1} marginBottom={5}>
        <SavedListsSuccessAlert />
        <Summary title={title} />
        <Datasets datasets={datasets} />
        <Contributors contributors={contributors} contacts={contacts} />
      </Stack>
    </DetailLayout>
  );
}

export default CollectionDetail;
