import React from 'react';
import marked from 'marked';

import OutboundLinkButton from 'js/shared-styles/Links/OutboundLinkButton';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper/VisualizationWrapper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { StyledPaper } from './style';

function Azimuth(props) {
  const { config } = props;
  const dataRefHtml = marked.parseInline(config.dataref);

  return (
    <SectionContainer>
      <SpacedSectionButtonRow
        leftText={<SectionHeader>Reference-Based Analysis</SectionHeader>}
        buttons={<OutboundLinkButton href={config.applink}>Open Azimuth App</OutboundLinkButton>}
      />
      <StyledPaper>
        <LabelledSectionText label="Modalities">{config.modalities}</LabelledSectionText>
        <LabelledSectionText label="Nuclei in reference">{config.nunit}</LabelledSectionText>
        {/* eslint-disable react/no-danger */}
        <LabelledSectionText label="Reference dataset">
          <span dangerouslySetInnerHTML={{ __html: dataRefHtml }} />
        </LabelledSectionText>
      </StyledPaper>

      {/* Need to refactor so "Visualization" is not included. */}
      <br />
      <VisualizationWrapper vitData={config.vitessce_conf} />
    </SectionContainer>
  );
}

export default Azimuth;
