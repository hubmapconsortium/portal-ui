import React from 'react';

import PublicationRelatedEntities from 'js/components/publications/PublicationRelatedEntities';
import PublicationCollections from 'js/components/publications/PublicationCollections';
import { buildCollectionsWithDatasetQuery } from 'js/hooks/useDatasetsCollections';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';

function PublicationsDataSection({ datasetUUIDs, uuid, associated_collection, isCollectionPublication }) {
  const query = isCollectionPublication
    ? { query: getIDsQuery(associated_collection) }
    : buildCollectionsWithDatasetQuery(datasetUUIDs);

  const { searchHits: collectionsData } = useSearchHits(query);

  return (
    <>
      {!isCollectionPublication && <PublicationRelatedEntities uuid={uuid} />}
      {Boolean(collectionsData) && <PublicationCollections collectionsData={collectionsData} />}
    </>
  );
}

export default PublicationsDataSection;
