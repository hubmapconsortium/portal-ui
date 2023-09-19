import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationBackground } from './style';

import { useVizContainerStyles } from './ContainerStylingContext';

export function VisualizationSuspenseFallback() {
  const { isPublicationPage, uuid, shouldDisplayHeader } = useVizContainerStyles();
  return (
    <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
      <SpacedSectionButtonRow
        leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
      />
      <VisualizationBackground>
        <CircularProgress />
      </VisualizationBackground>
    </DetailPageSection>
  );
}
