import React from 'react';

import CollectionDatasetsTable from 'js/components/detailPage/CollectionDatasetsTable';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import { SavedListsSuccessAlert } from 'js/components/savedLists/SavedListsAlerts';
import useTrackID from 'js/hooks/useTrackID';
import { Collection } from 'js/components/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import Stack from '@mui/material/Stack';
import { useFlaskDataContext } from 'js/components/Contexts';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SummaryBody from 'js/components/detailPage/summary/SummaryBody';

const shouldDisplaySection = {
  summary: true,
  datasets: true,
  contributors: true,
};

function Summary({ title }: { title: string }) {
  const {
    entity: { entity_type, last_modified_timestamp },
  } = useFlaskDataContext();

  return (
    <DetailPageSection id="summary">
      <SummaryData title={title} entity_type={entity_type} />
      <SummaryBody dateLastModified={last_modified_timestamp} />
    </DetailPageSection>
  );
}

function CollectionDetail({ collection: collectionData }: { collection: Collection }) {
  const { entity_type, hubmap_id, datasets, contributors, contacts, title } = collectionData;
  useTrackID({ entity_type, hubmap_id });

  if (!collectionData) {
    return null;
  }

  return (
    <DetailLayout sections={shouldDisplaySection}>
      <Stack gap={1} sx={{ marginBottom: 5 }}>
        <SavedListsSuccessAlert />
        <Summary title={title} />
        {'datasets' in collectionData && <CollectionDatasetsTable datasets={datasets} />}
        {contributors && Boolean(contributors.length) && (
          <ContributorsTable contributors={contributors} contacts={contacts} title="Contributors" />
        )}
      </Stack>
    </DetailLayout>
  );
}

export default CollectionDetail;
