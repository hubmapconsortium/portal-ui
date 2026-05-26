import React, { PropsWithChildren, type JSX } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import { VisualizationErrorBoundaryBackground } from './style';
import { VizContainerStyleContext } from './ContainerStylingContext';
import { StyledSectionHeader } from '../Visualization/style';

function VisualizationFallback({ error }: FallbackProps): JSX.Element {
  const err = error as Error | null;
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
              <div>{err?.name}</div>
              <div>{err?.message}</div>
              <div>{err?.stack}</div>
            </DetailsAccordion>
          </VisualizationErrorBoundaryBackground>
        </DetailPageSection>
      )}
    </VizContainerStyleContext.Consumer>
  );
}

function VisualizationErrorBoundary({ children }: PropsWithChildren) {
  return <ErrorBoundary FallbackComponent={VisualizationFallback}>{children}</ErrorBoundary>;
}

export default VisualizationErrorBoundary;
