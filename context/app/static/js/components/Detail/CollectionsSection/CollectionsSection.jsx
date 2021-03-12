import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import PanelList from 'js/components/Collections/PanelList';

function CollectionsSection({ collectionsData }) {
  return (
    <SectionContainer id="collections">
      <SectionHeader>Collections</SectionHeader>
      <PanelList collectionsData={collectionsData} />
    </SectionContainer>
  );
}

export default CollectionsSection;
