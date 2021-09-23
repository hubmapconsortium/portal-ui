import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import VisualizationWrapper from 'js/components/Detail/visualization/VisualizationWrapper/VisualizationWrapper';

import { StyledPaper } from './style';

function Azimuth(props) {
  const { config } = props;

  return (
    <SectionContainer>
      <SectionHeader>Reference-Based Analysis</SectionHeader>
      <StyledPaper>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </StyledPaper>
      <VisualizationWrapper vitData={config.vitessce_conf} />
    </SectionContainer>
  );
}

export default Azimuth;
