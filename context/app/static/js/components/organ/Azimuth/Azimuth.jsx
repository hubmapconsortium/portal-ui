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
  const dataRefHtml = marked(config.dataref);

  return (
    <SectionContainer>
      TODO: Add info popover.
      <SpacedSectionButtonRow
        leftText={<SectionHeader>Reference-Based Analysis</SectionHeader>}
        buttons={<OutboundLinkButton href={config.applink}>Open Azimuth App</OutboundLinkButton>}
      />
      <StyledPaper>
        TODO: Fix formatting
        <LabelledSectionText label="Modalities">{config.modalities}</LabelledSectionText>
        <LabelledSectionText label="Nuclei in reference">{config.nunit}</LabelledSectionText>
        {/* eslint-disable react/no-danger */}
        <LabelledSectionText label="Reference dataset">
          <div dangerouslySetInnerHTML={{ __html: dataRefHtml }} />
        </LabelledSectionText>
      </StyledPaper>
      TODO: Refactor so that can get the spinner without the a title?
      <VisualizationWrapper vitData={config.vitessce_conf} />
    </SectionContainer>
  );
}

export default Azimuth;
