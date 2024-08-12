import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PanelList from 'js/shared-styles/panels/PanelList';
import { useFlaskDataContext } from 'js/components/Contexts';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import { CollectionHit } from 'js/pages/Collections/types';

interface CollectionsSectionProps {
  collectionsData: CollectionHit[];
}

function CollectionsSection({ collectionsData }: CollectionsSectionProps) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);

  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  return (
    <DetailPageSection id="collections">
      <SectionHeader iconTooltipText={`List of collections that contain this ${entity_type?.toLowerCase()}.`}>
        Collections
      </SectionHeader>
      <PanelList panelsProps={panelsProps} />
    </DetailPageSection>
  );
}

export default CollectionsSection;
