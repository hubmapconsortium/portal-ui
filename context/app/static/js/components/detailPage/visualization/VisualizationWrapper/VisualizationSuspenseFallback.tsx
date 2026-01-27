import React from 'react';

import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from '../Visualization/style';

import { useVizContainerStyles } from './ContainerStylingContext';
import VisualizationSkeleton from '../VitessceSkeleton/VisualizationSkeleton';

export function VisualizationSuspenseFallback() {
  const { shouldDisplayHeader } = useVizContainerStyles();

  return (
    <>
      <SpacedSectionButtonRow
        leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
      />
      <VisualizationSkeleton />
    </>
  );
}
