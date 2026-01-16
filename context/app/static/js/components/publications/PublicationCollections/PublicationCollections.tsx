import React from 'react';

import { buildCollectionsPanelsProps } from 'js/components/collections/utils';
import PanelList from 'js/shared-styles/panels/PanelList';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { CollectionHit } from 'js/components/collections/types';

import { StyledSectionPaper } from './styles';

interface PublicationCollectionsProps {
  collectionsData: Required<CollectionHit>[];
  isCollectionPublication: boolean;
}

function PublicationCollections({ collectionsData = [], isCollectionPublication }: PublicationCollectionsProps) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return (
    <>
      <StyledSectionPaper $isCollectionPublication={isCollectionPublication}>
        <LabelledSectionText label="Collections">
          Datasets associated with this publication are included in the collections listed below.
        </LabelledSectionText>
      </StyledSectionPaper>
      <PanelList panelsProps={panelsProps} />
    </>
  );
}

export default PublicationCollections;
