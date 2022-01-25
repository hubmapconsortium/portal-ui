import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledCenteredLoaderWrapper, StyledPaper } from './style';

function DerivedEntitiesSectionWrapper({ isLoading, sectionId, children, headerComponent }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <DetailPageSection id={sectionId}>
      {headerComponent}
      <StyledPaper>{children}</StyledPaper>
    </DetailPageSection>
  );
}

export default DerivedEntitiesSectionWrapper;
