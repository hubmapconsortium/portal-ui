import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';

import PanelList from 'js/shared-styles/panels/PanelList';

function CollectionsSection({ collectionsData }) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return (
    <DetailPageSection id="collections">
      <SectionHeader>Collections</SectionHeader>
      <PanelList panelsProps={panelsProps} />
    </DetailPageSection>
  );
}

export default CollectionsSection;
