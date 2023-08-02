import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledCenteredLoaderWrapper, RelatedEntitiesPaper } from './style';

function Wrapper({ sectionId, children }) {
  if (sectionId) {
    return <DetailPageSection id={sectionId}>{children}</DetailPageSection>;
  }

  return children;
}

function RelatedEntitiesSectionWrapper({ isLoading, sectionId, children, headerComponent }) {
  if (isLoading) {
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>;
  }

  return (
    <Wrapper sectionId={sectionId}>
      {headerComponent}
      <RelatedEntitiesPaper>{children}</RelatedEntitiesPaper>
    </Wrapper>
  );
}

export default RelatedEntitiesSectionWrapper;
