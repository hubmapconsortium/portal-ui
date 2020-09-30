import React, { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StyledSectionContainer, StyledHeader, StyledHeaderText } from '../Visualization/style';
import { VisualizationBackground } from './style';

const Visualization = React.lazy(() => import('../Visualization'));

function VisualizationWrapper(props) {
  const { vitData } = props;

  return (
    <Suspense
      fallback={
        <StyledSectionContainer id="visualization">
          <StyledHeader>
            <StyledHeaderText>Visualization</StyledHeaderText>
          </StyledHeader>
          <VisualizationBackground>
            <CircularProgress />
          </VisualizationBackground>
        </StyledSectionContainer>
      }
    >
      <Visualization vitData={vitData} />
    </Suspense>
  );
}

export default VisualizationWrapper;
