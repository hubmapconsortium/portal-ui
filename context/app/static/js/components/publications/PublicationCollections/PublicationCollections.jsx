import React from 'react';

import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import PanelList from 'js/shared-styles/panels/PanelList';

function PublicationCollections({ collectionsData }) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return <PanelList panelsProps={panelsProps} />;
}

export default PublicationCollections;
