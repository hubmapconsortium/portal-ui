import React from 'react';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';

import PanelList from 'js/shared-styles/panels/PanelList';
import PublicationRelatedEntities from 'js/components/publications/PublicationRelatedEntities';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';

function PublicationsDataSection({ datasetUUIDs, uuid }) {
  const collectionsData = useDatasetsCollections(datasetUUIDs);
  const panelsProps = buildCollectionsPanelsProps(collectionsData);

  return (
    <>
      <PublicationRelatedEntities uuid={uuid} />
      <PanelList panelsProps={panelsProps} />;
    </>
  );
}

export default PublicationsDataSection;
