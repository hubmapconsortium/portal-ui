import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledCenteredLoaderWrapper, StyledPaper } from './style';

function DerivedEntitiesSectionWrapper({ isLoading, sectionId, children, headerComponent }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <SectionContainer id={sectionId}>
      {headerComponent}
      <StyledPaper>{children}</StyledPaper>
    </SectionContainer>
  );
}

export default DerivedEntitiesSectionWrapper;
