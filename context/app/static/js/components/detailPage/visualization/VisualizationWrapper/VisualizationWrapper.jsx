import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Suspense } from 'react';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationBackground } from './style';
import VisualizationErrorBoundary from './VisualizationError';

const Visualization = React.lazy(() => import('../Visualization'));

function VisualizationWrapper({ vitData, uuid, hasNotebook, shouldDisplayHeader, hasBeenMounted, isPublicationPage }) {
  return (
    <VisualizationErrorBoundary
      uuid={uuid}
      shouldDisplayHeader={shouldDisplayHeader}
      isPublicationPage={isPublicationPage}
    >
      <Suspense
        fallback={
          <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
            <SpacedSectionButtonRow
              leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
            />
            <VisualizationBackground>
              <CircularProgress />
            </VisualizationBackground>
          </DetailPageSection>
        }
      >
        <Visualization
          vitData={vitData}
          uuid={uuid}
          hasNotebook={hasNotebook}
          shouldDisplayHeader={shouldDisplayHeader}
          shouldMountVitessce={hasBeenMounted}
        />
      </Suspense>
    </VisualizationErrorBoundary>
  );
}

VisualizationWrapper.defaultProps = {
  shouldDisplayHeader: true,
};

export default VisualizationWrapper;
