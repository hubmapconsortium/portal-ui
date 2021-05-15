import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledDiv, StyledCenteredLoaderWrapper } from './style';

function DerivedEntitiesSectionWrapper({ isLoading, children }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <SectionContainer id="derived">
      <StyledDiv>{children}</StyledDiv>
    </SectionContainer>
  );
}

export default DerivedEntitiesSectionWrapper;
