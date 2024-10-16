import React from 'react';

import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import PanelList from 'js/shared-styles/panels/PanelList';

import { useCollections } from './hooks';

const description =
  'Collections of HuBMAP datasets represent data from related experiments—such as assays performed on the same organ—or data that has been grouped for other reasons. In the future, it will be possible to reference collections through Document Object Identifiers (DOIs).';

function Collections() {
  const panelsProps = useCollections();
  return (
    <PanelListLandingPage
      title="Collections"
      subtitle={panelsProps.length > 0 ? `${panelsProps.length} Collections` : undefined}
      description={description}
      dataTestId="collections-title"
    >
      <PanelList panelsProps={panelsProps} />
    </PanelListLandingPage>
  );
}

export default Collections;
