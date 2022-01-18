import React, { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationBackground } from './style';

const Visualization = React.lazy(() => import('../Visualization'));

function VisualizationWrapper(props) {
  const { vitData, uuid, hasNotebook } = props;

  return (
    <Suspense
      fallback={
        <PaddedSectionContainer id="visualization">
          <SpacedSectionButtonRow leftText={<StyledSectionHeader>Visualization</StyledSectionHeader>} />
          <VisualizationBackground>
            <CircularProgress />
          </VisualizationBackground>
        </PaddedSectionContainer>
      }
    >
      <Visualization vitData={vitData} uuid={uuid} hasNotebook={hasNotebook} />
    </Suspense>
  );
}

export default VisualizationWrapper;
