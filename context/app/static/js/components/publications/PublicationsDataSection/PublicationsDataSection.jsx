import React from 'react';

import PublicationRelatedEntities from 'js/components/publications/PublicationRelatedEntities';
import PublicationCollections from 'js/components/publications/PublicationCollections';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';

function PublicationsDataSection({ datasetUUIDs, uuid }) {
  const collectionsData = useDatasetsCollections(datasetUUIDs);

  return (
    <>
      <PublicationRelatedEntities uuid={uuid} />
      {Boolean(collectionsData) && <PublicationCollections collectionsData={collectionsData} />}
    </>
  );
}

export default PublicationsDataSection;
