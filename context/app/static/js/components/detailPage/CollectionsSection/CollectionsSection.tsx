import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PanelList from 'js/shared-styles/panels/PanelList';
import { DetailPageSection } from 'js/components/detailPage/style';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import { CollectionHit } from 'js/pages/Collections/types';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';

interface CollectionsSectionProps {
  collectionsData: CollectionHit[];
}

function CollectionsSection({ collectionsData }: CollectionsSectionProps) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);

  return (
    <DetailPageSection id="collections">
      <SectionHeader>Collections</SectionHeader>
      <SectionDescription>
        Collections may contain references to either raw or processed datasets. If a processed dataset is not included
        in any collection, there will be no corresponding tabs in the table below.
      </SectionDescription>
      <PanelList panelsProps={panelsProps} />
    </DetailPageSection>
  );
}

export default CollectionsSection;
