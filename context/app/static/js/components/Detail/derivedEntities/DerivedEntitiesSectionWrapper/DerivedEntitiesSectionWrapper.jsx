import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';
import { StyledCenteredLoaderWrapper, StyledPaper } from './style';

function DerivedEntitiesSectionWrapper({ isLoading, sectionId, children, headerComponent }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <PaddedSectionContainer id={sectionId}>
      {headerComponent}
      <StyledPaper>{children}</StyledPaper>
    </PaddedSectionContainer>
  );
}

export default DerivedEntitiesSectionWrapper;
