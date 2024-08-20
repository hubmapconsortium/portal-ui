import React from 'react';

import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import PanelList from 'js/shared-styles/panels/PanelList';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { StyledSectionPaper } from './styles';

function PublicationCollections({ collectionsData = [], isCollectionPublication }) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return (
    <CollapsibleDetailPageSection id="data" title="Data">
      <StyledSectionPaper $isCollectionPublication={isCollectionPublication}>
        <LabelledSectionText label="Collections">
          Datasets associated with this publication are included in the Collections listed below.
        </LabelledSectionText>
      </StyledSectionPaper>
      <PanelList panelsProps={panelsProps} />
    </CollapsibleDetailPageSection>
  );
}

export default PublicationCollections;
