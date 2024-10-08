import React from 'react';

import PublicationRelatedEntities from 'js/components/publications/PublicationRelatedEntities';
import PublicationCollections from 'js/components/publications/PublicationCollections';
import { buildCollectionsWithDatasetQuery } from 'js/hooks/useDatasetsCollections';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';

function PublicationsDataSection({ datasetUUIDs, uuid, associatedCollectionUUID }) {
  const query = associatedCollectionUUID
    ? { query: getIDsQuery(associatedCollectionUUID), _source: ['uuid', 'title', 'hubmap_id', 'datasets.uuid'] }
    : buildCollectionsWithDatasetQuery(datasetUUIDs);

  const { searchHits: collectionsData } = useSearchHits(query);

  if (associatedCollectionUUID) {
    return (
      <PublicationCollections collectionsData={collectionsData} isCollectionPublication={associatedCollectionUUID} />
    );
  }
  return <PublicationRelatedEntities uuid={uuid} />;
}

export default PublicationsDataSection;
