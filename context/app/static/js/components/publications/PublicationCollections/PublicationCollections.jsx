import React from 'react';

import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import PanelList from 'js/shared-styles/panels/PanelList';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import { StyledSectionPaper } from './styles';

function PublicationCollections({ collectionsData, isCollectionPublication }) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return (
    <>
      <StyledSectionPaper $isCollectionPublication={isCollectionPublication}>
        <LabelledSectionText label="Collections">
          Datasets associated with this publication are included in the Collections listed below.
        </LabelledSectionText>
      </StyledSectionPaper>
      <PanelList panelsProps={panelsProps} />
    </>
  );
}

export default PublicationCollections;
