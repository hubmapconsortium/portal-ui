import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledCenteredLoaderWrapper, StyledPaper } from './style';

function RelatedEntitiesSectionWrapper({ isLoading, sectionId, children, headerComponent }) {
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

export default RelatedEntitiesSectionWrapper;
