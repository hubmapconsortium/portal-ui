import React, { useCallback } from 'react';
import * as Sentry from '@sentry/react';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationErrorBoundaryBackground } from './style';

function VisualizationFallback({ isPublicationPage, uuid, shouldDisplayHeader }) {
  return useCallback(
    ({ componentStack }) => {
      return (
        <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
          <SpacedSectionButtonRow
            leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
          />
          <VisualizationErrorBoundaryBackground>
            <div>The Vitessce visualization encountered an error. Please try again or contact support.</div>
            <details>
              <summary>Click to expand error details</summary>
              <div>{componentStack}</div>
            </details>
          </VisualizationErrorBoundaryBackground>
        </DetailPageSection>
      );
    },
    [isPublicationPage, uuid, shouldDisplayHeader],
  );
}

function VisualizationErrorBoundary({ children, ...rest }) {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag('location', 'vitessce');
      }}
      fallback={VisualizationFallback({ ...rest })}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default VisualizationErrorBoundary;
