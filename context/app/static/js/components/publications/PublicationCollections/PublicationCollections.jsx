import React from 'react';

import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';
import PanelList from 'js/shared-styles/panels/PanelList';
import Section from 'js/shared-styles/sections/Section';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import { StyledSectionPaper } from './styles';

function PublicationCollections({ collectionsData }) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return (
    collectionsData.length > 0 && (
      <Section id="collections">
        <StyledSectionPaper>
          <LabelledSectionText label="Collections">
            Datasets associated with this publication are included in the collections listed below.
          </LabelledSectionText>
        </StyledSectionPaper>
        <PanelList panelsProps={panelsProps} />
      </Section>
    )
  );
}

export default PublicationCollections;
