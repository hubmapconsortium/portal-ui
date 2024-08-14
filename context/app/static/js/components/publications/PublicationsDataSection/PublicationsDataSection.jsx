import React from 'react';

import PublicationRelatedEntities from 'js/components/publications/PublicationRelatedEntities';
import PublicationCollections from 'js/components/publications/PublicationCollections';
import { buildCollectionsWithDatasetQuery } from 'js/hooks/useDatasetsCollections';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';

function PublicationsDataSection({ datasetUUIDs, uuid, associatedCollectionUUID }) {
  const query = associatedCollectionUUID
    ? { query: getIDsQuery(associatedCollectionUUID) }
    : buildCollectionsWithDatasetQuery(datasetUUIDs);

  const { searchHits: collectionsData } = useSearchHits(query);

  if (associatedCollectionUUID) {
    return (
      <PublicationCollections collectionsData={collectionsData} isCollectionPublication={associatedCollectionUUID} />
    );
  }

  return (
    <CollapsibleDetailPageSection title="Data" iconTooltipText="HuBMAP data created or used by the publication.">
      {!associatedCollectionUUID && <PublicationRelatedEntities uuid={uuid} />}
    </CollapsibleDetailPageSection>
  );
}

export default PublicationsDataSection;
