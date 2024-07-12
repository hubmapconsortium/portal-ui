import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledCenteredLoaderWrapper, RelatedEntitiesPaper } from './style';

interface WrapperProps {
  sectionId?: string;
  children: React.ReactNode;
}

function Wrapper({ sectionId, children }: WrapperProps) {
  if (sectionId) {
    return <DetailPageSection id={sectionId}>{children}</DetailPageSection>;
  }

  return children;
}

interface RelatedEntitiesSectionWrapperProps extends WrapperProps {
  isLoading: boolean;
  headerComponent: React.ReactNode;
}

function RelatedEntitiesSectionWrapper({
  isLoading,
  sectionId,
  children,
  headerComponent,
}: RelatedEntitiesSectionWrapperProps) {
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
