import React, { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StyledPaddedSectionContainer, StyledHeader, StyledHeaderText } from '../Visualization/style';
import { VisualizationBackground } from './style';

const Visualization = React.lazy(() => import('../Visualization'));

function VisualizationWrapper(props) {
  const { vitData, uuid, hasNotebook } = props;

  return (
    <Suspense
      fallback={
        <StyledPaddedSectionContainer id="visualization">
          <StyledHeader>
            <StyledHeaderText>Visualization</StyledHeaderText>
          </StyledHeader>
          <VisualizationBackground>
            <CircularProgress />
          </VisualizationBackground>
        </StyledPaddedSectionContainer>
      }
    >
      <Visualization vitData={vitData} uuid={uuid} hasNotebook={hasNotebook} />
    </Suspense>
  );
}

export default VisualizationWrapper;
