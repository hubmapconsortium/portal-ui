import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledCenteredLoaderWrapper, RelatedEntitiesPaper } from './style';

function RelatedEntitiesSectionWrapper({ isLoading, sectionId, children, headerComponent }) {
  return isLoading ? (
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>
  ) : (
    <DetailPageSection id={sectionId}>
      {headerComponent}
      <RelatedEntitiesPaper>{children}</RelatedEntitiesPaper>
    </DetailPageSection>
  );
}

export default RelatedEntitiesSectionWrapper;
