import React from 'react';

import PublicationRelatedEntities from 'js/components/publications/PublicationRelatedEntities';
import PublicationCollections from 'js/components/publications/PublicationCollections';
import { buildCollectionsWithDatasetQuery } from 'js/hooks/useDatasetsCollections';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';

function PublicationsDataSection({ datasetUUIDs, uuid, associatedCollectionUUID }) {
  const query = associatedCollectionUUID
    ? { query: getIDsQuery(associatedCollectionUUID) }
    : buildCollectionsWithDatasetQuery(datasetUUIDs);

  const { searchHits: collectionsData } = useSearchHits(query);

  return (
    <DetailPageSection id="data">
      {associatedCollectionUUID && <SectionHeader>Data</SectionHeader>}
      {!associatedCollectionUUID && <PublicationRelatedEntities uuid={uuid} />}
      {collectionsData.length > 0 && (
        <PublicationCollections collectionsData={collectionsData} isCollectionPublication={associatedCollectionUUID} />
      )}
    </DetailPageSection>
  );
}

export default PublicationsDataSection;
