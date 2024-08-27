import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import {
  CollapsibleDetailPageSection,
  CollapsibleDetailPageSectionProps,
} from 'js/components/detailPage/DetailPageSection';
import { StyledCenteredLoaderWrapper, RelatedEntitiesPaper } from './style';

interface RelatedEntitiesSectionWrapperProps extends CollapsibleDetailPageSectionProps {
  isLoading: boolean;
  title: string;
}

function RelatedEntitiesSectionWrapper({
  isLoading,
  id,
  children,
  title,
  action,
  iconTooltipText,
}: RelatedEntitiesSectionWrapperProps) {
  if (isLoading) {
    <StyledCenteredLoaderWrapper>
      <CircularProgress />
    </StyledCenteredLoaderWrapper>;
  }

  return (
    <CollapsibleDetailPageSection id={id} title={title} action={action} iconTooltipText={iconTooltipText}>
      <RelatedEntitiesPaper>{children}</RelatedEntitiesPaper>
    </CollapsibleDetailPageSection>
  );
}

export default RelatedEntitiesSectionWrapper;
