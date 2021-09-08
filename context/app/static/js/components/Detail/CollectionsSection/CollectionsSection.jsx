import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';
import PanelList from 'js/components/Collections/PanelList';

function CollectionsSection({ collectionsData }) {
  return (
    <PaddedSectionContainer id="collections">
      <SectionHeader>Collections</SectionHeader>
      <PanelList collectionsData={collectionsData} />
    </PaddedSectionContainer>
  );
}

export default CollectionsSection;
