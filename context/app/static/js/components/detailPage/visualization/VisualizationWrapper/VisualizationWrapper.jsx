import React, { Suspense, useMemo } from 'react';

import VisualizationErrorBoundary from './VisualizationError';
import { VizContainerStyleContext } from './ContainerStylingContext';
import { VisualizationSuspenseFallback } from './VisualizationSuspenseFallback';

const Visualization = React.lazy(() => import('../Visualization'));

function VisualizationWrapper({ vitData, uuid, hasNotebook, shouldDisplayHeader, hasBeenMounted, isPublicationPage }) {
  const containerStyles = useMemo(
    () => ({
      shouldDisplayHeader,
      isPublicationPage,
      uuid,
    }),
    [isPublicationPage, shouldDisplayHeader, uuid],
  );
  return (
    <VizContainerStyleContext.Provider value={containerStyles}>
      <VisualizationErrorBoundary>
        <Suspense fallback={<VisualizationSuspenseFallback />}>
          <Visualization
            vitData={vitData}
            uuid={uuid}
            hasNotebook={hasNotebook}
            shouldDisplayHeader={shouldDisplayHeader}
            shouldMountVitessce={hasBeenMounted}
          />
        </Suspense>
      </VisualizationErrorBoundary>
    </VizContainerStyleContext.Provider>
  );
}

VisualizationWrapper.defaultProps = {
  shouldDisplayHeader: true,
};

export default VisualizationWrapper;
