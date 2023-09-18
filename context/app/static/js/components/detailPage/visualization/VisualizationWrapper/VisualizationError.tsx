import React, { PropsWithChildren } from 'react';
import { FaroErrorBoundary } from '@grafana/faro-react';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import { VisualizationErrorBoundaryBackground } from './style';
import { VizContainerStyleContext } from './ContainerStylingContext';
import { StyledSectionHeader } from '../Visualization/style';

function VisualizationFallback(error: Error): JSX.Element {
  // Since react error boundaries don't work with hooks, we need to use a context consumer to determine how to
  // style the error message's container.
  return (
    <VizContainerStyleContext.Consumer>
      {({ isPublicationPage, uuid, shouldDisplayHeader }) => (
        <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
          <SpacedSectionButtonRow
            leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
          />
          <VisualizationErrorBoundaryBackground>
            <div>The Vitessce visualization encountered an error. Please try again or contact support.</div>
            <DetailsAccordion summary="Click to expand error details">
              <div>{error?.name}</div>
              <div>{error?.message}</div>
              <div>{error?.stack}</div>
            </DetailsAccordion>
          </VisualizationErrorBoundaryBackground>
        </DetailPageSection>
      )}
    </VizContainerStyleContext.Consumer>
  );
}

function VisualizationErrorBoundary({ children }: PropsWithChildren) {
  return <FaroErrorBoundary fallback={VisualizationFallback}>{children}</FaroErrorBoundary>;
}

export default VisualizationErrorBoundary;
