import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper/VisualizationWrapper';

import { StyledPaper } from './style';

function Azimuth(props) {
  const { config } = props;

  return (
    <SectionContainer>
      TODO: Add info popover.
      <SectionHeader>Reference-Based Analysis</SectionHeader>
      TODO: Add a button to <a href={config.applink}>Open Azimuth App</a>
      <StyledPaper>
        TODO: Format this information:
        <br />
        Modalities: {config.modalities}
        <br />
        Nuclei in reference: {config.nunit}
        <br />
        TODO: Which of the following markdowns should be rendered?
        <ul>
          <li>{config.dataref}</li>
          <li>{config.demodata}</li>
          <li>{config.details}</li>
        </ul>
      </StyledPaper>
      TODO: Refactor so that can get the spinner without the a title?
      <VisualizationWrapper vitData={config.vitessce_conf} />
    </SectionContainer>
  );
}

export default Azimuth;
