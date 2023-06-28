import React from 'react';

import PanelList from 'js/shared-styles/panels/PanelList';
import { usePublicationsPanelList } from './hooks';

function PublicationsPanelList({ status }) {
  const { publicationPanelsProps } = usePublicationsPanelList(status);

  return <PanelList panelsProps={publicationPanelsProps} />;
}

export default PublicationsPanelList;
