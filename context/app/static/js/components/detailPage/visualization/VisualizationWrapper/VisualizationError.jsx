import React, { useCallback } from 'react';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { faro } from '@grafana/faro-web-sdk';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationErrorBoundaryBackground } from './style';

function VisualizationFallback({ isPublicationPage, uuid, shouldDisplayHeader }) {
  return useCallback(
    ({ message, componentStack }) => {
      return (
        <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
          <SpacedSectionButtonRow
            leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
          />
          <VisualizationErrorBoundaryBackground>
            <div>The Vitessce visualization encountered an error. Please try again or contact support.</div>
            <DetailsAccordion summary="Click to expand error details">
              {message} {componentStack}
            </DetailsAccordion>
          </VisualizationErrorBoundaryBackground>
        </DetailPageSection>
      );
    },
    [isPublicationPage, uuid, shouldDisplayHeader],
  );
}

function VisualizationErrorBoundary({ children, ...rest }) {
  return (
    <SentryErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag('location', 'vitessce');
      }}
      onError={(error) => {
        faro.logError('VisualizationErrorBoundary', { error });
      }}
      fallback={VisualizationFallback({ ...rest })}
    >
      {children}
    </SentryErrorBoundary>
  );
}

export default VisualizationErrorBoundary;
