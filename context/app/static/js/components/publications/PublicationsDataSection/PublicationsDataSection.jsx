import React from 'react';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';

import PanelList from 'js/shared-styles/panels/PanelList';
import { useDatasetsCollections } from '../../../hooks/useDatasetsCollections';

function PublicationsDataSection({ datasetUUIDs }) {
  const collectionsData = useDatasetsCollections(datasetUUIDs);
  const panelsProps = buildCollectionsPanelsProps(collectionsData);

  return <PanelList panelsProps={panelsProps} />;
}

export default PublicationsDataSection;
