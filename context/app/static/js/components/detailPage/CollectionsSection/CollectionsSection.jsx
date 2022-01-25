import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import CollectionsPanelList from 'js/components/CollectionsPanelList';

function CollectionsSection({ collectionsData }) {
  return (
    <DetailPageSection id="collections">
      <SectionHeader>Collections</SectionHeader>
      <CollectionsPanelList collectionsData={collectionsData} />
    </DetailPageSection>
  );
}

export default CollectionsSection;
