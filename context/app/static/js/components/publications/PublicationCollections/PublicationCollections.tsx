import React from 'react';

import { buildCollectionsPanelsProps } from 'js/components/collections/utils';
import PanelList from 'js/shared-styles/panels/PanelList';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { CollectionHit } from 'js/components/collections/types';

import { StyledSectionPaper } from './styles';

interface PublicationCollectionsProps {
  collectionsData: CollectionHit[];
  isCollectionPublication: boolean;
}

function PublicationCollections({ collectionsData = [], isCollectionPublication }: PublicationCollectionsProps) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return (
    <CollapsibleDetailPageSection id="data" title="Data">
      <StyledSectionPaper $isCollectionPublication={isCollectionPublication}>
        <LabelledSectionText label="Collections">
          Datasets associated with this publication are included in the collections listed below.
        </LabelledSectionText>
      </StyledSectionPaper>
      <PanelList panelsProps={panelsProps} />
    </CollapsibleDetailPageSection>
  );
}

export default PublicationCollections;
