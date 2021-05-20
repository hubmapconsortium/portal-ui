import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledCenteredLoaderWrapper, StyledPaper } from './style';

function DerivedEntitiesSectionWrapper({ isLoading, sectionId, children, header }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <SectionContainer id={sectionId}>
      {header}
      <StyledPaper>{children}</StyledPaper>
    </SectionContainer>
  );
}

export default DerivedEntitiesSectionWrapper;
