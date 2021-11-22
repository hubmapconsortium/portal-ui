import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';
import CollectionsPanelList from 'js/components/CollectionsPanelList';

function CollectionsSection({ collectionsData }) {
  return (
    <PaddedSectionContainer id="collections">
      <SectionHeader>Collections</SectionHeader>
      <CollectionsPanelList collectionsData={collectionsData} />
    </PaddedSectionContainer>
  );
}

export default CollectionsSection;
